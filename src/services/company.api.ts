import { CompanyPostsPaginatedResponse, CompanyFeedPaginatedResponse, CompanyPostDetail, SearchCompanyPostsResponse, SearchCompanyPostsParams, MatchedPortfoliosResponse } from '@/types/companyPost';
import { API_BASE_URLS, API_ENDPOINTS, buildApiUrl } from '@/config/apiConfig';

/**
 * Company Posts API Service
 * Handles company job posts and recruitment operations
 * 
 * Uses centralized configuration from @/config/apiConfig
 * Supports both development and production environments
 */

/**
 * Fetch company job posts with pagination support
 * @param cursor - Optional cursor for pagination (ISO date string)
 * @param limit - Number of posts to fetch (default: 10)
 * @param accessToken - Optional access token for authenticated requests
 */
export const fetchCompanyPosts = async (
  cursorParam?: string,
  limit: number = 10,
  accessToken?: string
): Promise<CompanyFeedPaginatedResponse> => {
  try {
    console.log("📡 [fetchCompanyPosts] Starting with cursor:", cursorParam, "limit:", limit);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.warn("⏱️ Company posts fetch timeout after 30 seconds");
      controller.abort();
    }, 30000);

    // Build query parameters
    const params = new URLSearchParams();
    if (cursorParam) {
      params.append("cursor", cursorParam);
    }
    params.append("limit", limit.toString());

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add authorization header if token is provided
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    // Use centralized config — use the new /feed endpoint which returns wrapper items
    const feedEndpoint = `${API_ENDPOINTS.company.posts}/feed`;
    const fullUrl = buildApiUrl(API_BASE_URLS.company, feedEndpoint) + `?${params.toString()}`;
    console.log("📡 Making request to (feed):", fullUrl);

    const response = await fetch(fullUrl, {
      method: "GET",
      headers: headers,
      signal: controller.signal,
      credentials: "include",
    });

    clearTimeout(timeoutId);

    console.log("📡 Company posts API (feed) response status:", response.status);

    const contentType = response.headers.get("content-type");
    let data: unknown;

    if (contentType?.includes("application/json")) {
      try {
        data = await response.json();
        console.log("📦 Feed response data:", data);
      } catch (parseError) {
        console.error("❌ JSON parse error:", parseError);
        throw new Error("Invalid response format from server (JSON parse failed)");
      }
    } else {
      console.error("❌ Invalid response content type:", contentType);
      throw new Error("Server returned non-JSON response");
    }

    if (!response.ok) {
      const errorMsg = (data as Record<string, unknown>)?.message || "Failed to fetch company posts (feed)";
      console.error("❌ Fetch error:", errorMsg);
      throw new Error(String(errorMsg));
    }

    // New feed format: { items: [ { type, isSponsored, sponsoredLabel, data }, ... ], cursor, limit }
    if (!data || typeof data !== "object" || !Array.isArray((data as Record<string, unknown>).items)) {
      console.error("❌ Invalid feed response format:", data);
      throw new Error("Invalid response format from server");
    }

    const rawItems = (data as Record<string, any>).items as any[];

    // Map feed items preserving order: CompanyPost -> CompanyPostAPI, SponsoredPost -> SponsoredPostAPI
    const mappedItems: any[] = [];
    for (const it of rawItems) {
      if (!it || !it.type) continue;
      if (it.type === "CompanyPost" && it.data) {
        const d = it.data;
        mappedItems.push({
          postId: d.postId,
          position: d.position,
          companyName: d.companyName,
          companyAvatar: d.companyAvatar,
          coverImageUrl: d.coverImageUrl,
          mediaType: d.mediaType,
          mediaUrl: d.mediaUrl || d.coverImageUrl || "",
          address: d.address,
          salary: d.salary,
          employmentType: d.employmentType,
          createdAt: d.createdAt,
          isSaved: typeof d.isSaved === "boolean" ? d.isSaved : false,
          isSponsored: false,
        } as import('@/types/companyPost').CompanyPostAPI);
      } else if (it.type === "SponsoredPost" && it.data) {
        const d = it.data;
        mappedItems.push({
          id: d.id,
          createdBy: d.createdBy,
          contentType: d.contentType,
          textContent: d.textContent,
          imageUrl: d.imageUrl,
          videoUrl: d.videoUrl,
          pointsSpent: d.pointsSpent,
          durationDays: d.durationDays,
          startDate: d.startDate,
          expiryDate: d.expiryDate,
          status: d.status,
          clickThroughUrl: d.clickThroughUrl,
          viewCount: d.viewCount,
          clickCount: d.clickCount,
          createdAt: d.createdAt,
          isSponsored: true,
        } as import('@/types/companyPost').SponsoredPostAPI);
      } else {
        // Unknown item type: ignore for now
        console.warn("⚠️ Unknown feed item type, skipping:", it?.type);
      }
    }

    const responseCursor = (data as Record<string, any>).cursor ?? (data as Record<string, any>).nextCursor ?? null;
    const limitReturned = (data as Record<string, any>).limit ?? (params.get("limit") ? Number(params.get("limit")) : limit);

    const paginatedResponse = {
      items: mappedItems,
      cursor: responseCursor,
      limit: limitReturned,
    } as import('@/types/companyPost').CompanyFeedPaginatedResponse;

    console.log(
      "✅ Company posts (mapped) fetched successfully:",
      mappedItems.length,
      "items, cursor:",
      paginatedResponse.cursor
    );

    return paginatedResponse;
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      console.error("❌ CORS Error or Network Error:", error);
      throw new Error("Cannot connect to server. Please check your internet connection.");
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error. Please check your internet connection.");
  }
};

/**
 * Fetch company job posts filtered by company ID with pagination support
 * Used by recruiters to view their own company's job posts
 * @param companyId - The ID of the company
 * @param cursor - Optional cursor for pagination (ISO date string)
 * @param limit - Number of posts to fetch (default: 10)
 * @param accessToken - Optional access token for authenticated requests
 */
export const fetchCompanyPostsByCompanyId = async (
  companyId: number,
  cursor?: string,
  limit: number = 10,
  accessToken?: string
): Promise<CompanyPostsPaginatedResponse> => {
  try {
    console.log("📡 [fetchCompanyPostsByCompanyId] Starting for companyId:", companyId, "cursor:", cursor, "limit:", limit);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.warn("⏱️ Company posts fetch timeout after 30 seconds");
      controller.abort();
    }, 30000);

    // Build query parameters
    const params = new URLSearchParams();
    if (cursor) {
      params.append("cursor", cursor);
    }
    params.append("limit", limit.toString());

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add authorization header if token is provided
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    // API endpoint: GET /api/company-posts/company/{companyId}?limit=...
    const baseEndpoint = `/company-posts/company/${companyId}`;
    const fullUrl = buildApiUrl(API_BASE_URLS.company, baseEndpoint) + `?${params.toString()}`;
    console.log("📡 Making request to:", fullUrl);

    const response = await fetch(fullUrl, {
      method: "GET",
      headers: headers,
      signal: controller.signal,
      credentials: "include",
    });

    clearTimeout(timeoutId);

    console.log("📡 Company posts (by company) API response status:", response.status);
    console.log("📡 Response content-type:", response.headers.get("content-type"));

    const contentType = response.headers.get("content-type");
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

    // Check response status first
    if (!response.ok) {
      console.error("❌ API returned error status:", response.status);
      // Try to parse error message from response body
      if (contentType?.includes("application/json") && responseText) {
        try {
          const errorData = JSON.parse(responseText);
          throw new Error(errorData.message || `HTTP ${response.status}`);
        } catch (e) {
          if (e instanceof Error) throw e;
          throw new Error(`HTTP ${response.status}`);
        }
      }
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }

    // Parse successful response
    if (contentType?.includes("application/json") && responseText) {
      try {
        data = JSON.parse(responseText);
        console.log("📦 Response data:", data);
      } catch (parseError) {
        console.error("❌ JSON parse error:", parseError);
        throw new Error("Invalid response format from server (JSON parse failed)");
      }
    } else if (responseText && responseText.trim().length > 0) {
      console.warn("⚠️ Response has body but not JSON, treating as error");
      throw new Error("Server returned non-JSON response");
    } else {
      console.warn("⚠️ Response has empty body");
      throw new Error("Empty response from server");
    }

    // Validate response structure - should have items, nextCursor, hasMore
    if (
      !data ||
      typeof data !== "object" ||
      !Array.isArray((data as Record<string, unknown>).items)
    ) {
      console.error("❌ Invalid response format:", data);
      throw new Error("Invalid response format from server");
    }

    console.log(
      "✅ Company posts (by company) fetched successfully:",
      ((data as Record<string, unknown>).items as unknown[])?.length || 0,
      "posts"
    );
    return data as CompanyPostsPaginatedResponse;
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      console.error("❌ CORS Error or Network Error:", error);
      throw new Error("Cannot connect to server. Please check your internet connection.");
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error. Please check your internet connection.");
  }
};

/**
 * Fetch a single company job post by ID
 * @param postId - The ID of the company post to fetch
 * @param accessToken - Optional access token for authenticated requests
 */
export const fetchCompanyPostDetail = async (
  postId: number,
  accessToken?: string
): Promise<CompanyPostDetail> => {
  try {
    console.log("📡 [fetchCompanyPostDetail] Starting for postId:", postId);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.warn("⏱️ Company post detail fetch timeout after 30 seconds");
      controller.abort();
    }, 30000);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const fullUrl = buildApiUrl(API_BASE_URLS.company, API_ENDPOINTS.company.detail(postId));
    console.log("📡 Making request to:", fullUrl);

    const response = await fetch(fullUrl, {
      method: "GET",
      headers: headers,
      signal: controller.signal,
      credentials: "include",
    });

    clearTimeout(timeoutId);

    console.log("📡 Company post detail API response status:", response.status);
    console.log("📡 Response content-type:", response.headers.get("content-type"));

    const contentType = response.headers.get("content-type");
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

    // Check response status first
    if (!response.ok) {
      console.error("❌ API returned error status:", response.status);
      // Try to parse error message from response body
      if (contentType?.includes("application/json") && responseText) {
        try {
          const errorData = JSON.parse(responseText);
          throw new Error(errorData.message || `HTTP ${response.status}`);
        } catch (e) {
          if (e instanceof Error) throw e;
          throw new Error(`HTTP ${response.status}`);
        }
      }
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }

    // Parse successful response
    if (contentType?.includes("application/json") && responseText) {
      try {
        data = JSON.parse(responseText);
        console.log("📦 Company post detail fetched:", data);
      } catch (parseError) {
        console.error("❌ JSON parse error:", parseError);
        throw new Error("Invalid response format from server");
      }
    } else if (responseText && responseText.trim().length > 0) {
      console.warn("⚠️ Response has body but not JSON, treating as error");
      throw new Error("Server returned non-JSON response");
    } else {
      console.warn("⚠️ Response has empty body");
      throw new Error("Empty response from server");
    }

    console.log("✅ Company post detail fetched successfully");
    return data as CompanyPostDetail;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error");
  }
};

/**
 * Save a company job post
 * @param postId - The ID of the company post to save
 * @param accessToken - Optional access token for authenticated requests
 */
export const saveCompanyPost = async (
  postId: number,
  accessToken?: string
): Promise<{ message: string }> => {
  try {
    console.log("📡 [saveCompanyPost] Starting for postId:", postId);
    console.log("📡 [saveCompanyPost] accessToken provided:", !!accessToken);

    if (!accessToken) {
      console.warn("⚠️ [saveCompanyPost] No accessToken provided - API may reject request");
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.warn("⏱️ Save post timeout after 30 seconds");
      controller.abort();
    }, 30000);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
      console.log("📡 [saveCompanyPost] Authorization header added");
    }

    const fullUrl = buildApiUrl(API_BASE_URLS.company, API_ENDPOINTS.company.save(postId));
    console.log("📡 [saveCompanyPost] Making request to:", fullUrl);
    console.log("📡 [saveCompanyPost] Headers:", { "Content-Type": headers["Content-Type"], hasAuth: !!headers["Authorization"] });

    const response = await fetch(fullUrl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({}),  // Send empty body to be explicit
      signal: controller.signal,
      credentials: "include",
    });

    clearTimeout(timeoutId);

    console.log("📡 [saveCompanyPost] Response status:", response.status);
    console.log("📡 [saveCompanyPost] Response statusText:", response.statusText);
    console.log("📡 [saveCompanyPost] Response OK:", response.ok);

    const contentType = response.headers.get("content-type");
    console.log("📡 [saveCompanyPost] Content-Type:", contentType);

    let data: unknown;

    if (contentType?.includes("application/json")) {
      try {
        data = await response.json();
        console.log("📡 [saveCompanyPost] Parsed response data:", data);
      } catch (parseError) {
        console.error("❌ [saveCompanyPost] JSON parse error:", parseError);
        console.error("❌ [saveCompanyPost] Response status:", response.status);
        throw new Error("Invalid response format from server (JSON parse failed)");
      }
    } else {
      console.error("❌ [saveCompanyPost] Non-JSON response, content-type:", contentType);
      throw new Error("Server returned non-JSON response");
    }

    // Check response status
    if (!response.ok) {
      const errorMessage = (data as Record<string, unknown>)?.message as string || "Failed to save post";
      console.error("❌ [saveCompanyPost] API returned error:", response.status, errorMessage);
      throw new Error(errorMessage);
    }

    console.log("✅ [saveCompanyPost] Post saved successfully");
    return data as { message: string };
  } catch (error) {
    console.error("❌ [saveCompanyPost] Caught error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error while saving post");
  }
};

/**
 * Unsave a company job post
 * @param postId - The ID of the company post to unsave
 * @param accessToken - Optional access token for authenticated requests
 */
export const unsaveCompanyPost = async (
  postId: number,
  accessToken?: string
): Promise<{ message: string }> => {
  try {
    console.log("📡 [unsaveCompanyPost] Starting for postId:", postId);
    console.log("📡 [unsaveCompanyPost] accessToken provided:", !!accessToken);

    if (!accessToken) {
      console.warn("⚠️ [unsaveCompanyPost] No accessToken provided - API may reject request");
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.warn("⏱️ Unsave post timeout after 30 seconds");
      controller.abort();
    }, 30000);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
      console.log("📡 [unsaveCompanyPost] Authorization header added");
    }

    const fullUrl = buildApiUrl(API_BASE_URLS.company, API_ENDPOINTS.company.unsave(postId));
    console.log("📡 [unsaveCompanyPost] Making request to:", fullUrl);
    console.log("📡 [unsaveCompanyPost] Headers:", { "Content-Type": headers["Content-Type"], hasAuth: !!headers["Authorization"] });

    const response = await fetch(fullUrl, {
      method: "DELETE",
      headers: headers,
      body: JSON.stringify({}),
      signal: controller.signal,
      credentials: "include",
    });

    clearTimeout(timeoutId);

    console.log("📡 [unsaveCompanyPost] Response status:", response.status);
    console.log("📡 [unsaveCompanyPost] Response statusText:", response.statusText);
    console.log("📡 [unsaveCompanyPost] Response OK:", response.ok);

    const contentType = response.headers.get("content-type");
    console.log("📡 [unsaveCompanyPost] Content-Type:", contentType);

    let data: unknown;

    if (contentType?.includes("application/json")) {
      try {
        data = await response.json();
        console.log("📡 [unsaveCompanyPost] Parsed response data:", data);
      } catch (parseError) {
        console.error("❌ [unsaveCompanyPost] JSON parse error:", parseError);
        console.error("❌ [unsaveCompanyPost] Response status:", response.status);
        throw new Error("Invalid response format from server (JSON parse failed)");
      }
    } else {
      console.error("❌ [unsaveCompanyPost] Non-JSON response, content-type:", contentType);
      throw new Error("Server returned non-JSON response");
    }

    // Check response status
    if (!response.ok) {
      const errorMessage = (data as Record<string, unknown>)?.message as string || "Failed to unsave post";
      console.error("❌ [unsaveCompanyPost] API returned error:", response.status, errorMessage);
      throw new Error(errorMessage);
    }

    console.log("✅ [unsaveCompanyPost] Post unsaved successfully");
    return data as { message: string };
  } catch (error) {
    console.error("❌ [unsaveCompanyPost] Caught error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error while unsaving post");
  }
};

/**
 * Create a new company job post
 * @param postData - Post data containing position, salary, description, etc
 * @param files - Array of media files (images/videos)
 * @param accessToken - Optional access token for authenticated requests
 */
export const createCompanyPost = async (
  postData: {
    position: string;
    address: string;
    salary: string;
    employmentType: string;
    experienceYear?: number;
    quantity?: number;
    jobDescription: string;
    requirementsMandatory: string;
    requirementsPreferred: string;
    benefits: string;
  },
  files: File[],
  accessToken?: string
): Promise<{ postId: number; message: string }> => {
  try {
    console.log("📡 [createCompanyPost] Starting with data:", postData);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.warn("⏱️ Create post timeout after 60 seconds");
      controller.abort();
    }, 60000);

    const headers: Record<string, string> = {};

    // Add authorization header if token is provided
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
      console.log("✅ Authorization header set with token length:", accessToken.length);
    } else {
      console.warn("⚠️ No access token provided - request will be unauthenticated");
    }

    // Build FormData for multipart/form-data request
    const formData = new FormData();

    // Add post data as JSON string
    formData.append("postJson", JSON.stringify(postData));

    // Add files
    files.forEach((file) => {
      formData.append(`files`, file);
    });

    const fullUrl = buildApiUrl(API_BASE_URLS.company, API_ENDPOINTS.company.create);
    console.log("📡 Making request to:", fullUrl);

    const response = await fetch(fullUrl, {
      method: "POST",
      headers: headers,
      body: formData,
      signal: controller.signal,
      credentials: "include",
    });

    clearTimeout(timeoutId);

    console.log("📡 Create post API response status:", response.status);

    const contentType = response.headers.get("content-type");
    let data: unknown;

    if (contentType?.includes("application/json")) {
      try {
        data = await response.json();
        console.log("📦 Response data:", data);
      } catch (parseError) {
        console.error("❌ JSON parse error:", parseError);
        throw new Error("Invalid response format from server (JSON parse failed)");
      }
    } else {
      console.error("❌ Invalid response content type:", contentType);
      throw new Error("Server returned non-JSON response");
    }

    if (!response.ok) {
      const errorMsg = (data as Record<string, unknown>)?.message || "Failed to create company post";
      console.error("❌ Create post error:", errorMsg);
      throw new Error(errorMsg as string);
    }

    console.log("✅ Company post created successfully:", (data as Record<string, unknown>)?.postId);
    return data as { postId: number; message: string };
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      console.error("❌ CORS Error or Network Error:", error);
      throw new Error("Cannot connect to server. Please check your internet connection.");
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error. Please check your internet connection.");
  }
};

/**
 * Delete a company job post
 * @param postId - The ID of the company post to delete
 * @param accessToken - Optional access token for authenticated requests
 */
export const deleteCompanyPost = async (
  postId: number,
  accessToken?: string
): Promise<{ message: string }> => {
  try {
    console.log("📡 [deleteCompanyPost] Starting for postId:", postId);
    console.log("📡 [deleteCompanyPost] accessToken provided:", !!accessToken);

    if (!accessToken) {
      console.warn("⚠️ [deleteCompanyPost] No accessToken provided - API may reject request");
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.warn("⏱️ Delete post timeout after 30 seconds");
      controller.abort();
    }, 30000);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
      console.log("📡 [deleteCompanyPost] Authorization header added");
    }

    const fullUrl = buildApiUrl(API_BASE_URLS.company, API_ENDPOINTS.company.delete(postId));
    console.log("📡 [deleteCompanyPost] Making DELETE request to:", fullUrl);
    console.log("📡 [deleteCompanyPost] Headers:", { "Content-Type": headers["Content-Type"], hasAuth: !!headers["Authorization"] });

    const response = await fetch(fullUrl, {
      method: "DELETE",
      headers: headers,
      signal: controller.signal,
      credentials: "include",
    });

    clearTimeout(timeoutId);

    console.log("📡 [deleteCompanyPost] Response status:", response.status);
    console.log("📡 [deleteCompanyPost] Response statusText:", response.statusText);
    console.log("📡 [deleteCompanyPost] Response OK:", response.ok);

    const contentType = response.headers.get("content-type");
    console.log("📡 [deleteCompanyPost] Content-Type:", contentType);

    // Check response status first
    if (!response.ok) {
      // Try to parse error message if response has JSON body
      let errorMessage = `Failed to delete post (Status: ${response.status})`;
      
      if (contentType?.includes("application/json")) {
        try {
          const errorData = await response.json();
          errorMessage = (errorData as Record<string, unknown>)?.message as string || errorMessage;
        } catch {
          // If JSON parse fails, use the default error message
        }
      }
      
      console.error("❌ [deleteCompanyPost] API returned error:", response.status, errorMessage);
      throw new Error(errorMessage);
    }

    // Handle 204 No Content response (successful delete with no body)
    if (response.status === 204) {
      console.log("✅ [deleteCompanyPost] Post deleted successfully (204 No Content)");
      return { message: "Xóa bài đăng thành công" };
    }

    // For other successful responses (200, 201, etc.), try to parse JSON
    if (contentType?.includes("application/json")) {
      try {
        const data = await response.json();
        console.log("📡 [deleteCompanyPost] Parsed response data:", data);
        console.log("✅ [deleteCompanyPost] Post deleted successfully");
        return data as { message: string };
      } catch (parseError) {
        console.error("❌ [deleteCompanyPost] JSON parse error:", parseError);
        // If parse fails but status is OK, return success message
        console.log("✅ [deleteCompanyPost] Post deleted successfully (parse error ignored)");
        return { message: "Xóa bài đăng thành công" };
      }
    } else {
      // Successful response but no JSON content-type
      console.log("✅ [deleteCompanyPost] Post deleted successfully (no JSON content)");
      return { message: "Xóa bài đăng thành công" };
    }
  } catch (error) {
    console.error("❌ [deleteCompanyPost] Caught error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error while deleting post");
  }
};

/**
 * Update an existing company job post
 * @param postId - The ID of the company post to update
 * @param postData - Post data containing position, salary, description, etc
 * @param files - Array of media files (images/videos) - optional, only if updating media
 * @param accessToken - Optional access token for authenticated requests
 */
export const updateCompanyPost = async (
  postId: number,
  postData: {
    position: string;
    address: string;
    salary: string;
    employmentType: string;
    experienceYear?: number;
    quantity?: number;
    jobDescription: string;
    requirementsMandatory: string;
    requirementsPreferred: string;
    benefits: string;
    status: number;
  },
  files?: File[],
  accessToken?: string
): Promise<{ postId: number; message: string }> => {
  try {
    console.log("📡 [updateCompanyPost] Starting with postId:", postId, "data:", postData);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.warn("⏱️ Update post timeout after 60 seconds");
      controller.abort();
    }, 60000);

    const headers: Record<string, string> = {};

    // Add authorization header if token is provided
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    let body: FormData | string;
    const hasFiles = files && files.length > 0;

    if (hasFiles) {
      // If there are files, use FormData (multipart/form-data)
      console.log("📡 [updateCompanyPost] Sending with files as FormData");
      const formData = new FormData();
      formData.append("postJson", JSON.stringify(postData));
      files.forEach((file) => {
        formData.append(`files`, file);
      });
      body = formData;
      // Don't set Content-Type header - let browser set it for multipart/form-data
    } else {
      // If no files, send as JSON (application/json)
      console.log("📡 [updateCompanyPost] Sending without files as JSON");
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(postData);
    }

    const fullUrl = buildApiUrl(API_BASE_URLS.company, API_ENDPOINTS.company.update(postId));
    console.log("📡 Making PUT request to:", fullUrl);

    const response = await fetch(fullUrl, {
      method: "PUT",
      headers: headers,
      body: body,
      signal: controller.signal,
      credentials: "include",
    });

    clearTimeout(timeoutId);

    console.log("📡 Update post API response status:", response.status);

    const contentType = response.headers.get("content-type");
    let data: unknown;

    // Check response status first
    if (!response.ok) {
      // Try to parse error message if response has JSON body
      let errorMessage = `Failed to update post (Status: ${response.status})`;
      
      if (contentType?.includes("application/json")) {
        try {
          const errorData = await response.json();
          errorMessage = (errorData as Record<string, unknown>)?.message as string || errorMessage;
        } catch {
          // If JSON parse fails, use the default error message
        }
      }
      
      console.error("❌ Update post error:", response.status, errorMessage);
      throw new Error(errorMessage);
    }

    // Handle 204 No Content response (successful update with no body)
    if (response.status === 204) {
      console.log("✅ Company post updated successfully (204 No Content)");
      return { postId: parseInt(postId.toString()), message: "Cập nhật bài đăng thành công" };
    }

    // For other successful responses (200, 201, etc.), try to parse JSON
    if (contentType?.includes("application/json")) {
      try {
        data = await response.json();
        console.log("📦 Response data:", data);
        console.log("✅ Company post updated successfully:", (data as Record<string, unknown>)?.postId);
        return data as { postId: number; message: string };
      } catch (parseError) {
        console.error("❌ JSON parse error:", parseError);
        // If parse fails but status is OK, return success message
        console.log("✅ Company post updated successfully (parse error ignored)");
        return { postId: parseInt(postId.toString()), message: "Cập nhật bài đăng thành công" };
      }
    } else {
      // Successful response but no JSON content-type
      console.log("✅ Company post updated successfully (no JSON content)");
      return { postId: parseInt(postId.toString()), message: "Cập nhật bài đăng thành công" };
    }
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      console.error("❌ CORS Error or Network Error:", error);
      throw new Error("Cannot connect to server. Please check your internet connection.");
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error. Please check your internet connection.");
  }
};

/**
 * Update a company job post using the /full endpoint with complete data
 * @param postId - The ID of the company post to update
 * @param postData - The post data to update
 * @param files - Optional array of files (media) to upload with the post
 * @param accessToken - Optional access token for authenticated requests
 */
export const updateCompanyPostFull = async (
  postId: number,
  postData: {
    position: string;
    address: string;
    salary: string;
    employmentType: string;
    experienceYear?: number;
    quantity?: number;
    jobDescription: string;
    requirementsMandatory: string;
    requirementsPreferred: string;
    benefits: string;
  },
  files?: File[],
  accessToken?: string
): Promise<{ postId: number; message: string }> => {
  try {
    console.log("📡 [updateCompanyPostFull] Starting with postId:", postId, "data:", postData);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.warn("⏱️ Update post (/full) timeout after 60 seconds");
      controller.abort();
    }, 60000);

    const headers: Record<string, string> = {};

    // Add authorization header if token is provided
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    // Always use FormData for /full endpoint to support postJson + files
    const formData = new FormData();
    formData.append("postJson", JSON.stringify(postData));

    // Add files if provided
    if (files && files.length > 0) {
      console.log("📡 [updateCompanyPostFull] Adding", files.length, "files");
      files.forEach((file) => {
        formData.append("files", file);
      });
    } else {
      console.log("📡 [updateCompanyPostFull] No new files - preserving existing media");
    }

    const fullUrl = buildApiUrl(API_BASE_URLS.company, `/company-posts/${postId}/full`);
    console.log("📡 Making PUT request to:", fullUrl);

    const response = await fetch(fullUrl, {
      method: "PUT",
      headers: headers,
      body: formData,
      signal: controller.signal,
      credentials: "include",
    });

    clearTimeout(timeoutId);

    console.log("📡 Update post (/full) API response status:", response.status);

    const contentType = response.headers.get("content-type");
    let data: unknown;

    // Check response status first
    if (!response.ok) {
      // Try to parse error message if response has JSON body
      let errorMessage = `Failed to update post (Status: ${response.status})`;
      
      if (contentType?.includes("application/json")) {
        try {
          const errorData = await response.json();
          // Prefer detailed error message, fallback to generic message
          errorMessage = (errorData as Record<string, unknown>)?.message as string 
            || (errorData as Record<string, unknown>)?.error as string
            || errorMessage;
        } catch {
          // If JSON parse fails, use the default error message
        }
      }
      
      console.error("❌ Update post (/full) error:", response.status, errorMessage);
      throw new Error(errorMessage);
    }

    // Handle 204 No Content response (successful update with no body)
    if (response.status === 204) {
      console.log("✅ Company post updated successfully via /full (204 No Content)");
      return { postId: parseInt(postId.toString()), message: "Cập nhật bài đăng thành công" };
    }

    // For other successful responses (200, 201, etc.), try to parse JSON
    if (contentType?.includes("application/json")) {
      try {
        data = await response.json();
        console.log("📦 Response data:", data);
        console.log("✅ Company post updated successfully via /full:", (data as Record<string, unknown>)?.postId);
        return data as { postId: number; message: string };
      } catch (parseError) {
        console.error("❌ JSON parse error:", parseError);
        // If parse fails but status is OK, return success message
        console.log("✅ Company post updated successfully via /full (parse error ignored)");
        return { postId: parseInt(postId.toString()), message: "Cập nhật bài đăng thành công" };
      }
    } else {
      // Successful response but no JSON content-type
      console.log("✅ Company post updated successfully via /full (no JSON content)");
      return { postId: parseInt(postId.toString()), message: "Cập nhật bài đăng thành công" };
    }
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      console.error("❌ CORS Error or Network Error:", error);
      throw new Error("Cannot connect to server. Please check your internet connection.");
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error. Please check your internet connection.");
  }
};

/**
 * Search company posts with filters
 * @param searchParams - Search parameters (position, salary, location, type, pagination)
 * @param accessToken - Optional access token for authenticated requests
 */
export const searchCompanyPosts = async (
  searchParams: SearchCompanyPostsParams,
  accessToken?: string
): Promise<SearchCompanyPostsResponse> => {
  try {
    console.log("📡 [searchCompanyPosts] Starting with params:", searchParams);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.warn("⏱️ Search company posts timeout after 30 seconds");
      controller.abort();
    }, 30000);

    // Build query parameters
    const params = new URLSearchParams();
    
    if (searchParams.position) {
      params.append("position", searchParams.position);
    }
    if (searchParams.salary) {
      params.append("salary", searchParams.salary);
    }
    if (searchParams.location) {
      params.append("location", searchParams.location);
    }
    if (searchParams.type) {
      params.append("type", searchParams.type);
    }
    
    // Add pagination params
    params.append("page", (searchParams.page || 1).toString());
    params.append("pageSize", (searchParams.pageSize || 20).toString());

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add authorization header if token is provided
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    // Use the search endpoint
    const fullUrl = buildApiUrl(API_BASE_URLS.company, API_ENDPOINTS.company.search) + `?${params.toString()}`;
    console.log("📡 Making request to:", fullUrl);

    const response = await fetch(fullUrl, {
      method: "GET",
      headers: headers,
      signal: controller.signal,
      credentials: "include",
    });

    clearTimeout(timeoutId);

    console.log("📡 Search company posts API response status:", response.status);

    const contentType = response.headers.get("content-type");
    let data: unknown;

    if (contentType?.includes("application/json")) {
      try {
        data = await response.json();
        console.log("📦 Response data:", data);
      } catch (parseError) {
        console.error("❌ JSON parse error:", parseError);
        throw new Error("Invalid response format from server (JSON parse failed)");
      }
    } else {
      console.error("❌ Invalid response content type:", contentType);
      throw new Error("Server returned non-JSON response");
    }

    if (!response.ok) {
      const errorMsg = (data as Record<string, unknown>)?.message || "Failed to search company posts";
      console.error("❌ Fetch error:", errorMsg);
      throw new Error(String(errorMsg));
    }

    // Validate response structure
    if (
      !data ||
      typeof data !== "object" ||
      !Array.isArray((data as Record<string, unknown>).items)
    ) {
      console.error("❌ Invalid response format:", data);
      throw new Error("Invalid response format from server");
    }

    console.log(
      "✅ Company posts searched successfully:",
      ((data as Record<string, unknown>).items as unknown[])?.length || 0,
      "posts"
    );
    return data as SearchCompanyPostsResponse;
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      console.error("❌ CORS Error or Network Error:", error);
      throw new Error("Cannot connect to server. Please check your internet connection.");
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error. Please check your internet connection.");
  }
};

/**
 * Report a company job post
 * @param postId - The ID of the company post to report
 * @param reportData - Report data containing reason and description
 * @param accessToken - Optional access token for authenticated requests
 */
export const reportCompanyPost = async (
  postId: number,
  reportData: {
    reason: string;
    description: string;
  },
  accessToken?: string
): Promise<{
  id: number;
  companyPostId: number;
  postOwnerUserId: number;
  reporterUserId: number;
  reason: string;
  description: string;
  status: string;
  reviewedByUserId: number | null;
  reviewedAt: string | null;
  reviewNote: string | null;
  createdAt: string;
  updatedAt: string | null;
}> => {
  try {
    console.log("📡 [reportCompanyPost] Starting for postId:", postId);
    console.log("📡 [reportCompanyPost] accessToken provided:", !!accessToken);

    if (!accessToken) {
      console.warn("⚠️ [reportCompanyPost] No accessToken provided - API may reject request");
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.warn("⏱️ Report post timeout after 30 seconds");
      controller.abort();
    }, 30000);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
      console.log("📡 [reportCompanyPost] Authorization header added");
    }

    const fullUrl = buildApiUrl(API_BASE_URLS.company, `/company-posts/${postId}/report`);
    console.log("📡 [reportCompanyPost] Making POST request to:", fullUrl);
    console.log("📡 [reportCompanyPost] Headers:", { "Content-Type": headers["Content-Type"], hasAuth: !!headers["Authorization"] });

    const response = await fetch(fullUrl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(reportData),
      signal: controller.signal,
      credentials: "include",
    });

    clearTimeout(timeoutId);

    console.log("📡 [reportCompanyPost] Response status:", response.status);
    console.log("📡 [reportCompanyPost] Response statusText:", response.statusText);
    console.log("📡 [reportCompanyPost] Response OK:", response.ok);

    const contentType = response.headers.get("content-type");
    console.log("📡 [reportCompanyPost] Content-Type:", contentType);

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

    // Check response status first
    if (!response.ok) {
      console.error("❌ [reportCompanyPost] API returned error status:", response.status);
      if (contentType?.includes("application/json") && responseText) {
        try {
          const errorData = JSON.parse(responseText);
          throw new Error(errorData.message || `HTTP ${response.status}`);
        } catch (e) {
          if (e instanceof Error) throw e;
          throw new Error(`HTTP ${response.status}`);
        }
      }
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }

    // Parse successful response
    if (contentType?.includes("application/json") && responseText) {
      try {
        data = JSON.parse(responseText);
        console.log("📡 [reportCompanyPost] Parsed response data:", data);
      } catch (parseError) {
        console.error("❌ [reportCompanyPost] JSON parse error:", parseError);
        throw new Error("Invalid response format from server (JSON parse failed)");
      }
    } else if (responseText && responseText.trim().length > 0) {
      console.warn("⚠️ Response has body but not JSON, treating as error");
      throw new Error("Server returned non-JSON response");
    } else {
      console.warn("⚠️ Response has empty body");
      throw new Error("Empty response from server");
    }

    console.log("✅ [reportCompanyPost] Post reported successfully");
    return data as Awaited<ReturnType<typeof reportCompanyPost>>;
  } catch (error) {
    console.error("❌ [reportCompanyPost] Caught error:", error);
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      console.error("❌ CORS Error or Network Error:", error);
      throw new Error("Cannot connect to server. Please check your internet connection.");
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error while reporting post");
  }
};

/**
 * Fetch matched portfolios for a company job post
 * Returns portfolios that match the job requirements based on skills, categories, etc.
 * @param postId - The ID of the company post
 * @param page - Page number for pagination (default: 1)
 * @param pageSize - Number of results per page (default: 20)
 * @param accessToken - Optional access token for authenticated requests
 */
export const fetchMatchedPortfolios = async (
  postId: number,
  page: number = 1,
  pageSize: number = 20,
  accessToken?: string
): Promise<MatchedPortfoliosResponse> => {
  try {
    console.log("📡 [fetchMatchedPortfolios] Starting for postId:", postId, "page:", page, "pageSize:", pageSize);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.warn("⏱️ Fetch matched portfolios timeout after 30 seconds");
      controller.abort();
    }, 30000);

    // Build query parameters
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("pageSize", pageSize.toString());

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add authorization header if token is provided
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const fullUrl = buildApiUrl(API_BASE_URLS.company, `/company-posts/${postId}/match-portfolios`) + `?${params.toString()}`;
    console.log("📡 Making request to:", fullUrl);

    const response = await fetch(fullUrl, {
      method: "GET",
      headers: headers,
      signal: controller.signal,
      credentials: "include",
    });

    clearTimeout(timeoutId);

    console.log("📡 Matched portfolios API response status:", response.status);
    console.log("📡 Response content-type:", response.headers.get("content-type"));

    const contentType = response.headers.get("content-type");
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

    // Check response status first
    if (!response.ok) {
      console.error("❌ API returned error status:", response.status);
      // Try to parse error message from response body
      if (contentType?.includes("application/json") && responseText) {
        try {
          const errorData = JSON.parse(responseText);
          throw new Error(errorData.message || `HTTP ${response.status}`);
        } catch (e) {
          if (e instanceof Error) throw e;
          throw new Error(`HTTP ${response.status}`);
        }
      }
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }

    // Parse successful response
    if (contentType?.includes("application/json") && responseText) {
      try {
        data = JSON.parse(responseText);
        console.log("📦 Matched portfolios response data:", data);
      } catch (parseError) {
        console.error("❌ JSON parse error:", parseError);
        throw new Error("Invalid response format from server (JSON parse failed)");
      }
    } else if (responseText && responseText.trim().length > 0) {
      console.warn("⚠️ Response has body but not JSON, treating as error");
      throw new Error("Server returned non-JSON response");
    } else {
      console.warn("⚠️ Response has empty body");
      throw new Error("Empty response from server");
    }

    // Validate response structure - should have items, total, page, pageSize
    if (
      !data ||
      typeof data !== "object" ||
      !Array.isArray((data as Record<string, unknown>).items)
    ) {
      console.error("❌ Invalid response format:", data);
      throw new Error("Invalid response format from server");
    }

    console.log(
      "✅ Matched portfolios fetched successfully:",
      ((data as Record<string, unknown>).items as unknown[])?.length || 0,
      "portfolios"
    );
    return data as MatchedPortfoliosResponse;
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      console.error("❌ CORS Error or Network Error:", error);
      throw new Error("Cannot connect to server. Please check your internet connection.");
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error. Please check your internet connection.");
  }
};