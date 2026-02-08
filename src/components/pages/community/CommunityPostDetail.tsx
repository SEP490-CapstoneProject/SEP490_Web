import { ArrowLeft, Send } from "lucide-react";
import { CommunityPostComment } from "./CommunityPostComment";
import { communityPosts, POST_COMMENTS_MOCK } from "@/data/mockComment";
import { useNavigate, useParams } from "react-router-dom";
import { CommunityPostCard } from "./CommunityPostCard";

export default function CommunityPostDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const postId = Number(id);

  // 1. Tìm bài viết
  const post = communityPosts.find((p) => p.id === postId);

  // 2. Tìm danh sách bình luận tương ứng với postId này
  const postCommentsData = POST_COMMENTS_MOCK.find(
    (item) => item.postId === postId,
  );

  // Xử lý trường hợp không tìm thấy bài viết (ID sai)

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-slate-500 mb-4">Bài viết không tồn tại!</p>

        <button
          onClick={() => navigate("/community")}
          className="text-blue-500 font-bold"
        >
          Quay lại bảng tin
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto min-h-screen bg-white dark:bg-gray-900 border-x border-slate-200 dark:border-gray-800 shadow-sm">
      <div className="py-6 px-4">
        {/* Header điều hướng */}
        <header className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors cursor-pointer"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Bài viết</h1>
        </header>

        {/* Hiển thị lại PostCard gốc */}
        <div className="mb-6">
          <CommunityPostCard
            id={post.id.toString()}
            author={post.author.name} // Lấy name từ object author
            time={post.createdAt} // Sử dụng createdAt từ API
            avatar={post.author.avatar}
            isVerified={post.author.role === "COMPANY"} // Tự động xác định tích xanh nếu là doanh nghiệp
            content={post.description || ""} // Đổi từ content sang description
            image={post.media && post.media.length > 0 ? post.media[0] : ""} // Lấy ảnh đầu tiên trong mảng media
            imageTitle={post.portfolioPreview?.data?.title || ""} // Lấy tiêu đề từ portfolio preview nếu có
            likes={post.favoriteCount} // Đổi từ likes sang favoriteCount
            comments={post.commentCount} // Đổi từ comments sang commentCount
          />
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800 pt-6 mb-24">
          <h3 className="font-bold text-lg mb-6">
            Bình luận ({postCommentsData?.comments.length || 0})
          </h3>

          <div className="space-y-6">
            {/* LƯU Ý: Map trên mảng comments của bài viết cụ thể */}
            {postCommentsData?.comments.map((comment) => (
              <CommunityPostComment key={comment.id} comment={comment} />
            ))}

            {(!postCommentsData || postCommentsData.comments.length === 0) && (
              <p className="text-center text-slate-500 text-sm py-10">
                Chưa có bình luận nào.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Input gõ bình luận giữ nguyên */}
      <div className="z-50 fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 p-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
            className="w-10 h-10 rounded-full"
            alt="My Avatar"
          />
          <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 flex items-center">
            <input
              type="text"
              placeholder="Viết bình luận..."
              className="bg-transparent border-none focus:ring-0 w-full text-sm outline-none"
            />
            <button className="text-blue-500 hover:text-blue-600 transition-colors cursor-pointer">
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
