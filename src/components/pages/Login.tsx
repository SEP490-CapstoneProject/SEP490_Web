import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Mail, Lock, Eye, EyeOff, Globe, User, RotateCcw, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import LoginPlaceholder from "@/assets/login-page-image-placeholder.png";

// Định nghĩa các loại chế độ
type AuthMode = "login" | "register" | "recruiter";

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Header */}
      <header className="w-full px-6 py-2 flex justify-between items-center bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <img src="/product-logo.png" alt="SkillSnap Logo" className="h-10 w-auto" />
        </div>
        <Button variant="outline" className="rounded-full gap-2 border-slate-200">
          <Globe size={18} />
          <span>VI</span>
        </Button>
      </header>

      {/* Main Content */}
      <main className="grow flex items-center justify-center p-1">
        <Card className="w-full max-w-5xl overflow-hidden flex flex-col lg:flex-row min-h-162.5 border-slate-100 dark:border-slate-800 shadow-2xl">
          
          {/* Ảnh bên trái */}
          <div className="hidden lg:flex lg:w-1/2 bg-[#F0DBBA] dark:bg-yellow-900/10 relative items-center justify-center overflow-hidden">
            <div className="absolute inset-0 opacity-10 pattern-grid-lg text-slate-500"></div>
            <img
              src={LoginPlaceholder}
              alt="Illustration"
              className="z-10 w-4/5 h-auto object-contain transition-all duration-500 animate-in fade-in zoom-in duration-700"
            />
          </div>

          {/* Form Area */}
          <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col bg-white dark:bg-slate-900 justify-center">
            <div className="w-full max-w-sm mx-auto">
              
              {/* Tabs */}
              <div className="flex w-full mb-8 border-b border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setMode("login")}
                  className={cn(
                    "flex-1 pb-3 text-center transition-all duration-200 font-medium text-sm",
                    mode === "login"
                      ? "text-[#0288D1] border-b-2 border-[#0288D1] font-bold"
                      : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => setMode("register")}
                  className={cn(
                    "flex-1 pb-3 text-center transition-all duration-200 font-medium text-sm",
                    mode !== "login"
                      ? "text-[#0288D1] border-b-2 border-[#0288D1] font-bold"
                      : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  Đăng ký
                </button>
              </div>

              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                {mode === "login" && "Chào mừng trở lại!"}
                {mode === "register" && "Tạo tài khoản mới"}
                {mode === "recruiter" && "Đăng ký Nhà tuyển dụng"}
              </h1>
              <p className="text-slate-500 text-sm mb-4">
                {mode === "login" ? "Vui lòng đăng nhập để tiếp tục." : "Điền thông tin của bạn vào bên dưới."}
              </p>

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                
                {/* Field: Tên hiển thị (Chỉ hiện khi Đăng ký thường hoặc Nhà tuyển dụng) */}
                {mode !== "login" && (
                  <div className="space-y-1.5">
                    <Label htmlFor="username">Tên {mode === "recruiter" ? "công ty" : "hiển thị"}</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <Input
                        id="username"
                        placeholder={mode === "recruiter" ? "Nhập tên công ty" : "Nhập tên bạn muốn hiển thị"}
                        className="pl-10 h-11 border-slate-200 focus:ring-[#0288D1]"
                      />
                    </div>
                  </div>
                )}

                {/* Field: Mã số thuế (Chỉ hiện khi là Nhà tuyển dụng) */}
                {mode === "recruiter" && (
                  <div className="space-y-1.5 animate-in slide-in-from-left-2 duration-300">
                    <Label htmlFor="taxCode">Mã số thuế</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <Input
                        id="taxCode"
                        placeholder="Nhập mã số thuế doanh nghiệp"
                        className="pl-10 h-11 border-slate-200 focus:ring-[#0288D1]"
                      />
                    </div>
                  </div>
                )}

                {/* Field: Email */}
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@gmail.com"
                      className="pl-10 h-11 border-slate-200 focus:ring-[#0288D1]"
                    />
                  </div>
                </div>

                {/* Field: Mật khẩu */}
                <div className="space-y-1.5">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10 h-11 border-slate-200 focus:ring-[#0288D1]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Field: Xác nhận mật khẩu (Chỉ hiện khi đăng ký) */}
                {mode !== "login" && (
                  <div className="space-y-1.5 animate-in fade-in duration-300">
                    <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                    <div className="relative">
                      <RotateCcw className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <Input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Nhập lại mật khẩu"
                        className="pl-10 h-11 border-slate-200 focus:ring-[#0288D1]"
                      />
                    </div>
                  </div>
                )}

                {/* Quên mật khẩu & Link nhà tuyển dụng */}
                <div className="flex justify-end">
                  {mode === "login" ? (
                    <a href="#" className="text-sm font-medium text-[#0288D1] hover:underline">
                      Quên mật khẩu?
                    </a>
                  ) : (
                    <button 
                      type="button"
                      onClick={() => setMode(mode === "recruiter" ? "register" : "recruiter")}
                      className="text-sm font-medium text-[#0288D1] hover:underline"
                    >
                      {mode === "recruiter" ? "Đăng ký ứng viên?" : "Đăng ký cho Nhà tuyển dụng?"}
                    </button>
                  )}
                </div>

                <Button className="w-full h-11 font-bold text-white bg-[#0288D1] hover:bg-[#0277bd] transition-all mt-2 active:scale-[0.98] shadow-lg shadow-blue-500/20">
                  {mode === "login" ? "Đăng nhập" : "Đăng ký ngay"}
                </Button>
              </form>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}