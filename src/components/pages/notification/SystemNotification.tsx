import React from "react";
import { ShieldCheck, MessageSquare } from "lucide-react";

const SystemNotification = () => {
  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-blue-50 dark:border-gray-700 max-w-2xl transform transition-hover hover:scale-[1.01]">
        <p className="text-gray-700 dark:text-gray-300 text-center mb-6 leading-relaxed">
          Yêu cầu kết nối với nhà tuyển dụng của bạn đã được đồng ý. Từ giờ bạn có thể trò chuyện với nhà tuyển dụng.
        </p>
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gray-900 flex items-center justify-center overflow-hidden border-4 border-white dark:border-gray-700 shadow-lg">
              <img 
                alt="Google Logo" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDq3tltxEn4erJMKuhvKkrvB7KZiIV6YSdhEgM_qYD7T9gJjO1tuj_v4bYUcXu_zcHnJ521mgyg2-EwD6MTs2qaTSHL16P5z3LlfZ5rcNxCtyNgvxOn_zOFTQxjOYPMKCXYlMxrlbrMTqgHXpdZdy-XoCZox1cuQGOK4UMe10HgCTWO-Q2Tcbr8URpX4Se9gPteUrPghvzxnYU_MeK7KPetRAiDemZMhPGdiE1klAVcrOBXzQjws3Z7dWht2XlDLZwep1eXvLAqZKo"
              />
            </div>
            <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full border-2 border-white dark:border-gray-700 p-1">
              <ShieldCheck size={14} className="text-white" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Google Inc.</h3>
          <button className="mt-2 px-8 py-2.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors cursor-pointer flex items-center gap-2">
            <MessageSquare size={18} />
            Bắt đầu trò chuyện
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemNotification;