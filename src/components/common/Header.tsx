import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="h-16 border-b bg-background/95 backdrop-blur px-6 flex items-center justify-between">
      <div className="font-medium text-muted-foreground">
        Học kỳ: Spring 2026
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">Admin User</span>
        <Button variant="outline" size="sm">Đăng xuất</Button>
      </div>
    </header>
  );
}