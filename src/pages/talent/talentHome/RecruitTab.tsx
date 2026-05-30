import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// Assets & Icons
import TestImage from "@/assets/testImage/testImage.png";
import MapIcon from "@/assets/myWeb/map.png";
import MoneyIcon from "@/assets/myWeb/money.png";
import SortIcon from "@/assets/myWeb/sort.png";
import { Search, Loader2, Bookmark, ChevronDown, Sparkles, X, Crown, Zap, Target } from "lucide-react";

import { useAppSelector, useAppDispatch } from "@/store/hook";
import {
  addSavedPost,
  initializeSavedPosts,
} from "@/store/features/savedPosts/savedPostsSlice";
import { fetchCompanyPosts, saveCompanyPost, searchCompanyPosts } from "@/services/company.api";
import { fetchMyPortfolios, fetchMatchedJobs, PostMatch, PortfolioMainBlockItem } from "@/services/portfolio.api";
import { CompanyPostAPI, CompanyPost, SearchCompanyPostsParams, SponsoredPostAPI } from "@/types/companyPost";
import useOnScreen from '@/hooks/useOnScreen';
import { reportSponsoredView, reportSponsoredClick } from '@/services/points.api';
import { notify } from "@/lib/toast";

export default function RecruitTab() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // States
  const [filters, setFilters] = useState<SearchCompanyPostsParams>({
    position: "",
    location: "",
    salary: "",
    type: "",
  });
  const [filteredPosts, setFilteredPosts] = useState<(CompanyPostAPI | SponsoredPostAPI)[]>([]);
  const [allPosts, setAllPosts] = useState<(CompanyPostAPI | SponsoredPostAPI)[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [savingPostIds, setSavingPostIds] = useState<Set<number>>(new Set());

  // AI Search States
  const [isAISearchEnabled, setIsAISearchEnabled] = useState(false);
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [userPortfolios, setUserPortfolios] = useState<PortfolioMainBlockItem[]>([]);
  const [isLoadingPortfolios, setIsLoadingPortfolios] = useState(false);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<number | null>(null);
  const [isLoadingMatches, setIsLoadingMatches] = useState(false);

  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const savedPostIds = useAppSelector((state) => state.savedPosts.savedPostIds);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsInitialLoading(true);
        const response = await fetchCompanyPosts(undefined, 20);
        if (response.items) {
          setAllPosts(response.items);
          setFilteredPosts(response.items);
        }

        if (accessToken) {
          try {
            const savedResponse = await fetch(
              `https://company-service.redmushroom-1d023c6a.southeastasia.azurecontainerapps.io/api/company-posts/saved`,
              {
                headers: { Authorization: `Bearer ${accessToken}` },
              },
            );
            if (savedResponse.ok) {
              const savedData = await savedResponse.json();
              const savedIds = (savedData.items || savedData || []).map(
                (post: CompanyPost) => post.postId,
              );
              dispatch(initializeSavedPosts(savedIds));
            }
          } catch (err) {
            console.error("Lỗi khi fetch danh sách đã lưu:", err);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsInitialLoading(false);
      }
    };
    loadData();
  }, [accessToken, dispatch]);

  const hasActiveFilters = Object.values(filters).some((v) => v !== "");

  const handleApplyFilter = async () => {
    if (!hasActiveFilters) {
      setFilteredPosts(allPosts);
      return;
    }

    setIsLoading(true);
    try {
      const response = await searchCompanyPosts(
        { ...filters, page: 1, pageSize: 20 },
        accessToken || undefined,
      );
      setFilteredPosts(response.items);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
      notify.error("Không thể tìm kiếm. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetFilters = () => {
    setFilters({ position: "", location: "", salary: "", type: "" });
    setFilteredPosts(allPosts);
  };

  // AI Search Handler: Load user portfolios when modal opens
  const handleOpenPortfolioModal = async () => {
    setShowPortfolioModal(true);
    if (userPortfolios.length === 0 && !isLoadingPortfolios) {
      setIsLoadingPortfolios(true);
      try {
        const portfolios = await fetchMyPortfolios(accessToken || "");
        setUserPortfolios(portfolios);
      } catch (error) {
        console.error("Lỗi khi tải portfolio:", error);
        notify.error("Không thể tải danh sách portfolio");
      } finally {
        setIsLoadingPortfolios(false);
      }
    }
  };

  // AI Search Handler: Select portfolio and fetch matched jobs
  const handleSelectPortfolio = async (portfolioId: number) => {
    setSelectedPortfolioId(portfolioId);
    setShowPortfolioModal(false);
    setIsLoadingMatches(true);
    setIsAISearchEnabled(true);

    try {
      const response = await fetchMatchedJobs(portfolioId, accessToken || "", 1, 20);
      if (response.item && response.item.length > 0) {
        const matchedPosts = response.item.map((item: PostMatch) => ({
          postId: item.postId,
          position: item.title,
          companyName: item.companyName,
          companyAvatar: item.companyAvatar,
          mediaUrl: item.mediaUrl || item.coverImageUrl,
          address: item.address,
          salary: item.salary,
        })) as CompanyPostAPI[];
        setFilteredPosts(matchedPosts);
        notify.success(`Tìm thấy ${response.item.length} công việc phù hợp`);
      } else {
        setFilteredPosts([]);
        notify.info("Không tìm thấy công việc phù hợp");
      }
    } catch (error: any) {
      // Detect 403 / premium error
      const message = error?.message || "";
      const is403 =
        error?.status === 403 ||
        error?.response?.status === 403 ||
        message.includes("gói hiện tại không được sử dụng AI") ||
        message.includes("403");

      if (is403) {
        setShowPremiumModal(true);
      } else {
        notify.error("Không thể tìm kiếm công việc phù hợp");
      }

      setIsAISearchEnabled(false);
      setSelectedPortfolioId(null);
    } finally {
      setIsLoadingMatches(false);
    }
  };

  // Disable AI Search and return to normal
  const handleDisableAISearch = () => {
    setIsAISearchEnabled(false);
    setSelectedPortfolioId(null);
    setFilteredPosts(allPosts);
  };

  // Sponsored tracking dedupe sets
  const seenSponsoredRef = useRef<Set<number>>(new Set());
  const clickedSponsoredRef = useRef<Set<number>>(new Set());

  // Extract portfolio position from INTRO block
  const getPortfolioPosition = (portfolio: PortfolioMainBlockItem): string => {
    const blocks = Array.isArray(portfolio.blocks) ? portfolio.blocks : [portfolio.blocks as any];
    const intro = blocks.find((b) => b?.type?.toUpperCase() === 'INTRO') || blocks[0];
    const introData = intro?.data || {};
    return (
      introData.studyField ||
      introData.department ||
      introData.title ||
      introData.position ||
      "Không xác định"
    );
  };

  // SponsoredCard component — handles view & click reporting
  function SponsoredCard({ sp, accessToken }: { sp: SponsoredPostAPI; accessToken?: string | null }) {
    const ref = useRef<HTMLDivElement | null>(null);
    const isVisible = useOnScreen(ref, '0px', 0.5);

    useEffect(() => {
      let t: NodeJS.Timeout | null = null;
      if (isVisible && sp.id && !seenSponsoredRef.current.has(sp.id)) {
        // wait briefly to avoid accidental visibility
        t = setTimeout(() => {
          reportSponsoredView(sp.id, accessToken || undefined);
          seenSponsoredRef.current.add(sp.id);
        }, 300);
      }
      return () => {
        if (t) clearTimeout(t);
      };
    }, [isVisible, sp.id, accessToken]);

    const handleVisit = async () => {
      try {
        if (sp.id && !clickedSponsoredRef.current.has(sp.id)) {
          reportSponsoredClick(sp.id, accessToken || undefined);
          clickedSponsoredRef.current.add(sp.id);
        }
      } catch (err) {
        console.warn('Error reporting click', err);
      } finally {
        if (sp.clickThroughUrl) window.open(sp.clickThroughUrl, '_blank', 'noopener,noreferrer');
      }
    };

    const bg = sp.imageUrl || TestImage;

    return (
      <div
        ref={ref}
        onClick={handleVisit}
        className="relative overflow-hidden rounded-[2rem] aspect-[4/5] shadow-lg group transition-all duration-500 hover:-translate-y-2 border border-gray-100 cursor-pointer"
      >
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
          style={{ backgroundImage: `url(${bg})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 group-hover:via-black/40 transition-colors pointer-events-none" />
        </div>

        {/* Sponsored badge */}
        <div className="absolute top-4 left-4 z-20">
          <span className="bg-yellow-400 text-xs text-black font-bold px-3 py-1 rounded-full">Sponsored</span>
        </div>

        <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
          <div className="flex items-start gap-4">
            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
              <div>
                <h2 className="text-xl font-bold tracking-tight line-clamp-2 group-hover:text-yellow-300 transition-colors">
                  {sp.textContent || 'Sponsored content'}
                </h2>
                {sp.createdAt && (
                  <p className="text-xs opacity-80 mt-1">{new Date(sp.createdAt).toLocaleString()}</p>
                )}
              </div>

              {/* Image click handles navigation; removed Visit button */}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSave = async (postId: number) => {
    if (savingPostIds.has(postId)) return;

    setSavingPostIds((prev) => new Set(prev).add(postId));
    try {
      await saveCompanyPost(postId, accessToken || undefined);
      dispatch(addSavedPost(postId));
      notify.success("Đã lưu bài viết thành công");
    } catch (error) {
      console.error("Lỗi khi lưu bài viết:", error);
      notify.error("Không thể lưu bài viết");
    } finally {
      setSavingPostIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    }
  };

  if (isInitialLoading)
    return (
      <div className="py-20 flex flex-col items-center justify-center text-gray-500">
        <Loader2 className="h-8 w-8 animate-spin mb-2" />
        <div className="p-4 text-center">Đang tải...</div>
      </div>
    );

  return (
    <div className="flex w-full bg-slate-50 px-4 py-6 gap-6">
      {/* LEFT SIDEBAR */}
      <aside className="w-[320px] shrink-0">
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 sticky top-24">
          {/* Header */}
          <div className="flex items-center gap-2 mb-6 border-b pb-4">
            <img src={SortIcon} alt="Sort" className="w-6 h-6" />
            <h2 className="font-bold text-gray-800">Bộ lọc việc làm</h2>
          </div>

          <div className="space-y-5">
            {/* Vị trí */}
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase block mb-2">
                Vị trí
              </label>
              <input
                type="text"
                placeholder="Tìm kiếm vị trí..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-400 outline-none text-sm"
                value={filters.position}
                onChange={(e) => setFilters({ ...filters, position: e.target.value })}
              />
            </div>

            {/* Địa điểm */}
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase block mb-2">
                Địa điểm
              </label>
              <input
                type="text"
                placeholder="Thành phố..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-400 outline-none text-sm"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              />
            </div>

            {/* Mức lương */}
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase block mb-2">
                Mức lương
              </label>
              <input
                type="text"
                placeholder="VD: 10 triệu, 500$..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-400 outline-none text-sm"
                value={filters.salary}
                onChange={(e) => setFilters({ ...filters, salary: e.target.value })}
              />
            </div>

            {/* Loại công việc */}
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase block mb-2">
                Loại công việc
              </label>
              <div className="relative">
                <select
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-400 outline-none appearance-none text-sm text-gray-700 cursor-pointer"
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                >
                  <option value="">Tất cả</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            {/* Buttons */}
            <button
              onClick={handleApplyFilter}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Đang tìm...
                </>
              ) : (
                <>
                  <Search size={18} /> Tìm kiếm
                </>
              )}
            </button>

            {/* AI Search Button */}
            <button
              onClick={handleOpenPortfolioModal}
              disabled={isLoadingMatches || !accessToken}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-purple-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoadingMatches ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Đang tìm kiếm...
                </>
              ) : (
                <>
                  <Sparkles size={18} /> AI Search
                </>
              )}
            </button>

            {isAISearchEnabled && selectedPortfolioId && (
              <button
                onClick={handleDisableAISearch}
                className="w-full text-sm text-purple-600 hover:text-purple-700 py-2 transition-colors"
              >
                ✕ Tắt AI Search
              </button>
            )}

            {hasActiveFilters && !isAISearchEnabled && (
              <button
                onClick={handleResetFilters}
                className="w-full text-sm text-gray-400 hover:text-gray-600 py-1 transition-colors"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT */}
      <main className="flex-1">
        {filteredPosts.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 text-center shadow-sm">
            <span className="text-5xl">🔍</span>
            <h3 className="text-xl font-bold mt-4">
              Không tìm thấy kết quả phù hợp
            </h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => {
              // Sponsored posts have isSponsored === true
              if ((post as any).isSponsored) {
                const sp = post as SponsoredPostAPI;
                return <SponsoredCard key={`sponsored-${sp.id}`} sp={sp} accessToken={accessToken} />;
              }

              // Otherwise render as CompanyPost
              const cp = post as CompanyPostAPI;
              return (
                <div
                  key={cp.postId}
                  className="relative overflow-hidden rounded-[2rem] aspect-[4/5] shadow-lg group transition-all duration-500 hover:-translate-y-2 border border-gray-100"
                >
                  {/* Background Image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${cp.mediaUrl || TestImage})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 group-hover:via-black/50 transition-colors" />
                  </div>

                  {/* Bookmark Button */}
                  <button
                    onClick={() => handleSave(cp.postId)}
                    disabled={savingPostIds.has(cp.postId)}
                    className="absolute top-5 right-5 z-20 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full transition-all cursor-pointer border border-white/20 group/bookmark disabled:opacity-50"
                  >
                    {savingPostIds.has(cp.postId) ? (
                      <Loader2 className="w-5 h-5 text-white animate-spin" />
                    ) : (
                      <Bookmark
                        className={`w-5 h-5 transition-all group-hover/bookmark:scale-110 ${
                          savedPostIds.includes(cp.postId)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-white"
                        }`}
                      />
                    )}
                  </button>

                  {/* Content */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                    <div className="flex items-start gap-4">
                      <img
                        src={cp.companyAvatar || ""}
                        alt={cp.companyName}
                        className="w-14 h-14 rounded-2xl bg-white object-cover border-2 border-white/20 shrink-0 shadow-xl"
                      />
                      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                        <div>
                          <h2 className="text-xl font-bold tracking-tight line-clamp-1 group-hover:text-blue-400 transition-colors">
                            {cp.position}
                          </h2>
                          <p className="text-sm font-medium opacity-80 truncate">
                            {cp.companyName}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1.5 mt-2">
                          <div className="flex items-center gap-2 text-xs opacity-90">
                            <div className="p-1 bg-white/10 rounded-md">
                              <img src={MapIcon} className="w-3 h-3 invert" alt="" />
                            </div>
                            <span className="truncate">{cp.address}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs font-bold text-green-400">
                            <div className="p-1 bg-green-400/10 rounded-md">
                              <img src={MoneyIcon} className="w-3 h-3 invert" alt="" />
                            </div>
                            <span>{cp.salary}</span>
                          </div>
                        </div>
                        <button
                          className="mt-4 flex items-center justify-center gap-2 bg-white/10 hover:bg-blue-600 backdrop-blur-md border border-white/20 py-2.5 px-2 rounded-xl transition-all w-full group/btn cursor-pointer font-bold text-sm"
                          onClick={() => navigate(`/job/${cp.postId}`)}
                        >
                          <span>Xem chi tiết</span>
                          <div className="transition-transform group-hover/btn:translate-x-1">→</div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Portfolio Selection Modal */}
      {showPortfolioModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-96 max-h-96 overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                <h3 className="text-xl font-bold text-gray-900">Chọn Portfolio</h3>
              </div>
              <button
                onClick={() => setShowPortfolioModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Chọn một portfolio để tìm kiếm công việc phù hợp
            </p>

            {isLoadingPortfolios ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
              </div>
            ) : userPortfolios.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Bạn chưa có portfolio nào</p>
              </div>
            ) : (
              <div className="space-y-2">
                {userPortfolios.map((portfolio) => (
                  <button
                    key={portfolio.portfolioId}
                    onClick={() => handleSelectPortfolio(portfolio.portfolioId)}
                    className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-purple-400 hover:bg-purple-50 transition-all"
                  >
                    <p className="font-semibold text-gray-900">
                      {portfolio.portfolio.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {getPortfolioPosition(portfolio)}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Premium Modal */}
      {showPremiumModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative bg-white rounded-3xl w-[440px] shadow-2xl overflow-hidden">
            {/* Top gradient banner */}
            <div className="h-32 bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 flex items-center justify-center relative">
              {/* Decorative circles */}
              <div className="absolute top-[-20px] left-[-20px] w-32 h-32 rounded-full bg-white/10" />
              <div className="absolute bottom-[-30px] right-[-10px] w-40 h-40 rounded-full bg-white/10" />
              {/* Crown icon */}
              <div className="relative z-10 w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-xl">
                <Crown className="w-9 h-9 text-yellow-300" strokeWidth={1.5} />
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={() => setShowPremiumModal(false)}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <X size={16} className="text-white" />
            </button>

            {/* Content */}
            <div className="p-7">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-extrabold text-gray-900 mb-2 tracking-tight">
                  Nâng cấp lên Premium
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Hãy vui lòng đăng ký{" "}
                  <span className="font-bold text-purple-600">gói Premium</span> nếu bạn
                  muốn sử dụng tính năng tìm kiếm việc làm thông minh bằng AI.
                </p>
              </div>

              {/* Feature list */}
              <div className="space-y-3 mb-7">
                {[
                  {
                    icon: <Sparkles className="w-4 h-4 text-purple-500" />,
                    bg: "bg-purple-50",
                    text: "AI Match việc làm theo portfolio của bạn",
                  },
                  {
                    icon: <Zap className="w-4 h-4 text-yellow-500" />,
                    bg: "bg-yellow-50",
                    text: "Gợi ý thông minh & cực kỳ chính xác",
                  },
                  {
                    icon: <Target className="w-4 h-4 text-pink-500" />,
                    bg: "bg-pink-50",
                    text: "Tăng cơ hội được tuyển dụng đúng vị trí",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}>
                      {item.icon}
                    </div>
                    <p className="text-sm text-gray-700 font-medium">{item.text}</p>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <button
                onClick={() => {
                  setShowPremiumModal(false);
                  navigate("/subscription");
                }}
                className="w-full py-3.5 rounded-2xl font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-200 transition-all hover:shadow-purple-300 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 mb-3"
              >
                <Crown size={18} className="text-yellow-300" />
                Đăng ký Premium ngay
              </button>

              <button
                onClick={() => setShowPremiumModal(false)}
                className="w-full py-2.5 rounded-2xl text-sm text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all font-medium"
              >
                Để sau
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}