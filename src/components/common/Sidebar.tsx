import { FolderOpen, RefreshCw, Globe, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState } from "react";

const menuItems = [
  { icon: FolderOpen, label: "Portfolio", href: "/dashboard/portfolio" }, 
  { icon: RefreshCw, label: "Bài đăng tuyển dụng", href: "/dashboard/jobPost" },
  { icon: Globe, label: "Bài đăng cộng đồng", href: "/dashboard/community" },
  { icon: User, label: "Người dùng hệ thống", href: "/dashboard/user" },
];

export function Sidebar() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <aside
      className={cn(
        "relative shrink-0 bg-white border-r border-slate-100 h-screen flex flex-col transition-all duration-300",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {" "}
      {/* Logo Section */}
      <div className="p-2">
        <div className="flex flex-col items-center">
          <img
            src="/product-logo.png"
            alt="SkillSnap"
            className="h-16 w-auto object-contain"
          />
        </div>
      </div>
      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-2 space-y-2">
        {menuItems.map((item) => {
          // Kiểm tra xem path hiện tại có khớp với href không
          const isActive = location.pathname === item.href;

          return (
            <Link
              key={item.label}
              to={item.href}
              className={cn(
                "flex items-center gap-4 px-3 py-3 rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-blue-50 text-blue-600 shadow-sm" // Style khi được chọn
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              )}
            >
              <item.icon
                size={22}
                className={cn(
                  isActive
                    ? "text-blue-600"
                    : "text-slate-400 group-hover:text-slate-600"
                )}
              />
              {!isCollapsed && (
                <span className="font-medium text-[15px]">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
