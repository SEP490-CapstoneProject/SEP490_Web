import { useState } from "react";
import { ShoppingBag, LayoutDashboard, Megaphone } from "lucide-react";
import RewardsShop from "./RewardsShop";
import PointsDashboard from "./PointsDashboard";
import AdManagement from "./AdManagement";

// ---------------------------------------------------------------------------
// Tab definition
// ---------------------------------------------------------------------------
type TabId = "shop" | "dashboard" | "ads";

interface Tab {
  id: TabId;
  label: string;
  icon: React.ElementType;
}

const TABS: Tab[] = [
  { id: "shop",      label: "Shop Đổi Thưởng",  icon: ShoppingBag   },
  { id: "dashboard", label: "Quản Lý Điểm",      icon: LayoutDashboard },
  { id: "ads",       label: "Quản Lý Quảng Cáo", icon: Megaphone      },
];

// ---------------------------------------------------------------------------
// SponsoredPost page
// ---------------------------------------------------------------------------
export default function SponsoredPost() {
  const [activeTab, setActiveTab] = useState<TabId>("shop");

  // Shared balance state — RewardsShop writes, PointsDashboard reads.
  // Both children refresh independently; this just triggers PointsDashboard reload.
  const [balanceVersion, setBalanceVersion] = useState(0);
  const handleBalanceChange = () => setBalanceVersion((v) => v + 1);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ------------------------------------------------------------------ */}
      {/* Top tab bar                                                          */}
      {/* ------------------------------------------------------------------ */}
      <div className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4">
          <nav className="flex gap-1 overflow-x-auto scrollbar-none" role="tablist">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-4 py-4 text-sm font-semibold whitespace-nowrap transition-colors outline-none
                    ${active
                      ? "text-indigo-600"
                      : "text-slate-500 hover:text-slate-700"
                    }`}
                >
                  <Icon size={15} />
                  {tab.label}

                  {/* Active underline */}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Tab panels                                                           */}
      {/* ------------------------------------------------------------------ */}
      <div className="max-w-5xl mx-auto">
        {activeTab === "shop" && (
          <RewardsShop
            currentBalance={127}
            onBalanceChange={handleBalanceChange}
          />
        )}

        {activeTab === "dashboard" && (
          // key forces remount when balance changes so it re-fetches
          <PointsDashboard key={balanceVersion} />
        )}

        {activeTab === "ads" && <AdManagement />}
      </div>
    </div>
  );
}