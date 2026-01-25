import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/pages/Login";
import { WebLayout } from "./components/common/WebLayout";
import ProfilePage from "./components/pages/portfolio/Profile";
import PortfolioManagement from "./components/pages/portfolio/PortfolioManagement";

function App() {
  return (
    <Router>
      <Routes>
        {/* Route trang Login tách biệt hoàn toàn */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<LoginPage />} />{" "}
        <Route element={<WebLayout />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/portfolioManagement" element={<PortfolioManagement />} />
        </Route>
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
