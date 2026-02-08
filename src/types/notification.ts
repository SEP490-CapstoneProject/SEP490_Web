export type NotificationType =
  | "CONNECTION_ACCEPTED"
  | "CONNECTION_REJECTED"
  | "PROFILE_VIEWED"
  | "JOB_INVITATION"
  | "PORTFOLIO_APPROVED"
  | "SYSTEM_ANNOUNCEMENT"
  | "COMMUNITY_POST_REPORTED"
  | "PORTFOLIO_REPORTED"
  | "POST_LIKED"
  | "POST_COMMENTED"
  | "POST_COMMENT_REPLIED"
  | "POST_SHARED"
  | "POST_MENTIONED";
// export type UserNotification = {
//   id: number;
//   userId: number;
//   title: string;
//   content: string;
//   type: NotificationType;
//   objectId?: number;
//   createdAt: string;
//   isRead: boolean;


//   actor?: NotificationActor;
//   company?: NotificationCompany;
// };
