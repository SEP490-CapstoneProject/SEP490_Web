import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  BarChart2,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import SortIcon from "../../../assets/myWeb/sort.png";
import BookmarkIcon from "../../../assets/myWeb/bookmark.png";
import ShareIcon from "../../../assets/myWeb/share1.png";
import {
  portfolioService,
  PortfolioMainBlockItem,
  PortfolioPreview, // Import thêm type này
} from "@/services/portfolio.api";
import PortfolioRenderer from "@/components/portfolio/render/PortfolioRenderer";
import CommentModal from "./CommentModal";
import BookmarkModal from "./BookmarkModal";
import { SkillsHistoryModal } from "@/components/portfolio/SkillsHistoryModal";
import { getPortfolioSkillsHistory } from "@/services/challenge.api";
import { fetchEmployeeByUserId } from "@/services/profile.api";
import { SkillHistory } from "@/types/challenge";
import { notify } from "@/lib/toast";
import { RootState } from "@/store";

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

  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPortfolios, setFilteredPortfolios] = useState<
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

  // ── Thêm các State quản lý Preview tương tự ExploreTab ──
  const [currentPreview, setCurrentPreview] = useState<
    PortfolioPreview | null | undefined
  >(undefined);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  const currentPortfolio = filteredPortfolios[currentIndex];

  const currentUserName = currentPortfolio
    ? (extractIntroData(currentPortfolio)?.name ?? "User")
    : "User";

  // ── Hàm Fetch Preview tương tự ExploreTab ──
  const fetchCurrentPreview = async (portfolio: PortfolioMainBlockItem) => {
    if (!accessToken) return;

    setIsLoadingPreview(true);
    setCurrentPreview(undefined);
    setShowPreview(true); // Reset trạng thái hiển thị mỗi khi đổi portfolio

    try {
      const preview = await portfolioService.fetchPortfolioPreview(
        portfolio.portfolioId,
        accessToken,
      );
      setCurrentPreview(preview ?? null);
    } catch {
      setCurrentPreview(null);
    } finally {
      setIsLoadingPreview(false);
    }
  };

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
      const savedIds = new Set(savedData.map((p: any) => p.portfolioId));
      const detailsMap = new Map(
        savedData.map((p: any) => {
          const interestLevelRaw =
            p.interestLevel ||
            p.level ||
            p.priority ||
            p.interestLevelType ||
            "MEDIUM";
          const interestLevel = interestLevelRaw.toUpperCase() as
            | "LOW"
            | "MEDIUM"
            | "HIGH";
          const categoryId =
            p.categoryId ||
            p.followCategoryId ||
            p.categoryFollowId ||
            p.followId ||
            null;
          return [p.portfolioId, { interestLevel, categoryId }];
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
      const response = await portfolioService.fetchAllPortfolios(1, 10000);

      if (!response || !response.items || response.items.length === 0) {
        setFilteredPortfolios([]);
        setCurrentIndex(0);
        setIsLoading(false);
        return;
      }

      const portfolios = response.items;
      setFilteredPortfolios(portfolios);
      setAllPortfolios(portfolios);
      setCurrentIndex(0);

      await loadSavedPortfolios(accessToken);
    } catch (error) {
      console.error("❌ Error loading portfolios:", error);
      notify.error("Không thể tải danh sách portfolio. Vui lòng thử lại sau.");
      setFilteredPortfolios([]);
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, loadSavedPortfolios]);

  useEffect(() => {
    loadPortfolios();
  }, [loadPortfolios]);

  // ── Kích hoạt Fetch Preview khi portfolio thay đổi ──
  useEffect(() => {
    if (currentPortfolio) {
      fetchCurrentPreview(currentPortfolio);
    }
  }, [currentPortfolio?.portfolioId]);

  const handleNext = () => {
    if (currentIndex < filteredPortfolios.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSkillHistory([]);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSkillHistory([]);
    }
  };

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    try {
      const response = await portfolioService.fetchAllPortfolios(
        1,
        10000,
        "0",
        query,
      );
      if (!response || !response.items || response.items.length === 0) {
        setFilteredPortfolios([]);
        setCurrentIndex(0);
        return;
      }
      setFilteredPortfolios(response.items);
      setCurrentIndex(0);
    } catch (error) {
      console.error("❌ Error searching portfolios:", error);
      notify.error("Lỗi khi tìm kiếm portfolio.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredPortfolios(allPortfolios);
      setCurrentIndex(0);
    }
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      handleSearch(searchQuery);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setFilteredPortfolios(allPortfolios);
    setCurrentIndex(0);
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

  // ── Các biến điều kiện render helper tương tự ExploreTab ──
  const hasPreviewImage = !!currentPreview?.imageUrl;
  const shouldShowPreviewImage =
    !isLoadingPreview && hasPreviewImage && showPreview;
  const shouldShowPortfolio =
    !isLoadingPreview && (!hasPreviewImage || !showPreview);

  if (!currentPortfolio && !isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">
            Không tìm thấy portfolio nào
          </p>
          <Button onClick={handleClearSearch} className="bg-[#0288D1]">
            Đặt lại tìm kiếm
          </Button>
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

        {/* Main Content - Candidate Card */}
        <div className="flex-1 min-w-0 flex flex-col items-center justify-center gap-6 xl:ml-88 mr-2 lg:mr-4 ">
          {filteredPortfolios.length === 0 ? (
            <div className="relative w-full max-w-3xl min-h-128 rounded-2xl overflow-hidden shadow-lg shrink-0 bg-white flex flex-col items-center justify-center">
              <div className="text-center space-y-6 px-8">
                <div className="text-6xl">😕</div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Không tìm thấy portfolio
                </h2>
                <p className="text-gray-600 text-lg">
                  Không có portfolio phù hợp với tiêu chí tìm kiếm của bạn. Vui
                  lòng thử lại với các tiêu chí khác.
                </p>
                <button
                  onClick={handleClearSearch}
                  className="mt-8 px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
                >
                  Quay lại danh sách gốc
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="w-full max-w-3xl min-w-0 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 sm:p-5 md:p-6">
                  {/* 1. Skeleton Loading khi đang tải ảnh Preview */}
                  {isLoadingPreview && (
                    <div className="w-full h-56 bg-slate-100 rounded-2xl animate-pulse mb-6" />
                  )}

                  {/* 2. Hiển thị ảnh Preview (Nếu có ảnh và đang bật chế độ xem) */}
                  {/* 2. Hiển thị ảnh Preview (Nếu có ảnh và đang bật chế độ xem) */}
                  {shouldShowPreviewImage && (
                    <div className="mb-6 animate-in fade-in duration-300 relative group">
                      <div className="w-full rounded-2xl overflow-hidden bg-slate-100 ring-1 ring-slate-200 relative">
                        <img
                          src={currentPreview!.imageUrl}
                          alt="Bản xem trước portfolio"
                          className="w-full h-auto object-contain mx-auto"
                        />

                        {/* Nút Ẩn bản xem trước được đưa lên góc trên bên phải của ảnh */}
                        <div className="absolute top-4 right-4 z-10">
                          <button
                            onClick={() => setShowPreview(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-white/80 hover:bg-white backdrop-blur-md rounded-xl shadow-md border border-slate-200/50 transition-all active:scale-95 cursor-pointer"
                          >
                            <EyeOff size={15} />
                            Ẩn bản xem trước
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 3. Nút hiển thị lại ảnh Preview (Khi người dùng đã bấm Ẩn) */}
                  {!isLoadingPreview && hasPreviewImage && !showPreview && (
                    <div className="flex justify-center mb-5 animate-in fade-in duration-300">
                      <button
                        onClick={() => setShowPreview(true)}
                        className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl shadow-sm border border-blue-100 transition-all active:scale-95 cursor-pointer"
                      >
                        <Eye size={15} />
                        Xem bản xem trước
                      </button>
                    </div>
                  )}

                  {/* 4. Portfolio Renderer (Hiển thị khi không có preview hoặc khi preview bị ẩn) */}
                  {shouldShowPortfolio && (
                    <div className="animate-in fade-in duration-300">
                      {currentPortfolio?.blocks &&
                      Array.isArray(currentPortfolio.blocks) &&
                      currentPortfolio.blocks.length > 0 ? (
                        <PortfolioRenderer
                          blocks={currentPortfolio.blocks}
                          ranking={currentPortfolio.ranking}
                        />
                      ) : currentPortfolio?.blocks &&
                        !Array.isArray(currentPortfolio.blocks) ? (
                        <PortfolioRenderer
                          blocks={[currentPortfolio.blocks]}
                          ranking={currentPortfolio.ranking}
                        />
                      ) : (
                        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
                          <h3 className="text-lg font-bold text-gray-900 mb-2">
                            {currentPortfolio?.portfolio?.name || "Portfolio"}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Portfolio này chưa có nội dung để hiển thị.
                          </p>
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
                <div className="fixed bottom-4 z-[100] w-fit px-6 py-2 bg-white/80 backdrop-blur-xl border border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-3xl flex items-center gap-6">
                  <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className="p-3 hover:bg-slate-100 rounded-2xl transition-all disabled:opacity-20 text-slate-800 cursor-pointer"
                  >
                    <ChevronLeft size={32} strokeWidth={2.5} />
                  </button>

                  <div className="flex items-center gap-8 border-x border-slate-100 px-6">
                    <button
                      onClick={handleOpenSkillModal}
                      className="flex items-center justify-center hover:scale-125 transition-all cursor-pointer"
                      title="Xem lịch sử kỹ năng"
                    >
                      <BarChart2 className="text-indigo-500" size={24} />
                    </button>

                    <button
                      onClick={() => setIsCommentModalOpen(true)}
                      className="flex items-center justify-center hover:scale-125 transition-all cursor-pointer"
                      title="Nhận xét"
                    >
                      <MessageSquare className="text-blue-500" size={24} />
                    </button>

                    <button
                      onClick={handleBookmark}
                      className="flex items-center justify-center hover:scale-125 transition-all cursor-pointer"
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
                      className="flex items-center justify-center hover:scale-125 transition-all cursor-pointer"
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
                    disabled={currentIndex === filteredPortfolios.length - 1}
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
