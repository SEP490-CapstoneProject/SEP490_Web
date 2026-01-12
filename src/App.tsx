import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/pages/Login";
import PortfolioPage from "./components/pages/portfolio/Portfolio";
import { DashboardLayout } from "./components/common/DashboardLayout";
import JobPostPage from "./components/pages/jobPost/JobPost";
import UserPage from "./components/pages/user/User";
import CommunityPage from "./components/pages/community/Community";
import PortfolioDetailPage from "./components/pages/portfolio/PortfolioDetail";
import JobDetailPage from "./components/pages/jobPost/JobPostDetail";
import CommunityDetailPage from "./components/pages/community/CommunityDetail";
// import Members từ một file page khác bạn sẽ tạo

function App() {
  return (
    <Router>
      <Routes>
        {/* Route trang Login tách biệt hoàn toàn */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<LoginPage />} />{" "}
        {/* Mặc định vào login nếu muốn */}
        {/* Nhóm các route Dashboard sử dụng Layout chung */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* Khi vào /dashboard, sẽ tự động render PortfolioPage thông qua Outlet */}
          <Route index element={<PortfolioPage />} />
          <Route path="portfolio" element={<PortfolioPage />} />
          <Route path="portfolio/:id" element={<PortfolioDetailPage />} />
          <Route path="jobPost" element={<JobPostPage />} />
          <Route path="job/:id" element={<JobDetailPage />} />
          <Route path="community" element={<CommunityPage />} />
          <Route path="community/:id" element={<CommunityDetailPage />} />
          <Route path="user" element={<UserPage />} />
        </Route>
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
