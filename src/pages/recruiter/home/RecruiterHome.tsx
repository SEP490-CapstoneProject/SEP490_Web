import { useEffect, useState, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  BarChart2,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import SortIcon from "../../../assets/myWeb/sort.png";
import BookmarkIcon from "../../../assets/myWeb/bookmark.png";
import ShareIcon from "../../../assets/myWeb/share1.png";
import {
  portfolioService,
  PortfolioRankBy,
  PortfolioSortMode,
  PortfolioMainBlockItem,
} from "@/services/portfolio.api";
import {
  fetchCompanyPostsByCompanyId,
  fetchMatchedPortfolios,
} from "@/services/company.api";
import { CompanyPostAPI } from "@/types/companyPost";
import { SponsoredPostDto } from "@/types/sponsoredPost";
import PortfolioRenderer from "@/components/portfolio/render/PortfolioRenderer";
import useOnScreen from "@/hooks/useOnScreen";
import CommentModal from "./CommentModal";
import BookmarkModal from "./BookmarkModal";
import { SkillsHistoryModal } from "@/components/portfolio/SkillsHistoryModal";
import { getPortfolioSkillsHistory } from "@/services/challenge.api";
import { fetchEmployeeByUserId } from "@/services/profile.api";
import { SkillHistory } from "@/types/challenge";
import { notify } from "@/lib/toast";
import { RootState } from "@/store";
import { reportSponsoredClick, reportSponsoredView } from "@/services/points.api";

interface IntroData {
  portfolioId: number;
  position: string;
  jobTitle?: string;
  name?: string;
  avatar?: string;
  ranking?: { rankPosition: number; totalScore: number };
}

const extractIntroData = (
  portfolio: PortfolioMainBlockItem,
): IntroData | null => {
  const blocks = Array.isArray(portfolio.blocks)
    ? portfolio.blocks
    : [portfolio.blocks];
  for (const block of blocks) {
    if (!block || block.type?.toUpperCase() !== "INTRO") continue;
    const data = (block.data as Record<string, unknown>) || {};
    return {
      portfolioId: portfolio.portfolioId,
      position:
        (data.studyField as string) ||
        (data.position as string) ||
        (data.jobTitle as string) ||
        "",
      jobTitle: (data.jobTitle as string) || "",
      name: (data.name as string) || portfolio.portfolio?.name || "",
      avatar: (data.avatar as string) || (data.image as string) || "",
      ranking: portfolio.ranking,
    };
  }
  return null;
};

export default function RecruiterHome() {
  const navigate = useNavigate();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const user = useSelector((state: RootState) => state.auth.user);

  // ── AI Search States ──
  const [isAISearchMode, setIsAISearchMode] = useState(false);
  const [companyPosts, setCompanyPosts] = useState<CompanyPostAPI[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [isLoadingCompanyPosts, setIsLoadingCompanyPosts] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [, setFilteredPortfolios] = useState<
    PortfolioMainBlockItem[]
  >([]);
  const [allPortfolios, setAllPortfolios] = useState<PortfolioMainBlockItem[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [isBookmarkModalOpen, setIsBookmarkModalOpen] = useState(false);
  const [savedPortfolios, setSavedPortfolios] = useState<Set<number>>(
    new Set(),
  );
  const [savedPortfolioDetails, setSavedPortfolioDetails] = useState<
    Map<
      number,
      { interestLevel: "LOW" | "MEDIUM" | "HIGH"; categoryId: number | null }
    >
  >(new Map());

  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [skillHistory, setSkillHistory] = useState<SkillHistory[]>([]);
  const [isLoadingSkills, setIsLoadingSkills] = useState(false);
  
  // Trạng thái loading nạp chi tiết các block portfolio đầy đủ
  const [isLoadingFullPortfolio, setIsLoadingFullPortfolio] = useState(false);
 
  // Sponsored items from portfolio feed (ads)
  const [sponsoredItems, setSponsoredItems] = useState<SponsoredPostDto[]>([]);
  // Deduplication sets to ensure view/click reported once per session
  const clickedSponsoredRef = useRef<Set<number>>(new Set());
  const seenSponsoredRef = useRef<Set<number>>(new Set());
  
  // Display sequence - mix of portfolios and sponsored cards
  type DisplayItem = { kind: 'portfolio'; portfolio: PortfolioMainBlockItem } | { kind: 'sponsored'; sponsored: SponsoredPostDto };
  const [displayItems, setDisplayItems] = useState<DisplayItem[]>([]);
  const [displayIndex, setDisplayIndex] = useState(0);

  const currentDisplay = displayItems[displayIndex];
  const currentPortfolio = currentDisplay?.kind === 'portfolio' ? currentDisplay.portfolio : undefined;
 
  const currentUserName = currentPortfolio
    ? (extractIntroData(currentPortfolio)?.name ?? "User")
    : "User";

  // ── Hàm fetch full portfolio data bằng API chi tiết ──
  const fetchFullPortfolioData = useCallback(
    async (portfolio: PortfolioMainBlockItem) => {
      if (!accessToken) return;

      try {
        setIsLoadingFullPortfolio(true);
        const fullPortfolio = await portfolioService.fetchPortfolioByIdAPI(
          portfolio.portfolioId,
          accessToken,
        );

        if (fullPortfolio && fullPortfolio.blocks) {
          setFilteredPortfolios((prev) => {
            return prev.map((p) =>
              p.portfolioId === portfolio.portfolioId
                ? { ...p, blocks: fullPortfolio.blocks  as any} // Nạp mảng blocks đầy đủ vào thay thế mảng rỗng
                : p,
            );
          });
        }
      } catch (error) {
        console.error("❌ Error fetching full portfolio:", error);
      } finally {
        setIsLoadingFullPortfolio(false);
      }
    },
    [accessToken],
  );

  const handleOpenSkillModal = async () => {
    if (!currentPortfolio || !accessToken) {
      notify.error("Không thể xác thực người dùng.");
      return;
    }

    setIsSkillModalOpen(true);
    setIsLoadingSkills(true);

    try {
      const employeeProfile = await fetchEmployeeByUserId(
        currentPortfolio.employeeId,
        accessToken,
      );
      const userId = String(employeeProfile.userId);
      const data = await getPortfolioSkillsHistory(userId, accessToken);
      setSkillHistory(data);
    } catch (error) {
      console.error("❌ Error fetching skills:", error);
      notify.error("Không thể tải lịch sử kỹ năng.");
      setSkillHistory([]);
    } finally {
      setIsLoadingSkills(false);
    }
  };

  const loadSavedPortfolios = useCallback(async (token: string | null) => {
    try {
      if (!token) return;
      const savedData = await portfolioService.fetchSavedPortfolios(token);
      const savedIds = new Set(
        savedData.map((p: Record<string, unknown>) => p.portfolioId as number),
      );
      const detailsMap = new Map(
        savedData.map((p: Record<string, unknown>) => {
          const interestLevelRaw =
            (p.interestLevel as string) ||
            (p.level as string) ||
            (p.priority as string) ||
            (p.interestLevelType as string) ||
            "MEDIUM";
          const interestLevel = interestLevelRaw.toUpperCase() as
            | "LOW"
            | "MEDIUM"
            | "HIGH";
          const categoryId =
            (p.categoryId as number) ||
            (p.followCategoryId as number) ||
            (p.categoryFollowId as number) ||
            (p.followId as number) ||
            null;
          return [p.portfolioId as number, { interestLevel, categoryId }];
        }),
      );
      setSavedPortfolios(savedIds);
      setSavedPortfolioDetails(detailsMap);
    } catch (error) {
      console.warn("⚠️ Could not load saved portfolios:", error);
    }
  }, []);

  const loadPortfolios = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await portfolioService.fetchAllPortfolios(
        1,
        10000,
        PortfolioRankBy.average,
        undefined,
        PortfolioSortMode.random,
        accessToken ?? undefined,
      );

      if (!response || !response.items || response.items.length === 0) {
        setFilteredPortfolios([]);
        setDisplayIndex(0);
        setSponsoredItems([]);
        setIsLoading(false);
        return;
      }

      const portfolios = response.items;
      setFilteredPortfolios(portfolios);
      setAllPortfolios(portfolios);
      setDisplayIndex(0);

      // Capture sponsored items so UI can render them
      const spons = (response.sponsoredItems || []).slice();
      setSponsoredItems(spons);

      // build display sequence: interleave every 4 portfolios
      const merged: DisplayItem[] = [];
      for (let i = 0; i < portfolios.length; i++) {
        merged.push({ kind: 'portfolio', portfolio: portfolios[i] });
        if (i % 4 === 3 && spons.length > 0) merged.push({ kind: 'sponsored', sponsored: spons.shift()! });
      }
      while (spons.length > 0) merged.push({ kind: 'sponsored', sponsored: spons.shift()! });
      setDisplayItems(merged);
      setDisplayIndex(0);

      await loadSavedPortfolios(accessToken);
    } catch (error) {
      console.error("❌ Error loading portfolios:", error);
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, loadSavedPortfolios]);

  // ── Load Company Posts for Recruiter ──
  const loadCompanyPosts = useCallback(async () => {
    try {
      if (!user?.companyId || !accessToken) {
        console.warn("⚠️ No company ID or access token");
        return;
      }

      setIsLoadingCompanyPosts(true);
      const response = await fetchCompanyPostsByCompanyId(
        user.companyId,
        undefined,
        100,
        accessToken,
      );

      if (response && response.items) {
        setCompanyPosts(response.items);
      } else {
        setCompanyPosts([]);
      }
    } catch (error) {
      console.error("❌ Error loading company posts:", error);
      setCompanyPosts([]);
    } finally {
      setIsLoadingCompanyPosts(false);
    }
  }, [user?.companyId, accessToken]);

  // ── Load Matched Portfolios for Selected Post ──
  const loadMatchedPortfolios = useCallback(
    async (postId: number) => {
      try {
        if (!accessToken) {
          console.warn("⚠️ No access token");
          return;
        }

        setIsLoading(true);
        const response = await fetchMatchedPortfolios(postId, 1, 10000, accessToken);

        if (response && response.items) {
          const portfolios: PortfolioMainBlockItem[] = response.items.map(
            (item) => {
              return {
                portfolioId: item.portfolioId,
                employeeId: item.employeeId,
                portfolio: {
                  name: item.title,
                  status: 1,
                },
                blocks: [], // CẢI TIẾN QUAN TRỌNG: Để mảng rỗng để useEffect bắt được và fetch đè lên ngay lập tức
              } as unknown as PortfolioMainBlockItem;
            },
          );

          setFilteredPortfolios(portfolios);
          setAllPortfolios(portfolios);
          setDisplayIndex(0);

          await loadSavedPortfolios(accessToken);
        } else {
          setFilteredPortfolios([]);
          setDisplayIndex(0);
        }
      } catch (error) {
        console.error("❌ Error loading matched portfolios:", error);
        setFilteredPortfolios([]);
      setDisplayIndex(0);
      } finally {
        setIsLoading(false);
      }
    },
    [accessToken, loadSavedPortfolios],
  );

  useEffect(() => {
    loadPortfolios();
  }, [loadPortfolios]);

  // ── Load company posts when entering AI search mode ──
  useEffect(() => {
    if (isAISearchMode) {
      loadCompanyPosts();
    }
  }, [isAISearchMode, loadCompanyPosts]);

  // ── SỬA ĐIỀU KIỆN KÍCH HOẠT: Khi lướt qua portfolio mà mảng blocks trống, gọi API lấy full blocks ──
  useEffect(() => {
    if (
      currentPortfolio &&
      !isLoadingFullPortfolio &&
      (!currentPortfolio.blocks || !Array.isArray(currentPortfolio.blocks) || currentPortfolio.blocks.length === 0)
    ) {
      fetchFullPortfolioData(currentPortfolio);
    }
  }, [currentPortfolio, isLoadingFullPortfolio, fetchFullPortfolioData]);

  const handleNext = () => {
    if (displayIndex < displayItems.length - 1) {
      setDisplayIndex(displayIndex + 1);
      setSkillHistory([]);
      const next = displayItems[displayIndex + 1];
      if (next?.kind === 'portfolio') {
        const dispIdx = displayItems.findIndex(di => di.kind === 'portfolio' && di.portfolio.portfolioId === next.portfolio.portfolioId);
        if (dispIdx >= 0) setDisplayIndex(dispIdx);
      }
    }
  };

  const handlePrev = () => {
    if (displayIndex > 0) {
      setDisplayIndex(displayIndex - 1);
      setSkillHistory([]);
      const prev = displayItems[displayIndex - 1];
      if (prev?.kind === 'portfolio') {
        const dispIdx = displayItems.findIndex(di => di.kind === 'portfolio' && di.portfolio.portfolioId === prev.portfolio.portfolioId);
        if (dispIdx >= 0) setDisplayIndex(dispIdx);
      }
    }
  };

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    try {
      const response = await portfolioService.fetchAllPortfolios(
        1,
        10000,
        PortfolioRankBy.average,
        query,
        PortfolioSortMode.random,
        accessToken ?? undefined,
      );
      if (!response || !response.items || response.items.length === 0) {
        setFilteredPortfolios([]);
        setDisplayIndex(0);
        return;
      }
      setFilteredPortfolios(response.items);
      setDisplayIndex(0);
    } catch (error) {
      console.error("❌ Error searching portfolios:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredPortfolios(allPortfolios);
      const first = allPortfolios[0];
      if (first) {
        const idx = displayItems.findIndex(di => di.kind === 'portfolio' && di.portfolio.portfolioId === first.portfolioId);
        if (idx >= 0) setDisplayIndex(idx);
        else setDisplayIndex(0);
      } else {
        setDisplayIndex(0);
      }
    }
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      handleSearch(searchQuery);
    }
  };

  // ----------------------------------------------------------------
  // Helper: Sponsored sidebar card with view reporting
  // ----------------------------------------------------------------
  function SponsoredSidebarCard({ item }: { item: SponsoredPostDto }) {
    const ref = useRef<HTMLDivElement | null>(null);
    const onScreen = useOnScreen(ref, '0px', 0.5);

    useEffect(() => {
      if (onScreen && accessToken && !seenSponsoredRef.current.has(item.id)) {
        void reportSponsoredView(item.id, accessToken).then((ok) => {
          if (ok) {
            seenSponsoredRef.current.add(item.id);
          }
        });
      }
    }, [accessToken, onScreen, item.id]);

    const handleClick = (e: React.MouseEvent) => {
      if (accessToken && !clickedSponsoredRef.current.has(item.id)) {
        void reportSponsoredClick(item.id, accessToken).then((ok) => {
          if (ok) {
            clickedSponsoredRef.current.add(item.id);
          }
        });
      }
      if (item.clickThroughUrl) window.open(item.clickThroughUrl, '_blank');
      e.preventDefault();
    };

    return (
      <div ref={ref} className="mb-4">
        {item.imageUrl ? (
          <div className="cursor-pointer" onClick={handleClick}>
            <img src={item.imageUrl} alt={`sponsored-${item.id}`} className="w-full rounded-lg object-cover" />
          </div>
        ) : (
          <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700">Sponsored</div>
        )}
      </div>
    );
  }

  function SponsoredDisplayCard({ item }: { item: SponsoredPostDto }) {
    const ref = useRef<HTMLDivElement | null>(null);
    const onScreen = useOnScreen(ref, '0px', 0.5);

    useEffect(() => {
      if (onScreen && accessToken && !seenSponsoredRef.current.has(item.id)) {
        void reportSponsoredView(item.id, accessToken).then((ok) => {
          if (ok) {
            seenSponsoredRef.current.add(item.id);
          }
        });
      }
    }, [accessToken, onScreen, item.id]);

    const handleClick = (e: React.MouseEvent) => {
      if (accessToken && !clickedSponsoredRef.current.has(item.id)) {
        void reportSponsoredClick(item.id, accessToken).then((ok) => {
          if (ok) {
            clickedSponsoredRef.current.add(item.id);
          }
        });
      }
      if (item.clickThroughUrl) window.open(item.clickThroughUrl, '_blank');
      e.preventDefault();
    };

    return (
      <div ref={ref} className="rounded-xl border border-gray-100 bg-white p-4">
        {item.imageUrl ? (
          <div className="cursor-pointer" onClick={handleClick}>
            <img src={item.imageUrl} alt={`sponsored-${item.id}`} className="w-full rounded-lg object-cover" />
          </div>
        ) : (
          <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700">Sponsored</div>
        )}
      </div>
    );
  }

  const handleClearSearch = () => {
    setSearchQuery("");
    setFilteredPortfolios(allPortfolios);
    setDisplayIndex(0);
  };

  const handleBookmark = () => {
    if (currentPortfolio) {
      setIsBookmarkModalOpen(true);
    }
  };

  const handleCommentSuccess = () => {
    setIsCommentModalOpen(false);
  };

  const handleShare = () => {
    if (currentPortfolio) {
      console.log("Share portfolio:", currentPortfolio.portfolioId);
    }
  };

  const handleSubscribe = () => {
    navigate("/subscription");
  };

  if (displayItems.length === 0 && !isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Không tìm thấy portfolio nào</p>
          <Button onClick={handleClearSearch} className="bg-[#0288D1]">Đặt lại tìm kiếm</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="flex gap-0 pt-6 min-h-screen">
        {/* Left Search Sidebar */}
        <div className="fixed left-3 top-20 z-10 hidden xl:block">
          <div className="w-[20rem] bg-white rounded-lg p-4 shadow-md max-h-[calc(100vh-6rem)] overflow-y-auto overflow-x-hidden">
            {/* ── AI Search Mode Toggle ── */}
            <div className="mb-6 pb-4 border-b border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg font-bold text-gray-900">
                  Tìm kiếm bằng AI
                </span>
              </div>
              <button
                onClick={() => {
                  setIsAISearchMode(!isAISearchMode);
                  setSelectedPostId(null);
                  if (!isAISearchMode) {
                    // Handled inside useEffect
                  } else {
                    loadPortfolios();
                  }
                }}
                className={`w-full px-4 py-2 rounded-lg font-semibold transition-all ${
                  isAISearchMode
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {isAISearchMode ? "Đang sử dụng AI" : "Bật tìm kiếm AI"}
              </button>
            </div>

            {/* ── AI Search Content ── */}
            {isAISearchMode && (
              <div className="mb-6 pb-4 border-b border-gray-200 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-gray-700 mb-2">
                    Chọn bài đăng tuyển dụng
                  </h3>
                  <p className="text-xs text-gray-500 mb-3">
                    AI sẽ tìm kiếm những portfolio phù hợp
                  </p>

                  {isLoadingCompanyPosts ? (
                    <div className="flex justify-center py-4">
                      <div className="w-5 h-5 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
                    </div>
                  ) : companyPosts.length > 0 ? (
                    <select
                      value={selectedPostId || ""}
                      onChange={(e) => {
                        const postId = parseInt(e.target.value);
                        setSelectedPostId(postId);
                        loadMatchedPortfolios(postId);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">-- Chọn bài đăng --</option>
                      {companyPosts.map((post) => (
                        <option key={post.postId} value={post.postId}>
                          {post.position}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600 text-center">
                      Bạn chưa có bài đăng tuyển dụng nào
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Regular Search (always visible) ── */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <img src={SortIcon} alt="Search" className="w-8 h-8" />
                <h2 className="text-2xl font-bold text-gray-900">Tìm kiếm</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-2 block">
                    Nhập từ khóa tìm kiếm
                  </label>
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo tên, kỹ năng, vị trí..."
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") handleSearchSubmit();
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300"
                    style={{ backgroundColor: "#EFF6FF" }}
                  />
                </div>
                <button
                  onClick={handleSearchSubmit}
                  disabled={isSearching}
                  className="w-full mt-6 py-2 rounded-lg font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: isSearching ? "#1E40AF" : "#3B82F6",
                    opacity: isSearching ? 0.8 : 1,
                  }}
                >
                  {isSearching ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Đang tìm kiếm...</span>
                    </>
                  ) : (
                    <span>Tìm kiếm</span>
                  )}
                </button>
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className="w-full py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    Xóa tìm kiếm
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Candidate Card */}
        <div className="flex-1 min-w-0 flex flex-col items-center justify-center gap-6 xl:ml-88 mr-2 lg:mr-4 ">
          {isAISearchMode && !selectedPostId ? (
            <div className="relative w-full max-w-3xl min-h-128 rounded-2xl overflow-hidden shadow-lg shrink-0 bg-white flex flex-col items-center justify-center">
              <div className="text-center space-y-6 px-8">
                <div className="text-6xl">🤖</div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Tìm kiếm bằng AI
                </h2>
                <p className="text-gray-600 text-lg">
                  Chọn một bài đăng tuyển dụng từ danh sách bên trái để AI tìm kiếm những portfolio phù hợp nhất với yêu cầu của công ty bạn.
                </p>
              </div>
            </div>
          ) : displayItems.length === 0 ? (
            isLoading ? (
              <div className="relative w-full max-w-3xl min-h-128 rounded-2xl overflow-hidden shadow-lg shrink-0 bg-white flex flex-col items-center justify-center">
                <div className="text-center space-y-6">
                  <div className="flex justify-center">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
                  </div>
                  <p className="text-gray-600">
                    {isAISearchMode
                      ? "Đang tìm kiếm portfolio phù hợp..."
                      : "Đang tải portfolio..."}
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative w-full max-w-3xl min-h-128 rounded-2xl overflow-hidden shadow-lg shrink-0 bg-white flex flex-col items-center justify-center">
                <div className="text-center space-y-6 px-8">
                  <div className="text-6xl">😕</div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    Không tìm thấy portfolio
                  </h2>
                  <p className="text-gray-600 text-lg">
                    {isAISearchMode
                      ? "Không có portfolio phù hợp với bài đăng tuyển dụng được chọn."
                      : "Không có portfolio phù hợp với tiêu chí tìm kiếm của bạn. Vui lòng thử lại với các tiêu chí khác."}
                  </p>
                  <button
                    onClick={handleClearSearch}
                    className="mt-8 px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
                  >
                    Quay lại danh sách gốc
                  </button>
                </div>
              </div>
            )
          ) : (
            <>
              <div className="w-full max-w-3xl min-w-0 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 sm:p-5 md:p-6">
                  
                  {/* Hiển thị Skeleton loading khi đang fetch chi tiết các block portfolio */}
                  {isLoadingFullPortfolio ? (
                    <div className="w-full h-96 bg-slate-50 border border-dashed border-slate-200 rounded-2xl animate-pulse flex flex-col items-center justify-center space-y-4">
                      <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
                      <p className="text-sm text-slate-400 font-medium">AI đang nạp toàn bộ cấu trúc portfolio ứng viên...</p>
                    </div>
                  ) : (
                    <div className="animate-in fade-in duration-300">
                      {currentDisplay?.kind === 'portfolio' && currentPortfolio ? (
                        currentPortfolio.blocks && Array.isArray(currentPortfolio.blocks) && currentPortfolio.blocks.length > 0 ? (
                          <PortfolioRenderer blocks={currentPortfolio.blocks} ranking={currentPortfolio.ranking} />
                        ) : currentPortfolio.blocks && !Array.isArray(currentPortfolio.blocks) ? (
                          <PortfolioRenderer blocks={[currentPortfolio.blocks]} ranking={currentPortfolio.ranking} />
                        ) : (
                          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{currentPortfolio?.portfolio?.name || "Portfolio"}</h3>
                            <p className="text-sm text-gray-600">Portfolio này chưa có nội dung để hiển thị.</p>
                          </div>
                        )
                      ) : currentDisplay?.kind === 'sponsored' ? (
                        <SponsoredDisplayCard item={currentDisplay.sponsored} />
                      ) : (
                        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
                          <h3 className="text-lg font-bold text-gray-900 mb-2">Portfolio</h3>
                          <p className="text-sm text-gray-600">Portfolio này chưa có nội dung để hiển thị.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Loading Indicator chính */}
                {isLoading && (
                  <div className="flex justify-center pb-4">
                    <div className="w-4 h-4 border-2 border-blue-400 border-t-blue-600 rounded-full animate-spin"></div>
                  </div>
                )}
              </div>

              {/* Floating Action Bar */}
              {!isCommentModalOpen && !isBookmarkModalOpen && (
                <div className="fixed bottom-4 z-100 w-fit px-6 py-2 bg-white/80 backdrop-blur-xl border border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-3xl flex items-center gap-6">
                  <button
                    onClick={handlePrev}
                    disabled={displayIndex === 0 || isLoadingFullPortfolio}
                    className="p-3 hover:bg-slate-100 rounded-2xl transition-all disabled:opacity-20 text-slate-800 cursor-pointer"
                  >
                    <ChevronLeft size={32} strokeWidth={2.5} />
                  </button>

                  <div className="flex items-center gap-8 border-x border-slate-100 px-6">
                    <button
                      onClick={handleOpenSkillModal}
                      disabled={isLoadingFullPortfolio}
                      className="flex items-center justify-center hover:scale-125 transition-all cursor-pointer disabled:opacity-30"
                      title="Xem lịch sử kỹ năng"
                    >
                      <BarChart2 className="text-indigo-500" size={24} />
                    </button>

                    <button
                      onClick={() => setIsCommentModalOpen(true)}
                      disabled={isLoadingFullPortfolio}
                      className="flex items-center justify-center hover:scale-125 transition-all cursor-pointer disabled:opacity-30"
                      title="Nhận xét"
                    >
                      <MessageSquare className="text-blue-500" size={24} />
                    </button>

                    <button
                      onClick={handleBookmark}
                      disabled={isLoadingFullPortfolio}
                      className="flex items-center justify-center hover:scale-125 transition-all cursor-pointer disabled:opacity-30"
                      title="Lưu"
                    >
                      <img
                        src={BookmarkIcon}
                        alt="Bookmark"
                        className="w-6 h-6"
                        style={{
                          filter:
                            "brightness(0) saturate(100%) invert(45%) sepia(98%) saturate(1726%) hue-rotate(200deg) brightness(98%) contrast(93%)",
                        }}
                      />
                    </button>

                    <button
                      onClick={handleShare}
                      disabled={isLoadingFullPortfolio}
                      className="flex items-center justify-center hover:scale-125 transition-all cursor-pointer disabled:opacity-30"
                      title="Chia sẻ"
                    >
                      <img
                        src={ShareIcon}
                        alt="Share"
                        className="w-6 h-6"
                        style={{ filter: "brightness(0) saturate(100%)" }}
                      />
                    </button>
                  </div>

                  <button
                    onClick={handleNext}
                    disabled={displayIndex === displayItems.length - 1 || isLoadingFullPortfolio}
                    className="p-3 hover:bg-slate-100 rounded-2xl transition-all disabled:opacity-20 text-slate-800 cursor-pointer"
                  >
                    <ChevronRight size={32} strokeWidth={2.5} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Right Premium Section */}
        <aside className="hidden 2xl:block w-[20rem] shrink-0 py-6 pr-4 h-fit">
          <div className="fixed top-8 pt-11 pr-5">
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <div className="mb-6">
                <span className="inline-block bg-blue-500 text-white px-6 py-2 rounded-xl text-sm font-bold">
                  Premium
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Tuyển dụng nhanh hơn gấp 2 lần!
              </h2>
              <p className="text-gray-700 text-base leading-relaxed mb-8">
                Nâng cấp để tuyển dụng nhanh hơn với các ứng viên được phân tích
                từ AI phù hợp với yêu cầu của bạn.
              </p>
              <button
                onClick={handleSubscribe}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-xl transition-colors"
              >
                Đăng ký ngay
              </button>

              {/* Sponsored Ads from portfolio feed */}
              {sponsoredItems && sponsoredItems.length > 0 && (
                <div className="mt-6 border-t pt-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Sponsored</h3>
                  {sponsoredItems.map((item) => (
                    <SponsoredSidebarCard key={`spon-${item.id}`} item={item} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Modals */}
        {currentPortfolio && (
          <CommentModal
            isOpen={isCommentModalOpen}
            onClose={() => setIsCommentModalOpen(false)}
            portfolioId={currentPortfolio.portfolioId}
            onSuccess={handleCommentSuccess}
          />
        )}

        {currentPortfolio && (
          <BookmarkModal
            isOpen={isBookmarkModalOpen}
            onClose={() => setIsBookmarkModalOpen(false)}
            portfolioId={currentPortfolio.portfolioId}
            isAlreadySaved={savedPortfolios.has(currentPortfolio.portfolioId)}
            mode={
              savedPortfolios.has(currentPortfolio.portfolioId)
                ? "edit"
                : "create"
            }
            currentInterestLevel={
              savedPortfolioDetails.get(currentPortfolio.portfolioId)
                ?.interestLevel || "MEDIUM"
            }
            currentCategoryId={
              savedPortfolioDetails.get(currentPortfolio.portfolioId)
                ?.categoryId || null
            }
            onSuccess={(data) => {
              setSavedPortfolios(
                (prev) => new Set([...prev, currentPortfolio.portfolioId]),
              );
              setSavedPortfolioDetails((prev) => {
                const next = new Map(prev);
                next.set(currentPortfolio.portfolioId, {
                  interestLevel: data.interestLevel,
                  categoryId: data.categoryId,
                });
                return next;
              });
            }}
            onUnsave={() => {
              setSavedPortfolios((prev) => {
                const next = new Set(prev);
                next.delete(currentPortfolio.portfolioId);
                return next;
              });
              setSavedPortfolioDetails((prev) => {
                const next = new Map(prev);
                next.delete(currentPortfolio.portfolioId);
                return next;
              });
            }}
          />
        )}

        <SkillsHistoryModal
          isOpen={isSkillModalOpen}
          onClose={() => setIsSkillModalOpen(false)}
          skills={skillHistory}
          isLoading={isLoadingSkills}
          userName={currentUserName}
        />
      </div>
    </div>
  );
}