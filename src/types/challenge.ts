export interface ChallengeVersion {
  id: string;
  versionNumber: number;
  difficultyScore: number;
  difficultyLabel: "Easy" | "Medium" | "Hard";
  skillWeights?: Record<string, number>;
  criteria: ChallengeCriteria[];
  createdAt: string;
}

export interface ChallengeCriteria {
  id: string;
  name: string;
  description: string;
  maxScore: number;
  displayOrder: number;
}

export interface Challenge {
  id: string;
  title: string;
  description?: string;
  expectedSolution?: string;
  status?: "Draft" | "PendingReview"|"Published" | "Rejected" | "Expired";
  createdAt: string;
  createdById?: number;
  reviewedById?: number | null;
  deadline: string;
  publishedAt?: string | null;
  currentVersionId?: string | null;
  updatedAt?: string;
  difficultyScore?: number;
  difficultyLabel?: "Easy" | "Medium" | "Hard";
  activeVersion?: ChallengeVersion;
  startDate?: string;
  endDate?: string;
}

export interface ChallengeSubmission {
  id: number;
  challengeId: number;
  userId: number;
  status: string;
  overallScore?: number;
  aiFeedback?: string;
  createdAt: string;
  gradedAt?: string;
}

export interface ChallengeSubmissionDetail {
  id: string;
  challengeId: string;
  userId: number;
  userName: string;
  userEmail: string;
  userAvatar: string;
  submissionStatus: string;
  submittedAt: string;
  submissionContent: string;
  gitHubLink: string;
  evaluationScore: number;
  evaluationStatus: string;
  evaluatedAt: string;
  feedback: string;
  attemptCount: number;
}

export interface SubmissionsResponse {
  items: ChallengeSubmissionDetail[];
}

export interface SubmissionDetailResponse {
  id: string;
  challengeId: string;
  userId: number;
  status: string;
  overallScore: number;
  aiFeedback: string;
  createdAt: string;
  gradedAt: string;
}

export interface CreateChallengePayload {
  title: string;
  description?: string;
  expectedSolution?: string;
  deadline: string; // ISO 8601 format
}

export interface UpdateChallengePayload extends CreateChallengePayload {
  id: string;
}

export interface CreatorChallengesResponse {
  items: Challenge[];
  totalCount: number;
  skip: number;
  take: number;
}

export interface ChallengePaginatedResponse {
  data: Challenge[];
  total: number;
  hasMore: boolean;
  cursor?: string;
}
 
export interface CreateSubmissionPayload {
  content: string;
  githubUrl: string;
}

export interface MyChallengeSubmissionsResponse {
  items: MyChallengeSubmission[];
  totalCount: number;
  skip: number;
  take: number;
}

export interface MyChallengeSubmission {
  id: string;
  challengeId: string;
  challengeTitle: string;
  submissionStatus: string;
  submittedAt: string;
  submissionContent: string;
  gitHubLink: string;
  evaluationScore: number;
  evaluationStatus: string;
  evaluatedAt: string;
  feedback: string;
  attemptCount: number;
}

export interface PointTransaction {
  transactionId: string;
  points: number;
  reason: string;
  attemptCount: number;
  sourceType: string;
  sourceId: string;
  createdAt: string;
}

export interface SkillHistory {
  skillId: string;
  skillName: string;
  totalPoints: number;
  masteryScore: number;
  verificationLevel: number;
  challengeCount: number;
  lastVerifiedAt: string;
  firstVerifiedAt: string;
  pointTransactions: PointTransaction[];
}