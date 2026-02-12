import {
  Mail,
  Phone,
  MoreHorizontal,
  FileText,
  Users,
  LineChart,
  Bookmark,
  ChevronRight,
  HelpCircle,
  Lock,
  Info,
  Key,
  LogOut,
  Award,
  Edit3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EditProfileModal from "./EditProfileModal";
import { portfolioService } from "@/services/portfolio.api";

export default function ProfilePage() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const navigate = useNavigate();

  const handlePortfolioClick = async () => {
    try {
      const userId = 2; // Mock user ID
      const portfolios = await portfolioService.fetchMainPortfoliosManagerByUser(userId);
      
      if (portfolios && portfolios.length > 0) {
        navigate('/portfolioManagement');
      } else {
        navigate('/emptyPortfolio');
      }
    } catch (error) {
      console.error('Error checking portfolios:', error);
      navigate('/emptyPortfolio');
    }
  };

  const handleCommunityPostClick = () => {
    navigate('/my-community-posts');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
      {/* CỘT TRÁI - Portfolio Card */}
      <div className="lg:col-span-3 space-y-6">
        <Card className="overflow-hidden border-2 border-slate-200 shadow-sm rounded-2xl bg-white">
          <div className="h-32 bg-[url('https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=500')] bg-cover bg-center relative border-b-2 border-slate-200">
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
              <Avatar className="h-20 w-20 border-4 border-white shadow-md">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Kala" />
                <AvatarFallback>KA</AvatarFallback>
              </Avatar>
            </div>
          </div>
          <CardContent className="pt-12 pb-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-6 uppercase tracking-wider">
              <h3 className="font-bold text-lg text-slate-800">kakaka</h3>

              <div className="flex items-center justify-center w-7 h-7 border-2 border-slate-200 bg-white rounded-lg hover:border-blue-400 hover:text-blue-500 transition-all cursor-pointer group">
                <Edit3
                  size={12}
                  className="text-slate-400 group-hover:text-blue-500"
                  onClick={() => setIsEditModalOpen(true)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1 bg-[#5b99fc] hover:bg-blue-600 rounded-xl text-white font-bold">
                Chia sẻ hồ sơ
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-xl border-2 border-slate-200 bg-white"
              >
                <MoreHorizontal size={20} />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CỘT GIỮA - Main Profile & Services */}
      <div className="lg:col-span-6 space-y-6">
        {/* Bio Card */}
        <Card className="border-2 border-slate-200 shadow-sm rounded-3xl p-8 pb-4 bg-white">
          <CardContent className="p-0 flex flex-col items-center text-center space-y-4">
            <Avatar className="h-24 w-24 border-2 border-slate-200 shadow-sm">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=AnNhien" />
              <AvatarFallback>AN</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-slate-900">
                Phạm An Nhiên
              </h2>
              <p className="text-[#3B82F6] font-bold">
                Nhà thiết kế UI/UX & Lập trình viên Frontend
              </p>
            </div>
            <p className="text-slate-600 leading-relaxed max-w-md font-medium">
              Một nhà thiết kế sản phẩm đầy nhiệt huyết với hơn 5 năm kinh
              nghiệm. Tôi tập trung vào việc tạo ra những trải nghiệm người dùng
              trực quan.
            </p>
            <div className="flex gap-8 text-slate-500 text-sm pt-2 font-semibold">
              <div className="flex items-center gap-2">
                <Mail size={16} /> annhien@gmail.com
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} /> 0123456789
              </div>
            </div>

            <div className="pt-4 w-full flex justify-center ">
              <button className="flex items-center gap-1 text-slate-400 text-sm font-medium hover:text-slate-600 transition-colors cursor-pointer">
                Xem thêm
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 gap-4">
          <ServiceCard
            icon={<FileText className="text-blue-600" />}
            title="Quản lý hồ sơ"
            desc="Cập nhật hồ sơ của bạn"
            onClick={handlePortfolioClick}
          />
          <ServiceCard
            icon={<Users className="text-blue-600" />}
            title="Bài đăng cộng đồng"
            desc="Hoạt động cộng đồng"
            onClick={handleCommunityPostClick}
          />
          <ServiceCard
            icon={<LineChart className="text-blue-600" />}
            title="Dữ liệu hiệu xuất"
            desc="Thống kê & dữ liệu"
          />
          <ServiceCard
            icon={<Bookmark className="text-blue-600" />}
            title="Quan tâm"
            desc="Danh sách đã lưu"
          />
        </div>

        {/* Premium Banner */}
        <Card className="border-2 border-slate-200 shadow-sm rounded-2xl cursor-pointer hover:bg-blue-50/30 transition-all bg-white">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200">
                <Award className="text-blue-600" size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 uppercase text-xs tracking-widest">
                  Gói Premium của tôi
                </h4>
                <p className="text-sm text-blue-600 font-bold">
                  Nâng cấp để mở khóa thêm các tính năng
                </p>
              </div>
            </div>
            <ChevronRight className="text-slate-400" />
          </CardContent>
        </Card>
      </div>

      {/* CỘT PHẢI - Settings & Support */}
      <div className="lg:col-span-3">
        <Card className="border-2 border-slate-200 shadow-sm rounded-3xl p-6 bg-white">
          <h3 className="font-bold text-xl text-slate-800 mb-6 border-b-2 border-slate-100 pb-2">
            Cài đặt & hỗ trợ
          </h3>
          <div className="space-y-3">
            <SettingsItem
              icon={<HelpCircle size={18} />}
              label="Trung tâm hỗ trợ"
            />
            <SettingsItem
              icon={<Lock size={18} />}
              label="Trung tâm quyền riêng tư"
            />
            <SettingsItem
              icon={<Info size={18} />}
              label="Điều khoản & chính sách"
            />
            <SettingsItem icon={<Key size={18} />} label="Đổi mật khẩu" />
            <SettingsItem
              icon={<LogOut size={18} />}
              label="Đăng xuất"
              isDanger
            />
          </div>
          <p className="text-center text-[10px] text-slate-400 mt-12">
            SkillSnap Desktop V1.0.2
          </p>
        </Card>
      </div>
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  );
}

function ServiceCard({
  icon,
  title,
  desc,
  onClick,
}: {
  icon: any;
  title: string;
  desc: string;
  onClick?: () => void;
}) {
  return (
    <Card 
      className="border-2 border-slate-200 bg-white rounded-2xl cursor-pointer hover:border-blue-400 transition-all shadow-sm"
      onClick={onClick}
    >
      <CardContent className="p-6 space-y-3">
        <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
          {icon}
        </div>
        <div>
          <h4 className="font-bold text-slate-800 text-[15px]">{title}</h4>
          <p className="text-xs text-slate-400 font-medium">{desc}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function SettingsItem({
  icon,
  label,
  isDanger,
}: {
  icon: any;
  label: string;
  isDanger?: boolean;
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl border-2 border-slate-100 cursor-pointer hover:border-blue-200 hover:bg-slate-50 transition-all bg-white">
      <div
        className={`flex items-center gap-3 ${isDanger ? "text-red-500" : "text-slate-700"} font-bold text-sm`}
      >
        <span className={isDanger ? "text-red-400" : "text-slate-400"}>
          {icon}
        </span>
        {label}
      </div>
      <ChevronRight className="text-slate-300" size={16} />
    </div>
  );
}
