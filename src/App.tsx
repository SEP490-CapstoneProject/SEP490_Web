import { Routes, Route, BrowserRouter } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Layouts & Common
import { WebLayout } from "./components/common/WebLayout";
import LoadingWrapper from "./components/Loading/LoadingWrapper";

// Services & Store
import { realtimeService } from "./services/realtimeService";
import { useAppSelector } from "./store/hook";
import { notify } from "./lib/toast";
import { useUserProfile } from "./hook/useUserProfile";
import { useTokenExpirationCheck } from "./hook/useTokenExpirationCheck";
import SubscriptionManagementPage from "./pages/subscription/SubscriptionManagementPage";


// --- CHUYỂN SANG LAZY LOAD CHO CÁC PAGES ---
const LoginPage = lazy(() => import("./pages/login/Login"));
const ProfilePage = lazy(() => import("./pages/profile/Profile"));
const RecruiterProfile = lazy(
  () => import("./pages/recruiter/profile/RecruiterProfile"),
);
const PortfolioManagement = lazy(
  () => import("./pages/portfolio/PortfolioManagement"),
);
const EmptyPortfolioPage = lazy(
  () => import("./pages/portfolio/EmptyPortfolio"),
);
const CreatePortfolio = lazy(() => import("./pages/portfolio/CreatePortfolio"));
const EditPortfolio = lazy(() => import("./pages/portfolio/EditPortfolio"));
const TalentHome = lazy(() => import("./pages/talent/TalentHome"));
const RecruiterHome = lazy(
  () => import("./pages/recruiter/home/RecruiterHome"),
);
const RecruitmentManagement = lazy(
  () => import("./pages/recruiter/recruitment/RecruitmentManagement"),
);
const CreateRecruitmentPost = lazy(
  () => import("./pages/recruiter/recruitment/CreateRecruitmentPost"),
);
const EditRecruitmentPost = lazy(
  () => import("./pages/recruiter/recruitment/EditRecruitmentPost"),
);

const RecruitmentDetails = lazy(
  () => import("./pages/recruiter/recruitment/RecruitmentDetails"),
);
const PostDetail = lazy(() =>
  import("./pages/talent/PostDetail").then((module) => ({
    default: module.PostDetail,
  })),
);
const ChatRoom = lazy(() => import("./pages/chat/ChatRoom"));
const ApplicationHistory = lazy(
  () => import("./pages/talent/ApplicationHistory"),
);
const ApplicationManagement = lazy(
  () => import("./pages/recruiter/application/ApplicationManagement"),
);
const CandidateManagement = lazy(
  () => import("./pages/recruiter/recruitment/CandidateManagement"),
);
const InterviewSchedule = lazy(
  () => import("./pages/recruiter/recruitment/InterviewSchedule"),
);
const CommunityPost = lazy(() => import("./pages/community/CommunityPost"));
const CommunityPostDetail = lazy(
  () => import("./pages/community/CommunityPostDetail"),
);
const PortfolioViewPage = lazy(
  () => import("./components/portfolio/view/PortfolioViewPage"),
);
const PreviewPortfolio = lazy(
  () => import("./pages/portfolio/PreviewPortfolio"),
);
const CreatePreview = lazy(
  () => import("./pages/portfolio/CreatePreview"),
);
const NotificationsPage = lazy(
  () => import("./pages/notification/NotificationsPage"),
);
const MyCommunityPost = lazy(() => import("./pages/community/MyCommunityPost"));
const MySavePost = lazy(() => import("./pages/community/save/TalentSavePost"));
const CompanySavePost = lazy(
  () => import("./pages/community/save/CompanySavePost"),
);
const TalentSavePost = lazy(
  () => import("./pages/community/save/TalentSavePost"),
);
const ErrorPage = lazy(() => import("./pages/ErrorPage"));
const LandingPage = lazy(() => import("./pages/LandingPage"));
const SetupTalentProfile = lazy(
  () => import("./pages/login/SetupTalentProfile"),
);
const SetupCompanyProfile = lazy(
  () => import("./pages/login/SetupCompanyProfile"),
);
const SupportCenterPage = lazy(() => import("./pages/SupportCenterPage"));
const PrivacyCenterPage = lazy(() => import("./pages/PrivacyCenterPage"));
const TermsPolicyPage = lazy(() => import("./pages/TermsPolicyPage"));
const OtherTalentProfilePage = lazy(
  () => import("./pages/profile/otherProfile/OtherTalentProfile"),
);
const OtherCompanyProfilePage = lazy(
  () => import("./pages/profile/otherProfile/OtherCompanyProfile"),
);
const PortfolioRanking = lazy(() => import("./pages/ranking/PortfolioRanking"));
const SubscriptionPage = lazy(
  () => import("./pages/subscription/SubscriptionPage"),
);
const PaymentSuccessPage = lazy(
  () => import("./pages/payment/PaymentSuccessPage"),
);
const PaymentCancelPage = lazy(
  () => import("./pages/payment/PaymentCancelPage"),
);

const ChallengeManagementPage = lazy(
  () => import("./pages/challenge/ChallengeManagement"),
);
const ChallengeTalentPage = lazy(
  () => import("./pages/challenge/ChallengeTalent"),
);
const ChallengeDetailTalentPage = lazy(
  () => import("./pages/challenge/ChallengeDetailTalent"),
);
const ChallengeDetailRecruiterPage = lazy(
  () => import("./pages/challenge/ChallengeDetailRecruiter"),
);
const SubmissionDetailsPage = lazy(
  () => import("./pages/challenge/SubmissionDetails"),
);
const SponsoredPosts = lazy(
  () => import ("./pages/sponsoredPosts/SponsoredPost")
)
function AppContent() {
  const { accessToken } = useAppSelector((state) => state.auth);
  const profile = useUserProfile(); // Custom hook để lấy thông tin profile người dùng từ Redux store

  // Hook để kiểm tra token expiration - INSIDE Router context
  useTokenExpirationCheck();

  useEffect(() => {
    if (!accessToken) {
      realtimeService.stop();
      return;
    }

    // 1. Khởi tạo và bắt đầu kết nối
    realtimeService.initConnection(accessToken);
    realtimeService.start();

    // 2. Định nghĩa hàm xử lý thông báo Realtime
    const handleGlobalNotification = (e: Event) => {
      const event = (e as CustomEvent).detail;
      console.log("🔔 Received realtime notification event:", event);

      if (Number(event.actorId) !== profile?.user?.id) {
        let toastMsg = "";
        switch (event.type) {
          case "comment":
            toastMsg = ` ${event.actorName} đã bình luận bài viết của bạn`;
            break;
          case "like":
            toastMsg = ` ${event.actorName} đã thích bài viết của bạn`;
            break;
          case "reply":
            toastMsg = ` ${event.actorName} đã phản hồi bình luận của bạn`;
            break;
          default:
            toastMsg = ` ${event.content}`;
        }

        // Hiển thị Toast thông báo
        notify.info(toastMsg);

        // (Tùy chọn) Nếu bạn muốn cập nhật badge số lượng thông báo chưa đọc ở Header,
        // bạn có thể dispatch một action Redux ở đây.
      }
    };

    // 3. Đăng ký lắng nghe sự kiện từ window
    window.addEventListener("realtime-notification", handleGlobalNotification);

    // 4. Cleanup function: Xóa listener và stop connection khi logout hoặc unmount
    return () => {
      window.removeEventListener(
        "realtime-notification",
        handleGlobalNotification,
      );
      realtimeService.stop();
    };
  }, [accessToken, profile?.user?.id]); // Thêm profile.id để logic check "chính mình" chính xác

  return (
    <Suspense fallback={<LoadingWrapper />}>
      {/* Sử dụng Suspense bao bọc toàn bộ Routes. 
        Khi chuyển trang, LoadingWrapper sẽ hiển thị trong lúc tải file JS của trang đó.
      */}
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<WebLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="talent-home" element={<TalentHome />} />
          <Route path="recruiter-home" element={<RecruiterHome />} />
          <Route path="/job/:postId" element={<PostDetail />} />
          <Route path="/payment/result" element={<PaymentSuccessPage />} />
          <Route path="/payment/cancel" element={<PaymentCancelPage />} />
          <Route path="/chat" element={<ChatRoom />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/ranking" element={<PortfolioRanking />} />
          <Route path="/subscription" element={<SubscriptionPage />} />
          <Route path="/subscription-history" element={<SubscriptionManagementPage />} />
          <Route path="/profile/:userId" element={<OtherTalentProfilePage />} />
          <Route
            path="/recruiter-profile/:userId"
            element={<OtherCompanyProfilePage />}
          />
          <Route path="/application-history" element={<ApplicationHistory />} />
          <Route
            path="/application-management"
            element={<ApplicationManagement />}
          />
          <Route path="/recruiter-profile" element={<RecruiterProfile />} />
          <Route
            path="/candicate-management"
            element={<CandidateManagement />}
          />
          <Route
          path ="/sponsored-posts"
          element={<SponsoredPosts />}
          />
          <Route path="/interview-schedule" element={<InterviewSchedule />} />
          <Route path="/company-saved" element={<CompanySavePost />} />
          <Route path="/talent-saved" element={<TalentSavePost />} />

          <Route
            path="/setup-talent-profile"
            element={<SetupTalentProfile />}
          />
          <Route
            path="/setup-company-profile"
            element={<SetupCompanyProfile />}
          />
          <Route
            path="/recruitment-management"
            element={<RecruitmentManagement />}
          />
          <Route
            path="/recruitment-management/create"
            element={<CreateRecruitmentPost />}
          />
          <Route
            path="/recruitment-management/edit/:postId"
            element={<EditRecruitmentPost />}
          />

          <Route
            path="/recruitment-management/:postId"
            element={<RecruitmentDetails />}
          />
          <Route
            path="/challenge-management"
            element={<ChallengeManagementPage />}
          />
          <Route
            path="/challenge/:challengeId"
            element={<ChallengeDetailRecruiterPage />}
          />
          <Route
            path="/submission/:submissionId"
            element={<SubmissionDetailsPage />}
          />
          <Route
            path="/talent-challenge"
            element={<ChallengeTalentPage />}
          />
          <Route
            path="/talent-challenge/:id"
            element={<ChallengeDetailTalentPage />}
          />
          <Route
            path="/portfolioManagement"
            element={<PortfolioManagement />}
          />
          <Route path="/portfolio/create" element={<CreatePortfolio />} />
          <Route path="/portfolio/:id/edit" element={<EditPortfolio />} />
          <Route path="/portfolio/:portfolioId/preview" element={<PreviewPortfolio />} />
          <Route path="/portfolio/:portfolioId/create-preview" element={<CreatePreview />} />
          <Route path="/emptyPortfolio" element={<EmptyPortfolioPage />} />
          <Route path="/community" element={<CommunityPost />} />
          <Route path="/community/:id" element={<CommunityPostDetail />} />
          <Route path="/portfolio/:id" element={<PortfolioViewPage />} />
          <Route path="/notification" element={<NotificationsPage />} />
          <Route path="/my-community-posts" element={<MyCommunityPost />} />
          <Route path="/my-save-posts" element={<MySavePost />} />
          <Route path="/support-center" element={<SupportCenterPage />} />
          <Route path="/privacy-center" element={<PrivacyCenterPage />} />
          <Route path="/terms-policy" element={<TermsPolicyPage />} />
        </Route>

        <Route path="*" element={<ErrorPage />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        style={{ top: "85px" }}
        theme="light"
      />
    </Suspense>
  );
}

/**
 * Main App component - Creates BrowserRouter wrapper
 */
function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
