export interface CompanyPost {
  postId: number;
  companyId: number;
  companyName: string;
  companyAvatar: string;
  mediaUrl: string;
  position: string;
  address: string;
  salary: string;
  employmentType: string; 
  experienceYear: number;
  quantity: number;
  jobDescription: string;
  requirementsMandatory: string;
  requirementsPreferred: string;
  benefits: string;
  createAt: Date;
  status: number;
}

/**
 * Company Post from API response
 * This is the actual structure returned from the backend API
 */
export interface CompanyPostAPI {
  postId: number;
  position: string;
  companyName: string;
  companyAvatar: string | null;
  coverImageUrl: string | null;
  mediaType: "image" | "video";
  mediaUrl: string;
  address: string;
  salary: string;
  employmentType: string;
  createdAt?: string;
  isSaved: boolean;
}

/**
 * Pagination info from API response
 */
export interface CompanyPostsPaginatedResponse {
  items: CompanyPostAPI[];
  nextCursor: string | null;
  hasMore: boolean;
}

/**
 * Media item in company post detail
 */
export interface PostMedia {
  type: "image" | "video";
  url: string;
}

/**
 * Company Post Detail from API response for detail page
 * This is the actual structure returned from /api/company-posts/{id}
 */
export interface CompanyPostDetail {
  postId: number;
  companyId: number;
  position: string;
  companyName: string;
  companyAvatar: string | null;
  coverImageUrl: string | null;
  address: string;
  salary: string;
  employmentType: string;
  experienceYear: number | null;
  quantity: number | null;
  jobDescription: string | null;
  requirementsMandatory: string | null;
  requirementsPreferred: string | null;
  benefits: string | null;
  createdAt: string;
  status: number;
  media: PostMedia[];
  isSaved: boolean;
}

/**
 * Search Company Posts response with pagination
 * Used for /api/company-posts/search endpoint
 */
export interface SearchCompanyPostsResponse {
  items: CompanyPostAPI[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Search parameters for company posts
 */
export interface SearchCompanyPostsParams {
  position?: string;
  salary?: string;
  location?: string;
  type?: string; // Full-time or Part-time
  page?: number;
  pageSize?: number;
}
