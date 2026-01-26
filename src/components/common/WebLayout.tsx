import { Header } from "./Header"; // Giả định file Header của bạn ở cùng thư mục
import { Outlet } from "react-router-dom";

export function WebLayout() {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Header />
      <main className="max-w-360 mx-auto py-4 px-4 ">
        <Outlet /> 
      </main>
    </div>
  );
}