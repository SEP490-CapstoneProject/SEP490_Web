import { Award, CheckCircle2, ChevronRight, Lightbulb } from "lucide-react";

const TipItem = ({ text }: { text: string }) => (
  <li className="flex gap-4 group">
    <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 shrink-0 transition-transform group-hover:scale-125"></div>
    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
      {text}
    </p>
  </li>
);
export function PremiumAndTips() {
  return (
    <aside className="w-1/3 space-y-8 hidden lg:block bg-slate-50/50 dark:bg-slate-900/50">
      <div className="bg-blue-500 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg shadow-blue-500/20">
        <div className="relative z-10">
          <h3 className="text-2xl font-bold mb-3 leading-tight">
            Nâng cấp tài khoản Premium
          </h3>
          <p className="text-blue-50 text-sm leading-relaxed mb-8">
            Nhận ưu tiên hiển thị hồ sơ cho các nhà tuyển dụng hàng đầu và mở
            khóa các tính năng nâng cao.
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
export function PremiumInNotification() {
  return (
    <aside className="w-full lg:w-96 shrink-0">
      <div className="sticky top-8 space-y-6">
        <h2 className="text-gray-500 dark:text-gray-400 font-medium flex items-center gap-2 text-sm uppercase tracking-wider">
          <Award size={16} className="text-blue-500" />
          Dành riêng cho bạn
        </h2>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-xl overflow-hidden transform transition-all hover:shadow-2xl hover:shadow-blue-500/10">
          <div className="p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Award size={32} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                  Gói Premium
                </h3>
                <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-1">
                  Nâng tầm sự nghiệp
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
                  Dành cho Người dùng
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle2
                      size={16}
                      className="text-blue-500 shrink-0 mt-0.5"
                    />
                    <span>Xem ai đã ghé thăm và quan tâm hồ sơ của bạn</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle2
                      size={16}
                      className="text-blue-500 shrink-0 mt-0.5"
                    />
                    <span>Mở rộng giới hạn tạo hồ sơ kỹ năng (+5)</span>
                  </li>
                </ul>
              </div>

              <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
                  Dành cho Nhà tuyển dụng
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle2
                      size={16}
                      className="text-blue-500 shrink-0 mt-0.5"
                    />
                    <span>Ưu tiên hiển thị tin tuyển dụng trên bảng tin</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle2
                      size={16}
                      className="text-blue-500 shrink-0 mt-0.5"
                    />
                    <span>Sử dụng bộ lọc ứng viên AI nâng cao</span>
                  </li>
                </ul>
              </div>
            </div>

            <button className="w-full mt-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/25 active:scale-[0.97] cursor-pointer flex items-center justify-center gap-2">
              Nâng cấp gói chỉ với 399.000/tháng
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
