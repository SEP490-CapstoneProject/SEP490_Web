import { ChevronLeft, Trophy, Flame, ArrowUpRight } from "lucide-react";
import top1Avatar from "@/assets/myWeb/top1avatar.png";
import TestImage from "@/assets/testImage/testImage.png";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  portfolioService,
  PortfolioRankBy,
  PortfolioSortMode,
  PortfolioMainBlockItem,
  Reviewer,
} from "@/services/portfolio.api";
import { notify } from "@/lib/toast";
import { useAppSelector } from "@/store/hook";
import useOnScreen from "@/hooks/useOnScreen";
import { reportSponsoredClick, reportSponsoredView } from "@/services/points.api";
import { SponsoredPostDto } from "@/types/sponsoredPost";

interface IntroData {
  portfolioId: number;
  avatar?: string;
  name?: string;
  studyField?: string;
  totalScore?: number;
  rankPosition?: number;
  reviewers?: Reviewer[];
}

const extractIntroData = (portfolio: PortfolioMainBlockItem): IntroData => {
  const blocks = Array.isArray(portfolio.blocks)
    ? portfolio.blocks
    : [portfolio.blocks];
  
  let introData: IntroData = {
    portfolioId: portfolio.portfolioId,
    totalScore: portfolio.ranking?.totalScore,
    rankPosition: portfolio.ranking?.rankPosition,
    reviewers: portfolio.reviewers || [],
  };

  for (const block of blocks) {
    if (!block || block.type?.toUpperCase() !== "INTRO") continue;
    
    const data = block.data as Record<string, unknown> || {};
    introData = {
      ...introData,
      avatar: (data.avatar as string) || "",
      name: (data.name as string) || portfolio.portfolio?.name || "",
      studyField: (data.studyField as string) || "",
    };
    break;
  }

  return introData;
};

function SponsoredPortfolioCard({
  item,
  accessToken,
}: {
  item: SponsoredPostDto;
  accessToken?: string | null;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const isVisible = useOnScreen(ref, "0px", 0.5);
  const viewReportedRef = useRef(false);
  const clickReportedRef = useRef(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    if (isVisible && item.id && accessToken && !viewReportedRef.current) {
      timeoutId = setTimeout(() => {
        void reportSponsoredView(item.id, accessToken).then((ok) => {
          if (ok) {
            viewReportedRef.current = true;
          }
        });
      }, 300);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [accessToken, isVisible, item.id]);

  const handleClick = () => {
    if (item.id && accessToken && !clickReportedRef.current) {
      void reportSponsoredClick(item.id, accessToken).then((ok) => {
        if (ok) {
          clickReportedRef.current = true;
        }
      });
    }

    if (item.clickThroughUrl) {
      window.open(item.clickThroughUrl, "_blank", "noopener,noreferrer");
    }
  };

  const mediaUrl =
    item.contentType === "Video"
      ? item.videoUrl || item.imageUrl || TestImage
      : item.imageUrl || item.videoUrl || TestImage;

  return (
    <div
      ref={ref}
      onClick={handleClick}
      className="overflow-hidden rounded-[2rem] shadow-lg border border-gray-100 bg-white cursor-pointer group transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        {item.contentType === "Video" && item.videoUrl ? (
          <video
            src={item.videoUrl}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            muted
            playsInline
            autoPlay
            loop
          />
        ) : (
          <img
            src={mediaUrl}
            alt="Sponsored portfolio"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full">
            Sponsored
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
          {item.textContent || "Sponsored portfolio"}
        </h3>
        <p className="mt-2 text-sm text-gray-500 line-clamp-2">
          Nhấn vào hình ảnh để xem chi tiết.
        </p>
      </div>
    </div>
  );
}

export default function PortfolioRanking() {
  const navigate = useNavigate();
  const [topPortfolios, setTopPortfolios] = useState<PortfolioMainBlockItem[]>([]);
  const [sponsoredPosts, setSponsoredPosts] = useState<SponsoredPostDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  useEffect(() => {
    const loadTopPortfolios = async () => {
      try {
        setIsLoading(true);
        const response = await portfolioService.fetchAllPortfolios(
          1,
          10,
          PortfolioRankBy.total,
          undefined,
          PortfolioSortMode.rank_asc,
          accessToken ?? undefined,
        );
        if (response && response.items) {
          setTopPortfolios(response.items);
        }
        setSponsoredPosts(response?.sponsoredItems || []);
      } catch (error) {
        console.error("❌ Error loading portfolios:", error);
        notify.error("Không thể tải danh sách portfolio.");
      } finally {
        setIsLoading(false);
      }
    };

    loadTopPortfolios();
  }, [accessToken]);

  return (
    <div className="min-h-screen bg-white">
      {/* 1. Thanh Header cố định */}
      <header className="fixed top-16 left-0 right-0 backdrop-blur-md z-50 px-6 py-4 flex items-center gap-4 border-b border-gray-100">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Trophy className="text-yellow-500" /> Bảng xếp hạng Portfolio
        </h1>
      </header>

      <main className="pt-4">
        {/* 2. SECTION TOP 1 - CHIẾM TRỌN CHIỀU NGANG */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : topPortfolios.length > 0 ? (
          (() => {
            const top1Portfolio = topPortfolios[0];
            const top1Data = extractIntroData(top1Portfolio);
            return (
              <section className={`relative w-full bg-orange-100 py-20 flex justify-center items-center overflow-hidden`}>
                {/* Decor hiệu ứng lan tỏa */}
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent"></div>

                <div className="relative z-10 w-[360px] bg-white rounded-[3rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.15)] p-10 border border-white flex flex-col items-center">
                  {/* Huy hiệu Rank 1 */}
                  <div className="absolute -top-5 flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-500 text-white px-6 py-2.5 rounded-full shadow-xl">
                    <Flame size={20} fill="currentColor" className="animate-pulse" />
                    <span className="font-black text-sm uppercase tracking-tighter">
                      Portfolio nổi bật
                    </span>
                    <span className="bg-black/20 px-2.5 py-0.5 rounded-lg ml-1 font-bold">
                      #1
                    </span>
                  </div>

                  <img
                    src={top1Data.avatar || top1Avatar}
                    className="w-52 h-52 rounded-[2.5rem] object-cover shadow-2xl mb-8 border-4 border-orange-50 transition-transform hover:scale-105 duration-500"
                    alt={top1Data.name}
                  />

                  <div className="text-left">
                    {/* Name & Role */}
                    <h2 className="text-3xl font-black text-gray-900 leading-tight mb-2">
                      {top1Data.name}
                    </h2>
                    <p className="text-orange-600 font-bold uppercase tracking-widest text-[10px] mb-4">
                      {top1Data.studyField}
                    </p>

                    {/* Reviewers Section */}
                    {top1Data.reviewers && top1Data.reviewers.length > 0 && (
                      <div className="w-full mb-6">
                        <p className="text-xs font-semibold text-gray-600 mb-2.5 uppercase tracking-wider">
                          Được đánh giá bởi
                        </p>
                        <div className="flex items-center gap-3 flex-wrap">
                          {top1Data.reviewers.map((reviewer) => (
                            <div
                              key={reviewer.userId}
                              className="group relative"
                              title={`${reviewer.name} (${reviewer.role})`}
                            >
                              <img
                                src={reviewer.avatar}
                                alt={reviewer.name}
                                className="w-10 h-10 rounded-full object-cover border-2 border-orange-200 shadow-sm hover:shadow-md transition-all hover:scale-110"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = top1Avatar;
                                }}
                              />
                              {/* Tooltip */}
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                {reviewer.name}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={() => navigate(`/portfolio/${top1Portfolio.portfolioId}?viewOnly=true`)}
                    className="mt-2 w-full bg-black hover:bg-zinc-800 text-white py-4.5 rounded-[1.5rem] font-bold flex items-center justify-center gap-3 transition-all active:scale-95 cursor-pointer">
                    Xem Portfolio <ArrowUpRight size={20} />
                  </button>
                </div>
              </section>
            );
          })()
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400">Không có dữ liệu portfolio</p>
          </div>
        )}
        {/* 3. SECTION RANK 2 TO 5 - GRID */}
        <section className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topPortfolios.slice(1, 5).map((portfolio, index) => {
              const portfolioData = extractIntroData(portfolio);
              return (
                <div
                  key={portfolio.portfolioId}
                  onClick={() => navigate(`/portfolio/${portfolio.portfolioId}?viewOnly=true`)}
                  className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100 flex flex-col items-center text-center hover:-translate-y-3 transition-all duration-500 group cursor-pointer"
                >
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-blue-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all"></div>
                    <img
                      src={portfolioData.avatar || top1Avatar}
                      className="relative w-28 h-28 rounded-[1.5rem] object-cover shadow-md"
                      alt={portfolioData.name}
                    />
                    <span className="absolute -bottom-2 -right-2 bg-zinc-900 text-white w-10 h-10 rounded-full flex items-center justify-center font-black border-4 border-white text-sm">
                      #{index + 2}
                    </span>
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 leading-tight">
                    {portfolioData.name}
                  </h3>
                  <p className="text-gray-400 text-xs mt-2 font-medium">
                    {portfolioData.studyField}
                  </p>

                  {/* Reviewers Section */}
                  {portfolioData.reviewers && portfolioData.reviewers.length > 0 && (
                    <div className="w-full mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-center gap-2 flex-wrap">
                        {portfolioData.reviewers.map((reviewer) => (
                          <div
                            key={reviewer.userId}
                            className="group relative"
                            title={`${reviewer.name} (${reviewer.role})`}
                          >
                            <img
                              src={reviewer.avatar}
                              alt={reviewer.name}
                              className="w-8 h-8 rounded-full object-cover border-2 border-blue-200 shadow-sm hover:shadow-md transition-all hover:scale-110"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = top1Avatar;
                              }}
                            />
                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1.5 px-2 py-1 bg-gray-900 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                              {reviewer.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. SECTION RANK 6 TO 10 - VERTICAL LIST */}
        {topPortfolios.length > 5 && (
          <section className="max-w-7xl mx-auto px-6 mt-12 py-8">
            {/* Section Title */}
            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-xl">📋</span> Các portfolio khác
            </h2>

            {/* Vertical List */}
            <div className="space-y-4">
              {topPortfolios.slice(5, 10).map((portfolio, index) => {
                const portfolioData = extractIntroData(portfolio);
                return (
                  <div
                    key={portfolio.portfolioId}
                    onClick={() => navigate(`/portfolio/${portfolio.portfolioId}?viewOnly=true`)}
                    className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 flex items-center gap-5 hover:shadow-lg hover:border-gray-200 transition-all duration-300 cursor-pointer group"
                  >
                    {/* Rank Badge */}
                    <div className="relative flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                        <img
                          src={portfolioData.avatar || top1Avatar}
                          className="w-14 h-14 rounded-lg object-cover"
                          alt={portfolioData.name}
                        />
                      </div>
                      <span className="absolute -bottom-1 -right-1 bg-zinc-900 text-white w-7 h-7 rounded-full flex items-center justify-center font-black text-xs border-2 border-white">
                        {index + 6}
                      </span>
                    </div>

                    {/* Portfolio Info */}
                    <div className="flex-grow min-w-0">
                      <h3 className="font-bold text-lg text-gray-900 leading-tight truncate">
                        {portfolioData.name}
                      </h3>
                      <p className="text-gray-500 text-sm mt-1 truncate">
                        {portfolioData.studyField}
                      </p>
                    </div>

                    {/* Reviewers Mini */}
                    {portfolioData.reviewers && portfolioData.reviewers.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {portfolioData.reviewers.slice(0, 3).map((reviewer) => (
                          <div
                            key={reviewer.userId}
                            className="group/reviewer relative"
                            title={`${reviewer.name} (${reviewer.role})`}
                          >
                            <img
                              src={reviewer.avatar}
                              alt={reviewer.name}
                              className="w-7 h-7 rounded-full object-cover border border-blue-200 shadow-sm hover:shadow-md transition-all hover:scale-110"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = top1Avatar;
                              }}
                            />
                            {/* Tooltip */}
                            <div className="absolute bottom-full right-0 mb-1 px-2 py-1 bg-gray-900 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover/reviewer:opacity-100 transition-opacity pointer-events-none z-50">
                              {reviewer.name}
                            </div>
                          </div>
                        ))}
                        {portfolioData.reviewers.length > 3 && (
                          <div className="text-xs font-semibold text-gray-500 ml-1">
                            +{portfolioData.reviewers.length - 3}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {sponsoredPosts.length > 0 && (
          <section className="max-w-7xl mx-auto px-6 mt-12 pb-16">
            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-xl">⭐</span> Bài tài trợ
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sponsoredPosts.map((item) => (
                <SponsoredPortfolioCard
                  key={item.id}
                  item={item}
                  accessToken={accessToken}
                />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
