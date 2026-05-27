import { useState, useEffect } from "react";
import { Mail, Lock, Eye, EyeOff, KeyRound, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { authAPI } from "../../services/auth.api";
import { notify } from "@/lib/toast";

interface ForgotPasswordFlowProps {
  onBackToLogin: () => void;
}

type StepType = 1 | 2 | 3 | "success";

export const ForgotPasswordFlow = ({ onBackToLogin }: ForgotPasswordFlowProps) => {
  const [step, setStep] = useState<StepType>(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // States lưu trữ data luồng nhập dữ liệu
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Bộ đếm ngược cho nút gửi lại mã OTP (60 giây)
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Xử lý Bước 1: Gửi yêu cầu lấy OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setErrorMsg("");

    try {
      const response = await authAPI.forgotPassword({ email });
      if (response.success) {
        notify.success(response.message || "Mã OTP đã được gửi!");
        setStep(2);
        setCountdown(60); // Bắt đầu đếm ngược 60s
      } else {
        setErrorMsg(response.message || "Gửi OTP thất bại.");
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Đã xảy ra lỗi hệ thống.");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý gửi lại OTP (Resend)
  const handleResendOtp = async () => {
    if (countdown > 0 || !email) return;
    setLoading(true);
    try {
      const response = await authAPI.forgotPassword({ email });
      notify.success(response.message || "Đã gửi lại mã OTP mới!");
      setCountdown(60);
    } catch (err) {
      notify.error(err instanceof Error ? err.message : "Không thể gửi lại mã.");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý Bước 2: Xác thực Token OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || token.length < 6) {
      setErrorMsg("Vui lòng nhập đầy đủ mã OTP 6 chữ số.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const response = await authAPI.verifyResetToken({ email, token });
      if (response.success) {
        notify.success("Xác thực thành công!");
        setStep(3);
      } else {
        setErrorMsg(response.message || "Mã OTP không hợp lệ.");
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Xác thực thất bại.");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý Bước 3: Đặt lại Mật khẩu mới
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMsg("Mật khẩu xác nhận không khớp!");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const response = await authAPI.resetPassword({ email, token, newPassword });
      if (response.success) {
        notify.success("Đặt lại mật khẩu thành công!");
        setStep("success");
      } else {
        setErrorMsg(response.message || "Đặt lại mật khẩu thất bại.");
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Đổi mật khẩu thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Nút quay lại (Ẩn đi nếu đã thành công hoàn toàn) */}
      {step !== "success" && (
        <button
          onClick={step === 1 ? onBackToLogin : () => setStep((prev) => (prev as number) - 1 as StepType)}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          {step === 1 ? "Quay lại đăng nhập" : "Quay lại bước trước"}
        </button>
      )}

      {/* HIỂN THỊ ERROR CHUNG NẾU CÓ */}
      {errorMsg && (
        <div className="text-red-500 text-sm font-medium bg-red-50 p-2 rounded border border-red-100">
          {errorMsg}
        </div>
      )}

      {/* --- BƯỚC 1: NHẬP EMAIL --- */}
      {step === 1 && (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900">Quên mật khẩu?</h2>
            <p className="text-sm text-slate-500">
              Nhập email của bạn để hệ thống gửi mã xác thực OTP gồm 6 chữ số.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="forgot-email">Email tài khoản</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input
                id="forgot-email"
                type="email"
                placeholder="example@gmail.com"
                className="pl-10 h-11"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 font-bold text-white bg-[#0288D1] hover:bg-[#0277bd]"
          >
            Gửi mã xác thực
          </Button>
        </form>
      )}

      {/* --- BƯỚC 2: XÁC THỰC MÃ OTP --- */}
      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900">Xác thực mã OTP</h2>
            <p className="text-sm text-slate-500">
              Mã xác thực đã được gửi tới email <span className="font-medium text-slate-800">{email}</span>.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="otp-token">Mã xác thực OTP (6 số)</Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input
                id="otp-token"
                type="text"
                maxLength={6}
                placeholder="Nhập 6 số..."
                className="pl-10 h-11 text-center font-mono text-lg tracking-[0.25em]"
                value={token}
                onChange={(e) => setToken(e.target.value.replace(/\D/g, ""))} // Chỉ cho nhập số
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500">Chưa nhận được mã?</span>
            <button
              type="button"
              disabled={countdown > 0 || loading}
              onClick={handleResendOtp}
              className="font-medium text-[#0288D1] hover:underline disabled:text-slate-400 disabled:no-underline cursor-pointer"
            >
              {countdown > 0 ? `Gửi lại mã sau (${countdown}s)` : "Gửi lại mã ngay"}
            </button>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 font-bold text-white bg-[#0288D1] hover:bg-[#0277bd]"
          >
            Xác nhận mã
          </Button>
        </form>
      )}

      {/* --- BƯỚC 3: ĐẶT LẠI MẬT KHẨU MỚI --- */}
      {step === 3 && (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900">Thiết lập mật khẩu mới</h2>
            <p className="text-sm text-slate-500">Hãy điền mật khẩu mới có tính bảo mật cao.</p>
          </div>

          {/* Mật khẩu mới */}
          <div className="space-y-1.5">
            <Label htmlFor="new-password">Mật khẩu mới</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input
                id="new-password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-10 pr-10 h-11"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={loading}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Xác nhận mật khẩu */}
          <div className="space-y-1.5">
            <Label htmlFor="confirm-password">Xác nhận mật khẩu</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input
                id="confirm-password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-10 h-11"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 font-bold text-white bg-[#0288D1] hover:bg-[#0277bd]"
          >
            Đổi mật khẩu
          </Button>
        </form>
      )}

      {/* --- MÀN HÌNH HOÀN THÀNH THÀNH CÔNG --- */}
      {step === "success" && (
        <div className="text-center py-4 space-y-4">
          <div className="flex justify-center text-green-500">
            <CheckCircle2 size={56} className="animate-bounce" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900">Thành công!</h2>
            <p className="text-sm text-slate-500">
              Mật khẩu của bạn đã được cập nhật lại thành công. Bây giờ bạn có thể đăng nhập bằng mật khẩu mới.
            </p>
          </div>
          <Button
            type="button"
            onClick={onBackToLogin}
            className="w-full h-11 font-bold text-white bg-green-600 hover:bg-green-700"
          >
            Quay lại Đăng nhập ngay
          </Button>
        </div>
      )}

      {/* LOADING OVERLAY TOÀN MÀN HÌNH CHUNG (Tận dụng giao diện loading bạn đang có) */}
      {loading && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-blue-100 rounded-full"></div>
              <div className="absolute top-0 left-0 w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};