import { Home, Users, Calendar, Settings } from "lucide-react";

const menuItems = [
  { icon: Home, label: "Dashboard", href: "/" },
  { icon: Users, label: "Members", href: "/members" },
  { icon: Calendar, label: "Events", href: "/events" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
  return (
    <aside className="w-64 border-r bg-card h-screen p-4 flex flex-col">
      <div className="text-xl font-bold mb-8 px-2 text-primary">Club Manager</div>
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-accent-foreground transition-colors"
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
}