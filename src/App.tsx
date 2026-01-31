import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/pages/login/Login";
import { WebLayout } from "./components/common/WebLayout";
import ProfilePage from "./components/pages/portfolio/Profile";
import PortfolioManagement from "./components/pages/portfolio/PortfolioManagement";
import EmptyPortfolioPage from "./components/pages/portfolio/EmptyPortfolio";
import TalentHome from "./components/pages/talent/TalentHome";
import { PostDetail } from "./components/pages/talent/PostDetail";
import CommunityPost from "./components/pages/community/CommunityPost";
import CommunityPostDetail from "./components/pages/community/CommunityPostDetail";
function App() {
  return (
    <Router>
      <Routes>
        {/* Route trang Login tách biệt hoàn toàn */}
        <Route path="/" element={<LoginPage />} />{" "}
        <Route element={<WebLayout />}>
          <Route path="talent-home" element={<TalentHome />} />
          <Route path="/job/:postId" element={<PostDetail />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/portfolioManagement" element={<PortfolioManagement />} />
          <Route path="/emptyPortfolio" element={<EmptyPortfolioPage />} />
          <Route path="/community" element={<CommunityPost />} />
          <Route path="/community/:id" element={<CommunityPostDetail />} />
        </Route>
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
