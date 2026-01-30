import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Giả lập xác thực (có thể thay bằng API call sau)
    setTimeout(() => {
      if (email === "user@gmail.com" && password === "user123") {
        // Đăng nhập thành công
        setLoading(false);
        navigate("/talent-home");
      } else {
        // Đăng nhập thất bại
        setError("Email hoặc mật khẩu không chính xác");
        setLoading(false);
      }
    }, 500);
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4 animate-in fade-in duration-500">
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input 
            id="email" 
            type="email" 
            placeholder="example@gmail.com" 
            className="pl-10 h-11" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">Mật khẩu</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input 
            id="password" 
            type={showPassword ? "text" : "password"} 
            placeholder="••••••••" 
            className="pl-10 pr-10 h-11" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {error && <div className="text-red-500 text-sm font-medium">{error}</div>}

      <div className="flex justify-end">
        <a href="#" className="text-sm font-medium text-[#0288D1] hover:underline">Quên mật khẩu?</a>
      </div>

      <Button 
        type="submit"
        disabled={loading}
        className="w-full h-11 font-bold text-white bg-[#0288D1] hover:bg-[#0277bd] cursor-pointer disabled:opacity-50"
      >
        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
      </Button>
    </form>
  );
};