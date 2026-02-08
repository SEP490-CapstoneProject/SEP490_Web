import React from "react";
import { Users, Heart, MessageCircle } from "lucide-react";

// Định nghĩa kiểu dữ liệu cho một thông báo
interface NotificationData {
  id: number;
  userName?: string;
  userAvatar?: string;
  content: string;
  time: string;
  isUnread?: boolean;
  type: "like" | "comment" | "group";
}

const CommunityNotification = () => {
  // Giả lập danh sách dữ liệu từ API
  const notifications: NotificationData[] = [
    {
      id: 1,
      userName: "Phạm Cường",
      userAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBsNUWRQMyW6ZiTNRuBJ_lHeNdO5Vw3t276JN4Lh2oa2R7r3Gsb5YTHn_7VnV4LO70f8zv1iymTn-zdNgbfwIxNXg3KZ84Hayw0B_xxn3kLYFCTckLuokLxaKtMJb41rfWrOvkUuffi6qecGniHGdQZddaBVgxJbsN7ssmhHtJ-oB9RudeNAV7CBUKsvgzrOFcnlLCJZE2j6p5nmGCOJjIdyOzZTmtXiNCBi3A5orYvq27LR8S44zaGDLkkxuogq9c6f9dTOHWTSa4",
      content: "đã thích bài viết của bạn.",
      time: "2 giờ trước",
      isUnread: true,
      type: "like",
    },
    {
      id: 2,
      userName: "Nguyễn Lan",
      userAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAgNbjcy3FSq_LFseGkzZyneTybEF3nEuEaXqG51zeqk88gUqkF1k9TahazUAJ5WW-6BtTUQSSSU0cSvRdByeMIRSnY2ux7alSK1-pzKgTcBojfTQy5fuHCRI0MAi0knDWwMUnp3tbGK2v8YD8PpDpP25IcpyzTaDiVRm1OyWOUeJ1OpQHiD50-nSRW3JS6P2XSjevjq9HEAkYT-lLAc2ZceAUl171F0T45x34_vkf5CTSgIqNxHBRgXCsoTaIO7PGA31Tev_egx4Y",
      content: 'đã bình luận: "Thật tuyệt vời!"',
      time: "5 giờ trước",
      type: "comment",
    },
    {
      id: 3,
      content: "Có 5 người mới vừa tham gia nhóm Thiết kế UI/UX.",
      time: "1 ngày trước",
      type: "group",
    },

  ];

  return (
    <div className="space-y-3">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 max-w-2xl hover:border-blue-400/50 transition-all cursor-pointer group"
        >
          {/* Avatar hoặc Icon tùy theo loại thông báo */}
          {notif.type === "group" ? (
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <Users size={24} />
            </div>
          ) : (
            <img
              alt={notif.userName}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-700 shrink-0"
              src={notif.userAvatar}
            />
          )}

          {/* Nội dung thông báo */}
          <div className="flex-grow">
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-snug">
              {notif.userName && (
                <span className="font-bold text-gray-900 dark:text-white mr-1">
                  {notif.userName}
                </span>
              )}
              {notif.content}
            </p>
            <span className="text-xs text-gray-500 mt-1 block">{notif.time}</span>
          </div>

          {/* Chấm xanh báo hiệu chưa đọc */}
          {notif.isUnread && (
            <span className="w-2.5 h-2.5 bg-blue-500 rounded-full shrink-0"></span>
          )}
        </div>
      ))}
    </div>
  );
};

export default CommunityNotification;