import {
  Home,
  Users,
  MessageSquare,
  Bell,
  Library,
  Crown,
  Zap,
  Beaker,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/hook";
import { useUserProfile } from "@/hook/useUserProfile";
import { notify } from "@/lib/toast";

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

  // Xác định trang home/profile dựa trên role
  const homeHref = user?.role === 2 ? "/recruiter-home" : "/talent-home";
  const profileHref = user?.role === 2 ? "/recruiter-profile" : "/profile";

  // Xử lý click vào logo
  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      notify.warning("Vui lòng đăng nhập để vào trang chủ");
      navigate("/login");
      return;
    }
    
    // Nếu đã login, chuyển đến trang home
    navigate(homeHref);
  };

  // Danh sách các tab điều hướng trung tâm
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
      // Nếu đã login: Ẩn các tab có hideOnLogin, hiện các tab còn lại (alwaysShow hoặc requireAuth)
      if (item.hideOnLogin) return false;
      if (item.hideWithCompany && user?.role === 2) return false; // Ẩn tab nếu là doanh nghiệp
      return true;
    }
    // Nếu chưa login: Chỉ hiện các tab KHÔNG yêu cầu auth (Giới thiệu & Gói cước)
    return !item.requireAuth;
  });

  return (
    <header className="h-16 border-b border-slate-100 bg-white px-8 flex items-center justify-between sticky top-0 z-50">
      {/* 1. Logo Section */}
      <div className="flex items-center gap-2 min-w-[150px]">
        <button
          onClick={handleLogoClick}
          className="flex items-center gap-2 group hover:opacity-80 transition-opacity active:scale-95 cursor-pointer"
          title={isLoggedIn ? "Về trang chủ" : "Đăng nhập để tiếp tục"}
        >
          <img
            src="/product-logo.png"
            alt="SkillSnap"
            className="h-16 w-auto object-contain"
          />
        </button>
      </div>

      {/* 2. Navigation Tabs */}
      <nav className="flex items-center gap-2 bg-slate-50/80 p-1 rounded-2xl border border-slate-100">
        {visibleNavItems.map((item) => {
          const isActive =
            location.pathname === item.href ||
            (item.label === "Trang chủ" &&
              (location.pathname === "/talent-home" ||
                location.pathname === "/recruiter-home")) ||
            (item.label === "Thử thách" &&
              (location.pathname === "/challenge-management" ||
                location.pathname.startsWith("/challenge-management/") ||
                location.pathname === "/talent-challenge" ||
                location.pathname.startsWith("/talent-challenge/")));

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

      {/* 3. User Section (Conditional Rendering) */}
      <div className="flex items-center justify-end min-w-[150px]">
        {isLoggedIn ? (
          /* TRƯỜNG HỢP: ĐÃ ĐĂNG NHẬP */
          <Link
            to={profileHref}
            className="flex items-center gap-3 group p-1 pr-3 rounded-full hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
          >
            <div className="text-right hidden md:block">
              <p className="text-[16px] font-black text-slate-800 leading-none">
                {profile?.displayName}
              </p>
            </div>

            {/* Bọc Avatar vào một div relative inline-block để định vị tick xanh */}
            <div className="relative inline-block group">
              {/* 1. HIỂN THỊ HUY HIỆU GÓI CƯỚC (ĐỘI NGHIÊNG GÓC 45 ĐỘ) */}
              {isLoggedIn && profile?.planName && (
                <div
                  className={cn(
                    "absolute z-10 transition-all duration-300",
                    // Tọa độ: Đẩy lên trên (-top-3) và lệch sang phải (-right-1)
                    "-top-1.5 -right-2",
                    // Xoay nhẹ icon để tạo cảm giác đội vương miện nghiêng
                    "rotate-[35deg] group-hover:rotate-[25deg] group-hover:scale-110",
                  )}
                >
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

              {/* 2. AVATAR CHÍNH */}
              <Avatar
                className={cn(
                  "h-10 w-10 border-2 shadow-sm transition-all duration-300 rounded-full overflow-hidden bg-white",
                  profile?.planName === "Premium"
                    ? "border-yellow-400 ring-2 ring-yellow-400/10"
                    : profile?.planName === "Pro"
                      ? "border-blue-500 ring-2 ring-blue-500/10"
                      : "border-white",
                )}
              >
                <AvatarImage
                  src={profile?.avatar || "/user_placeholder.png"}
                  alt={profile?.displayName || "User"}
                  className="object-cover w-full h-full"
                />
                <AvatarFallback className="bg-slate-100 text-slate-500 font-bold text-xs uppercase">
                  {profile?.displayName?.slice(0, 2) || "US"}
                </AvatarFallback>
              </Avatar>

              {/* 3. TICK XANH CHO DOANH NGHIỆP (VẪN GIỮ Ở GÓC DƯỚI) */}
              {user?.role === 2 && (
                <div className="absolute -bottom-0.5 -right-0.5 transform z-20">
                  <img
                    src="/blue-tick-company.png"
                    alt="Verified"
                    className="w-4 h-4 bg-white rounded-full border border-white shadow-sm"
                  />
                </div>
              )}
            </div>
          </Link>
        ) : (
          /* TRƯỜNG HỢP: CHƯA ĐĂNG NHẬP */
          <button
            onClick={() => navigate("/login")}
            className="group flex items-center gap-3 px-4 py-2 bg-slate-50 hover:bg-blue-50 rounded-xl border border-slate-200 hover:border-blue-100 transition-all active:scale-95 cursor-pointer"
          >
            <span className="text-[13px] font-black text-slate-600 group-hover:text-blue-600 uppercase tracking-wider">
              Đăng nhập
            </span>
            <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-white shadow-sm group-hover:rotate-12 transition-transform">
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
  );
}
