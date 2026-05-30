import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getPortfolioSkillsHistory } from "@/services/challenge.api";
import { SkillHistory } from "@/types/challenge";
import { SkillsHistoryModal } from "@/components/portfolio/SkillsHistoryModal";
import { fetchEmployeeByUserId } from "@/services/profile.api";
import { ChevronLeft, ChevronRight, Trophy, BarChart2 } from "lucide-react";
import SortIcon from "@/assets/myWeb/sort.png";
import ShareIcon from "@/assets/myWeb/share1.png";
import {
  portfolioService,
  PortfolioMainBlockItem,
} from "@/services/portfolio.api";
import PortfolioRenderer from "@/components/portfolio/render/PortfolioRenderer";
import { notify } from "@/lib/toast";
import { useNavigate } from "react-router-dom";

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

export default function ExploreTab() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const [filteredPortfolios, setFilteredPortfolios] = useState<
    PortfolioMainBlockItem[]
  >([]);
  const [allPortfolios, setAllPortfolios] = useState<PortfolioMainBlockItem[]>(
    [],
  );
  const [topPortfolios, setTopPortfolios] = useState<PortfolioMainBlockItem[]>(
    [],
  );
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const currentPortfolio = filteredPortfolios[currentIndex];
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [skillHistory, setSkillHistory] = useState<SkillHistory[]>([]);
  const [isLoadingSkills, setIsLoadingSkills] = useState(false);

  // ----------------------------------------------------------------
  // Data loading
  // ----------------------------------------------------------------

  const loadPortfolios = async () => {
    try {
      setIsLoading(true);
      const topResponse = await portfolioService.fetchAllPortfolios(1, 1, "0");
      if (topResponse && topResponse.items && topResponse.items.length > 0) {
        setTopPortfolios([topResponse.items[0]]);
      }

      const response = await portfolioService.fetchAllPortfolios(1, 10000, "2");
      if (!response || !response.items || response.items.length === 0) {
        setFilteredPortfolios([]);
        setIsLoading(false);
        return;
      }

      setFilteredPortfolios(response.items);
      setAllPortfolios(response.items);
      setCurrentIndex(0);
    } catch (error) {
      console.error("❌ Error loading portfolios:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPortfolios();
  }, []);

  // ----------------------------------------------------------------
  // Handlers
  // ----------------------------------------------------------------

  const currentUserName = currentPortfolio
    ? (extractIntroData(currentPortfolio)?.name ?? "User")
    : "User";

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
      console.error("❌ Error:", error);
      notify.error("Không thể tải lịch sử kỹ năng.");
      setSkillHistory([]);
    } finally {
      setIsLoadingSkills(false);
    }
  };

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
        "2",
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

  // ----------------------------------------------------------------
  // JSX
  // ----------------------------------------------------------------

  return (
    <div className="flex w-full min-h-screen">
      {/* Left Sidebar - Search */}
      <div className="hidden xl:block w-[360px] shrink-0 px-4">
        <div className="sticky top-16 w-full bg-white rounded-2xl p-6 shadow-md border border-gray-100 h-fit">
          <div className="flex items-center gap-2 mb-6">
            <img src={SortIcon} alt="Search" className="w-7 h-7" />
            <h2 className="text-xl font-bold text-gray-900">
              Tìm kiếm Portfolio
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold text-gray-700 mb-2 block ml-1">
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
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 outline-none transition-all"
                style={{ backgroundColor: "#F8FAFC" }}
              />
            </div>

            <button
              onClick={handleSearchSubmit}
              disabled={isSearching}
              className="w-full py-3 rounded-xl font-bold text-white shadow-lg shadow-blue-100 transition-all active:scale-[0.98]"
              style={{ backgroundColor: isSearching ? "#1E40AF" : "#3B82F6" }}
            >
              {isSearching ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Đang tìm...</span>
                </div>
              ) : (
                "Tìm kiếm"
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

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center py-8 px-6 overflow-x-hidden">
        <div className="w-full max-w-4xl space-y-6">
          <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden flex flex-col min-h-[750px] transition-all">
            <div className="flex-1 p-8 overflow-y-auto no-scrollbar scroll-smooth">
              {filteredPortfolios.length === 0 ? (
                isLoading ? (
                  <div className="flex flex-col items-center justify-center h-[600px]">
                    <div className="flex justify-center mb-4">
                      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
                    </div>
                    <p className="text-slate-400">Đang tải portfolio...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[600px] text-slate-400">
                    <p className="text-6xl mb-6">🔍</p>
                    <h3 className="text-xl font-bold">Không tìm thấy ứng viên</h3>
                    <p className="mt-2">
                      Thử thay đổi bộ lọc để xem nhiều kết quả hơn
                    </p>
                  </div>
                )
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {/* Luôn luôn render trực tiếp PortfolioRenderer */}
                  <PortfolioRenderer
                    blocks={
                      Array.isArray(currentPortfolio?.blocks)
                        ? currentPortfolio.blocks
                        : [currentPortfolio?.blocks]
                    }
                    ranking={currentPortfolio?.ranking}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Floating Action Bar */}
        {filteredPortfolios.length === 0 ? (
          <div />
        ) : (
          <div className="fixed bottom-4 z-[100] w-fit px-6 py-2 bg-white/80 backdrop-blur-xl border border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-3xl flex items-center gap-6">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-3 hover:bg-slate-100 rounded-2xl transition-all disabled:opacity-20 text-slate-800 cursor-pointer"
            >
              <ChevronLeft size={32} strokeWidth={2.5} />
            </button>

            <div className="flex items-center gap-6 border-x border-slate-100 px-6">
              <button
                onClick={handleOpenSkillModal}
                className="flex items-center justify-center hover:scale-125 transition-all cursor-pointer"
              >
                <BarChart2 className="text-indigo-500" size={24} />
              </button>

              <button className="hover:scale-125 transition-all cursor-pointer">
                <img
                  src={ShareIcon}
                  className="w-8 h-8"
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
      </main>

      {/* Right Sidebar - Top Ranked */}
      <div className="hidden xl:block w-[320px] shrink-0 px-4 py-8">
        <div className="sticky top-16 w-full bg-white rounded-2xl p-6 shadow-md border border-gray-100 h-fit">
          <div className="flex items-center gap-2 mb-6">
            <Trophy size={24} className="text-yellow-500" />
            <h2 className="text-xl font-bold text-gray-900">
              Portfolio được đánh giá cao nhất
            </h2>
          </div>

          {topPortfolios.length > 0 && extractIntroData(topPortfolios[0]) ? (
            (() => {
              const introData = extractIntroData(topPortfolios[0]);
              return (
                <div className="flex flex-col items-center text-center mb-6">
                  {introData?.avatar && (
                    <img
                      src={introData.avatar}
                      alt={introData.name || "Avatar"}
                      className="w-20 h-20 rounded-full object-cover border-2 border-purple-200 mb-4"
                    />
                  )}
                  <p className="text-lg font-bold text-gray-900">
                    {introData?.name || "Ứng viên"}
                  </p>
                </div>
              );
            })()
          ) : (
            <p className="text-xs text-gray-400 text-center py-8">
              Chưa có dữ liệu
            </p>
          )}

          <button
            onClick={() => navigate("/ranking")}
            className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-[0.98]"
          >
            Xem chi tiết
          </button>
        </div>
      </div>

      <SkillsHistoryModal
        isOpen={isSkillModalOpen}
        onClose={() => setIsSkillModalOpen(false)}
        skills={skillHistory}
        isLoading={isLoadingSkills}
        userName={currentUserName}
      />
    </div>
  );
}