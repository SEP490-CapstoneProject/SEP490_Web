export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role: number; // 1 = talent, 2 = recruiter
}

export interface AuthUser {
  id: number;
  email: string;
  role: number;
  status: number;
  createdAt: string;
  employeeId: number;
  companyId: number;
}

export interface AuthData {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
  message: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: AuthData;
  errors: string[];
}

// --- FORGOT PASSWORD TYPES ---

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyResetTokenRequest {
  email: string;
  token: string;
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  newPassword: string;
}

export interface AuthCommonResponse {
  success: boolean;
  message: string;
  data: null;
  errors: string[];
}