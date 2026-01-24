import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/pages/Login";
import { Header } from "./components/common/Header";


function App() {
  return (
    <Router>
      <Routes>
        {/* Route trang Login tách biệt hoàn toàn */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<LoginPage />} />{" "}
        <Route path="/Header" element={<Header />} />{" "}

        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
