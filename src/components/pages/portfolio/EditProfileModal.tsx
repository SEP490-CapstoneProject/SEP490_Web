import {
  X,
  ArrowLeft,
  Camera,
  User,
  PhoneIcon,
  Mail,
  Lock,
  Check,
  Edit3,
} from "lucide-react";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditProfileModal = ({ isOpen, onClose }: EditProfileModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="bg-white dark:bg-gray-900 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden relative z-10 animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-800">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-700 dark:text-gray-300"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Chỉnh sửa thông tin cá nhân
            </h1>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Images Section (Banner & Avatar) */}
        <div className="relative">
          {/* Banner */}
          <div className="h-44 w-full bg-gray-200 dark:bg-gray-800 relative group overflow-hidden">
            <img
              alt="Profile Banner"
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1000"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <label className="cursor-pointer bg-white/20 backdrop-blur-md p-3 rounded-full hover:bg-white/40 transition-colors">
                <Camera className="text-white" size={24} />
                <input type="file" className="hidden" />
              </label>
            </div>
            <div className="absolute bottom-4 right-4">
              <button className="bg-black/40 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 hover:bg-black/60 transition-colors border border-white/20">
                <Camera size={14} />
                Thay đổi ảnh bìa
              </button>
            </div>
          </div>

          {/* Avatar */}
          <div className="absolute -bottom-12 left-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-900 overflow-hidden bg-gray-300 dark:bg-gray-700 shadow-xl">
                <img
                  alt="User profile"
                  className="w-full h-full object-cover"
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=AnNhien"
                />
              </div>
              <label className="absolute bottom-1 right-1 bg-white dark:bg-gray-800 p-2.5 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300">
                <Camera size={18} />
                <input type="file" className="hidden" />
              </label>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="pt-16 pb-6 px-8 space-y-5">
          {/* Tên hiển thị */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-500 dark:text-gray-400 ml-1">
              Tên hiển thị
            </label>
            <div className="relative group">
              <User
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#5b99fc] transition-colors"
                size={18}
              />
              <input
                className="w-full pl-12 pr-12 py-3 bg-gray-100 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-[#5b99fc] text-gray-900 dark:text-white transition-all outline-none"
                type="text"
                defaultValue="An Nhiên"
              />
              <Edit3
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5b99fc] cursor-pointer"
                size={18}
              />
            </div>
          </div>

          {/* Số điện thoại */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-500 dark:text-gray-400 ml-1">
              Số điện thoại
            </label>
            <div className="relative group">
              <PhoneIcon
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#5b99fc] transition-colors"
                size={18}
              />
              <input
                className="w-full pl-12 pr-12 py-3 bg-gray-100 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-[#5b99fc] text-gray-900 dark:text-white transition-all outline-none"
                type="tel"
                defaultValue="0123456789"
              />
              <Edit3
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5b99fc] cursor-pointer"
                size={18}
              />
            </div>
          </div>

          {/* Email (Readonly) */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-500 dark:text-gray-400 ml-1">
              Email
            </label>
            <div className="relative opacity-60">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                className="w-full pl-12 pr-12 py-3 bg-gray-100 dark:bg-gray-800 border-none rounded-xl text-gray-500 dark:text-gray-400 cursor-not-allowed outline-none"
                disabled
                type="email"
                value="hihihaha@gmail.com"
              />
              <Lock
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-8 pt-0">
          <button
            onClick={onClose}
            className="w-full cursor-pointer bg-[#5b99fc] hover:bg-[#5b99fc] text-white font-bold py-4 rounded-xl shadow-lg shadow-red-500/30 transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
          >
            Lưu thay đổi
            <Check
              className="group-hover:translate-x-1 transition-transform"
              size={20}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
