import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Wallet,
  TrendingUp,
  ShoppingCart,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  Loader2,
  ReceiptText,
} from "lucide-react";
import { pointsApi } from "../../services/sponsoredPost.api";
import type { PointBalanceDto, PointTransactionDto } from "../../types/sponsoredPost";

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------
const mockBalance: PointBalanceDto = {
  userId: 1,
  currentBalance: 127.0,
  todayEarned: 15,
  totalEarned: 450.0,
  totalSpent: 323.0,
  lastTransactionAt: new Date().toISOString(),
};

const mockTransactions: PointTransactionDto[] = [
  {
    id: 1,
    userId: 1,
    points: 30,
    type: "Earn",
    sourceType: "ComplimentReview",
    sourceId: "9",
    description: null,
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: 2,
    userId: 1,
    points: 5,
    type: "Spend",
    sourceType: "SponsoredFeedRedemption",
    sourceId: "daccbf1b-72de-4608-bf98-84f4759ea6e0",
    description: null,
    createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
  },
  {
    id: 3,
    userId: 1,
    points: 12,
    type: "Spend",
    sourceType: "SponsoredFeedRedemption",
    sourceId: "a1b2c3d4-5678-90ab-cdef-1234567890ab",
    description: null,
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const formatDate = (d: string) => format(new Date(d), "dd/MM/yyyy HH:mm");

const getRelativeTime = (d: string) => {
  const ms = Date.now() - new Date(d).getTime();
  const mins = Math.floor(ms / 60000);
  const hours = Math.floor(ms / 3600000);
  const days = Math.floor(ms / 86400000);
  if (mins < 60) return `${mins} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  return `${days} ngày trước`;
};

// ---------------------------------------------------------------------------
// Stat card
// ---------------------------------------------------------------------------
const StatCard = ({
  icon: Icon,
  iconBg,
  iconColor,
  label,
  value,
  sub,
  badge,
}: {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  label: string;
  value: React.ReactNode;
  sub?: string;
  badge?: string;
}) => (
  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3">
    <div className="flex items-start gap-3">
      <div className={`p-2.5 rounded-xl ${iconBg} shrink-0`}>
        <Icon size={18} className={iconColor} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-400 font-medium mb-0.5">{label}</p>
        <p className="text-2xl font-bold text-slate-800 tabular-nums leading-tight">
          {value}
        </p>
      </div>
    </div>
    {badge && (
      <span className="self-start inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
        <ArrowUpRight size={11} />
        {badge}
      </span>
    )}
    {sub && <p className="text-xs text-slate-400">{sub}</p>}
  </div>
);

// ---------------------------------------------------------------------------
// Tab button
// ---------------------------------------------------------------------------
const TabBtn = ({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all whitespace-nowrap
      ${active
        ? "bg-indigo-600 text-white shadow-sm"
        : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
      }`}
  >
    {children}
  </button>
);

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function PointsDashboard() {
  const [tab, setTab] = useState(0);
  const [balance, setBalance] = useState<PointBalanceDto | null>(null);
  const [transactions, setTransactions] = useState<PointTransactionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [balanceData, txData] = await Promise.all([
        pointsApi.getBalance(),
        pointsApi.getTransactions(),
      ]);
      setBalance(balanceData);
      setTransactions(txData);
      setUsingMockData(false);
    } catch {
      setBalance(mockBalance);
      setTransactions(mockTransactions);
      setUsingMockData(true);
    } finally {
      setLoading(false);
    }
  };

  const earnTx = transactions.filter((t) => t.type === "Earn");
  const spendTx = transactions.filter((t) => t.type === "Spend");
  const displayed = tab === 0 ? transactions : tab === 1 ? earnTx : spendTx;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-slate-400">
        <Loader2 size={32} className="animate-spin" />
        <span className="text-sm">Đang tải dữ liệu…</span>
      </div>
    );
  }

  if (!balance) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="mb-7">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 bg-indigo-600 rounded-lg">
            <Wallet size={16} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Quản Lý Điểm
          </h1>
        </div>
        <p className="text-sm text-slate-500 ml-9">
          Theo dõi số dư và lịch sử giao dịch điểm của bạn
        </p>
      </div>

      {/* Mock data banner */}
      {usingMockData && (
        <div className="mb-5 flex items-center gap-2.5 px-4 py-3 bg-sky-50 border border-sky-200 rounded-xl text-sky-700 text-sm">
          <Info size={15} className="shrink-0" />
          Đang hiển thị dữ liệu mẫu (API chưa kết nối)
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={Wallet}
          iconBg="bg-indigo-50"
          iconColor="text-indigo-600"
          label="Số dư hiện tại"
          value={balance.currentBalance.toLocaleString()}
          sub="điểm khả dụng"
        />
        <StatCard
          icon={TrendingUp}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          label="Tổng tích lũy"
          value={balance.totalEarned.toLocaleString()}
          badge={`+${balance.todayEarned} hôm nay`}
        />
        <StatCard
          icon={ShoppingCart}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
          label="Tổng đã tiêu"
          value={balance.totalSpent.toLocaleString()}
          sub="đã đổi quảng cáo"
        />
        <StatCard
          icon={Clock}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
          label="Giao dịch cuối"
          value={
            balance.lastTransactionAt
              ? getRelativeTime(balance.lastTransactionAt)
              : "Chưa có"
          }
          sub={
            balance.lastTransactionAt
              ? formatDate(balance.lastTransactionAt)
              : undefined
          }
        />
      </div>

      {/* Transaction history */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

        {/* Card header + tabs */}
        <div className="px-5 pt-5 pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ReceiptText size={16} className="text-slate-500" />
            <h2 className="text-base font-semibold text-slate-800">
              Lịch Sử Giao Dịch
            </h2>
          </div>
          <div className="flex items-center gap-1 pb-3">
            <TabBtn active={tab === 0} onClick={() => setTab(0)}>
              Tất cả ({transactions.length})
            </TabBtn>
            <TabBtn active={tab === 1} onClick={() => setTab(1)}>
              Tích ({earnTx.length})
            </TabBtn>
            <TabBtn active={tab === 2} onClick={() => setTab(2)}>
              Tiêu ({spendTx.length})
            </TabBtn>
          </div>
        </div>

        {/* Table – desktop */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["Loại", "Mô tả / Nguồn", "Điểm", "Thời gian"].map((h) => (
                  <th
                    key={h}
                    className={`px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider text-left
                      ${h === "Điểm" ? "text-right" : ""}
                      ${h === "Thời gian" ? "text-right" : ""}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayed.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-400 text-sm">
                    Không có giao dịch nào
                  </td>
                </tr>
              )}
              {displayed.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/60 transition-colors">
                  {/* Type */}
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border
                        ${tx.type === "Earn"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                    >
                      {tx.type === "Earn" ? (
                        <ArrowUpRight size={11} />
                      ) : (
                        <ArrowDownRight size={11} />
                      )}
                      {tx.type === "Earn" ? "Tích" : "Tiêu"}
                    </span>
                  </td>

                  {/* Description / source */}
                  <td className="px-5 py-3.5">
                    <p className="text-slate-700 font-medium">
                      {tx.description ?? (
                        <span className="text-slate-400">{tx.sourceType}</span>
                      )}
                    </p>
                    {tx.description && (
                      <p className="text-xs text-slate-400 mt-0.5">{tx.sourceType}</p>
                    )}
                  </td>

                  {/* Points */}
                  <td className="px-5 py-3.5 text-right">
                    <span
                      className={`text-base font-bold tabular-nums
                        ${tx.type === "Earn" ? "text-emerald-600" : "text-amber-600"}`}
                    >
                      {tx.type === "Earn" ? "+" : "−"}
                      {tx.points}
                    </span>
                  </td>

                  {/* Time */}
                  <td className="px-5 py-3.5 text-right">
                    <p className="text-slate-600 font-medium">
                      {getRelativeTime(tx.createdAt)}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {formatDate(tx.createdAt)}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* List – mobile */}
        <div className="sm:hidden divide-y divide-slate-100">
          {displayed.length === 0 && (
            <p className="py-10 text-center text-slate-400 text-sm">
              Không có giao dịch nào
            </p>
          )}
          {displayed.map((tx) => (
            <div key={tx.id} className="px-4 py-3.5 flex items-center gap-3">
              {/* Icon */}
              <div
                className={`p-2 rounded-xl shrink-0
                  ${tx.type === "Earn" ? "bg-emerald-50" : "bg-amber-50"}`}
              >
                {tx.type === "Earn" ? (
                  <ArrowUpRight size={16} className="text-emerald-600" />
                ) : (
                  <ArrowDownRight size={16} className="text-amber-600" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-700 font-medium truncate">
                  {tx.description ?? tx.sourceType}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {getRelativeTime(tx.createdAt)}
                </p>
              </div>

              {/* Points */}
              <span
                className={`text-base font-bold tabular-nums shrink-0
                  ${tx.type === "Earn" ? "text-emerald-600" : "text-amber-600"}`}
              >
                {tx.type === "Earn" ? "+" : "−"}
                {tx.points}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}