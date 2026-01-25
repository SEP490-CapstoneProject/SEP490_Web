import {
  ArrowLeft,
  Plus,
  MoreVertical,
  Mail,
  Phone,
  Share2,
  Eye,
  Edit3,
  Trash2,
  Lightbulb,
} from "lucide-react";


const ProfileCard = ({
  status,
  statusLabel,
  image,
}: {
  status: string;
  statusLabel: string;
  image: string;
}) => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative group">
    <div className="absolute top-4 right-4 flex items-center gap-2">
      <span
        className={`text-xs font-semibold px-2 py-1 rounded ${
          status === "active"
            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
        }`}
      >
        {statusLabel}
      </span>
      <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
        <MoreVertical size={20} />
      </button>
    </div>

    <div className="flex flex-col items-center text-center">
      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-50 dark:border-slate-800 mb-4">
        <img alt="Profile" className="w-full h-full object-cover" src={image} />
      </div>
      <h3 className="text-xl font-bold mb-1">Phạm An Nhiên</h3>
      <p className="text-blue-500 font-medium text-sm mb-4">
        Nhà thiết kế UI/UX & Lập trình viên Frontend
      </p>
      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6 max-w-sm">
        Một nhà thiết kế sản phẩm đầy nhiệt huyết với hơn 5 năm kinh nghiệm. Tôi
        tập trung vào việc tạo ra những trải nghiệm người dùng trực quan, đẹp
        mắt.
      </p>

      <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-8">
        <div className="flex items-center gap-1.5">
          <Mail size={16} /> annhien@gmail.com
        </div>
        <div className="flex items-center gap-1.5">
          <Phone size={16} /> 0123456789
        </div>
      </div>

      <div className="w-full pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-4 gap-2">
        <ActionButton icon={<Share2 size={16} />} label="Chia sẻ" />
        <ActionButton icon={<Eye size={16} />} label="Xem" />
        <ActionButton icon={<Edit3 size={16} />} label="Sửa" active />
        <ActionButton icon={<Trash2 size={16} />} label="Xóa" danger />
      </div>
    </div>
  </div>
);

const ActionButton = ({
  icon,
  label,
  active,
  danger,
}: {
  icon: any;
  label: string;
  active?: boolean;
  danger?: boolean;
}) => (
  <button
    className={`flex items-center justify-center gap-1 py-2 text-xs font-medium rounded transition-colors ${
      danger
        ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
        : active
          ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20"
          : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
    }`}
  >
    {icon} {label}
  </button>
);

const TipItem = ({ text }: { text: string }) => (
  <li className="flex gap-4 group">
    <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 shrink-0 transition-transform group-hover:scale-125"></div>
    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
      {text}
    </p>
  </li>
);

export default function ProfileManagement() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <div className="max-w-360 mx-auto flex min-h-screen">
        
        <main className="w-2/3 md:px-10 pr-4 border-slate-200 dark:border-slate-800">
          <header className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
                <ArrowLeft size={24} />
              </button>
              <h1 className="text-2xl font-bold tracking-tight">
                Quản lý hồ sơ
              </h1>
            </div>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 shadow-sm transition-all active:scale-95">
              <Plus size={20} /> Thêm hồ sơ mới
            </button>
          </header>

          <div className="mb-6">
            <h2 className="text-slate-500 dark:text-slate-400 font-medium">
              Danh sách hồ sơ (2)
            </h2>
          </div>

          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <ProfileCard
              status="active"
              statusLabel="Đang dùng"
              image="https://api.dicebear.com/7.x/avataaars/svg?seed=1"
            />
            <ProfileCard
              status="draft"
              statusLabel="Bản nháp"
              image="https://api.dicebear.com/7.x/avataaars/svg?seed=2"
            />
            <ProfileCard
              status="draft"
              statusLabel="Bản nháp"
              image="https://api.dicebear.com/7.x/avataaars/svg?seed=2"
            />
            <ProfileCard
              status="draft"
              statusLabel="Bản nháp"
              image="https://api.dicebear.com/7.x/avataaars/svg?seed=2"
            />
          </div>
        </main>

        
        <aside className="w-1/3  space-y-8 hidden lg:block bg-slate-50/50 dark:bg-slate-900/50">
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
      </div>
    </div>
  );
}
