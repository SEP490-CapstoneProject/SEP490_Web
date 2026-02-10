import { Header } from "./Header"; // Giả định file Header của bạn ở cùng thư mục
import { Outlet } from "react-router-dom";

export function WebLayout() {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Header />
      <main >
        <Outlet /> 
      </main>
    </div>
  );
}