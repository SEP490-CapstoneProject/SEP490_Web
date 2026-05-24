import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, MessageSquare, BarChart2 } from "lucide-react"; // Bổ sung BarChart2 làm icon kỹ năng
import { Button } from "../../../components/ui/button";
import SortIcon from "../../../assets/myWeb/sort.png";
import BookmarkIcon from "../../../assets/myWeb/bookmark.png";
import ShareIcon from "../../../assets/myWeb/share1.png";
import {
  portfolioService,
  PortfolioMainBlockItem,
} from "@/services/portfolio.api";
import PortfolioRenderer from "@/components/portfolio/render/PortfolioRenderer";
import CommentModal from "./CommentModal";
import BookmarkModal from "./BookmarkModal";
import { SkillsHistoryModal } from "@/components/portfolio/SkillsHistoryModal"; // Import Modal lịch sử kỹ năng
import { getPortfolioSkillsHistory } from "@/services/challenge.api"; // Import API lấy lịch sử kỹ năng
import { fetchEmployeeByUserId } from "@/services/profile.api"; // Import API lấy profile để mapping userId
import { SkillHistory } from "@/types/challenge"; // Import Type
import { notify } from "@/lib/toast";
import { RootState } from "@/store";

// Hàm bổ trợ để trích xuất thông tin người dùng từ portfolio block nhằm lấy Name hiển thị trên Modal
interface IntroData {
  portfolioId: number;
  position: string;
  jobTitle?: string;
  name?: string;
  avatar?: string;
  ranking?: { rankPosition: number; totalScore: number };
}

const extractIntroData = (portfolio: PortfolioMainBlockItem): IntroData | null => {
  const blocks = Array.isArray(portfolio.blocks) ? portfolio.blocks : [portfolio.blocks];
  for (const block of blocks) {
    if (!block || block.type?.toUpperCase() !== "INTRO") continue;
    const data = block.data as Record<string, unknown> || {};
    return {
      portfolioId: portfolio.portfolioId,
      position: (data.studyField as string) || (data.position as string) || (data.jobTitle as string) || "",
      jobTitle: (data.jobTitle as string) || "",
      name: (data.name as string) || portfolio.portfolio?.name || "",
      avatar: (data.avatar as string) || (data.image as string) || "",
      ranking: portfolio.ranking
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
  // Store saved portfolio details (interest level, category)
  const [savedPortfolioDetails, setSavedPortfolioDetails] = useState<
    Map<number, { interestLevel: "LOW" | "MEDIUM" | "HIGH"; categoryId: number | null }>
  >(new Map());

  // Các State xử lý phần Modal lịch sử kỹ năng tương tự ExploreTab
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [skillHistory, setSkillHistory] = useState<SkillHistory[]>([]);
  const [isLoadingSkills, setIsLoadingSkills] = useState(false);

  const currentPortfolio = filteredPortfolios[currentIndex];

  const currentUserName = currentPortfolio
    ? extractIntroData(currentPortfolio)?.name ?? "User"
    : "User";

  // Hàm handle xử lý việc mở modal và gọi API bất đồng bộ theo 2 bước
  const handleOpenSkillModal = async () => {
    if (!currentPortfolio || !accessToken) {
      notify.error("Không thể xác thực người dùng.");
      return;
    }

    setIsSkillModalOpen(true);
    setIsLoadingSkills(true);

    try {
      // Bước 1: Lấy userId từ employeeId của ứng viên hiện tại
      const employeeProfile = await fetchEmployeeByUserId(
        currentPortfolio.employeeId,
        accessToken
      );

      // Bước 2: Dùng userId thu được từ profile để fetch lịch sử kỹ năng
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

  // Load saved portfolios to restrict duplicate saves
  const loadSavedPortfolios = useCallback(async (token: string | null) => {
    try {
      if (!token) return;

      console.log("📡 Loading saved portfolios...");
      const savedData = await portfolioService.fetchSavedPortfolios(token);
      console.log("📦 Raw saved portfolio data:", savedData);
      
      const savedIds = new Set(savedData.map((p: any) => p.portfolioId));
      const detailsMap = new Map(
        savedData.map((p: any) => {
          const interestLevelRaw =
            p.interestLevel ||
            p.level ||
            p.priority ||
            p.interestLevelType ||
            "MEDIUM";
          // Normalize to uppercase (API returns lowercase)
          const interestLevel = interestLevelRaw
            .toUpperCase() as "LOW" | "MEDIUM" | "HIGH";
          const categoryId =
            p.categoryId ||
            p.followCategoryId ||
            p.categoryFollowId ||
            p.followId ||
            null;
          
          console.log(
            "📋 Portfolio details for",
            p.portfolioId,
            "- Full object:",
            p,
            "| Interest level extracted:",
            interestLevel,
            "| Category ID extracted:",
            categoryId,
          );
          
          return [
            p.portfolioId,
            {
              interestLevel,
              categoryId,
            },
          ];
        }),
      );
      setSavedPortfolios(savedIds);
      setSavedPortfolioDetails(detailsMap);
      console.log("✅ Loaded saved portfolio IDs:", savedIds);
      console.log("✅ Loaded saved portfolio details:", detailsMap);
    } catch (error) {
      console.warn("⚠️ Could not load saved portfolios:", error);
      // Don't fail if we can't load saved portfolios, just continue
    }
  }, []);

  // Load all portfolios (no pagination - load all at once)
  const loadPortfolios = useCallback(async () => {
    try {
      setIsLoading(true);

      console.log("📡 Loading all portfolios...");

      // Load all portfolios with a large pageSize
      const response = await portfolioService.fetchAllPortfolios(1, 10000);
      console.log("📦 Loaded portfolios response:", response);

      if (!response || !response.items || response.items.length === 0) {
        console.warn("⚠️ API returned empty response");
        setFilteredPortfolios([]);
        setCurrentIndex(0);
        setIsLoading(false);
        return;
      }

      const portfolios = response.items;

      console.log("✅ Loaded", portfolios.length, "portfolios in total");

      setFilteredPortfolios(portfolios);
      setAllPortfolios(portfolios);
      setCurrentIndex(0);

      // Load saved portfolios to check which ones are already saved
      await loadSavedPortfolios(accessToken);
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Failed to load portfolios";
      console.error("❌ Error loading portfolios:", errorMsg);
      notify.error("Không thể tải danh sách portfolio. Vui lòng thử lại sau.");

      setFilteredPortfolios([]);
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, loadSavedPortfolios]);

  // Load all portfolios on component mount
  useEffect(() => {
    loadPortfolios();
  }, [loadPortfolios]);

  const handleNext = () => {
    if (currentIndex < filteredPortfolios.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSkillHistory([]); // Clear lịch sử kỹ năng của user cũ khi chuyển trang
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSkillHistory([]); // Clear lịch sử kỹ năng của user cũ khi chuyển trang
    }
  };

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    try {
      // Call API with search query parameter
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

      const portfolios = response.items;
      setFilteredPortfolios(portfolios);
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
      // If search is cleared, show all portfolios
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
      console.log(
        "Opening bookmark modal for portfolio:",
        currentPortfolio.portfolioId,
      );
      setIsBookmarkModalOpen(true);
    }
  };

  const handleCommentSuccess = () => {
    console.log("✅ Comment submitted/updated successfully");
    // Close the comment modal
    setIsCommentModalOpen(false);
  };

  const handleShare = () => {
    if (currentPortfolio) {
      console.log("Share portfolio:", currentPortfolio.portfolioId);
      // TODO: Implement share functionality
    }
  };

  const handleSubscribe = () => {
    navigate("/subscription");
  };

  if (!currentPortfolio) {
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
              {/* Search Input */}
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
                    if (e.key === "Enter") {
                      handleSearchSubmit();
                    }
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300"
                  style={{ backgroundColor: "#EFF6FF" }}
                />
              </div>

              {/* Search Button */}
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

              {/* Clear Search Button */}
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
          {/* Portfolio Card or Empty State */}
          {filteredPortfolios.length === 0 ? (
            // Màn hình không tìm thấy
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
              {/* Portfolio Card - No outer frame */}
              <div className="w-full max-w-3xl min-w-0">
                {/* Portfolio Blocks Content */}
                <div className="mb-3 p-4 sm:p-5 md:p-6">
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

                {/* Loading Indicator */}
                {isLoading && (
                  <div className="flex justify-center mt-4">
                    <div className="w-4 h-4 border-2 border-blue-400 border-t-blue-600 rounded-full animate-spin"></div>
                  </div>
                )}
              </div>

              {/* Floating Action Bar - Cách 1: Tích hợp nút Kỹ năng vào trong thanh Bar */}
              {!isCommentModalOpen && !isBookmarkModalOpen && (
                <div className="fixed bottom-4 z-[100] w-fit px-6 py-2 bg-white/80 backdrop-blur-xl border border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-3xl flex items-center gap-6">
                  {/* Previous Button */}
                  <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className="p-3 hover:bg-slate-100 rounded-2xl transition-all disabled:opacity-20 text-slate-800 cursor-pointer"
                  >
                    <ChevronLeft size={32} strokeWidth={2.5} />
                  </button>

                  {/* Action Buttons Container */}
                  <div className="flex items-center gap-8 border-x border-slate-100 px-6">
                    {/* Nút Xem lịch sử kỹ năng mới được tích hợp */}
                    <button
                      onClick={handleOpenSkillModal}
                      className="flex items-center justify-center hover:scale-125 transition-all cursor-pointer"
                      title="Xem lịch sử kỹ năng"
                    >
                      <BarChart2 className="text-indigo-500" size={24} />
                    </button>

                    {/* Nút Nhận xét */}
                    <button
                      onClick={() => setIsCommentModalOpen(true)}
                      className="flex items-center justify-center hover:scale-125 transition-all cursor-pointer"
                      title="Nhận xét"
                    >
                      <MessageSquare className="text-blue-500" size={24} />
                    </button>

                    {/* Nút Lưu Bookmark */}
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

                    {/* Nút Chia sẻ */}
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

                  {/* Next Button */}
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
              {/* Premium Badge */}
              <div className="mb-6">
                <span className="inline-block bg-blue-500 text-white px-6 py-2 rounded-xl text-sm font-bold">
                  Premium
                </span>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Tuyển dụng nhanh hơn gấp 2 lần!
              </h2>

              {/* Description */}
              <p className="text-gray-700 text-base leading-relaxed mb-8">
                Nâng cấp để tuyển dụng nhanh hơn với các ứng viên được phân tích
                từ AI phù hợp với yêu cầu của bạn.
              </p>

              {/* CTA Button */}
              <button
                onClick={handleSubscribe}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-xl transition-colors"
              >
                Đăng ký ngay
              </button>
            </div>
          </div>
        </aside>

        {/* Comment Modal */}
        {currentPortfolio && (
          <CommentModal
            isOpen={isCommentModalOpen}
            onClose={() => setIsCommentModalOpen(false)}
            portfolioId={currentPortfolio.portfolioId}
            onSuccess={() => {
              handleCommentSuccess();
            }}
          />
        )}

        {/* Bookmark Modal */}
        {currentPortfolio && (
          <BookmarkModal
            isOpen={isBookmarkModalOpen}
            onClose={() => setIsBookmarkModalOpen(false)}
            portfolioId={currentPortfolio.portfolioId}
            isAlreadySaved={savedPortfolios.has(currentPortfolio.portfolioId)}
            mode={
              savedPortfolios.has(currentPortfolio.portfolioId) ? "edit" : "create"
            }
            currentInterestLevel={
              (() => {
                const level =
                  savedPortfolioDetails.get(currentPortfolio.portfolioId)
                    ?.interestLevel || "MEDIUM";
                console.log(
                  "📤 Passing currentInterestLevel to BookmarkModal:",
                  level,
                  "for portfolio",
                  currentPortfolio.portfolioId,
                );
                return level;
              })()
            }
            currentCategoryId={
              (() => {
                const catId =
                  savedPortfolioDetails.get(currentPortfolio.portfolioId)
                    ?.categoryId || null;
                console.log(
                  "📤 Passing currentCategoryId to BookmarkModal:",
                  catId,
                  "for portfolio",
                  currentPortfolio.portfolioId,
                );
                return catId;
              })()
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

        {/* Skills History Modal - Đặt ở tầng dưới cùng để tránh bọc lồng phần tử */}
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