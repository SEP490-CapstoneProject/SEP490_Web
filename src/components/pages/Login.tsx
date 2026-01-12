import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Mail, Lock, Eye, EyeOff, Globe, User, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import LoginPlaceholder from "@/assets/login-page-image-placeholder.png";
export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Header */}
      <header className="w-full px-6 py-2 flex justify-between items-center bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <img src="/product-logo.png" alt="Logo image" className="w-1/5 h-1/5" />
        </div>
        <Button variant="outline" className="rounded-full gap-2">
          <Globe size={18} />
          <span>VI</span>
        </Button>
      </header>

      {/* Main Content */}
      <main className="grow flex items-center justify-center p-2">
        <Card className="w-full max-w-4xl overflow-hidden flex flex-col lg:flex-row min-h-150 border-slate-100 dark:border-slate-800 shadow-2xl">
          {/* Ảnh bên trái */}
          <div className="w-full lg:w-7/12 bg-[#F0DBBA] dark:bg-yellow-900/10 relative flex items-center justify-center order-2 lg:order-1 overflow-hidden">
            <div className="absolute inset-0 opacity-10 pattern-grid-lg text-slate-500"></div>

            <img
              src={LoginPlaceholder}
              alt="Illustration"
              className="z-10 w-full h-1/2 object-cover object-center  transition-all duration-500 mb-8"
            />
          </div>

          {/* login regis */}
          <div className="w-full lg:w-7/12 p-8 lg:p-12 flex flex-col order-1 lg:order-2 bg-white dark:bg-slate-900 justify-center">
            <div className="w-full max-w-sm mx-auto">
              {/* 2 tab*/}
              <div className="flex w-full mb-8 border-b border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setMode("login")}
                  className={cn(
                    "flex-1 pb-3 text-center transition-all duration-200 font-medium",
                    mode === "login"
                      ? "text-blue-500 border-b-2 border-primary font-semibold"
                      : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => setMode("register")}
                  className={cn(
                    "flex-1 pb-3 text-center transition-all duration-200 font-medium",
                    mode === "register"
                      ? "text-blue-500 border-b-2 border-primary font-semibold"
                      : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  Đăng ký
                </button>
              </div>

              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                {mode === "login" ? "Đăng nhập tại đây" : "Tạo tài khoản mới"}
              </h1>

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                {mode === "register" && (
                  <div className="space-y-1">
                    <Label htmlFor="username">Tên hiển thị</Label>
                    <div className="relative">
                      <User
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        size={18}
                      />
                      <Input
                        id="username"
                        placeholder="Nhập tên bạn muốn hiển thị"
                        className="pl-10 h-11 border-slate-200 focus:border-primary focus:ring-primary"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Nhập địa chỉ email"
                      className="pl-10 h-11 border-slate-200 focus:border-primary focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={
                        mode === "login" ? "Nhập mật khẩu" : "Nhập mật khẩu mới"
                      }
                      className="pl-10 pr-10 h-11 border-slate-200 focus:border-primary focus:ring-primary"
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

                {mode === "register" && (
                  <div className="space-y-1">
                    <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                    <div className="relative">
                      <RotateCcw
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        size={18}
                      />
                      <Input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Nhập lại mật khẩu của bạn"
                        className="pl-10 h-11 border-slate-200 focus:border-primary focus:ring-primary"
                      />
                    </div>
                  </div>
                )}

                {mode === "login" && (
                  <div className="flex justify-end">
                    <a href="#" className="text-sm font-medium text-blue-500 ">
                      Quên mật khẩu?
                    </a>
                  </div>
                )}

                <Button className="w-full h-11 font-bold text-white bg-[#0288D1] hover:bg-blue-700 transition-all mt-2 active:scale-[0.98]">
                  {mode === "login" ? "Đăng nhập" : "Đăng ký"}
                </Button>
              </form>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
