import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Bookmark, Reply, MoreHorizontal } from 'lucide-react';

// Thêm prop id vào Interface
interface PostProps {
  id: string; // ID dùng cho router
  author: string;
  time: string;
  avatar: string;
  isVerified?: boolean;
  content: string;
  image?: string;
  imageTitle?: string;
  likes: number;
  comments: number;
  // ... các props khác
}

export const CommunityPostCard: React.FC<PostProps> = ({ 
  id, author, time, avatar, isVerified, content, image, imageTitle, likes, comments 
}) => {
  return (
    <article className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex space-x-3">
            <img 
              alt={author} 
              className={`w-12 h-12 object-cover ${isVerified ? 'rounded-lg' : 'rounded-full'}`} 
              src={avatar} 
            />
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white leading-tight">{author}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">{time}</p>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <MoreHorizontal size={20} />
          </button>
        </div>

        {/* Bọc nội dung bằng Link để dẫn đến trang chi tiết */}
        <Link to={`/community/${id}`} className="block mt-4 group">
          <p 
            className="text-gray-800 dark:text-gray-200 leading-relaxed transition-colors" 
            dangerouslySetInnerHTML={{ __html: content }} 
          />
          
          {image && (
            <div className="relative mt-4 rounded-xl overflow-hidden shadow-sm">
              <img src={image} className="w-full aspect-video object-cover" alt={imageTitle} />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all" />
            </div>
          )}
        </Link>
      </div>

      <div className="flex items-center gap-16 px-6 py-3 border-t border-gray-100 dark:border-gray-700">
        <button className="flex items-center cursor-pointer space-x-1.5 text-gray-500 hover:text-red-500">
          <Heart size={18} />
          <span className="text-xs">{likes}</span>
        </button>
        
        {/* Nút bình luận cũng có thể dẫn đến trang chi tiết */}
        <Link to={`/community/${id}`} className="flex items-center cursor-pointer space-x-1.5 text-gray-500 hover:text-blue-500">
          <MessageCircle size={18} />
          <span className="text-xs">{comments}</span>
        </Link>
        
        <button className="text-gray-500 cursor-pointer hover:text-yellow-500">
          <Bookmark size={18} />
        </button>
        <button className="text-gray-500 cursor-pointer hover:text-green-500">
          <Reply size={18} className="rotate-180" />
        </button>
      </div>
    </article>
  );
};