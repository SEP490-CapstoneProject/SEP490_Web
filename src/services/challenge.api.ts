import {
  Challenge,
  ChallengePaginatedResponse,
  CreateChallengePayload,
  CreatorChallengesResponse,
  ChallengeSubmission,
  CreateSubmissionPayload,
  SubmissionsResponse,
  SubmissionDetailResponse,
  MyChallengeSubmissionsResponse,
  SkillHistory
} from "@/types/challenge";
import { API_BASE_URLS, API_ENDPOINTS, buildApiUrl } from "@/config/apiConfig";

/**
 * Challenge API Service
 * Handles challenge operations for company users
 * Uses real API calls to the Challenge Service
 */

/**
 * Build authorization header with Bearer token
 */
const getAuthHeader = (accessToken: string) => ({
  Authorization: `Bearer ${accessToken}`,
  "Content-Type": "application/json",
});

/**
 * Fetch creator's challenges (for challenge management page)
 */
export const fetchCreatorChallenges = async (
  skip: number = 0,
  take: number = 20,
  accessToken?: string,
): Promise<CreatorChallengesResponse> => {
  try {
    console.log(
      "📡 [fetchCreatorChallenges] Fetching creator challenges from API",
    );

    const url = buildApiUrl(
      API_BASE_URLS.challenge,
      API_ENDPOINTS.challenge.creatorList,
    );
    const queryParams = new URLSearchParams({
      skip: skip.toString(),
      take: take.toString(),
    });

    console.log(
      "🔗 [fetchCreatorChallenges] Full URL:",
      `${url}?${queryParams}`,
    );
    console.log("🔐 [fetchCreatorChallenges] Token exists:", !!accessToken);

    const response = await fetch(`${url}?${queryParams}`, {
      method: "GET",
      headers: accessToken
        ? getAuthHeader(accessToken)
        : { "Content-Type": "application/json" },
    });

    console.log(
      "📊 [fetchCreatorChallenges] Response status:",
      response.status,
      response.statusText,
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.log("❌ [fetchCreatorChallenges] Error response:", error);
      throw new Error(
        error.message ||
          `Failed to fetch creator challenges: ${response.statusText}`,
      );
    }

    const data = await response.json();
    console.log("✅ [fetchCreatorChallenges] Success:", data);
    return data;
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to fetch creator challenges";
    console.error("❌ [fetchCreatorChallenges] Error:", errorMessage);
    throw error;
  }
};

/**
 * Fetch challenges with optional pagination
 */
export const fetchChallengesByCompanyId = async (
  cursor?: string,
  limit: number = 10,
  accessToken?: string,
): Promise<ChallengePaginatedResponse> => {
  try {
    console.log("📡 [fetchChallengesByCompanyId] Fetching challenges from API");

    const url = buildApiUrl(
      API_BASE_URLS.challenge,
      API_ENDPOINTS.challenge.list,
    );
    const queryParams = new URLSearchParams({
      limit: limit.toString(),
      ...(cursor && { cursor }),
    });

    const response = await fetch(`${url}?${queryParams}`, {
      method: "GET",
      headers: accessToken
        ? getAuthHeader(accessToken)
        : { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.message || `Failed to fetch challenges: ${response.statusText}`,
      );
    }

    const data = await response.json();
    console.log("✅ [fetchChallengesByCompanyId] Success");
    return data;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch challenges";
    console.error("❌ [fetchChallengesByCompanyId] Error:", errorMessage);
    throw error;
  }
};

/**
 * Get challenge details by ID
 */
export const getChallengeDetail = async (
  challengeId: string | number,
  accessToken?: string,
): Promise<Challenge> => {
  try {
    console.log("📡 [getChallengeDetail] Fetching challenge:", challengeId);

    const url = buildApiUrl(
      API_BASE_URLS.challenge,
      API_ENDPOINTS.challenge.detail(String(challengeId)),
    );

    console.log("🔗 [getChallengeDetail] Full URL:", url);
    console.log("🔐 [getChallengeDetail] Token exists:", !!accessToken);

    const response = await fetch(url, {
      method: "GET",
      headers: accessToken
        ? getAuthHeader(accessToken)
        : { "Content-Type": "application/json" },
    });

    console.log(
      "📊 [getChallengeDetail] Response status:",
      response.status,
      response.statusText,
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.log("❌ [getChallengeDetail] Error response:", error);
      throw new Error(
        error.message || `Failed to fetch challenge: ${response.statusText}`,
      );
    }

    const data = await response.json();
    console.log("✅ [getChallengeDetail] Success:", data);
    return data;
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to fetch challenge detail";
    console.error("❌ [getChallengeDetail] Error:", errorMessage);
    throw error;
  }
};

/**
 * Create a new challenge
 */
export const createChallenge = async (
  payload: CreateChallengePayload,
  accessToken: string,
): Promise<Challenge> => {
  try {
    console.log("📡 [createChallenge] Creating challenge:", payload);

    const url = buildApiUrl(
      API_BASE_URLS.challenge,
      API_ENDPOINTS.challenge.create,
    );
    console.log("🔗 [createChallenge] Full URL:", url);
    console.log(
      "📦 [createChallenge] Payload:",
      JSON.stringify(payload, null, 2),
    );
    console.log("🔐 [createChallenge] Token exists:", !!accessToken);

    const response = await fetch(url, {
      method: "POST",
      headers: getAuthHeader(accessToken),
      body: JSON.stringify(payload),
    });

    console.log(
      "📊 [createChallenge] Response status:",
      response.status,
      response.statusText,
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.log("❌ [createChallenge] Error response:", error);
      throw new Error(
        error.message || `Failed to create challenge: ${response.statusText}`,
      );
    }

    const data = await response.json();
    console.log("✅ [createChallenge] Success:", data);
    return data;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create challenge";
    console.error("❌ [createChallenge] Error:", errorMessage);
    throw error;
  }
};

/**
 * Update a challenge
 */
export const updateChallenge = async (
  challengeId: string | number,
  payload: CreateChallengePayload,
  accessToken: string,
): Promise<Challenge> => {
  try {
    console.log("📡 [updateChallenge] Updating challenge:", challengeId);

    const url = buildApiUrl(
      API_BASE_URLS.challenge,
      API_ENDPOINTS.challenge.update(String(challengeId)),
    );

    console.log("🔗 [updateChallenge] Full URL:", url);
    console.log("📦 [updateChallenge] Payload:", JSON.stringify(payload, null, 2));
    console.log("🔐 [updateChallenge] Token exists:", !!accessToken);
    console.log("📋 [updateChallenge] Headers:", {
      Authorization: `Bearer ${accessToken?.slice(0, 20)}...`,
      "Content-Type": "application/json",
    });

    const response = await fetch(url, {
      method: "PUT",
      headers: getAuthHeader(accessToken),
      body: JSON.stringify(payload),
    });

    console.log("📊 [updateChallenge] Response status:", response.status, response.statusText);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.log("❌ [updateChallenge] Error response:", error);
      throw new Error(
        error.message || `Failed to update challenge: ${response.statusText}`,
      );
    }

    const data = await response.json();
    console.log("✅ [updateChallenge] Success:", data);
    return data;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update challenge";
    console.error("❌ [updateChallenge] Error:", errorMessage);
    throw error;
  }
};

/**
 * Delete a challenge
 */
export const deleteChallenge = async (
  challengeId: string | number,
  accessToken: string,
): Promise<void> => {
  try {
    console.log("📡 [deleteChallenge] Deleting challenge:", challengeId);

    const url = buildApiUrl(
      API_BASE_URLS.challenge,
      API_ENDPOINTS.challenge.delete(String(challengeId)),
    );

    const response = await fetch(url, {
      method: "DELETE",
      headers: getAuthHeader(accessToken),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.message || `Failed to delete challenge: ${response.statusText}`,
      );
    }

    console.log("✅ [deleteChallenge] Success");
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete challenge";
    console.error("❌ [deleteChallenge] Error:", errorMessage);
    throw error;
  }
};

/**
 * Fetch public challenges (ongoing challenges for talents to participate)
 */
export const fetchPublicChallenges = async (
  skip: number = 0,
  take: number = 20,
): Promise<CreatorChallengesResponse> => {
  try {
    console.log(
      "📡 [fetchPublicChallenges] Fetching public challenges from API",
    );

    const url = buildApiUrl(
      API_BASE_URLS.challenge,
      API_ENDPOINTS.challenge.publicList,
    );
    const queryParams = new URLSearchParams({
      skip: skip.toString(),
      take: take.toString(),
    });

    console.log(
      "🔗 [fetchPublicChallenges] Full URL:",
      `${url}?${queryParams}`,
    );

    const response = await fetch(`${url}?${queryParams}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    console.log(
      "📊 [fetchPublicChallenges] Response status:",
      response.status,
      response.statusText,
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.log("❌ [fetchPublicChallenges] Error response:", error);
      throw new Error(
        error.message ||
          `Failed to fetch public challenges: ${response.statusText}`,
      );
    }

    const data = await response.json();
    console.log("✅ [fetchPublicChallenges] Success:", data);
    return data;
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to fetch public challenges";
    console.error("❌ [fetchPublicChallenges] Error:", errorMessage);
    throw error;
  }
};

/**
 * Fetch public challenge detail by ID (no auth required)
 */
export const fetchPublicChallengeDetail = async (
  id: string | number,
  accessToken?: string,
): Promise<Challenge> => {
  try {
    console.log("📡 [fetchPublicChallengeDetail] Fetching challenge:", id);

    const url = buildApiUrl(
      API_BASE_URLS.challenge,
      API_ENDPOINTS.challenge.publicDetail(String(id)), // dùng endpoint public
    );

    console.log("🔗 [fetchPublicChallengeDetail] Full URL:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: accessToken
        ? getAuthHeader(accessToken)
        : { "Content-Type": "application/json" },
    });

    console.log("📊 [fetchPublicChallengeDetail] Status:", response.status);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.message || `Failed to fetch challenge: ${response.statusText}`,
      );
    }

    const data = await response.json();
    console.log("✅ [fetchPublicChallengeDetail] Success:", data);
    return data;
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to fetch challenge detail";
    console.error("❌ [fetchPublicChallengeDetail] Error:", errorMessage);
    throw error;
  }
};
/**
 * Submit a challenge for admin review
 * POST /api/challenges/{id}/submit-review
 */
export const submitChallengeForReview = async (
  challengeId: string,
  accessToken: string,
): Promise<Challenge> => {
  try {
    console.log(
      "📡 [submitChallengeForReview] Submitting challenge ID:",
      challengeId,
    );

    // Bạn hãy cấu hình endpoint này trong apiConfig nếu cần, dưới đây là fallback nối chuỗi URL trực tiếp
    const url = buildApiUrl(
      API_BASE_URLS.challenge,
      `${API_ENDPOINTS.challenge.list}/${challengeId}/submit-review`,
    );

    const response = await fetch(url, {
      method: "POST",
      headers: getAuthHeader(accessToken),
    });

    console.log(
      "📊 [submitChallengeForReview] Response status:",
      response.status,
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.message || `Gửi duyệt thất bại: ${response.statusText}`,
      );
    }

    const data = await response.json();
    console.log("✅ [submitChallengeForReview] Success:", data);
    return data;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Lỗi khi gửi duyệt thử thách";
    console.error("❌ [submitChallengeForReview] Error:", errorMessage);
    throw error;
  }
};

/**
 * Creator self-approve and publish challenge
 * POST /api/creator/challenges/{challengeId}/approve-and-publish
 */
export const approveAndPublishChallenge = async (
  challengeId: string,
  accessToken: string,
): Promise<Challenge> => {
  try {
    console.log(
      "📡 [approveAndPublishChallenge] Publishing challenge ID:",
      challengeId,
    );

    const url = buildApiUrl(
      API_BASE_URLS.challenge,
      `/api/creator/challenges/${challengeId}/approve-and-publish`,
    );

    const response = await fetch(url, {
      method: "POST",
      headers: getAuthHeader(accessToken),
    });

    console.log(
      "📊 [approveAndPublishChallenge] Response status:",
      response.status,
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.message || `Xuất bản thất bại: ${response.statusText}`,
      );
    }

    const data = await response.json();
    console.log("✅ [approveAndPublishChallenge] Success:", data);
    return data;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Lỗi khi xuất bản thử thách";
    console.error("❌ [approveAndPublishChallenge] Error:", errorMessage);
    throw error;
  }
};
export const createSubmission = async (
  challengeId: string,
  payload: CreateSubmissionPayload,
  accessToken: string,
): Promise<ChallengeSubmission> => {
  try {
    console.log(`📡 [createSubmission] Submitting for challenge ID: ${challengeId}`);

    // Sử dụng buildApiUrl của dự án hoặc nối chuỗi trực tiếp nếu chưa config ENDPOINTS
    // Ở đây mình build URL gốc kèm endpoint path chính xác của Swagger
    const baseUrl = buildApiUrl(
      API_BASE_URLS.challenge,
      API_ENDPOINTS.challenge.submissions,
    );

    // Thêm query parameter ?challengeId=... vào URL theo đúng Swagger UI
    const queryParams = new URLSearchParams({ challengeId });
    const url = `${baseUrl}?${queryParams}`;

    console.log("🔗 [createSubmission] Full URL:", url);
    console.log("📦 [createSubmission] Payload:", JSON.stringify(payload));

    const response = await fetch(url, {
      method: "POST",
      headers: getAuthHeader(accessToken),
      body: JSON.stringify(payload),
    });

    console.log("📊 [createSubmission] Response status:", response.status);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.log("❌ [createSubmission] Error response:", error);
      throw new Error(
        error.message || `Nộp bài thất bại: ${response.statusText}`,
      );
    }

    const data = await response.json();
    console.log("✅ [createSubmission] Success:", data);
    return data;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Lỗi khi nộp bài thử thách";
    console.error("❌ [createSubmission] Error:", errorMessage);
    throw error;
  }
};

/**
 * Get challenge submissions for creator
 * GET /api/creator/challenges/{challengeId}/submissions
 */
export const getChallengeSubmissions = async (
  challengeId: string,
  accessToken: string,
): Promise<SubmissionsResponse> => {
  try {
    console.log(
      "📡 [getChallengeSubmissions] Fetching submissions for challenge ID:",
      challengeId,
    );

    const url = buildApiUrl(
      API_BASE_URLS.challenge,
      `/api/creator/challenges/${challengeId}/submissions`,
    );

    console.log("🔗 [getChallengeSubmissions] Full URL:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeader(accessToken),
    });

    console.log(
      "📊 [getChallengeSubmissions] Response status:",
      response.status,
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.log("❌ [getChallengeSubmissions] Error response:", error);
      throw new Error(
        error.message || `Failed to fetch submissions: ${response.statusText}`,
      );
    }

    const data = await response.json();
    console.log("✅ [getChallengeSubmissions] Success:", data);
    return data;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Lỗi khi tải danh sách bài nộp";
    console.error("❌ [getChallengeSubmissions] Error:", errorMessage);
    throw error;
  }
};

/**
 * Get submission detail by ID
 * GET /api/submissions/{id}
 */
export const getSubmissionDetail = async (
  submissionId: string,
  accessToken: string,
): Promise<SubmissionDetailResponse> => {
  try {
    console.log("📡 [getSubmissionDetail] Fetching submission:", submissionId);

    const url = buildApiUrl(
      API_BASE_URLS.challenge,
      `/api/submissions/${submissionId}`,
    );

    console.log("🔗 [getSubmissionDetail] Full URL:", url);
    console.log("🔐 [getSubmissionDetail] Token exists:", !!accessToken);

    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeader(accessToken),
    });

    console.log(
      "📊 [getSubmissionDetail] Response status:",
      response.status,
      response.statusText,
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.log("❌ [getSubmissionDetail] Error response:", error);
      throw new Error(
        error.message || `Failed to fetch submission detail: ${response.statusText}`,
      );
    }

    const data = await response.json();
    console.log("✅ [getSubmissionDetail] Success:", data);
    return data;
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to fetch submission detail";
    console.error("❌ [getSubmissionDetail] Error:", errorMessage);
    throw error;
  }
};
/**
 * Get user's own submissions for a specific challenge
 * GET /api/challenges/{challengeId}/my-submissions
 */
export const getMyChallengeSubmissions = async (
  challengeId: string,
  skip: number = 0,
  take: number = 20,
  accessToken: string,
): Promise<MyChallengeSubmissionsResponse> => {
  try {
    console.log(
      `📡 [getMyChallengeSubmissions] Fetching my submissions for challenge ID: ${challengeId}`,
    );

    const url = buildApiUrl(
      API_BASE_URLS.challenge,
      `/api/challenges/${challengeId}/my-submissions`,
    );

    const queryParams = new URLSearchParams({
      skip: skip.toString(),
      take: take.toString(),
    });

    const fullUrl = `${url}?${queryParams}`;
    console.log("🔗 [getMyChallengeSubmissions] Full URL:", fullUrl);

    const response = await fetch(fullUrl, {
      method: "GET",
      headers: getAuthHeader(accessToken),
    });

    console.log(
      "📊 [getMyChallengeSubmissions] Response status:",
      response.status,
      response.statusText,
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.log("❌ [getMyChallengeSubmissions] Error response:", error);
      throw new Error(
        error.message ||
          `Failed to fetch my submissions: ${response.statusText}`,
      );
    }

    const data = await response.json();
    console.log("✅ [getMyChallengeSubmissions] Success:", {
      totalCount: data.totalCount,
      itemCount: data.items?.length || 0,
    });
    return data;
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Lỗi khi tải danh sách bài nộp của tôi";
    console.error("❌ [getMyChallengeSubmissions] Error:", errorMessage);
    throw error;
  }
};

/**
 * Get portfolio skills history by userId
 * GET /api/portfolio/skills/{userId}/history
 */
export const getPortfolioSkillsHistory = async (
  userId: string,
  accessToken: string,
): Promise<SkillHistory[]> => {
  try {
    console.log("📡 [getPortfolioSkillsHistory] Fetching skills history for userId:", userId);

    const url = buildApiUrl(
      API_BASE_URLS.challenge,
      API_ENDPOINTS.challenge.skillsHistory(userId),
    );

    console.log("🔗 [getPortfolioSkillsHistory] Full URL:", url);
    console.log("🔐 [getPortfolioSkillsHistory] Token exists:", !!accessToken);

    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeader(accessToken),
    });

    console.log(
      "📊 [getPortfolioSkillsHistory] Response status:",
      response.status,
      response.statusText,
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.log("❌ [getPortfolioSkillsHistory] Error response:", error);
      throw new Error(
        error.message || `Failed to fetch skills history: ${response.statusText}`,
      );
    }

    const data: SkillHistory[] = await response.json();
    console.log("✅ [getPortfolioSkillsHistory] Success:", {
      skillCount: data?.length || 0,
    });
    return data;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch skills history";
    console.error("❌ [getPortfolioSkillsHistory] Error:", errorMessage);
    throw error;
  }
};