import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmptyImg from "@/assets/empty-portfolio-img.png";

export default function EmptyPortfolioPage() {
  return (

    <div className="h-screen flex items-center justify-center overflow-hidden">
      <main className="max-w-4xl w-full flex flex-col items-center text-center mb-20">
        
        <div className="mb-10 w-full flex items-center justify-center">
          <div className="relative w-32 h-32 md:w-56 md:h-56 overflow-hidden ">
            <img
              alt="empty portfolio illustration"
              className="w-full h-full object-cover"
              src={EmptyImg}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl md:text-[40px] font-bold text-slate-900 tracking-tight">
            Bắt đầu hành trình tỏa sáng của bạn!
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Bạn chưa có hồ sơ nào. Đừng để kỹ năng của bạn bị lãng quên. Hãy tạo dấu ấn riêng 
            và kết nối với nhà tuyển dụng ngay hôm nay trên SkillSnap.
          </p>
        </div>

        <div className="mt-10">
          <Button 
            className="bg-[#3b82f6] hover:bg-blue-600 text-white px-8 py-7 rounded-lg font-semibold text-lg flex items-center gap-2 transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-blue-500/20"
          >
            <PlusCircle size={24} />
            <span>Tạo hồ sơ đầu tiên</span>
          </Button>
        </div>
      </main>
    </div>
  );
}