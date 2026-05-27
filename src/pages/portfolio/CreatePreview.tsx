import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { portfolioService } from "@/services/portfolio.api";
import { useAppSelector } from "@/store/hook";
import { notify } from "@/lib/toast";
import CustomLoading from "@/components/Loading/Loading";

export default function CreatePreview() {
  const navigate = useNavigate();
  const { portfolioId } = useParams<{ portfolioId: string }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [highlightsDescription, setHighlightsDescription] = useState("");

  const { accessToken } = useAppSelector((state) => state.auth);

  const handleGeneratePreview = async () => {
    try {
      // Validate highlightsDescription
      if (!highlightsDescription.trim()) {
        setError("Vui lòng nhập mô tả nổi bật");
        notify.error("Vui lòng nhập mô tả nổi bật");
        return;
      }

      setLoading(true);
      setError(null);

      if (!accessToken) {
        notify.error("Vui lòng đăng nhập để tạo preview");
        navigate("/login");
        return;
      }

      if (!portfolioId) {
        setError("Portfolio ID không hợp lệ");
        return;
      }

      const portfolioIdNum = parseInt(portfolioId, 10);
      console.log("📋 [CreatePreview] Generating preview for portfolio:", portfolioIdNum);

      const preview = await portfolioService.generatePortfolioPreview(
        portfolioIdNum,
        accessToken,
        highlightsDescription.trim(),
      );

      console.log("📋 [CreatePreview] Preview generated successfully:", preview);
      notify.success("Tạo bản preview thành công!");

      // Navigate to preview page
      navigate(`/portfolio/${portfolioIdNum}/preview`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Không thể tạo preview";
      console.error("❌ Error generating preview:", errorMessage);
      setError(errorMessage);
      notify.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <CustomLoading />;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-8">
      <div className="max-w-4xl mx-auto px-4 md:px-10">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-slate-200 rounded-full transition-colors cursor-pointer mb-6"
        >
          <ArrowLeft size={24} />
        </button>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div>
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">✨</div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Tạo bản preview
              </h2>
              <p className="text-slate-600">
                Hệ thống sẽ tự động tạo bản preview chuyên nghiệp cho portfolio của bạn dựa trên thông tin hiện có.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div className="mb-8">
              <label htmlFor="highlights" className="block text-sm font-semibold text-slate-900 mb-2">
                Mô tả nổi bật <span className="text-red-500">*</span>
              </label>
              <textarea
                id="highlights"
                value={highlightsDescription}
                onChange={(e) => {
                  setHighlightsDescription(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Ví dụ: Frontend developer với 2 năm kinh nghiệm, sertified AWS, chuyên React và React Native"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={4}
              />
              <p className="text-xs text-slate-500 mt-2">
                Mô tả ngắn gọn về những thành tựu và kỹ năng nổi bật của bạn
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-2.5 rounded-lg font-semibold transition-all border border-slate-300 text-slate-700 hover:bg-slate-50 active:scale-95"
              >
                Hủy
              </button>
              <button
                onClick={handleGeneratePreview}
                disabled={loading || !highlightsDescription.trim()}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2.5 rounded-lg font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Đang tạo..." : "Tạo preview"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
