import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { portfolioService, PortfolioPreview } from "@/services/portfolio.api";
import { useAppSelector } from "@/store/hook";
import { notify } from "@/lib/toast";
import CustomLoading from "@/components/Loading/Loading";
import { formatToLocalTime } from "@/utils/time";

export default function PreviewPortfolio() {
  const navigate = useNavigate();
  const { portfolioId } = useParams<{ portfolioId: string }>();
  const [preview, setPreview] = useState<PortfolioPreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const { accessToken } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        setLoading(true);
        setError(null);
        setNotFound(false);

        if (!accessToken) {
          notify.error("Vui lòng đăng nhập để xem preview");
          navigate("/login");
          return;
        }

        if (!portfolioId) {
          setError("Portfolio ID không hợp lệ");
          return;
        }

        const portfolioIdNum = parseInt(portfolioId, 10);
        console.log(
          "📋 [PreviewPortfolio] Fetching preview for portfolio:",
          portfolioIdNum,
        );

        const previewData = await portfolioService.fetchPortfolioPreview(
          portfolioIdNum,
          accessToken,
        );

        console.log("📋 [PreviewPortfolio] Fetch result:", previewData);
        console.log(
          "📋 [PreviewPortfolio] Has previewJson:",
          !!previewData?.previewJson,
        );

        if (!previewData) {
          console.warn("📋 [PreviewPortfolio] Preview data is null/undefined");
          setNotFound(true);
          return;
        }

        // Validate that preview has required fields
        if (!previewData.previewJson) {
          console.warn(
            "📋 [PreviewPortfolio] Preview missing previewJson field",
          );
          setNotFound(true);
          return;
        }

        setPreview(previewData);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Không thể tải preview";
        console.error("❌ Error fetching preview:", errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();
  }, [portfolioId, accessToken, navigate]);

  if (loading) {
    return <CustomLoading />;
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-8">
        <div className="max-w-4xl mx-auto px-4 md:px-10">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors cursor-pointer mb-6"
          >
            <ArrowLeft size={24} />
          </button>

          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Bản preview của portfolio không tìm thấy
            </h2>
            <p className="text-slate-600 mb-6">
              Hãy tạo bản preview để xem thông tin của portfolio
            </p>
            <button
              onClick={() => navigate(`/portfolio/${portfolioId}/create-preview`)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold transition-all active:scale-95"
            >
              Tạo bản preview
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-8">
        <div className="max-w-4xl mx-auto px-4 md:px-10">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors cursor-pointer mb-6"
          >
            <ArrowLeft size={24} />
          </button>

          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!preview) {
    return null;
  }

  const previewJson = preview.previewJson || {};

  console.log("📋 [PreviewPortfolio] Rendering with data:", {
    portfolioId: preview.portfolioId,
    hasImage: !!preview.imageUrl,
    previewJsonFields: Object.keys(previewJson),
  });

  // Check if preview has any meaningful content
  const hasContent =
    previewJson.title ||
    previewJson.keySkills ||
    previewJson.specialization ||
    previewJson.recentProjects ||
    previewJson.achievement ||
    previewJson.summary ||
    preview.highlightsDescription;

  if (!hasContent) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-8">
        <div className="max-w-4xl mx-auto px-4 md:px-10">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors cursor-pointer mb-6"
          >
            <ArrowLeft size={24} />
          </button>

          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Bản preview trống
            </h2>
            <p className="text-slate-600 mb-6">
              Portfolio này chưa có dữ liệu preview. Hãy chỉnh sửa portfolio để
              tạo preview.
            </p>
            <button
              onClick={() => navigate(`/portfolio/${preview.portfolioId}/create-preview`)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold transition-all active:scale-95"
            >
              Tạo bản preview
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-8">
      <div className="max-w-4xl mx-auto px-4 md:px-10">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-slate-200 rounded-full transition-colors cursor-pointer mb-6"
        >
          <ArrowLeft size={24} />
        </button>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Image Section */}
          {preview.imageUrl && (
            <div className="w-full bg-slate-100">
              <img 
                src={preview.imageUrl}
                alt="Portfolio Preview"
                className="w-full h-auto object-contain"
              />
            </div>
          )}

          {/* Content Section */}
          <div className="p-6 md:p-10">
            {/* Title */}
            {previewJson.title && (
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                  {previewJson.title}
                </h1>
              </div>
            )}

            {/* Highlights Description */}
            {preview.highlightsDescription && (
              <div className="mb-8 pb-6 border-b border-slate-200">
                <p className="text-lg text-blue-600 font-semibold">
                  {preview.highlightsDescription}
                </p>
              </div>
            )}

            {/* Key Skills */}
            {previewJson.keySkills && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-slate-900 mb-3">
                  Kỹ năng chính
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  {previewJson.keySkills}
                </p>
              </div>
            )}

            {/* Specialization */}
            {previewJson.specialization && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-slate-900 mb-3">
                  Chuyên môn
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  {previewJson.specialization}
                </p>
              </div>
            )}

            {/* Recent Projects */}
            {previewJson.recentProjects && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-slate-900 mb-3">
                  Dự án gần đây
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  {previewJson.recentProjects}
                </p>
              </div>
            )}

            {/* Achievement */}
            {previewJson.achievement && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-slate-900 mb-3">
                  Thành tích
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  {previewJson.achievement}
                </p>
              </div>
            )}

            {/* Summary */}
            {previewJson.summary && (
              <div className="mb-8 pb-8 border-b border-slate-200">
                <h2 className="text-xl font-bold text-slate-900 mb-3">
                  Tóm tắt
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  {previewJson.summary}
                </p>
              </div>
            )}

            {/* Metadata */}
            <div className="text-xs text-slate-500 space-y-1">
              <p>Phiên bản: {preview.version || "N/A"}</p>
              <p>
                Cập nhật lần cuối:{" "}
                {preview.updatedAt
                  ? formatToLocalTime(preview.updatedAt)
                  : "N/A"}
              </p>
              <p>Mô hình AI: {preview.generationModel || "N/A"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
