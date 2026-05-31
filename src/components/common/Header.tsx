import {
  Home,
  Users,
  MessageSquare,
  Bell,
  Library,
  Crown,
  Zap,
  Beaker,
  Menu, // Thêm icon Menu cho Mobile
  X,    // Thêm icon Đóng cho Mobile Menu
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/hook";
import { useUserProfile } from "@/hook/useUserProfile";
import { notify } from "@/lib/toast";
import { useState, useEffect } from "react"; // Thêm useState và useEffect

type NavItem = {
  icon: LucideIcon;
  label: string;
  href: string;
  requireAuth?: boolean;
  hideOnLogin?: boolean;
  hideWithCompany?: boolean;
  hideForTalent?: boolean;
};

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { profile, isLoggedIn } = useUserProfile();
  
  // State quản lý trạng thái đóng/mở menu trên mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Đóng mobile menu khi chuyển trang
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const homeHref = user?.role === 2 ? "/recruiter-home" : "/talent-home";
  const profileHref = user?.role === 2 ? "/recruiter-profile" : "/profile";

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      notify.warning("Vui lòng đăng nhập để vào trang chủ");
      navigate("/login");
      return;
    }
    navigate(homeHref);
  };

  const allNavItems: NavItem[] = [
    { icon: Library, label: "Giới thiệu", href: "/", hideOnLogin: true },
    { icon: Home, label: "Trang chủ", href: homeHref, requireAuth: true },
    {
      icon: Crown,
      label: "Gói dịch vụ",
      href: "/subscription",
      requireAuth: true,
      hideWithCompany: true,
    },
    { icon: Users, label: "Cộng đồng", href: "/community", requireAuth: true },
    {
      icon: MessageSquare,
      label: "Tin nhắn",
      href: "/chat",
      requireAuth: true,
    },
    {
      icon: Beaker,
      label: "Thử thách",
      href: user?.role === 2 ? "/challenge-management" : "/talent-challenge",
      requireAuth: true,
    },
    {
      icon: Bell,
      label: "Thông báo",
      href: "/notification",
      requireAuth: true,
    },
  ];

  const visibleNavItems = allNavItems.filter((item) => {
    if (isLoggedIn) {
      if (item.hideOnLogin) return false;
      if (item.hideWithCompany && user?.role === 2) return false;
      return true;
    }
    return !item.requireAuth;
  });

  // Hàm helper kiểm tra Tab Active (Tái sử dụng cho cả Desktop và Mobile)
  const checkIsActive = (item: NavItem) => {
    return (
      location.pathname === item.href ||
      (item.label === "Trang chủ" &&
        (location.pathname === "/talent-home" ||
          location.pathname === "/recruiter-home")) ||
      (item.label === "Thử thách" &&
        (location.pathname === "/challenge-management" ||
          location.pathname.startsWith("/challenge-management/") ||
          location.pathname === "/talent-challenge" ||
          location.pathname.startsWith("/talent-challenge/")))
    );
  };

  return (
    <>
      {/* --- DESKTOP & MOBILE FIXED HEADER --- */}
      <header className="h-16 border-b border-slate-100 bg-white px-4 md:px-8 flex items-center justify-between sticky top-0 z-50">
        
        {/* 1. Nút Hamburger Menu (Chỉ hiện trên Mobile < lg) */}
        <div className="flex items-center lg:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* 2. Logo Section */}
        <div className="flex items-center gap-2 min-w-[120px] md:min-w-[150px]">
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-2 group hover:opacity-80 transition-opacity active:scale-95 cursor-pointer"
            title={isLoggedIn ? "Về trang chủ" : "Đăng nhập để tiếp tục"}
          >
            <img
              src="/product-logo.png"
              alt="SkillSnap"
              className="h-12 md:h-16 w-auto object-contain"
            />
          </button>
        </div>

        {/* 3. Navigation Tabs (Ẩn trên Mobile, hiện trên Desktop >= lg) */}
        <nav className="hidden lg:flex items-center gap-2 bg-slate-50/80 p-1 rounded-2xl border border-slate-100">
          {visibleNavItems.map((item) => {
            const isActive = checkIsActive(item);
            return (
              <Link
                key={item.label}
                to={item.href}
                className={cn(
                  "flex items-center gap-2.5 px-5 py-2 rounded-xl transition-all duration-200 group",
                  isActive
                    ? "bg-white text-blue-600 shadow-sm font-bold"
                    : "text-slate-500 hover:text-slate-900",
                )}
              >
                <item.icon
                  size={18}
                  className={cn(
                    isActive
                      ? "text-blue-600"
                      : "text-slate-400 group-hover:text-blue-500",
                  )}
                />
                <span className="text-[16px] tracking-tight group-hover:text-blue-500">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* 4. User Section (Hiển thị trên cả hai nhưng tối ưu không gian hiển thị text) */}
        <div className="flex items-center justify-end min-w-[120px] md:min-w-[150px]">
          {isLoggedIn ? (
            <Link
              to={profileHref}
              className="flex items-center gap-2 md:gap-3 group p-1 md:pr-3 rounded-full hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
            >
              {/* Tên User: Ẩn trên mobile nhỏ, hiện từ mức md trở lên */}
              <div className="text-right hidden md:block">
                <p className="text-[16px] font-black text-slate-800 leading-none">
                  {profile?.displayName}
                </p>
              </div>

              <div className="relative inline-block group">
                {/* Vương miện Gói cước */}
                {profile?.planName && (
                  <div className="absolute z-10 transition-all duration-300 -top-1.5 -right-2 rotate-[35deg] group-hover:rotate-[25deg] group-hover:scale-110">
                    {profile.planName === "Premium" ? (
                      <div className="bg-yellow-400 text-white p-0.5 rounded-md shadow-[0_4px_12px_rgba(234,179,8,0.5)] border-[1.5px] border-white">
                        <Crown size={14} fill="currentColor" strokeWidth={2.5} />
                      </div>
                    ) : profile.planName === "Pro" ? (
                      <div className="bg-blue-600 text-white p-0.5 rounded-md shadow-[0_4px_12px_rgba(37,99,235,0.5)] border-[1.5px] border-white">
                        <Zap size={14} fill="currentColor" strokeWidth={2.5} />
                      </div>
                    ) : null}
                  </div>
                )}

                {/* Avatar */}
                <Avatar className={cn(
                  "h-9 w-9 md:h-10 md:w-10 border-2 shadow-sm transition-all duration-300 rounded-full overflow-hidden bg-white",
                  profile?.planName === "Premium"
                    ? "border-yellow-400 ring-2 ring-yellow-400/10"
                    : profile?.planName === "Pro"
                      ? "border-blue-500 ring-2 ring-blue-500/10"
                      : "border-white"
                )}>
                  <AvatarImage
                    src={profile?.avatar || "/user_placeholder.png"}
                    alt={profile?.displayName || "User"}
                    className="object-cover w-full h-full"
                  />
                  <AvatarFallback className="bg-slate-100 text-slate-500 font-bold text-xs uppercase">
                    {profile?.displayName?.slice(0, 2) || "US"}
                  </AvatarFallback>
                </Avatar>

                {/* Tick xanh doanh nghiệp */}
                {user?.role === 2 && (
                  <div className="absolute -bottom-0.5 -right-0.5 transform z-20">
                    <img
                      src="/blue-tick-company.png"
                      alt="Verified"
                      className="w-3.5 h-3.5 md:w-4 md:h-4 bg-white rounded-full border border-white shadow-sm"
                    />
                  </div>
                )}
              </div>
            </Link>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="group flex items-center gap-2 md:gap-3 px-3 md:px-4 py-1.5 md:py-2 bg-slate-50 hover:bg-blue-50 rounded-xl border border-slate-200 hover:border-blue-100 transition-all active:scale-95 cursor-pointer"
            >
              <span className="text-[11px] md:text-[13px] font-black text-slate-600 group-hover:text-blue-600 uppercase tracking-wider">
                Đăng nhập
              </span>
              <div className="h-7 w-7 md:h-8 md:w-8 rounded-full overflow-hidden border-2 border-white shadow-sm group-hover:rotate-12 transition-transform">
                <img
                  src="/user_placeholder.png"
                  alt="Guest"
                  className="h-full w-full object-cover opacity-80"
                />
              </div>
            </button>
          )}
        </div>
      </header>

      {/* --- MOBILE SIDEBAR MENU (DRAWER) --- */}
      {/* 1. Backdrop làm mờ nền */}
      <div
        className={cn(
          "fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity duration-300 lg:hidden",
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* 2. Khung chứa nội dung Menu trượt từ trái qua */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 w-[280px] max-w-[calc(100vw-40px)] bg-white z-50 p-6 shadow-2xl flex flex-col justify-between transition-transform duration-300 cubic-bezier(0.4,0,0.2,1) lg:hidden",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col gap-6">
          {/* Header của Sidebar: Logo và Nút Đóng */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <img src="/product-logo.png" alt="SkillSnap" className="h-10 w-auto object-contain" />
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* List các nút chuyển hướng trên Mobile dạng Dọc */}
          <nav className="flex flex-col gap-1.5">
            {visibleNavItems.map((item) => {
              const isActive = checkIsActive(item);
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 font-medium",
                    isActive
                      ? "bg-blue-50 text-blue-600 font-bold"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <item.icon
                    size={20}
                    className={isActive ? "text-blue-600" : "text-slate-400"}
                  />
                  <span className="text-[15px]">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Phần chân Sidebar hiển thị thông tin User nếu đã Login */}
        {isLoggedIn && profile && (
          <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-slate-200">
              <AvatarImage src={profile?.avatar || "/user_placeholder.png"} />
              <AvatarFallback>{profile?.displayName?.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
              <p className="text-[14px] font-bold text-slate-800 truncate">
                {profile?.displayName}
              </p>
              <p className="text-[12px] text-slate-500 truncate">
                {profile?.planName ? `Gói: ${profile.planName}` : "Thành viên"}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}