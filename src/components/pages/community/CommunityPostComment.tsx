import React from 'react';
import { Heart } from 'lucide-react';

interface CommentProps {
  comment: any;
  isLast?: boolean;
  level?: number;
}

export const CommunityPostComment: React.FC<CommentProps> = ({ comment, isLast, level = 0 }) => {
  return (
    <div className="relative">
      {/* Đường kẻ dọc nối các bình luận con */}
      {comment.replies.length > 0 && (
        <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-gray-100 dark:bg-gray-800" />
      )}

      <div className="flex gap-3 mb-4 relative">
        {/* Đường kẻ ngang nối từ đường dọc vào Avatar của bình luận con */}
        {level > 0 && (
          <div className="absolute -left-6 top-5 w-6 h-0.5 bg-gray-100 dark:bg-gray-800" />
        )}

        <img src={comment.avatar} className="w-10 h-10 rounded-full z-10 bg-white" alt={comment.author} />
        
        <div className="flex-1">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-2 inline-block max-w-full">
            <h4 className="font-bold text-sm text-gray-900 dark:text-white">{comment.author}</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{comment.content}</p>
          </div>
          
          <div className="flex items-center gap-4 mt-1 ml-2 text-xs font-bold text-gray-500">
            <span>{comment.time}</span>
            <button className="hover:underline cursor-pointer">Thích</button>
            <button className="hover:underline cursor-pointer">Phản hồi</button>
            {comment.likes > 0 && (
              <div className="flex items-center gap-1">
                <Heart size={12} className="text-red-500 fill-current" />
                <span>{comment.likes}</span>
              </div>
            )}
          </div>

          {/* Render các bình luận con (Đệ quy) */}
          {comment.replies.length > 0 && (
            <div className="mt-4 ml-6">
              {comment.replies.map((reply: any, index: number) => (
                <CommunityPostComment
                  key={reply.id} 
                  comment={reply} 
                  level={level + 1}
                  isLast={index === comment.replies.length - 1} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};