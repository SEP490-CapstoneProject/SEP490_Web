import { AuthCommonResponse, ForgotPasswordRequest, LoginRequest, LoginResponse, RegisterRequest, ResetPasswordRequest, VerifyResetTokenRequest } from "@/types/auth";
import { API_BASE_URLS, API_ENDPOINTS, buildApiUrl } from "@/config/apiConfig";

// API_BASE_URL được cấu hình từ config tập trung

export const authAPI = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      console.log("🔐 Bắt đầu login request với email:", credentials.email);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.warn("⏱️ Login request timeout sau 30 giây");
        controller.abort();
      }, 60000); // 30 giây timeout

      const response = await fetch(buildApiUrl(API_BASE_URLS.gateway, API_ENDPOINTS.auth.login), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      
      console.log("📡 Response status:", response.status);
      
      // Kiểm tra nếu response có content trước khi parse JSON
      const contentType = response.headers.get("content-type");
      let data: LoginResponse;
      
      if (contentType?.includes("application/json")) {
        try {
          data = await response.json();
          console.log("📦 Response data:", { success: data.success, message: data.message, errors: data.errors });
        } catch (parseError) {
          console.error("❌ JSON parse error:", parseError);
          throw new Error("Invalid response format from server (JSON parse failed)");
        }
      } else {
        console.error("❌ Invalid response content type:", contentType);
        throw new Error("Server returned non-JSON response");
      }

      if (!response.ok) {
        const errorMsg = data.errors?.[0] || data.message || "Login failed. Please try again.";
        console.error("❌ Login error:", errorMsg);
        throw new Error(errorMsg);
      }

      // Kiểm tra response format hợp lệ
      if (!data || typeof data.success === 'undefined') {
        console.error("❌ Invalid response format:", data);
        throw new Error("Invalid response format from server");
      }

      if (!data.success) {
        const errorMsg = data.message || "Login failed";
        console.warn("⚠️ Login failed (success=false):", errorMsg);
        throw new Error(errorMsg);
      }

      console.log("✅ Login successful");
      return data;
    } catch (error) {
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        console.error("❌ CORS Error hoặc Network Error:", error);
        throw new Error("Không thể kết nối tới server. Vui lòng kiểm tra internet hoặc thử lại sau.");
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Network error. Vui lòng kiểm tra kết nối internet.");
    }
  },

  register: async (credentials: RegisterRequest): Promise<LoginResponse> => {
    try {
      const roleType = credentials.role === 2 ? "recruiter" : "talent";
      console.log("📝 Bắt đầu register request cho", roleType, "với email:", credentials.email);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.warn("⏱️ Register request timeout sau 30 giây");
        controller.abort();
      }, 30000);

      const response = await fetch(buildApiUrl(API_BASE_URLS.gateway, API_ENDPOINTS.auth.register), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      
      console.log("📡 Response status:", response.status);
      
      // Kiểm tra nếu response có content trước khi parse JSON
      const contentType = response.headers.get("content-type");
      let data: LoginResponse;
      
      if (contentType?.includes("application/json")) {
        try {
          data = await response.json();
          console.log("📦 Response data:", { success: data.success, message: data.message, errors: data.errors });
        } catch (parseError) {
          console.error("❌ JSON parse error:", parseError);
          throw new Error("Invalid response format from server (JSON parse failed)");
        }
      } else {
        console.error("❌ Invalid response content type:", contentType);
        throw new Error("Server returned non-JSON response");
      }

      if (!response.ok) {
        const errorMsg = data.errors?.[0] || data.message || "Register failed. Please try again.";
        console.error("❌ Register error:", errorMsg);
        throw new Error(errorMsg);
      }

      if (!data || typeof data.success === 'undefined') {
        console.error("❌ Invalid response format:", data);
        throw new Error("Invalid response format from server");
      }

      if (!data.success) {
        const errorMsg = data.message || "Register failed";
        console.warn("⚠️ Register failed (success=false):", errorMsg);
        throw new Error(errorMsg);
      }

      console.log("✅ Register successful");
      return data;
    } catch (error) {
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        console.error("❌ CORS Error hoặc Network Error:", error);
        throw new Error("Không thể kết nối tới server. Vui lòng kiểm tra internet hoặc thử lại sau.");
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Network error. Vui lòng kiểm tra kết nối internet.");
    }
  },

  changePassword: async (
    oldPassword: string,
    newPassword: string,
    accessToken: string,
  ): Promise<{ success: boolean; message: string }> => {
    try {
      console.log("🔐 [changePassword] Starting password change...");

      if (!accessToken) {
        console.error("❌ No access token provided!");
        throw new Error("Access token is missing. Please login again.");
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.warn("⏱️ Change password request timeout after 30 seconds");
        controller.abort();
      }, 30000);

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      };

      const fullUrl = buildApiUrl(API_BASE_URLS.gateway, "/Auth/change-password");
      console.log("📡 Making request to:", fullUrl);

      const response = await fetch(fullUrl, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log("📡 Change password response status:", response.status);

      const contentType = response.headers.get("content-type");
      let data: { success?: boolean; message?: string; errors?: string[] };

      if (contentType?.includes("application/json")) {
        try {
          data = await response.json();
          console.log("📦 Response data:", { success: data.success, message: data.message });
        } catch (parseError) {
          console.error("❌ JSON parse error:", parseError);
          throw new Error("Invalid response format from server");
        }
      } else {
        throw new Error("Server returned non-JSON response");
      }

      // Handle 401 Unauthorized
      if (response.status === 401) {
        console.error("❌ 401 Unauthorized - Token may be invalid or expired");
        throw new Error("Your session has expired. Please login again.");
      }

      if (!response.ok) {
        const errorMsg = data.errors?.[0] || data.message || `Server error: ${response.status}`;
        console.error("❌ Change password error:", errorMsg);
        throw new Error(errorMsg);
      }

      if (!data.success) {
        const errorMsg = data.message || "Failed to change password";
        console.warn("⚠️ Change password failed:", errorMsg);
        throw new Error(errorMsg);
      }

      console.log("✅ Password changed successfully:", data.message);
      return {
        success: true,
        message: data.message || "Password changed successfully",
      };
    } catch (error) {
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        console.error("❌ [changePassword] CORS Error or Network Error:", error);
        throw new Error("Cannot connect to server. Please check your internet connection.");
      }
      if (error instanceof Error) {
        console.error("❌ [changePassword] Error:", error.message);
        throw error;
      }
      throw new Error("Network error. Please check your connection");
    }
  },
  // 1. API: Yêu cầu gửi mã OTP quên mật khẩu
  forgotPassword: async (payload: ForgotPasswordRequest): Promise<AuthCommonResponse> => {
    try {
      console.log("🔒 [forgotPassword] Bắt đầu yêu cầu reset cho email:", payload.email);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.warn("⏱️ Forgot password request timeout sau 30 giây");
        controller.abort();
      }, 30000);

      const response = await fetch(buildApiUrl(API_BASE_URLS.gateway, API_ENDPOINTS.auth.forgotPassword || "/Auth/forgot-password"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      console.log("📡 Forgot password response status:", response.status);

      const contentType = response.headers.get("content-type");
      let data: AuthCommonResponse;

      if (contentType?.includes("application/json")) {
        try {
          data = await response.json();
          console.log("📦 Response data:", { success: data.success, message: data.message });
        } catch (parseError) {
          console.error("❌ JSON parse error:", parseError);
          throw new Error("Định dạng phản hồi từ server không hợp lệ.");
        }
      } else {
        throw new Error("Server không trả về định dạng JSON.");
      }

      if (!response.ok) {
        const errorMsg = data.errors?.[0] || data.message || `Lỗi server: ${response.status}`;
        console.error("❌ Forgot password error:", errorMsg);
        throw new Error(errorMsg);
      }

      return data;
    } catch (error) {
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        throw new Error("Không thể kết nối tới server. Vui lòng kiểm tra internet.");
      }
      if (error instanceof Error) throw error;
      throw new Error("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  },

  // 2. API: Xác thực mã token OTP
  verifyResetToken: async (payload: VerifyResetTokenRequest): Promise<AuthCommonResponse> => {
    try {
      console.log("🔒 [verifyResetToken] Đang xác thực mã OTP cho:", payload.email);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 30000);

      const response = await fetch(buildApiUrl(API_BASE_URLS.gateway, API_ENDPOINTS.auth.verifyResetToken || "/Auth/verify-reset-token"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      console.log("📡 Verify token response status:", response.status);

      const contentType = response.headers.get("content-type");
      let data: AuthCommonResponse;

      if (contentType?.includes("application/json")) {
        data = await response.json();
      } else {
        throw new Error("Server không trả về định dạng JSON.");
      }

      if (!response.ok) {
        const errorMsg = data.errors?.[0] || data.message || "Xác thực mã OTP thất bại.";
        throw new Error(errorMsg);
      }

      if (!data.success) {
        throw new Error(data.message || "Mã xác thực không chính xác hoặc đã hết hạn.");
      }

      return data;
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error("Lỗi kết nối mạng.");
    }
  },

  // 3. API: Tiến hành đặt lại mật khẩu mới
  resetPassword: async (payload: ResetPasswordRequest): Promise<AuthCommonResponse> => {
    try {
      console.log("🔒 [resetPassword] Tiến hành đặt lại mật khẩu mới cho:", payload.email);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 30000);

      const response = await fetch(buildApiUrl(API_BASE_URLS.gateway, API_ENDPOINTS.auth.resetPassword || "/Auth/reset-password"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      console.log("📡 Reset password response status:", response.status);

      const contentType = response.headers.get("content-type");
      let data: AuthCommonResponse;

      if (contentType?.includes("application/json")) {
        data = await response.json();
      } else {
        throw new Error("Server không trả về định dạng JSON.");
      }

      if (!response.ok) {
        const errorMsg = data.errors?.[0] || data.message || "Đặt lại mật khẩu thất bại.";
        throw new Error(errorMsg);
      }

      if (!data.success) {
        throw new Error(data.message || "Không thể đặt lại mật khẩu.");
      }

      return data;
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error("Lỗi kết nối mạng.");
    }
  },
};