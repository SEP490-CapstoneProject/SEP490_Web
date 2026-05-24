import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getPortfolioSkillsHistory } from "@/services/challenge.api";
import { SkillHistory } from "@/types/challenge";
import { SkillsHistoryModal } from "@/components/portfolio/SkillsHistoryModal";
import { fetchEmployeeByUserId } from "@/services/profile.api";
import { ChevronLeft, ChevronRight, Trophy } from "lucide-react";
// import { Button } from "@/components/ui/button";
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

  const currentPortfolio = filteredPortfolios[currentIndex];
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [skillHistory, setSkillHistory] = useState<SkillHistory[]>([]);
  const [isLoadingSkills, setIsLoadingSkills] = useState(false);
  const loadPortfolios = async () => {
    try {
      // Fetch top portfolio separately (sorted by ranking)
      const topResponse = await portfolioService.fetchAllPortfolios(1, 1, "0");
      if (topResponse && topResponse.items && topResponse.items.length > 0) {
        const topPortfolio = topResponse.items[0];
        setTopPortfolios([topPortfolio]);
      }

      // Fetch random portfolios for main view
      const response = await portfolioService.fetchAllPortfolios(1, 10000, "2");
      if (!response || !response.items || response.items.length === 0) {
        setFilteredPortfolios([]);
        return;
      }

      const portfolios = response.items;

      setFilteredPortfolios(portfolios);
      setAllPortfolios(portfolios);
      setCurrentIndex(0);
    } catch (error) {
      console.error("❌ Error loading portfolios:", error);
      notify.error("Không thể tải danh sách portfolio.");
    }
  };

  useEffect(() => {
    loadPortfolios();
  }, []);
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
      // Bước 1: Lấy userId từ employeeId
      const employeeProfile = await fetchEmployeeByUserId(
        currentPortfolio.employeeId, // hoặc currentPortfolio.employeeId tuỳ API
        accessToken,
      );

      // Bước 2: Dùng userId từ profile để fetch skills
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
      // Call API with search query parameter
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

    // Call handleSearch with debounce can be added if needed
    // For now, search as user types
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

  return (
    <div className="flex w-full min-h-screen">
      {/* Search Bar - Top Section for XL screens */}
      <div className="hidden xl:block w-[360px] shrink-0 px-4">
        <div className="sticky top-16 w-full bg-white rounded-2xl p-6 shadow-md border border-gray-100 h-fit">
          {/* Header của thanh tìm kiếm */}
          <div className="flex items-center gap-2 mb-6">
            <img src={SortIcon} alt="Search" className="w-7 h-7" />
            <h2 className="text-xl font-bold text-gray-900">
              Tìm kiếm Portfolio
            </h2>
          </div>

          <div className="space-y-4">
            {/* Search Input */}
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
                  if (e.key === "Enter") {
                    handleSearchSubmit();
                  }
                }}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 outline-none transition-all"
                style={{ backgroundColor: "#F8FAFC" }}
              />
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearchSubmit}
              disabled={isSearching}
              className="w-full py-3 rounded-xl font-bold text-white shadow-lg shadow-blue-100 transition-all active:scale-[0.98]"
              style={{
                backgroundColor: isSearching ? "#1E40AF" : "#3B82F6",
              }}
            >
              {isSearching ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang tìm...</span>
                </div>
              ) : (
                "Tìm kiếm"
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

      {/* Main Content Area */}

      <main className="flex-1 flex flex-col items-center py-8 px-6 overflow-x-hidden">
        {/* Container chính bao bọc Portfolio */}

        <div className="w-full max-w-4xl space-y-6">
          {/* Khung nội dung Portfolio */}

          <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden flex flex-col min-h-[750px] transition-all">
            <div className="flex-1 p-8 overflow-y-auto no-scrollbar scroll-smooth">
              {filteredPortfolios.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[600px] text-slate-400">
                  <p className="text-6xl mb-6">🔍</p>

                  <h3 className="text-xl font-bold">Không tìm thấy ứng viên</h3>

                  <p className="mt-2">
                    Thử thay đổi bộ lọc để xem nhiều kết quả hơn
                  </p>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
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

        {/* 2. Floating Action Bar - Đưa vào trong main để nó nằm giữa phần content */}
        {filteredPortfolios.length === 0 ? (
          <div></div>
        ) : (
          <div className="fixed bottom-4 z-[100] w-fit px-6 py-2 bg-white/80 backdrop-blur-xl border border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-3xl flex items-center gap-6">
            {/* Nút Prev */}
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-3 hover:bg-slate-100 rounded-2xl transition-all disabled:opacity-20 text-slate-800 cursor-pointer"
            >
              <ChevronLeft size={32} strokeWidth={2.5} />
            </button>

            {/* Khu vực chứa các nút chức năng ở giữa */}
            <div className="flex items-center gap-6 border-x border-slate-100 px-6">
              {/* Nút Xem lịch sử kỹ năng mới thêm vào */}
              <button
                onClick={handleOpenSkillModal}
                className="px-4 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transition-all shadow-md shadow-blue-100 active:scale-[0.95] flex items-center gap-2 text-sm"
              >
                Kỹ năng
              </button>

              {/* Nút Share */}
              <button className="hover:scale-125 transition-all cursor-pointer">
                <img
                  src={ShareIcon}
                  className="w-8 h-8"
                  style={{ filter: "brightness(0) saturate(100%)" }}
                />
              </button>
            </div>

            {/* Nút Next */}
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

      {/* Right Sidebar - Top Ranked Portfolio */}
      <div className="hidden xl:block w-[320px] shrink-0 px-4 py-8">
        <div className="sticky top-16 w-full bg-white rounded-2xl p-6 shadow-md border border-gray-100 h-fit">
          {/* Header */}
          <div className="flex items-center gap-2 mb-6">
            <Trophy size={24} className="text-yellow-500" />
            <h2 className="text-xl font-bold text-gray-900">
              Portfolio được đánh giá cao nhất
            </h2>
          </div>

          {/* Top 1 Portfolio */}
          {topPortfolios.length > 0 && extractIntroData(topPortfolios[0]) ? (
            (() => {
              const introData = extractIntroData(topPortfolios[0]);
              return (
                <div className="flex flex-col items-center text-center mb-6">
                  {/* Avatar */}
                  {introData?.avatar && (
                    <img
                      src={introData.avatar}
                      alt={introData.name || "Avatar"}
                      className="w-20 h-20 rounded-full object-cover border-2 border-purple-200 mb-4"
                    />
                  )}
                  {/* Name */}
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

          {/* View Details Button */}
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
