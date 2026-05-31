import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_REWARDSHOP_API_BASE_URL ??
  "https://portfolio-service.redmushroom-1d023c6a.southeastasia.azurecontainerapps.io";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const authConfig = (accessToken?: string | null) =>
  accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : undefined;

export interface PointBalanceDto {
  userId: number;
  currentBalance: number;
  todayEarned: number;
  totalEarned: number;
  totalSpent: number;
  lastTransactionAt: string | null;
}

export interface PointTransactionDto {
  id: number;
  userId: number;
  points: number;
  type: "Earn" | "Spend";
  sourceType: string;
  sourceId: string;
  description: string | null;
  createdAt: string;
}

export interface SponsoredPostDto {
  id: number;
  createdBy: number;
  contentType: "Text" | "Image" | "Video";
  textContent: string | null;
  imageUrl: string | null;
  videoUrl: string | null;
  pointsSpent: number;
  durationDays: number;
  startDate: string;
  expiryDate: string;
  status: "Active" | "Paused" | "Expired";
  clickThroughUrl: string | null;
  viewCount: number;
  clickCount: number;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateSponsoredPostRequest {
  contentType: string;
  textContent: string | null;
  imageUrl: string | null;
  videoUrl: string | null;
  pointsToSpend: number;
  clickThroughUrl: string | null;
}

export const pointsApi = {
  getBalance: async (accessToken?: string | null): Promise<PointBalanceDto> => {
    const response = await apiClient.get<PointBalanceDto>(
      "/api/points/balance",
      authConfig(accessToken),
    );
    return response.data;
  },

  getTransactions: async (
    accessToken?: string | null,
  ): Promise<PointTransactionDto[]> => {
    const response = await apiClient.get<PointTransactionDto[]>(
      "/api/points/transactions",
      authConfig(accessToken),
    );
    return response.data;
  },

  createSponsoredPost: async (
    data: CreateSponsoredPostRequest,
    accessToken?: string | null,
  ): Promise<SponsoredPostDto> => {
    const response = await apiClient.post<SponsoredPostDto>(
      "/api/points/sponsored-posts",
      {
        ...data,
        contentType: data.contentType.toLowerCase(),
      },
      authConfig(accessToken),
    );
    return response.data;
  },

  getAllSponsoredPosts: async (
    accessToken?: string | null,
  ): Promise<SponsoredPostDto[]> => {
    const response = await apiClient.get<SponsoredPostDto[]>(
      "/api/points/sponsored-posts",
      authConfig(accessToken),
    );
    return response.data;
  },

  getMySponsoredPosts: async (
    accessToken?: string | null,
  ): Promise<SponsoredPostDto[]> => {
    const response = await apiClient.get<SponsoredPostDto[]>(
      "/api/points/sponsored-posts/my",
      authConfig(accessToken),
    );
    return response.data;
  },

  getSponsoredPost: async (
    postId: number,
    accessToken?: string | null,
  ): Promise<SponsoredPostDto> => {
    const response = await apiClient.get<SponsoredPostDto>(
      `/api/points/sponsored-posts/${postId}`,
      authConfig(accessToken),
    );
    return response.data;
  },

  deleteSponsoredPost: async (
    postId: number,
    accessToken?: string | null,
  ): Promise<void> => {
    await apiClient.delete(
      `/api/points/sponsored-posts/${postId}`,
      authConfig(accessToken),
    );
  },

  pauseSponsoredPost: async (
    postId: number,
    accessToken?: string | null,
  ): Promise<void> => {
    await apiClient.patch(
      `/api/points/sponsored-posts/${postId}/pause`,
      undefined,
      authConfig(accessToken),
    );
  },

  resumeSponsoredPost: async (
    postId: number,
    accessToken?: string | null,
  ): Promise<void> => {
    await apiClient.patch(
      `/api/points/sponsored-posts/${postId}/resume`,
      undefined,
      authConfig(accessToken),
    );
  },

  trackView: async (postId: number, accessToken?: string | null): Promise<void> => {
    await apiClient.post(
      `/api/points/sponsored-posts/${postId}/view`,
      undefined,
      authConfig(accessToken),
    );
  },

  trackClick: async (
    postId: number,
    accessToken?: string | null,
  ): Promise<void> => {
    await apiClient.post(
      `/api/points/sponsored-posts/${postId}/click`,
      undefined,
      authConfig(accessToken),
    );
  },
};

export default apiClient;
