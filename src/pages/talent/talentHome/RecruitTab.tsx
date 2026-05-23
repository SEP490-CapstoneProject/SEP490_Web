import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Assets & Icons
import TestImage from "@/assets/testImage/testImage.png";
import MapIcon from "@/assets/myWeb/map.png";
import MoneyIcon from "@/assets/myWeb/money.png";
import SortIcon from "@/assets/myWeb/sort.png";
import { Search, Loader2, Bookmark, ChevronDown } from "lucide-react";

import { useAppSelector, useAppDispatch } from "@/store/hook";
import {
  addSavedPost,
  initializeSavedPosts,
} from "@/store/features/savedPosts/savedPostsSlice";
import { fetchCompanyPosts, saveCompanyPost, searchCompanyPosts } from "@/services/company.api";
import { CompanyPostAPI, CompanyPost, SearchCompanyPostsParams } from "@/types/companyPost";
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
  const [filteredPosts, setFilteredPosts] = useState<CompanyPostAPI[]>([]);
  const [allPosts, setAllPosts] = useState<CompanyPostAPI[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [savingPostIds, setSavingPostIds] = useState<Set<number>>(new Set());

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
    // Nếu không có filter nào, hiện lại toàn bộ
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

            {hasActiveFilters && (
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
            {filteredPosts.map((post) => (
              <div
                key={post.postId}
                className="relative overflow-hidden rounded-[2rem] aspect-[4/5] shadow-lg group transition-all duration-500 hover:-translate-y-2 border border-gray-100"
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${post.mediaUrl || TestImage})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 group-hover:via-black/50 transition-colors" />
                </div>

                {/* Bookmark Button */}
                <button
                  onClick={() => handleSave(post.postId)}
                  disabled={savingPostIds.has(post.postId)}
                  className="absolute top-5 right-5 z-20 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full transition-all cursor-pointer border border-white/20 group/bookmark disabled:opacity-50"
                >
                  {savingPostIds.has(post.postId) ? (
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  ) : (
                    <Bookmark
                      className={`w-5 h-5 transition-all group-hover/bookmark:scale-110 ${
                        savedPostIds.includes(post.postId)
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
                      src={post.companyAvatar || ""}
                      alt={post.companyName}
                      className="w-14 h-14 rounded-2xl bg-white object-cover border-2 border-white/20 shrink-0 shadow-xl"
                    />
                    <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                      <div>
                        <h2 className="text-xl font-bold tracking-tight line-clamp-1 group-hover:text-blue-400 transition-colors">
                          {post.position}
                        </h2>
                        <p className="text-sm font-medium opacity-80 truncate">
                          {post.companyName}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1.5 mt-2">
                        <div className="flex items-center gap-2 text-xs opacity-90">
                          <div className="p-1 bg-white/10 rounded-md">
                            <img src={MapIcon} className="w-3 h-3 invert" alt="" />
                          </div>
                          <span className="truncate">{post.address}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-green-400">
                          <div className="p-1 bg-green-400/10 rounded-md">
                            <img src={MoneyIcon} className="w-3 h-3 invert" alt="" />
                          </div>
                          <span>{post.salary}</span>
                        </div>
                      </div>
                      <button
                        className="mt-4 flex items-center justify-center gap-2 bg-white/10 hover:bg-blue-600 backdrop-blur-md border border-white/20 py-2.5 px-2 rounded-xl transition-all w-full group/btn cursor-pointer font-bold text-sm"
                        onClick={() => navigate(`/job/${post.postId}`)}
                      >
                        <span>Xem chi tiết</span>
                        <div className="transition-transform group-hover/btn:translate-x-1">→</div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}