import { Lightbulb } from "lucide-react";

const TipItem = ({ text }: { text: string }) => (
  <li className="flex gap-4 group">
    <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 shrink-0 transition-transform group-hover:scale-125"></div>
    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
      {text}
    </p>
  </li>
);
export default function PremiumAndTips() {
  return (
    <aside className="w-1/3 space-y-8 hidden lg:block bg-slate-50/50 dark:bg-slate-900/50">
          <div className="bg-blue-500 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg shadow-blue-500/20">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-3 leading-tight">
                Nâng cấp tài khoản Premium
              </h3>
              <p className="text-blue-50 text-sm leading-relaxed mb-8">
                Nhận ưu tiên hiển thị hồ sơ cho các nhà tuyển dụng hàng đầu và
                mở khóa các tính năng nâng cao.
              </p>
              <button className="bg-white text-blue-500 px-6 py-4 rounded-2xl font-bold text-sm w-full hover:bg-blue-50 transition-colors shadow-sm cursor-po">
                Tìm hiểu thêm
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center border border-blue-100 dark:border-blue-800">
                <Lightbulb className="text-blue-500" size={24} />
              </div>
              <h3 className="text-xl font-bold">Mẹo nhỏ cho bạn</h3>
            </div>
            <ul className="space-y-6">
              <TipItem text="Một ảnh đại diện chuyên nghiệp giúp tăng 40% khả năng kết nối." />
              <TipItem text="Cập nhật hồ sơ thường xuyên để luôn đứng đầu danh sách tìm kiếm." />
              <TipItem text="Sử dụng từ khóa chuyên môn trong chức danh để nhà tuyển dụng dễ tìm thấy." />
            </ul>
          </div>
        </aside>
  );
}