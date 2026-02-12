import React, { useState, useMemo } from "react";
import { CommunityPostCard } from "./CommunityPostCard";
import { communityPosts } from "@/data/mockComment";
import type { CommunityPost } from "@/types/communityPost.ts";
import sortIcon from "@/assets/myWeb/sort 2.png";

type SortOption = "newest" | "oldest";

export default function MyCommunityPost() {
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [showSortMenu, setShowSortMenu] = useState(false);

  // ID của user hiện tại - trong thực tế sẽ lấy từ auth context
  const currentUserId = 101; // Giả sử user hiện tại là "Google Inc." có id 101

  // Lọc chỉ lấy bài post của user hiện tại
  const myPosts = useMemo(() => {
    return communityPosts.filter((post) => post.author.id === currentUserId);
  }, [currentUserId]);

  // Sắp xếp bài post theo option được chọn
  const sortedPosts = useMemo(() => {
    const posts = [...myPosts];
    switch (sortBy) {
      case "newest":
        return posts.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "oldest":
        return posts.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      default:
        return posts;
    }
  }, [myPosts, sortBy]);

  const sortOptions = [
    { value: "newest" as SortOption, label: "Mới nhất" },
    { value: "oldest" as SortOption, label: "Cũ nhất" },
  ];

  const currentSortLabel =
    sortOptions.find((opt) => opt.value === sortBy)?.label || "Mới nhất";

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-2xl mx-auto py-4 px-4">
        {/* Header Section - Số bài post và Sort */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <p className="text-base text-gray-900">
              <span className="font-bold">
                Bạn có {myPosts.length} bài đăng
              </span>
            </p>

            {/* Sort Button */}
            <div className="relative">
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 transition-colors text-gray-700"
              >
                <img src={sortIcon} alt="Sort" className="w-5 h-5" />
                <span className="text-sm font-medium">{currentSortLabel}</span>
              </button>

              {/* Dropdown Menu */}
              {showSortMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value);
                        setShowSortMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                        sortBy === option.value
                          ? "text-blue-600 font-medium bg-blue-50"
                          : "text-gray-700"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Posts List */}
        {sortedPosts.length > 0 ? (
          <div className="space-y-6">
            {sortedPosts.map((post: CommunityPost) => (
              <CommunityPostCard
                key={post.id}
                id={post.id.toString()}
                author={post.author.name}
                time={post.createdAt}
                avatar={post.author.avatar}
                isVerified={post.author.role === "COMPANY"}
                content={post.description || ""}
                image={post.media && post.media.length > 0 ? post.media[0] : ""}
                imageTitle={post.portfolioPreview?.data?.title || ""}
                likes={post.favoriteCount}
                comments={post.commentCount}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Chưa có bài viết nào
            </h3>
            <p className="text-sm text-gray-500">
              Bạn chưa đăng bài viết nào. Hãy chia sẻ suy nghĩ của bạn!
            </p>
          </div>
        )}

        {/* Footer */}
        {sortedPosts.length > 0 && (
          <div className="mt-10 text-center pb-12">
            <p className="text-sm text-gray-400">
              Đã hiển thị tất cả {sortedPosts.length} bài viết
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
