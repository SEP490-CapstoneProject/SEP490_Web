/**
 * User Profile API Service
 * Handles employee/talent profile operations and company profile operations
 * 
 * Uses centralized configuration from @/config/apiConfig
 */
import { Company } from "@/types/company";
import { API_BASE_URLS, buildApiUrl } from "@/config/apiConfig";

export type { Company };

export interface EmployeeProfile {
  id: number;
  userId: number;
  name: string;
  phone: string;
  email?: string;
  status?: string;
  createAt?: string;
  coverImage?: string;
  avatar?: string;
}

// API configuration imported from centralized config

/**
 * Fetch employee by user ID
 */
export const fetchEmployeeByUserId = async (
  userId: number,
  accessToken: string,
): Promise<EmployeeProfile> => {
  try {
    console.log("📡 [fetchEmployeeByUserId] Starting...");
    console.log("👤 User ID:", userId);
    console.log("🔐 Token available:", !!accessToken);

    if (!userId) {
      console.error("❌ No user ID provided!");
      throw new Error("User ID is required.");
    }

    if (!accessToken) {
      console.error("❌ No access token provided!");
      throw new Error("Access token is missing. Please login again.");
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.warn("⏱️ Employee by user ID fetch timeout after 30 seconds");
      controller.abort();
    }, 30000);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };

    const fullUrl = buildApiUrl(API_BASE_URLS.userProfile, `/Employee/by-user/${userId}`);
    console.log("📡 Making request to:", fullUrl);

    const response = await fetch(fullUrl, {
      method: "GET",
      headers: headers,
      signal: controller.signal,
      credentials: "include",
    });

    clearTimeout(timeoutId);

    console.log("📡 Employee by user ID API response status:", response.status);

    let data: unknown;
    let responseText: string = "";

    // Try to read response body first
    try {
      responseText = await response.text();
      console.log("📦 Raw response (first 500 chars):", responseText.substring(0, 500));
    } catch (readError) {
      console.error("❌ Error reading response body:", readError);
      throw new Error("Failed to read server response");
    }

    // Handle 401 Unauthorized specifically
    if (response.status === 401) {
      console.error("❌ 401 Unauthorized - Token is invalid or expired");
      throw new Error("Your session has expired. Please login again.");
    }

    // Try to parse JSON - be lenient with content-type check
    if (responseText) {
      try {
        data = JSON.parse(responseText);
        console.log("📦 Employee by user ID API response data:", data);
      } catch (parseError) {
        console.error("❌ JSON parse error:", parseError);
        console.error("📦 Raw response text:", responseText);
        throw new Error("Invalid response format from server");
      }
    }

    if (!response.ok) {
      const dataAsObj = data as Record<string, unknown> | null;
      const errors = dataAsObj?.errors as (string | unknown)[] | undefined;
      const errorMsg: string =
        (typeof dataAsObj?.message === "string" ? dataAsObj.message : undefined) ||
        (errors?.[0] && typeof errors[0] === "string" ? errors[0] : undefined) ||
        `Server error: ${response.status} ${response.statusText}`;
      console.error("❌ Employee by user ID fetch error:", errorMsg);
      throw new Error(errorMsg);
    }

    // Handle multiple possible response formats
    let employeeData: unknown;
    const dataAsObj = data as Record<string, unknown> | null;

    // Try different extraction strategies
    if (dataAsObj?.data && typeof dataAsObj.data === "object") {
      // Format: { data: { employee } }
      employeeData = dataAsObj.data;
    } else if (dataAsObj) {
      // Format: { employee } or { success: true, employee fields }
      // Check if this looks like an employee object (has required fields)
      const asEmployee = dataAsObj as any;
      if (asEmployee.id || asEmployee.userId || asEmployee.name || asEmployee.email) {
        employeeData = dataAsObj;
      } else {
        // Fallback: use the entire response
        employeeData = dataAsObj;
      }
    } else {
      employeeData = data;
    }

    if (!employeeData || typeof employeeData !== "object") {
      console.warn("⚠️ Unexpected response format for employee by user ID");
      console.warn("⚠️ employeeData:", employeeData);
      console.warn("⚠️ full data:", data);
      throw new Error("Invalid employee data format");
    }

    console.log("✅ Employee by user ID fetched successfully:", employeeData);
    return employeeData as EmployeeProfile;
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      console.error("❌ [fetchEmployeeByUserId] CORS Error or Network Error:", error);
      throw new Error(
        "Cannot connect to server. Please check your internet connection.",
      );
    }
    if (error instanceof Error) {
      console.error("❌ [fetchEmployeeByUserId] Error:", error.message);
      throw error;
    }
    throw new Error("Network error. Please check your connection");
  }
};

/**
 * Fetch current employee/talent profile information
 */
export const fetchEmployeeProfile = async (accessToken: string): Promise<EmployeeProfile> => {
  try {
    console.log("📡 [fetchEmployeeProfile] Starting...");
    console.log("🔐 Token available:", !!accessToken);

    if (!accessToken) {
      console.error("❌ No access token provided!");
      throw new Error("Access token is missing. Please login again.");
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.warn("⏱️ Employee profile fetch timeout after 30 seconds");
      controller.abort();
    }, 30000);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };

    const fullUrl = buildApiUrl(API_BASE_URLS.userProfile, "/Employee/me");
    console.log("📡 Making request to:", fullUrl);

    const response = await fetch(fullUrl, {
      method: "GET",
      headers: headers,
      signal: controller.signal,
      credentials: "include",
    });

    clearTimeout(timeoutId);

    console.log("📡 Employee profile API response status:", response.status);

    let data: unknown;
    let responseText: string = "";

    // Try to read response body first
    try {
      responseText = await response.text();
      console.log("📦 Raw response (first 500 chars):", responseText.substring(0, 500));
    } catch (readError) {
      console.error("❌ Error reading response body:", readError);
      throw new Error("Failed to read server response");
    }

    // Handle 401 Unauthorized specifically
    if (response.status === 401) {
      console.error("❌ 401 Unauthorized - Token is invalid or expired");
      throw new Error("Your session has expired. Please login again.");
    }

    // Try to parse JSON - be lenient with content-type check
    if (responseText) {
      try {
        data = JSON.parse(responseText);
        console.log("📦 Employee profile API response data:", data);
      } catch (parseError) {
        console.error("❌ JSON parse error:", parseError);
        console.error("📦 Raw response text:", responseText);
        throw new Error("Invalid response format from server");
      }
    }

    if (!response.ok) {
      const dataAsObj = data as Record<string, unknown> | null;
      const errors = dataAsObj?.errors as (string | unknown)[] | undefined;
      const errorMsg: string =
        (typeof dataAsObj?.message === "string" ? dataAsObj.message : undefined) ||
        (errors?.[0] && typeof errors[0] === "string" ? errors[0] : undefined) ||
        `Server error: ${response.status} ${response.statusText}`;
      console.error("❌ Employee profile fetch error:", errorMsg);
      throw new Error(errorMsg);
    }

    // Handle multiple possible response formats
    let profileData: unknown;
    const dataAsObj = data as Record<string, unknown> | null;
    
    // Try different extraction strategies
    if (dataAsObj?.data && typeof dataAsObj.data === "object") {
      // Format: { data: { profile } }
      profileData = dataAsObj.data;
    } else if (dataAsObj) {
      // Format: { profile } or { success: true, profile fields }
      // Check if this looks like a profile object (has required fields)
      const asProfile = dataAsObj as any;
      if (asProfile.id || asProfile.userId || asProfile.name || asProfile.phone) {
        profileData = dataAsObj;
      } else {
        // Fallback: maybe the entire response is wrapped, try extracting main fields
        profileData = dataAsObj;
      }
    } else {
      profileData = data;
    }

    if (!profileData || typeof profileData !== "object") {
      console.warn("⚠️ Unexpected response format for employee profile");
      console.warn("⚠️ profileData:", profileData);
      console.warn("⚠️ full data:", data);
      throw new Error("Invalid employee profile data format");
    }

    console.log("✅ Employee profile fetched successfully:", profileData);
    return profileData as EmployeeProfile;
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      console.error("❌ [fetchEmployeeProfile] CORS Error or Network Error:", error);
      throw new Error(
        "Cannot connect to server. Please check your internet connection.",
      );
    }
    if (error instanceof Error) {
      console.error("❌ [fetchEmployeeProfile] Error:", error.message);
      throw error;
    }
    throw new Error("Network error. Please check your connection");
  }
};

/**
 * Update employee/talent profile information with file uploads
 */
export const updateEmployeeProfile = async (
  employeeId: number,
  accessToken: string,
  profileData: {
    name?: string;
    phone?: string;
    avatarFile?: File;
    coverImageFile?: File;
  },
): Promise<EmployeeProfile> => {
  try {
    console.log("📡 [updateEmployeeProfile] Starting...");
    console.log("📝 Employee ID:", employeeId);
    console.log("📝 Profile data to update:", { name: profileData.name, phone: profileData.phone });

    if (!employeeId) {
      console.error("❌ No employeeId provided!");
      throw new Error("Employee ID is missing.");
    }

    if (!accessToken) {
      console.error("❌ No access token provided!");
      throw new Error("Access token is missing. Please login again.");
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.warn("⏱️ Employee profile update timeout after 30 seconds");
      controller.abort();
    }, 30000);

    const headers: Record<string, string> = {
      Authorization: `Bearer ${accessToken}`,
    };

    // Use FormData for multipart file upload
    const formData = new FormData();
    
    if (profileData.name) {
      formData.append("name", profileData.name);
      console.log("📝 Added name to FormData:", profileData.name);
    }
    
    if (profileData.phone) {
      formData.append("phone", profileData.phone);
      console.log("📝 Added phone to FormData:", profileData.phone);
    }
    
    if (profileData.avatarFile) {
      formData.append("avatar", profileData.avatarFile);
      console.log("📝 Added avatar file to FormData:", profileData.avatarFile.name);
    }
    
    if (profileData.coverImageFile) {
      formData.append("coverImage", profileData.coverImageFile);
      console.log("📝 Added cover image file to FormData:", profileData.coverImageFile.name);
    }

    const fullUrl = buildApiUrl(API_BASE_URLS.userProfile, `/Employee/${employeeId}`);
    console.log("📡 Making PUT request to:", fullUrl);

    const response = await fetch(fullUrl, {
      method: "PUT",
      headers: headers,
      body: formData,
      signal: controller.signal,
      credentials: "include",
    });

    clearTimeout(timeoutId);

    console.log("📡 Employee profile update response status:", response.status);

    let data: unknown;
    let responseText: string = "";

    // Try to read response body first
    try {
      responseText = await response.text();
      console.log("📦 Raw response (first 500 chars):", responseText.substring(0, 500));
    } catch (readError) {
      console.error("❌ Error reading response body:", readError);
      throw new Error("Failed to read server response");
    }

    // Handle 401 Unauthorized specifically
    if (response.status === 401) {
      console.error("❌ 401 Unauthorized - Token is invalid or expired");
      throw new Error("Your session has expired. Please login again.");
    }

    // Try to parse JSON - be lenient with content-type check
    if (responseText) {
      try {
        data = JSON.parse(responseText);
        console.log("📦 Employee profile update response data:", data);
      } catch (parseError) {
        console.error("❌ JSON parse error:", parseError);
        console.error("📦 Raw response text:", responseText);
        throw new Error("Invalid response format from server");
      }
    }

    if (!response.ok) {
      const dataAsObj = data as Record<string, unknown> | null;
      const errors = dataAsObj?.errors as (string | unknown)[] | undefined;
      const errorMsg: string =
        (typeof dataAsObj?.message === "string" ? dataAsObj.message : undefined) ||
        (errors?.[0] && typeof errors[0] === "string" ? errors[0] : undefined) ||
        `Server error: ${response.status} ${response.statusText}`;
      console.error("❌ Employee profile update error:", errorMsg);
      throw new Error(errorMsg);
    }

    // Handle multiple possible response formats
    let updatedProfileData: unknown;
    const dataAsObj = data as Record<string, unknown> | null;
    
    // Try different extraction strategies
    if (dataAsObj?.data && typeof dataAsObj.data === "object") {
      // Format: { data: { profile } }
      updatedProfileData = dataAsObj.data;
    } else if (dataAsObj) {
      // Format: { profile } or { success: true, profile fields }
      // Check if this looks like a profile object (has expected fields)
      const asProfile = dataAsObj as any;
      if (asProfile.id || asProfile.userId || asProfile.name || asProfile.phone) {
        updatedProfileData = dataAsObj;
      } else {
        // If still not clear, use the whole response
        updatedProfileData = dataAsObj;
      }
    } else {
      updatedProfileData = data;
    }

    if (!updatedProfileData || typeof updatedProfileData !== "object") {
      console.warn("⚠️ Unexpected response format for updated employee profile");
      console.warn("⚠️ updatedProfileData:", updatedProfileData);
      console.warn("⚠️ full data:", data);
      throw new Error("Invalid updated profile data format");
    }

    console.log("✅ Employee profile updated successfully:", updatedProfileData);
    return updatedProfileData as EmployeeProfile;
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      console.error("❌ [updateEmployeeProfile] CORS Error or Network Error:", error);
      throw new Error(
        "Cannot connect to server. Please check your internet connection.",
      );
    }
    if (error instanceof Error) {
      console.error("❌ [updateEmployeeProfile] Error:", error.message);
      throw error;
    }
    throw new Error("Network error. Please check your connection");
  }
};

/**
 * Fetch current company profile information
 */
export const fetchCompanyProfile = async (accessToken: string): Promise<Company> => {
  try {
    console.log("📡 [fetchCompanyProfile] Starting...");
    console.log("🔐 Token available:", !!accessToken);

    if (!accessToken) {
      console.error("❌ No access token provided!");
      throw new Error("Access token is missing. Please login again.");
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.warn("⏱️ Company profile fetch timeout after 30 seconds");
      controller.abort();
    }, 30000);

    // Use the userprofile-service URL for company profile
    const apiBaseUrl = "https://userprofile-service.redmushroom-1d023c6a.southeastasia.azurecontainerapps.io";
    const fullUrl = `${apiBaseUrl}/api/Company/me`;
    console.log("📡 Making request to:", fullUrl);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };

    const response = await fetch(fullUrl, {
      method: "GET",
      headers: headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log("📡 Company profile API response status:", response.status);

    let data: unknown;
    let responseText: string = "";

    // Try to read response body first
    try {
      responseText = await response.text();
      console.log("📦 Raw response (first 500 chars):", responseText.substring(0, 500));
    } catch (readError) {
      console.error("❌ Error reading response body:", readError);
      throw new Error("Failed to read server response");
    }

    // Handle 401 Unauthorized specifically
    if (response.status === 401) {
      console.error("❌ 401 Unauthorized - Token is invalid or expired");
      throw new Error("Your session has expired. Please login again.");
    }

    // Try to parse JSON
    if (responseText) {
      try {
        data = JSON.parse(responseText);
        console.log("📦 Company profile API response data:", data);
      } catch (parseError) {
        console.error("❌ JSON parse error:", parseError);
        console.error("📦 Raw response text:", responseText);
        throw new Error("Invalid response format from server");
      }
    }

    if (!response.ok) {
      const dataAsObj = data as Record<string, unknown> | null;
      const errors = dataAsObj?.errors as (string | unknown)[] | undefined;
      const errorMsg: string =
        (typeof dataAsObj?.message === "string" ? dataAsObj.message : undefined) ||
        (errors?.[0] && typeof errors[0] === "string" ? errors[0] : undefined) ||
        `Server error: ${response.status} ${response.statusText}`;
      console.error("❌ Company profile fetch error:", errorMsg);
      throw new Error(errorMsg);
    }

    // Handle multiple possible response formats
    let profileData: unknown;
    const dataAsObj = data as Record<string, unknown> | null;
    
    if (dataAsObj?.data && typeof dataAsObj.data === "object") {
      profileData = dataAsObj.data;
    } else if (dataAsObj) {
      profileData = dataAsObj;
    } else {
      profileData = data;
    }

    if (!profileData || typeof profileData !== "object") {
      console.warn("⚠️ Unexpected response format for company profile");
      throw new Error("Invalid company profile data format");
    }

    console.log("✅ Company profile fetched successfully:", profileData);
    return profileData as Company;
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      console.error("❌ [fetchCompanyProfile] CORS Error or Network Error:", error);
      throw new Error(
        "Cannot connect to server. Please check your internet connection.",
      );
    }
    if (error instanceof Error) {
      console.error("❌ [fetchCompanyProfile] Error:", error.message);
      throw error;
    }
    throw new Error("Network error. Please check your connection");
  }
};

/**
 * Update company profile information with file uploads
 */
export const updateCompanyProfile = async (
  companyId: string | number,
  accessToken: string,
  profileData: {
    companyName?: string;
    activityField?: string;
    taxIdentification?: number;
    address?: string;
    description?: string;
    avatarFile?: File;
    coverImageFile?: File;
  },
): Promise<Company> => {
  try {
    console.log("📡 [updateCompanyProfile] Starting...");
    console.log("📝 Company ID:", companyId);
    console.log("📝 Profile data to update:", {
      companyName: profileData.companyName,
      activityField: profileData.activityField,
      address: profileData.address,
      description: profileData.description,
    });

    if (!companyId) {
      console.error("❌ No companyId provided!");
      throw new Error("Company ID is missing.");
    }

    if (!accessToken) {
      console.error("❌ No access token provided!");
      throw new Error("Access token is missing. Please login again.");
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.warn("⏱️ Company profile update timeout after 30 seconds");
      controller.abort();
    }, 30000);

    const apiBaseUrl = "https://userprofile-service.redmushroom-1d023c6a.southeastasia.azurecontainerapps.io";
    const fullUrl = `${apiBaseUrl}/api/Company/${companyId}`;
    console.log("📡 Making request to:", fullUrl);

    const formData = new FormData();
    if (profileData.companyName) formData.append("companyName", profileData.companyName);
    if (profileData.activityField) formData.append("activityField", profileData.activityField);
    if (profileData.taxIdentification) formData.append("taxIdentification", String(profileData.taxIdentification));
    if (profileData.address) formData.append("address", profileData.address);
    if (profileData.description) formData.append("description", profileData.description);

    // Append files if provided
    if (profileData.avatarFile) {
      console.log("📸 Avatar file to upload:", profileData.avatarFile.name);
      formData.append("avatar", profileData.avatarFile);
    }
    if (profileData.coverImageFile) {
      console.log("📸 Cover image file to upload:", profileData.coverImageFile.name);
      formData.append("coverImage", profileData.coverImageFile);
    }

    const headers: Record<string, string> = {
      Authorization: `Bearer ${accessToken}`,
    };

    const response = await fetch(fullUrl, {
      method: "PUT",
      headers: headers,
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log("📡 Company profile update response status:", response.status);

    let data: unknown;
    let responseText: string = "";

    try {
      responseText = await response.text();
      console.log("📦 Raw response (first 500 chars):", responseText.substring(0, 500));
    } catch (readError) {
      console.error("❌ Error reading response body:", readError);
      throw new Error("Failed to read server response");
    }

    // Handle 401 Unauthorized specifically
    if (response.status === 401) {
      console.error("❌ 401 Unauthorized - Token is invalid or expired");
      throw new Error("Your session has expired. Please login again.");
    }

    // Try to parse JSON
    if (responseText) {
      try {
        data = JSON.parse(responseText);
        console.log("📦 Company profile update response data:", data);
      } catch (parseError) {
        console.error("❌ JSON parse error:", parseError);
        console.error("📦 Raw response text:", responseText);
        throw new Error("Invalid response format from server");
      }
    }

    if (!response.ok) {
      const dataAsObj = data as Record<string, unknown> | null;
      const errors = dataAsObj?.errors as (string | unknown)[] | undefined;
      const errorMsg: string =
        (typeof dataAsObj?.message === "string" ? dataAsObj.message : undefined) ||
        (errors?.[0] && typeof errors[0] === "string" ? errors[0] : undefined) ||
        `Server error: ${response.status} ${response.statusText}`;
      console.error("❌ Company profile update error:", errorMsg);
      throw new Error(errorMsg);
    }

    // Handle multiple possible response formats
    let updatedProfileData: unknown;
    const dataAsObj = data as Record<string, unknown> | null;
    
    if (dataAsObj?.data && typeof dataAsObj.data === "object") {
      updatedProfileData = dataAsObj.data;
    } else if (dataAsObj) {
      updatedProfileData = dataAsObj;
    } else {
      updatedProfileData = data;
    }

    if (!updatedProfileData || typeof updatedProfileData !== "object") {
      console.warn("⚠️ Unexpected response format for updated company profile");
      throw new Error("Invalid updated company profile data format");
    }

    console.log("✅ Company profile updated successfully:", updatedProfileData);
    return updatedProfileData as Company;
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      console.error("❌ [updateCompanyProfile] CORS Error or Network Error:", error);
      throw new Error(
        "Cannot connect to server. Please check your internet connection.",
      );
    }
    if (error instanceof Error) {
      console.error("❌ [updateCompanyProfile] Error:", error.message);
      throw error;
    }
    throw new Error("Network error. Please check your connection");
  }
};

export const profileService = {
  fetchEmployeeProfile,
  updateEmployeeProfile,
  fetchCompanyProfile,
  updateCompanyProfile,
};
