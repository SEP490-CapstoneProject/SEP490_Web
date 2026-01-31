import React from "react";
import { ImageIcon, Contact, Send } from "lucide-react";
import { CommunityPostCard } from "./CommunityPostCard";
import { communityPosts } from "@/data/mockComment";
import type { CommunityPost } from "@/types/communityPost.ts";


export default function CommunityPost() {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 min-h-screen transition-colors duration-200">
      <div className="max-w-2xl mx-auto py-4 px-4">
        
        {/* Create Post Section */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4 mb-6">
          <div className="flex space-x-3 mb-4">
            <img
              alt="User"
              className="w-12 h-12 rounded-full border border-gray-100 dark:border-gray-700 object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBsjvi0ArLl2XqTraIl2aHGRPylpHqFv_bVfqa61Xh0wJBB-a-tohjy7lUVXCnLgaE6jem9etqCZFeoUnm-_rVD1mmqLc3_QE1xCBesU6jGA0-1vjyUxg4ecyzd7Hv6c8YjmGG4IuVd9L9aXXJ4Nzn1mokwny3g1_G4vwmxo8LdKnQR8pbPVZ3P8ltMgxDBi0Pw6X5c_XGhsKYtcTlRsjvwihYnkDPuffHdEpgwnUCtpzvhY-JXfzVauuEjfGSa0B1NWj2OIImtto"
            />
            <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-3 flex items-center">
              <input
                className="bg-transparent border-none focus:ring-0 focus:outline-none w-full text-sm text-gray-700 dark:text-gray-300 placeholder-gray-500"
                placeholder="Chia sẻ suy nghĩ của bạn..."
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center justify-between pt-2">
            <div className="flex space-x-1">
              <button className="flex items-center cursor-pointer space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400">
                <ImageIcon size={18} className="text-blue-500" />
                <span className="text-sm font-medium">Thêm ảnh</span>
              </button>
              <button className="flex items-center cursor-pointer space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400">
                <Contact size={18} className="text-green-500" />
                <span className="text-sm font-medium">Hồ sơ</span>
              </button>
            </div>
            <button className="bg-blue-500 cursor-pointer hover:bg-blue-600 text-white px-8 py-2 rounded-lg font-semibold transition-all shadow-md active:scale-95 flex items-center gap-2">
              <Send size={16} />
              Đăng
            </button>
          </div>
        </div>

        {/* Feed List - Hiển thị toàn bộ bài viết từ mock data */}
        <div className="space-y-6">
          {communityPosts.map((post: CommunityPost) => (
            <CommunityPostCard
              key={post.id}
              id={post.id.toString()} // Chuyển id sang string nếu component yêu cầu
              author={post.author.name}
              time={post.createdAt} // Bạn có thể dùng hàm format thời gian tại đây
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

        {/* Footer Link */}
        <div className="mt-10 text-center pb-12">
          <button className="text-sm font-semibold text-gray-500 hover:text-blue-500 dark:text-gray-400 transition-colors cursor-pointer">
            Xem thêm bài viết mới
          </button>
        </div>
      </div>
    </div>
  );
}