import React from 'react';
// import { formatDistanceToNow } from "date-fns";
// import { vi } from "date-fns/locale";
import type { PostComment, ReplyComment } from "@/types/communityPost.ts";// Import interface của bạn

interface CommentProps {
  comment: PostComment;
}

export const CommunityPostComment: React.FC<CommentProps> = ({ comment }) => {
  return (
    <div className="relative">
      {/* 1. Render Comment chính (Level 0) */}
      <CommentItem 
        author={comment.author}
        content={comment.content}
        createdAt={comment.createdAt}
        isReply={false}
      />

      {/* 2. Render danh sách các Reply (Level 1) */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-12 mt-2 space-y-3 relative">
          {/* Đường kẻ dọc nối các reply */}
          <div className="absolute -left-6 top-0 bottom-6 w-0.5 bg-gray-100 dark:bg-gray-800" />
          
          {comment.replies.map((reply) => (
            <div key={reply.id} className="relative">
              {/* Đường kẻ ngang nối từ đường dọc vào avatar reply */}
              <div className="absolute -left-6 top-5 w-4 h-0.5 bg-gray-100 dark:bg-gray-800" />
              
              <CommentItem 
                author={reply.author}
                content={reply.content}
                createdAt={reply.createdAt}
                replyToUser={reply.replyToUser}
                isReply={true}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Sub-component để hiển thị từng dòng comment ---
interface ItemProps {
  author: any;
  content: string;
  createdAt: string;
  isReply: boolean;
  replyToUser?: any;
}

const CommentItem = ({ author, content, createdAt, isReply, replyToUser }: ItemProps) => {
  return (
    <div className="flex gap-3 mb-2">
      <img 
        src={author.avatar} 
        className={`${isReply ? "w-8 h-8" : "w-10 h-10"} rounded-full z-10 bg-white dark:bg-gray-900 object-cover shadow-sm`} 
        alt={author.name} 
      />
      
      <div className="flex-1">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-2 inline-block max-w-full">
          <div className="flex items-center gap-2 mb-0.5">
            <h4 className="font-bold text-sm text-gray-900 dark:text-white leading-none">
              {author.name}
            </h4>
            {author.role === "COMPANY" && (
              <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">
                Company
              </span>
            )}
          </div>
          
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {isReply && replyToUser && (
              <span className="text-blue-500 font-medium mr-1">@{replyToUser.name}</span>
            )}
            {content}
          </p>
        </div>
        
        <div className="flex items-center gap-4 mt-1 ml-2 text-[11px] font-bold text-gray-500">
          {/* <span>{formatDistanceToNow(new Date(createdAt), { addSuffix: true, locale: vi })}</span> */}
          <span>{createdAt}</span>
          <button className="hover:underline cursor-pointer text-gray-600 dark:text-gray-400">
            Phản hồi
          </button>
        </div>
      </div>
    </div>
  );
};