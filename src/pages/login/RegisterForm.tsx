import { Mail, Lock, Eye, EyeOff, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../../services/auth.api";
import { notify } from "@/lib/toast";

type UserRole = "talent" | "recruiter";

export const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>("talent");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Role configuration
  const roleConfig = {
    talent: {
      label: "Ứng viên",
      roleValue: 1,
      emailLabel: "Email",
      emailPlaceholder: "example@gmail.com",
      buttonText: "Đăng ký ứng viên",
    },
    recruiter: {
      label: "Nhà tuyển dụng",
      roleValue: 2,
      emailLabel: "Email công ty",
      emailPlaceholder: "hr@company.com",
      buttonText: "Đăng ký tuyển dụng",
    },
  };

  const currentConfig = roleConfig[role];

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!email || !password || !confirmPassword) {
      setError("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu không khớp!");
      return;
    }

    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    setLoading(true);
    try {
      console.log(`📝 RegisterForm - Bắt đầu đăng ký ${currentConfig.label}`);
      const response = await authAPI.register({
        email,
        password,
        role: currentConfig.roleValue,
      });

      if (response.success) {
        console.log(`✅ RegisterForm - Đăng ký ${currentConfig.label} thành công`);
        notify.success("Đăng ký thành công! Vui lòng đăng nhập.");
        // Điều hướng về login page
        navigate("/login", { replace: true });
      } else {
        setError(response.message || "Đăng ký thất bại!");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Đăng ký thất bại!";
      console.error(`❌ RegisterForm - Error:`, errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      {/* Role Selector Sliding Button */}
      <div className="space-y-1.5">
        <Label>Đăng ký với tư cách là</Label>
        <div className="flex gap-1 bg-slate-200 p-1 rounded-lg w-full h-11">
          <button
            type="button"
            onClick={() => setRole("talent")}
            className={`flex-1 font-medium rounded transition-all duration-300 ${
              role === "talent"
                ? "bg-[#0288D1] text-white shadow-md"
                : "bg-transparent text-slate-700 hover:text-slate-900"
            }`}
          >
            Ứng viên
          </button>
          <button
            type="button"
            onClick={() => setRole("recruiter")}
            className={`flex-1 font-medium rounded transition-all duration-300 ${
              role === "recruiter"
                ? "bg-[#0288D1] text-white shadow-md"
                : "bg-transparent text-slate-700 hover:text-slate-900"
            }`}
          >
            Nhà tuyển dụng
          </button>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">{currentConfig.emailLabel}</Label>
        <div className="relative">
          {role === "talent" && (
            <Mail
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
          )}
          <Input
            id="email"
            type="email"
            placeholder={currentConfig.emailPlaceholder}
            className={`${role === "talent" ? "pl-10" : ""} h-11 border-none bg-slate-100 focus-visible:ring-1 focus-visible:ring-[#0288D1]`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">Mật khẩu</Label>
        <div className="relative">
          <Lock
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="pl-10 pr-10 h-11 border-none bg-slate-100 focus-visible:ring-1 focus-visible:ring-[#0288D1]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="confirm">Xác nhận</Label>
        <div className="relative">
          <RotateCcw
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <Input
            id="confirm"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="pl-10 h-11 border-none bg-slate-100 focus-visible:ring-1 focus-visible:ring-[#0288D1]"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {/* Hiển thị error */}
      {error && (
        <div className="text-red-500 text-sm font-medium bg-red-50 p-2 rounded border border-red-100">
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full h-11 font-bold cursor-pointer text-white bg-[#0288D1] hover:bg-[#0277bd] border-none shadow-none disabled:opacity-70"
      >
        {loading ? (
          <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
            {/* Container cho Spinner và Text */}
            <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-4">
              {/* Vòng tròn Loading Spinner */}
              <div className="relative">
                {/* Vòng tròn nhạt phía dưới */}
                <div className="w-12 h-12 border-4 border-blue-100 rounded-full"></div>
                {/* Vòng xoay chính */}
                <div className="absolute top-0 left-0 w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
          </div>
        ) : (
          currentConfig.buttonText
        )}
      </Button>
    </form>
  );
};
