export interface CommunityPost {
  id: number;
  author: {
    id: number;
    name: string;
    avatar: string;
    role: "COMPANY" | "USER";
  };
  description?: string;
  media?: string[];
  portfolioId?: number;
  portfolioPreview?: {
    type: string;
    variant: string;
    data: any;
  };
  favoriteCount: number;
  commentCount: number;
  isFavorited: boolean;
  isSaved: boolean;
  createdAt: string;
}
