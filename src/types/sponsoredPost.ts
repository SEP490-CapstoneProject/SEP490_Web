export interface PointBalanceDto {
  userId: number;
  currentBalance: number; // decimal from API (25.00)
  todayEarned: number; // integer from API
  totalEarned: number; // decimal from API (30.00)
  totalSpent: number; // decimal from API (5.00)
  lastTransactionAt: string | null; // "2026-05-29T05:15:58.3556249" or null
}

export interface PointTransactionDto {
  id: number;
  userId: number;
  points: number;
  type: 'Earn' | 'Spend';
  sourceType: string;
  sourceId: string;
  description: string | null;
  createdAt: string;
}

export interface SponsoredPostDto {
  id: number;
  createdBy: number;
  contentType: 'Text' | 'Image' | 'Video';
  textContent: string | null;
  imageUrl: string | null;
  videoUrl: string | null;
  pointsSpent: number;
  durationDays: number;
  startDate: string;
  expiryDate: string;
  status: 'Active' | 'Paused' | 'Expired';
  clickThroughUrl: string | null;
  viewCount: number;
  clickCount: number;
  createdAt: string;
  updatedAt: string | null;
}

// Request type for creating sponsored post
// Note: API expects lowercase contentType ("text", "image", "video")
export interface CreateSponsoredPostRequest {
  contentType: string; // lowercase: "text", "image", "video"
  textContent: string | null;
  imageUrl: string | null;
  videoUrl: string | null;
  pointsToSpend: number;
  clickThroughUrl: string | null;
}