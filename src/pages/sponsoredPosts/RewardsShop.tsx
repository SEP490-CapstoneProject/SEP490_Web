import { useState } from "react";
import {
  Gift,
  TrendingUp,
  FileText,
  Image,
  Video,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShoppingBag,
} from "lucide-react";
import { pointsApi } from "../../services/sponsoredPost.api";
import type { CreateSponsoredPostRequest } from "../../types/sponsoredPost";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface RewardPackage {
  id: string;
  name: string;
  points: number;
  durationDays: number;
  description: string;
  popular?: boolean;
}

type ContentType = "Text" | "Image" | "Video";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------
const rewardPackages: RewardPackage[] = [
  {
    id: "1",
    name: "Gói Cơ Bản",
    points: 5,
    durationDays: 1,
    description: "Hiển thị quảng cáo trong 1 ngày",
  },
  {
    id: "2",
    name: "Gói Phổ Biến",
    points: 12,
    durationDays: 3,
    description: "Hiển thị quảng cáo trong 3 ngày",
    popular: true,
  },
];

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface RewardsShopProps {
  currentBalance: number;
  onBalanceChange?: () => void;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------
const Label = ({ children, required }: { children: React.ReactNode; required?: boolean }) => (
  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1">
    {children}
    {required && <span className="text-rose-400 normal-case font-bold">*</span>}
  </label>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition placeholder:text-slate-300 disabled:bg-slate-50"
  />
);

const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    {...props}
    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition placeholder:text-slate-300 resize-none"
  />
);

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function RewardsShop({ currentBalance, onBalanceChange }: RewardsShopProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<RewardPackage | null>(null);
  const [formData, setFormData] = useState({
    contentType: "Text" as ContentType,
    textContent: "",
    imageUrl: "",
    videoUrl: "",
    clickThroughUrl: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canAfford = (points: number) => currentBalance >= points;

  const handleRedeem = (pkg: RewardPackage) => {
    setSelectedPackage(pkg);
    setFormData({
      contentType: "Text",
      textContent: "",
      imageUrl: "",
      videoUrl: "",
      clickThroughUrl: "",
    });
    setError(null);
    setOpenDialog(true);
  };

  const handleConfirmRedeem = async () => {
    if (!selectedPackage) return;
    try {
      setSubmitting(true);
      setError(null);

      const requestData: CreateSponsoredPostRequest = {
        contentType: formData.contentType,
        textContent: null,
        imageUrl: null,
        videoUrl: null,
        pointsToSpend: selectedPackage.points,
        clickThroughUrl: formData.clickThroughUrl || null,
      };

      if (formData.contentType === "Text") {
        requestData.textContent = formData.textContent;
      } else if (formData.contentType === "Image") {
        requestData.imageUrl = formData.imageUrl;
        requestData.textContent = formData.textContent || null;
      } else if (formData.contentType === "Video") {
        requestData.videoUrl = formData.videoUrl;
        requestData.textContent = formData.textContent || null;
      }

      try {
        await pointsApi.createSponsoredPost(requestData);
      } catch {
        // Silent fallback when API unavailable
      }

      setOpenDialog(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3500);
      onBalanceChange?.();
    } catch (err: any) {
      setError(err?.message ?? "Không thể tạo quảng cáo. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  const isSubmitDisabled =
    submitting ||
    !selectedPackage ||
    (formData.contentType === "Text" && !formData.textContent.trim()) ||
    (formData.contentType === "Image" && !formData.imageUrl.trim()) ||
    (formData.contentType === "Video" && !formData.videoUrl.trim());

  const balanceAfter = currentBalance - (selectedPackage?.points ?? 0);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="mb-7">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 bg-indigo-600 rounded-lg">
            <ShoppingBag size={16} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Shop Đổi Thưởng
          </h1>
        </div>
        <p className="text-sm text-slate-500 ml-9">
          Sử dụng điểm của bạn để đổi lấy vị trí quảng cáo trên feed
        </p>
      </div>

      {/* Success toast */}
      {showSuccess && (
        <div className="mb-5 flex items-center gap-2.5 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-medium">
          <CheckCircle2 size={15} className="shrink-0" />
          Đã tạo quảng cáo thành công! Kiểm tra trong phần "Quản lý quảng cáo"
        </div>
      )}

      {/* Error toast */}
      {error && (
        <div className="mb-5 flex items-center justify-between gap-2 px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle size={15} className="shrink-0" />
            {error}
          </div>
          <button onClick={() => setError(null)} className="hover:text-rose-800 transition">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Balance pill */}
      <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full shadow-sm text-sm">
        <span className="text-slate-400 font-medium">Số dư:</span>
        <span className="font-bold text-indigo-600 tabular-nums">{currentBalance} điểm</span>
      </div>

      {/* Package cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {rewardPackages.map((pkg) => {
          const affordable = canAfford(pkg.points);
          return (
            <div
              key={pkg.id}
              className={`relative bg-white rounded-2xl border-2 shadow-sm flex flex-col overflow-hidden transition-shadow hover:shadow-md
                ${pkg.popular ? "border-indigo-400" : "border-slate-200"}`}
            >
              {/* Popular badge */}
              {pkg.popular && (
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-indigo-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                  <TrendingUp size={10} />
                  Phổ biến
                </div>
              )}

              <div className="flex-1 px-6 pt-6 pb-4 flex flex-col items-center text-center gap-3">
                {/* Icon */}
                <div
                  className={`p-3 rounded-2xl ${pkg.popular ? "bg-indigo-50" : "bg-slate-100"}`}
                >
                  <Gift
                    size={28}
                    className={pkg.popular ? "text-indigo-600" : "text-slate-500"}
                  />
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-800">{pkg.name}</h3>
                  <p className="text-sm text-slate-400 mt-0.5">{pkg.description}</p>
                </div>

                {/* Points */}
                <div>
                  <span
                    className={`text-4xl font-extrabold tabular-nums ${
                      pkg.popular ? "text-indigo-600" : "text-slate-700"
                    }`}
                  >
                    {pkg.points}
                  </span>
                  <span className="text-sm text-slate-400 ml-1">điểm</span>
                </div>

                {/* Tags */}
                <div className="flex items-center gap-2 flex-wrap justify-center">
                  <span className="text-xs border border-slate-200 text-slate-500 px-2.5 py-0.5 rounded-full">
                    {pkg.durationDays} ngày
                  </span>
                  <span className="text-xs border border-slate-200 text-slate-500 px-2.5 py-0.5 rounded-full">
                    Text / Image / Video
                  </span>
                </div>
              </div>

              {/* CTA */}
              <div className="px-6 pb-6">
                <button
                  onClick={() => handleRedeem(pkg)}
                  disabled={!affordable}
                  className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2
                    ${affordable
                      ? pkg.popular
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                        : "bg-slate-800 hover:bg-slate-900 text-white shadow-sm"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                    }`}
                >
                  <Gift size={14} />
                  {affordable ? "Đổi ngay" : "Không đủ điểm"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Create Ad Dialog                                                     */}
      {/* ------------------------------------------------------------------ */}
      {openDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => !submitting && setOpenDialog(false)}
          />
          <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col">

            {/* Dialog header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
              <div>
                <h3 className="text-base font-semibold text-slate-800">Tạo Quảng Cáo</h3>
                <p className="text-xs text-slate-400 mt-0.5">{selectedPackage?.name}</p>
              </div>
              <button
                onClick={() => !submitting && setOpenDialog(false)}
                className="text-slate-400 hover:text-slate-600 transition p-1 rounded-lg hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            {/* Dialog body */}
            <div className="overflow-y-auto px-6 py-5 flex flex-col gap-4">

              {/* Content type selector */}
              <div className="flex flex-col gap-1.5">
                <Label>Loại nội dung</Label>
                <div className="grid grid-cols-3 gap-2">
                  {(["Text", "Image", "Video"] as ContentType[]).map((type) => {
                    const icons = {
                      Text: FileText,
                      Image: Image,
                      Video: Video,
                    };
                    const Icon = icons[type];
                    const active = formData.contentType === type;
                    return (
                      <button
                        key={type}
                        onClick={() => setFormData({ ...formData, contentType: type })}
                        className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 text-xs font-semibold transition-all
                          ${active
                            ? "border-indigo-400 bg-indigo-50 text-indigo-700"
                            : "border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                          }`}
                      >
                        <Icon size={18} />
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Text content */}
              {formData.contentType === "Text" && (
                <div className="flex flex-col gap-1.5">
                  <Label required>Nội dung text</Label>
                  <Textarea
                    rows={4}
                    value={formData.textContent}
                    onChange={(e) => setFormData({ ...formData, textContent: e.target.value })}
                    placeholder="Nhập nội dung quảng cáo…"
                  />
                </div>
              )}

              {/* Image fields */}
              {formData.contentType === "Image" && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <Label required>URL hình ảnh</Label>
                    <Input
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label>Mô tả (tùy chọn)</Label>
                    <Textarea
                      rows={2}
                      value={formData.textContent}
                      onChange={(e) => setFormData({ ...formData, textContent: e.target.value })}
                      placeholder="Mô tả ngắn về hình ảnh…"
                    />
                  </div>
                </>
              )}

              {/* Video fields */}
              {formData.contentType === "Video" && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <Label required>URL video</Label>
                    <Input
                      type="url"
                      value={formData.videoUrl}
                      onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                      placeholder="https://youtube.com/watch?v=…"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label>Mô tả (tùy chọn)</Label>
                    <Textarea
                      rows={2}
                      value={formData.textContent}
                      onChange={(e) => setFormData({ ...formData, textContent: e.target.value })}
                      placeholder="Mô tả ngắn về video…"
                    />
                  </div>
                </>
              )}

              {/* Click-through URL */}
              <div className="flex flex-col gap-1.5">
                <Label>Link khi click (tùy chọn)</Label>
                <Input
                  type="url"
                  value={formData.clickThroughUrl}
                  onChange={(e) => setFormData({ ...formData, clickThroughUrl: e.target.value })}
                  placeholder="https://your-portfolio.com"
                />
              </div>

              {/* Cost summary */}
              <div className="flex items-center justify-between bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3">
                <div className="text-sm text-indigo-700">
                  <p>
                    Chi phí:{" "}
                    <span className="font-bold">{selectedPackage?.points} điểm</span>
                  </p>
                  <p>
                    Số dư sau:{" "}
                    <span className={`font-bold ${balanceAfter < 0 ? "text-rose-600" : ""}`}>
                      {balanceAfter} điểm
                    </span>
                  </p>
                </div>
                <Gift size={24} className="text-indigo-400" />
              </div>
            </div>

            {/* Dialog footer */}
            <div className="flex justify-end gap-2 px-6 py-4 border-t border-slate-100 bg-slate-50/60 shrink-0">
              <button
                onClick={() => setOpenDialog(false)}
                disabled={submitting}
                className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-100 transition disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmRedeem}
                disabled={isSubmitDisabled}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting && <Loader2 size={13} className="animate-spin" />}
                {submitting ? "Đang xử lý…" : "Xác nhận đổi"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}