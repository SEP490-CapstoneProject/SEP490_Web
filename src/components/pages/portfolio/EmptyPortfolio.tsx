import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmptyImg from "@/assets/empty-portfolio-img.png";
import PremiumAndTips from "@/components/common/PremiumAndTips";

export default function EmptyPortfolioPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Container chính: Max-width để nội dung không quá tràn sang 2 bên */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row min-h-screen gap-8">
        {/* BÊN TRÁI: Main Content (Nội dung trống) */}
        <main className="w-full lg:w-2/3 flex flex-col justify-center items-center text-center bg-white rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm mb-32">
          <div className="mb-10 w-full flex items-center justify-center">
            <div className="relative w-48 h-48 md:w-64 md:h-64">
              <img
                alt="empty portfolio illustration"
                className="w-full h-full object-contain"
                src={EmptyImg}
              />
            </div>
          </div>

          <div className="space-y-6 max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Bắt đầu hành trình tỏa sáng của bạn!
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
              Bạn chưa có hồ sơ nào. Đừng để kỹ năng của bạn bị lãng quên. Hãy
              tạo dấu ấn riêng và kết nối với nhà tuyển dụng ngay hôm nay trên
              <span className="font-semibold text-blue-500 ml-1">
                SkillSnap
              </span>
              .
            </p>
          </div>

          <div className="mt-12">
            <Button className="bg-blue-500 hover:bg-blue-600 cursor-pointer text-white px-10 py-8 rounded-2xl font-bold text-xl flex items-center gap-3 transition-all transform hover:scale-[1.03] active:scale-95 shadow-xl shadow-blue-500/25">
              <PlusCircle size={28} />
              <span>Tạo hồ sơ đầu tiên</span>
            </Button>
          </div>
        </main>
    
        <PremiumAndTips />
      </div>
    </div>
  );
}
