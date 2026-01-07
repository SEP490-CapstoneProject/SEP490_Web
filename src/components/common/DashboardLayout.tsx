import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

interface Props {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: Props) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}