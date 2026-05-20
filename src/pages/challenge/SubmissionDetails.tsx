import { ArrowLeft, AlertCircle, Star,  FileText, Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "@/store/hook";
import { getSubmissionDetail } from "@/services/challenge.api";
import { SubmissionDetailResponse } from "@/types/challenge";
import CustomLoading from "@/components/Loading/Loading";
import { notify } from "@/lib/toast";

export default function SubmissionDetail() {
  const navigate = useNavigate();
  const { submissionId } = useParams<{ submissionId: string }>();
  const { accessToken } = useAppSelector((state) => state.auth);

  const [submission, setSubmission] = useState<SubmissionDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadSubmissionDetail = useCallback(async () => {
    try {
      setIsLoading(true);

      if (!submissionId || !accessToken) {
        throw new Error("Invalid submission ID or token");
      }

      console.log("📡 [SubmissionDetail] Loading submission:", submissionId);
      const data = await getSubmissionDetail(submissionId, accessToken);
      setSubmission(data);
      console.log("✅ [SubmissionDetail] Submission loaded:", data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Có lỗi khi tải dữ liệu";
      console.error("❌ Error loading submission:", errorMessage);
      notify.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [submissionId, accessToken]);

  useEffect(() => {
    if (submissionId) {
      loadSubmissionDetail();
    }
  }, [submissionId, loadSubmissionDetail]);

  if (isLoading) {
    return <CustomLoading />;
  }

  if (!submission) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto text-red-600 mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Không tìm thấy bài nộp</h1>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "Graded":
        return {
          label: "Đã chấm điểm",
          color: "bg-green-100 text-green-800",
          icon: <CheckCircle2 size={16} />,
        };
      case "Pending":
        return {
          label: "Đang chờ",
          color: "bg-yellow-100 text-yellow-800",
          icon: <Loader2 size={16} className="animate-spin" />,
        };
      case "Failed":
        return {
          label: "Thất bại",
          color: "bg-red-100 text-red-800",
          icon: <XCircle size={16} />,
        };
      default:
        return {
          label: status,
          color: "bg-slate-100 text-slate-800",
          icon: null,
        };
    }
  };

  const statusDisplay = getStatusDisplay(submission.status);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-medium"
        >
          <ArrowLeft size={20} />
          Quay lại
        </button>

        {/* Header card */}
        <div className="bg-white rounded-lg border border-slate-200 p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">
                Chi tiết bài nộp
              </h1>
              <p className="text-sm text-slate-500 font-mono">ID: {submission.id}</p>
            </div>
            <span
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold ${statusDisplay.color}`}
            >
              {statusDisplay.icon}
              {statusDisplay.label}
            </span>
          </div>

          {/* Score section */}
          <div className="p-6 bg-slate-50 rounded-lg mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Star size={20} className="text-yellow-500" />
                <span className="font-semibold text-slate-700">Điểm tổng</span>
              </div>
              <span
                className={`text-3xl font-bold ${getScoreColor(submission.overallScore)}`}
              >
                {submission.overallScore}
                <span className="text-lg text-slate-400 font-normal">/100</span>
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full transition-all duration-700 ${getScoreBarColor(submission.overallScore)}`}
                style={{ width: `${Math.min(submission.overallScore, 100)}%` }}
              />
            </div>
          </div>

          {/* Meta info grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 border border-slate-100 rounded-lg">
              <p className="text-xs text-slate-500 mb-1">Mã thử thách</p>
              <p className="text-sm font-semibold text-slate-800 font-mono truncate">
                {submission.challengeId}
              </p>
            </div>
            <div className="p-4 border border-slate-100 rounded-lg">
              <div className="flex items-center gap-1.5 mb-1">
                <Clock size={12} className="text-slate-400" />
                <p className="text-xs text-slate-500">Ngày nộp</p>
              </div>
              <p className="text-sm font-semibold text-slate-800">
                {new Date(submission.createdAt).toLocaleDateString("vi-VN", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            {submission.gradedAt && (
              <div className="p-4 border border-slate-100 rounded-lg">
                <div className="flex items-center gap-1.5 mb-1">
                  <CheckCircle2 size={12} className="text-slate-400" />
                  <p className="text-xs text-slate-500">Ngày chấm</p>
                </div>
                <p className="text-sm font-semibold text-slate-800">
                  {new Date(submission.gradedAt).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* AI Feedback */}
        {submission.aiFeedback && (
          <div className="bg-white rounded-lg border border-slate-200 p-8 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <FileText size={16} className="text-blue-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Nhận xét từ AI</h2>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-5">
              <p className="text-slate-700 whitespace-pre-wrap leading-relaxed text-sm">
                {submission.aiFeedback}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}