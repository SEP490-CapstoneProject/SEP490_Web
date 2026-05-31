import {
  Bookmark,
  ChevronRight,
  HelpCircle,
  Lock,
  Info,
  Key,
  LogOut,
  Edit3,
  Building2,
  MapPin,
  FileText,
  Briefcase,
  History,
  ShoppingBag,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/store/hook";
import { logout } from "@/store/features/auth/authSlice";
import { notify } from "@/lib/toast";
import EditRecruiterProfileModal from "./EditRecruiterProfileModal";
import ChangePasswordModal from "./ChangePasswordModal";
import { useEffect, useState } from "react";
import { profileService } from "@/services/profile.api";
import { Company } from "@/types/company";

export default function RecruiterProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, accessToken } = useAppSelector((state) => state.auth);

  // State for modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);

  // Profile state
  const [companyProfile, setCompanyProfile] = useState<Company | null>(null);

  // Fetch company profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!accessToken) {
          console.warn("⚠️ No access token available");
          return;
        }

        console.log("📡 Fetching company profile...");
        const profile = await profileService.fetchCompanyProfile(accessToken);
        console.log("✅ Profile loaded:", profile);

        // Ensure profile has avatar and coverImage, with fallbacks
        const enrichedProfile = {
          ...profile,
          avatar:
            profile.avatar ||
            "https://api.dicebear.com/7.x/avataaars/svg?seed=company",
          coverImage:
            profile.coverImage ||
            "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000",
        };

        setCompanyProfile(enrichedProfile);
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Failed to load profile";
        console.error("❌ Error loading profile:", errorMsg);
        notify.error(errorMsg);

        // Set default profile on error so UI doesn't break
        setCompanyProfile({
          id: 0,
          userId: 0,
          companyName: "Company",
          activityField: "Công nghệ",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=company",
          coverImage:
            "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000",
          taxIdentification: 0,
          address: "Vietnam",
          description: "Company description",
        });
      }
    };

    fetchProfile();
  }, [accessToken]);

  const displayName = companyProfile?.companyName || "Company";
  const displayAvatar =
    companyProfile?.avatar ||
    "https://api.dicebear.com/7.x/avataaars/svg?seed=company";
  const displayCoverImage =
    companyProfile?.coverImage ||
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000";
  const displayActivityField = companyProfile?.activityField || "Công nghệ";
  const displayAddress = companyProfile?.address || "Vietnam";
  const displayDescription =
    companyProfile?.description || "Company description";

  const handleProfileUpdated = (updatedProfile: Partial<Company>) => {
    console.log("🔄 Profile updated, refreshing display...");
    if (companyProfile) {
      const mergedProfile = { ...companyProfile, ...updatedProfile };
      setCompanyProfile(mergedProfile);
    } else {
      // If no profile exists yet, use the updated profile as is
      setCompanyProfile(updatedProfile as Company);
    }
  };

  const handleEditProfile = () => {
    setIsEditModalOpen(true);
  };

  const handleChangePassword = () => {
    setIsChangePasswordModalOpen(true);
  };

  const handlePortfolioClick = () => {
    navigate("/recruitment-management");
  };

  const handleCommunityPostClick = () => {
    navigate("/my-community-posts");
  };

  const handleApplicationManagementClick = () => {
    navigate("/application-management");
  };

  const handleInterestClick = () => {
    navigate("/company-saved");
  };
  const handleTransactionHistoryClick = () => {
    navigate("/subscription-history");
  };
  const handleRewardsShopClick = () => {
    navigate("/company-rewards");
  };
  const handleSupportCenterClick = () => {
    navigate("/support-center");
  };

  const handlePrivacyCenterClick = () => {
    navigate("/privacy-center");
  };

  const handleTermsPolicyClick = () => {
    navigate("/terms-policy");
  };

  const handleLogout = () => {
    // Clear any stored authentication data if needed
    // localStorage.removeItem('token');
    dispatch(logout());
    notify.success("Đã đăng xuất. Hẹn gặp lại bạn!");
    navigate("/");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
      {/* CỘT TRÁI - Company Introduction */}
      <div className="lg:col-span-3 space-y-6">
        <Card className="overflow-hidden border-2 border-slate-200 shadow-sm rounded-2xl bg-white">
          <div
            className="h-32 bg-cover bg-center relative border-b-2 border-slate-200"
            style={{ backgroundImage: `url('${displayCoverImage}')` }}
          >
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
              <Avatar className="h-20 w-20 border-4 border-white shadow-md">
                <AvatarImage src={displayAvatar} />
                <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
          </div>
          <CardContent className="pt-12 pb-6 px-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <h3 className="font-bold text-lg text-slate-800 text-center">
                {displayName}
              </h3>
              <button onClick={handleEditProfile}>
                <div className="flex items-center justify-center w-7 h-7 border-2 border-slate-200 bg-white rounded-lg hover:border-blue-400 hover:text-blue-500 transition-all cursor-pointer group">
                  <Edit3
                    size={12}
                    className="text-slate-400 group-hover:text-blue-500"
                  />
                </div>
              </button>
            </div>

            {/* Company Info */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-[11px] text-slate-600 min-w-0">
                <Building2 size={16} className="text-slate-400 shrink-0" />
                <span className="truncate">
                  Lĩnh vực: {displayActivityField}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-600 min-w-0">
                <MapPin size={16} className="text-slate-400 shrink-0" />
                <span className="truncate">{displayAddress}</span>
              </div>
            </div>

            <button
              onClick={handleRewardsShopClick}
              className="w-full mb-5 flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700 active:scale-[0.98] cursor-pointer"
            >
              <ShoppingBag size={16} />
              Đổi thưởng
            </button>

            {/* Introduction */}
            <p className="text-xs text-slate-600 leading-relaxed">
              {displayDescription}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* CỘT GIỮA - Main Profile & Services */}
      <div className="lg:col-span-6 space-y-6">
        {/* Quick Actions Grid - 6 items */}
        <div className="grid grid-cols-2 gap-4">
          <ServiceCard
            icon={<FileText className="text-blue-600" />}
            title="Quản lý bài đăng tuyển dụng"
            desc="Cập nhật bài đăng tuyển dụng của bạn"
            onClick={handlePortfolioClick}
          />
          <ServiceCard
            icon={<FileText className="text-blue-600" />}
            title="Bài đăng cộng đồng"
            desc="Hoạt động cộng đồng"
            onClick={handleCommunityPostClick}
          />
          <ServiceCard
            icon={<Briefcase className="text-blue-600" />}
            title="Quản lý ứng tuyển"
            desc="Quản lý các yêu cầu ứng tuyển"
            onClick={handleApplicationManagementClick}
          />
          <ServiceCard
            icon={<Bookmark className="text-blue-600" />}
            title="Quan tâm"
            desc="Danh sách đã lưu"
            onClick={handleInterestClick}
          />
          <ServiceCard
            icon={<History className="text-blue-600" />}
            title="Lịch sử giao dịch"
            desc="Danh sách đã xem"
            onClick={handleTransactionHistoryClick}
          />
          <ServiceCard
            icon={<ShoppingBag className="text-blue-600" />}
            title="Đổi thưởng"
            desc="Mở shop đổi điểm lấy quảng cáo"
            onClick={handleRewardsShopClick}
          />
        </div>

        {/* Premium Banner */}
      </div>

      {/* CỘT PHẢI - Settings & Support */}
      <div className="lg:col-span-3">
        <Card className="border-2 border-slate-200 shadow-sm rounded-3xl px-4 py-6 bg-white">
          <h3 className="font-bold text-xl text-slate-800 mb-6 border-b-2 border-slate-100 pb-2">
            Cài đặt & hỗ trợ
          </h3>
          <div className="space-y-3">
            <SettingsItem
              icon={<HelpCircle size={18} />}
              label="Trung tâm hỗ trợ"
              onClick={handleSupportCenterClick}
            />
            <SettingsItem
              icon={<Lock size={18} />}
              label="Trung tâm quyền riêng tư"
              onClick={handlePrivacyCenterClick}
            />
            <SettingsItem
              icon={<Info size={18} />}
              label="Điều khoản & chính sách"
              onClick={handleTermsPolicyClick}
            />
            <SettingsItem
              icon={<Key size={18} />}
              label="Đổi mật khẩu"
              onClick={handleChangePassword}
            />
            <SettingsItem
              icon={<LogOut size={18} />}
              label="Đăng xuất"
              isDanger
              onClick={handleLogout}
            />
          </div>
          <p className="text-center text-[10px] text-slate-400 mt-12">
            SkillSnap Desktop V1.0.2
          </p>
        </Card>
      </div>

      {/* Modals */}
      <EditRecruiterProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        companyId={companyProfile?.id || user?.companyId || ""}
        initialProfile={companyProfile}
        onProfileUpdated={handleProfileUpdated}
      />

      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
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
  icon: React.ReactNode;
  title: string;
  desc: string;
  onClick?: () => void;
}) {
  return (
    <Card
      className="border-2 border-slate-200 bg-[#EFF6FF] rounded-2xl cursor-pointer hover:border-blue-400 transition-all shadow-sm"
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
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  isDanger?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      className="flex items-center justify-between px-2 py-3 rounded-xl border-2 border-slate-100 cursor-pointer hover:border-blue-200 hover:bg-slate-50 transition-all bg-white"
      onClick={onClick}
    >
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
