import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "@/components/pages/Dashboard";
// import Members từ một file page khác bạn sẽ tạo

function App() {
  return (
    <Router>
      <Routes>
        {/* Route cho trang chính */}
        <Route path="/" element={<Dashboard />} />
        
        {/* Bạn sẽ thêm các route khác ở đây */}
        {/* <Route path="/members" element={<MembersPage />} /> */}
        
        {/* Route 404 - Trang không tìm thấy */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;