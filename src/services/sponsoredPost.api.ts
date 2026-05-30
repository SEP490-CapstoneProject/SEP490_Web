import { API_BASE_URLS, buildApiUrl } from "@/config/apiConfig";
import type {
  PointBalanceDto,
  PointTransactionDto,
  SponsoredPostDto,
  CreateSponsoredPostRequest,
} from "@/types/sponsoredPost";

/**
 * Helper: get auth token from storage (adjust key to match your project)
 */
const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem("accessToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Helper: parse response and throw on non-OK status
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return undefined as T;
  }
  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText);
    throw new Error(`API Error ${response.status}: ${errorText}`);
  }
  return response.json() as Promise<T>;
}

/**
 * Base URL for all points/sponsored-post endpoints
 * Maps to: https://portfolio-service.redmushroom-1d023c6a.southeastasia.azurecontainerapps.io/api
 */
const BASE = API_BASE_URLS.portfolio;

export const pointsApi = {
  // Get current user's point balance
  getBalance: async (): Promise<PointBalanceDto> => {
    const response = await fetch(buildApiUrl(BASE, "/points/balance"), {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse<PointBalanceDto>(response);
  },

  // Get transaction history
  getTransactions: async (): Promise<PointTransactionDto[]> => {
    const response = await fetch(buildApiUrl(BASE, "/points/transactions"), {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse<PointTransactionDto[]>(response);
  },

  // Create new sponsored post
  createSponsoredPost: async (
    data: CreateSponsoredPostRequest
  ): Promise<SponsoredPostDto> => {
    const requestData: CreateSponsoredPostRequest = {
      ...data,
      // Transform contentType to lowercase for API (Text -> text, Image -> image, Video -> video)
      contentType: data.contentType.toLowerCase(),
    };
    const response = await fetch(
      buildApiUrl(BASE, "/points/sponsored-posts"),
      {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
      }
    );
    return handleResponse<SponsoredPostDto>(response);
  },

  // Get all sponsored posts (might be admin only)
  getAllSponsoredPosts: async (): Promise<SponsoredPostDto[]> => {
    const response = await fetch(
      buildApiUrl(BASE, "/points/sponsored-posts"),
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );
    return handleResponse<SponsoredPostDto[]>(response);
  },

  // Get current user's sponsored posts
  getMySponsoredPosts: async (): Promise<SponsoredPostDto[]> => {
    const response = await fetch(
      buildApiUrl(BASE, "/points/sponsored-posts/my"),
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );
    return handleResponse<SponsoredPostDto[]>(response);
  },

  // Get single sponsored post by ID
  getSponsoredPost: async (postId: number): Promise<SponsoredPostDto> => {
    const response = await fetch(
      buildApiUrl(BASE, `/points/sponsored-posts/${postId}`),
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );
    return handleResponse<SponsoredPostDto>(response);
  },

  // Delete sponsored post
  deleteSponsoredPost: async (postId: number): Promise<void> => {
    const response = await fetch(
      buildApiUrl(BASE, `/points/sponsored-posts/${postId}`),
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      }
    );
    return handleResponse<void>(response);
  },

  // Pause sponsored post (returns 204 No Content)
  pauseSponsoredPost: async (postId: number): Promise<void> => {
    const response = await fetch(
      buildApiUrl(BASE, `/points/sponsored-posts/${postId}/pause`),
      {
        method: "PATCH",
        headers: getAuthHeaders(),
      }
    );
    return handleResponse<void>(response);
  },

  // Resume sponsored post (returns 204 No Content)
  resumeSponsoredPost: async (postId: number): Promise<void> => {
    const response = await fetch(
      buildApiUrl(BASE, `/points/sponsored-posts/${postId}/resume`),
      {
        method: "PATCH",
        headers: getAuthHeaders(),
      }
    );
    return handleResponse<void>(response);
  },

  // Track view (for analytics)
  trackView: async (postId: number): Promise<void> => {
    const response = await fetch(
      buildApiUrl(BASE, `/points/sponsored-posts/${postId}/view`),
      {
        method: "POST",
        headers: getAuthHeaders(),
      }
    );
    return handleResponse<void>(response);
  },

  // Track click (for analytics)
  trackClick: async (postId: number): Promise<void> => {
    const response = await fetch(
      buildApiUrl(BASE, `/points/sponsored-posts/${postId}/click`),
      {
        method: "POST",
        headers: getAuthHeaders(),
      }
    );
    return handleResponse<void>(response);
  },
};