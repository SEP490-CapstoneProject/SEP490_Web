import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Eye,
  MousePointerClick,
  TrendingUp,
  Calendar,
  Pencil,
  Trash2,
  Play,
  Pause,
  X,
  AlertCircle,
  Info,
  Loader2,
  Megaphone,
} from "lucide-react";
import { pointsApi } from "../../services/sponsoredPost.api";
import type { SponsoredPostDto } from "../../types/sponsoredPost";


const mockAds: SponsoredPostDto[] = [
  {
    id: 1,
    createdBy: 1,
    contentType: "Image",
    textContent: "Khám phá portfolio thiết kế UI/UX của tôi!",
    imageUrl:
      "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=400",
    videoUrl: null,
    pointsSpent: 12,
    durationDays: 3,
    startDate: new Date(Date.now() - 2 * 86400000).toISOString(),
    expiryDate: new Date(Date.now() + 1 * 86400000).toISOString(),
    status: "Active",
    clickThroughUrl: "https://myportfolio.com",
    viewCount: 1247,
    clickCount: 89,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: null,
  },
  {
    id: 2,
    createdBy: 1,
    contentType: "Video",
    textContent: "Demo dự án React + TypeScript",
    imageUrl: null,
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    pointsSpent: 5,
    durationDays: 1,
    startDate: new Date(Date.now() - 4 * 86400000).toISOString(),
    expiryDate: new Date(Date.now() - 3 * 86400000).toISOString(),
    status: "Expired",
    clickThroughUrl: "https://github.com/myusername",
    viewCount: 856,
    clickCount: 45,
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 3,
    createdBy: 1,
    contentType: "Text",
    textContent:
      "Frontend Developer với 5 năm kinh nghiệm React, NextJS. Đang tìm cơ hội remote!",
    imageUrl: null,
    videoUrl: null,
    pointsSpent: 12,
    durationDays: 3,
    startDate: new Date(Date.now() - 1 * 86400000).toISOString(),
    expiryDate: new Date(Date.now() + 2 * 86400000).toISOString(),
    status: "Paused",
    clickThroughUrl: null,
    viewCount: 234,
    clickCount: 12,
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60000).toISOString(),
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const getCTR = (views: number, clicks: number) =>
  views === 0 ? "0.00" : ((clicks / views) * 100).toFixed(2);

const getDaysRemaining = (expiryDate: string) =>
  Math.max(0, Math.ceil((new Date(expiryDate).getTime() - Date.now()) / 86400000));

const getProgress = (start: string, expiry: string) => {
  const total = new Date(expiry).getTime() - new Date(start).getTime();
  const elapsed = Date.now() - new Date(start).getTime();
  return Math.min(100, Math.max(0, (elapsed / total) * 100));
};

// ---------------------------------------------------------------------------
// Status badge
// ---------------------------------------------------------------------------
const StatusBadge = ({ status }: { status: SponsoredPostDto["status"] }) => {
  const styles: Record<string, string> = {
    Active:
      "bg-emerald-50 text-emerald-700 border border-emerald-200 ring-1 ring-emerald-400/30",
    Paused:
      "bg-amber-50 text-amber-700 border border-amber-200 ring-1 ring-amber-400/30",
    Expired:
      "bg-rose-50 text-rose-600 border border-rose-200 ring-1 ring-rose-400/30",
  };
  const dots: Record<string, string> = {
    Active: "bg-emerald-500 animate-pulse",
    Paused: "bg-amber-500",
    Expired: "bg-rose-400",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${styles[status]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dots[status]}`} />
      {status}
    </span>
  );
};

// ---------------------------------------------------------------------------
// Content type pill
// ---------------------------------------------------------------------------
const TypePill = ({ type }: { type: SponsoredPostDto["contentType"] }) => {
  const styles: Record<string, string> = {
    Image: "bg-violet-50 text-violet-700 border border-violet-200",
    Video: "bg-blue-50 text-blue-700 border border-blue-200",
    Text: "bg-slate-100 text-slate-600 border border-slate-200",
  };
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${styles[type]}`}
    >
      {type}
    </span>
  );
};

// ---------------------------------------------------------------------------
// Stat card
// ---------------------------------------------------------------------------
const Stat = ({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  accent: string;
}) => (
  <div className="flex flex-col gap-1">
    <div className={`flex items-center gap-1.5 ${accent}`}>
      <Icon size={13} />
      <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
    </div>
    <span className="text-2xl font-bold text-slate-800 tabular-nums">{value}</span>
  </div>
);

// ---------------------------------------------------------------------------
// Modal base
// ---------------------------------------------------------------------------
const Modal = ({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-base font-semibold text-slate-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function AdManagement() {
  const [ads, setAds] = useState<SponsoredPostDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingMockData, setUsingMockData] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedAd, setSelectedAd] = useState<SponsoredPostDto | null>(null);
  const [editFormData, setEditFormData] = useState({
    textContent: "",
    clickThroughUrl: "",
  });
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "error" | "success" } | null>(null);

  const showToast = (msg: string, type: "error" | "success" = "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    loadAds();
  }, []);

  const loadAds = async () => {
    try {
      setLoading(true);
      const data = await pointsApi.getMySponsoredPosts();
      setAds(data);
      setUsingMockData(false);
    } catch {
      setAds(mockAds);
      setUsingMockData(true);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (ad: SponsoredPostDto) => {
    setActionLoading(ad.id);
    try {
      if (ad.status === "Active") {
        await pointsApi.pauseSponsoredPost(ad.id);
        setAds((prev) =>
          prev.map((a) =>
            a.id === ad.id
              ? { ...a, status: "Paused" as const, updatedAt: new Date().toISOString() }
              : a
          )
        );
      } else if (ad.status === "Paused") {
        await pointsApi.resumeSponsoredPost(ad.id);
        setAds((prev) =>
          prev.map((a) =>
            a.id === ad.id
              ? { ...a, status: "Active" as const, updatedAt: new Date().toISOString() }
              : a
          )
        );
      }
    } catch {
      showToast("Không thể thay đổi trạng thái quảng cáo.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleEdit = (ad: SponsoredPostDto) => {
    setSelectedAd(ad);
    setEditFormData({
      textContent: ad.textContent ?? "",
      clickThroughUrl: ad.clickThroughUrl ?? "",
    });
    setEditDialog(true);
  };

  const handleSaveEdit = () => {
    if (!selectedAd) return;
    setAds((prev) =>
      prev.map((a) =>
        a.id === selectedAd.id
          ? {
              ...a,
              textContent: editFormData.textContent,
              clickThroughUrl: editFormData.clickThroughUrl,
              updatedAt: new Date().toISOString(),
            }
          : a
      )
    );
    setEditDialog(false);
    showToast("Đã lưu thay đổi (cục bộ).", "success");
    console.warn("Update API not implemented yet. Changes are local only.");
  };

  const handleConfirmDelete = async () => {
    if (!selectedAd) return;
    setActionLoading(selectedAd.id);
    try {
      await pointsApi.deleteSponsoredPost(selectedAd.id);
      setAds((prev) => prev.filter((a) => a.id !== selectedAd.id));
      setDeleteDialog(false);
    } catch {
      showToast("Không thể xóa quảng cáo.");
    } finally {
      setActionLoading(null);
    }
  };

  // -------------------------------------------------------------------------
  // Loading state
  // -------------------------------------------------------------------------
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-slate-400">
        <Loader2 size={32} className="animate-spin" />
        <span className="text-sm">Đang tải quảng cáo…</span>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <div className="relative max-w-5xl mx-auto px-4 py-8 font-[system-ui]">

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-[100] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium border transition-all
            ${toast.type === "error"
              ? "bg-rose-50 text-rose-700 border-rose-200"
              : "bg-emerald-50 text-emerald-700 border-emerald-200"
            }`}
        >
          <AlertCircle size={15} />
          {toast.msg}
        </div>
      )}

      {/* Mock data banner */}
      {usingMockData && (
        <div className="mb-5 flex items-center gap-2.5 px-4 py-3 bg-sky-50 border border-sky-200 rounded-xl text-sky-700 text-sm">
          <Info size={15} className="shrink-0" />
          Đang hiển thị dữ liệu mẫu (API chưa kết nối)
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-indigo-600 rounded-lg">
              <Megaphone size={16} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Quản Lý Quảng Cáo
            </h1>
          </div>
          <p className="text-sm text-slate-500 ml-9">
            Theo dõi hiệu suất và quản lý các quảng cáo của bạn
          </p>
        </div>

        {/* Summary pills */}
        <div className="flex gap-3 ml-9 sm:ml-0">
          <div className="flex flex-col items-center px-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm">
            <span className="text-xs text-slate-400 font-medium">Đang chạy</span>
            <span className="text-xl font-bold text-emerald-600">
              {ads.filter((a) => a.status === "Active").length}
            </span>
          </div>
          <div className="flex flex-col items-center px-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm">
            <span className="text-xs text-slate-400 font-medium">Tổng views</span>
            <span className="text-xl font-bold text-slate-700">
              {ads.reduce((s, a) => s + a.viewCount, 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Ad cards */}
      <div className="flex flex-col gap-4">
        {ads.map((ad) => (
          <div
            key={ad.id}
            className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
          >
            <div className="flex flex-col lg:flex-row">

              {/* Left – content preview */}
              <div className="lg:w-64 shrink-0 p-5 border-b lg:border-b-0 lg:border-r border-slate-100 bg-slate-50/60 flex flex-col gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <TypePill type={ad.contentType} />
                  <StatusBadge status={ad.status} />
                </div>

                {ad.imageUrl && (
                  <img
                    src={ad.imageUrl}
                    alt="Ad preview"
                    className="w-full h-36 object-cover rounded-xl border border-slate-200"
                  />
                )}

                {ad.textContent && (
                  <p className="text-sm text-slate-600 leading-relaxed line-clamp-4">
                    {ad.textContent}
                  </p>
                )}

                {ad.videoUrl && (
                  <div className="bg-slate-200/60 rounded-xl px-3 py-2.5 text-center">
                    <span className="text-xs text-slate-500 break-all">
                      {ad.videoUrl.substring(0, 38)}…
                    </span>
                  </div>
                )}

                <div className="mt-auto text-xs text-slate-400">
                  <span>{ad.pointsSpent} pts · {ad.durationDays} ngày</span>
                </div>
              </div>

              {/* Right – stats + controls */}
              <div className="flex-1 p-5 flex flex-col gap-5">

                {/* Stats row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <Stat
                    icon={Eye}
                    label="Lượt xem"
                    value={ad.viewCount.toLocaleString()}
                    accent="text-slate-400"
                  />
                  <Stat
                    icon={MousePointerClick}
                    label="Lượt click"
                    value={ad.clickCount}
                    accent="text-indigo-400"
                  />
                  <Stat
                    icon={TrendingUp}
                    label="CTR"
                    value={`${getCTR(ad.viewCount, ad.clickCount)}%`}
                    accent="text-emerald-500"
                  />
                  <Stat
                    icon={Calendar}
                    label="Còn lại"
                    value={
                      ad.status === "Expired"
                        ? "Hết hạn"
                        : `${getDaysRemaining(ad.expiryDate)} ngày`
                    }
                    accent="text-amber-400"
                  />
                </div>

                {/* Progress bar */}
                {ad.status !== "Expired" && (
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs text-slate-400 font-medium">
                        Tiến độ chiến dịch
                      </span>
                      <span className="text-xs text-slate-500 font-semibold tabular-nums">
                        {Math.round(getProgress(ad.startDate, ad.expiryDate))}%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full transition-all duration-500"
                        style={{
                          width: `${getProgress(ad.startDate, ad.expiryDate)}%`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-[11px] text-slate-400">
                        {format(new Date(ad.startDate), "dd/MM/yyyy")}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {format(new Date(ad.expiryDate), "dd/MM/yyyy")}
                      </span>
                    </div>
                  </div>
                )}

                <div className="border-t border-slate-100" />

                {/* Action buttons */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(ad)}
                      disabled={ad.status === "Expired"}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      <Pencil size={13} />
                      Chỉnh sửa
                    </button>
                    <button
                      onClick={() => {
                        setSelectedAd(ad);
                        setDeleteDialog(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-rose-500 border border-rose-200 rounded-lg hover:bg-rose-50 transition-all"
                    >
                      <Trash2 size={13} />
                      Xóa
                    </button>
                  </div>

                  {ad.status !== "Expired" && (
                    <button
                      onClick={() => handleToggleStatus(ad)}
                      disabled={actionLoading === ad.id}
                      className={`inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold rounded-lg transition-all disabled:opacity-60
                        ${ad.status === "Active"
                          ? "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                          : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
                        }`}
                    >
                      {actionLoading === ad.id ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : ad.status === "Active" ? (
                        <Pause size={13} />
                      ) : (
                        <Play size={13} />
                      )}
                      {ad.status === "Active" ? "Tạm dừng" : "Chạy lại"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {ads.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center text-slate-400 gap-3 border-2 border-dashed border-slate-200 rounded-2xl">
            <Megaphone size={36} className="opacity-40" />
            <p className="text-sm">
              Bạn chưa có quảng cáo nào.
              <br />
              Hãy vào Shop để đổi điểm lấy quảng cáo!
            </p>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Edit Dialog                                                          */}
      {/* ------------------------------------------------------------------ */}
      <Modal
        open={editDialog}
        onClose={() => setEditDialog(false)}
        title="Chỉnh sửa quảng cáo"
      >
        <div className="px-6 py-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Nội dung text
            </label>
            <textarea
              rows={3}
              value={editFormData.textContent}
              onChange={(e) =>
                setEditFormData({ ...editFormData, textContent: e.target.value })
              }
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 resize-none transition"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Link khi click
            </label>
            <input
              type="url"
              placeholder="https://..."
              value={editFormData.clickThroughUrl}
              onChange={(e) =>
                setEditFormData({
                  ...editFormData,
                  clickThroughUrl: e.target.value,
                })
              }
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
            />
          </div>
          <div className="flex items-start gap-2 text-xs text-sky-600 bg-sky-50 border border-sky-200 rounded-lg px-3 py-2.5">
            <Info size={13} className="mt-0.5 shrink-0" />
            Bạn không thể thay đổi loại nội dung (Text/Image/Video) sau khi tạo
          </div>
        </div>
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-slate-100 bg-slate-50/60">
          <button
            onClick={() => setEditDialog(false)}
            className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-100 transition"
          >
            Hủy
          </button>
          <button
            onClick={handleSaveEdit}
            className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm transition"
          >
            Lưu thay đổi
          </button>
        </div>
      </Modal>

      {/* ------------------------------------------------------------------ */}
      {/* Delete Dialog                                                        */}
      {/* ------------------------------------------------------------------ */}
      <Modal
        open={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        title="Xác nhận xóa"
      >
        <div className="px-6 py-5">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-rose-100 rounded-full shrink-0">
              <Trash2 size={16} className="text-rose-600" />
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Bạn có chắc muốn xóa quảng cáo này?{" "}
              <span className="font-semibold text-slate-800">
                Hành động này không thể hoàn tác.
              </span>
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-slate-100 bg-slate-50/60">
          <button
            onClick={() => setDeleteDialog(false)}
            className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-100 transition"
          >
            Hủy
          </button>
          <button
            onClick={handleConfirmDelete}
            disabled={actionLoading !== null}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-rose-600 rounded-lg hover:bg-rose-700 shadow-sm transition disabled:opacity-60"
          >
            {actionLoading !== null && (
              <Loader2 size={13} className="animate-spin" />
            )}
            Xóa
          </button>
        </div>
      </Modal>
    </div>
  );
}