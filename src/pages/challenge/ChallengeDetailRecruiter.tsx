import { ArrowLeft, CheckCircle2, Send, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "@/store/hook";
import { getChallengeDetail, submitChallengeForReview, approveAndPublishChallenge, getChallengeSubmissions } from "@/services/challenge.api";
import { Challenge } from "@/types/challenge";
import { ChallengeSubmissionDetail } from "@/types/challenge";
import CustomLoading from "@/components/Loading/Loading";
import { notify } from "@/lib/toast";
import { formatToLocalTime } from "@/utils/time";

export default function ChallengeDetailRecruiter() {
  const navigate = useNavigate();
  const { challengeId } = useParams<{ challengeId: string }>();
  const { accessToken } = useAppSelector((state) => state.auth);

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissions, setSubmissions] = useState<ChallengeSubmissionDetail[]>([]);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);
  const [expandedSubmissionId, setExpandedSubmissionId] = useState<string | null>(null);

  const loadChallengeSubmissions = useCallback(
    async (cId: string) => {
      if (!accessToken) return;
      try {
        setIsLoadingSubmissions(true);
        console.log("📡 [ChallengeDetailRecruiter] Loading submissions for challenge:", cId);
        const submissionsData = await getChallengeSubmissions(cId, accessToken);
        setSubmissions(submissionsData.items || []);
        console.log("✅ [ChallengeDetailRecruiter] Submissions loaded:", submissionsData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Có lỗi khi tải danh sách bài nộp";
        console.error("❌ Error loading submissions:", errorMessage);
      } finally {
        setIsLoadingSubmissions(false);
      }
    },
    [accessToken]
  );

  const loadChallengeDetail = useCallback(async () => {
    try {
      setIsLoading(true);

      if (!challengeId || !accessToken) {
        throw new Error("Invalid challenge ID or token");
      }

      const id = challengeId;
      console.log("📡 [ChallengeDetailRecruiter] Loading challenge:", id);
      const challengeData = await getChallengeDetail(id, accessToken);
      setChallenge(challengeData);
      console.log("✅ [ChallengeDetailRecruiter] Challenge loaded:", challengeData);

      await loadChallengeSubmissions(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Có lỗi khi tải dữ liệu";
      console.error("❌ Error loading challenge:", errorMessage);
      notify.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [challengeId, accessToken, loadChallengeSubmissions]);

  useEffect(() => {
    if (challengeId) {
      loadChallengeDetail();
    }
  }, [challengeId, loadChallengeDetail]);

  const handleSubmitForReview = async () => {
    if (!challenge || !challengeId || !accessToken) return;
    
    try {
      setIsSubmitting(true);
      console.log("📡 Submitting challenge for review:", challenge.id);
      
      const updatedChallenge = await submitChallengeForReview(challengeId, accessToken);
      
      // Cập nhật lại state -> Thử thách chuyển sang "PendingReview"
      // Lúc này nút "Tự xuất bản ngay" sẽ tự động được mở khóa (enable)
      setChallenge(updatedChallenge);
      notify.success("Gửi thành công");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Có lỗi khi gửi duyệt";
      notify.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublishNow = async () => {
    if (!challenge || !challengeId || !accessToken) return;
    
    try {
      setIsSubmitting(true);
      console.log("📡 Publishing challenge immediately:", challenge.id);
      
      const updatedChallenge = await approveAndPublishChallenge(challengeId, accessToken);
      
      setChallenge(updatedChallenge);
      notify.success("Xuất bản thử thách thành công");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Có lỗi khi xuất bản";
      notify.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <CustomLoading />;
  }

  if (!challenge) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto text-red-600 mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Không tìm thấy thử thách</h1>
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

  const createdDate = new Date(challenge.createdAt).toLocaleDateString("vi-VN");
  const deadline = new Date(challenge.deadline).toLocaleDateString("vi-VN");

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "Draft":
        return { label: "Nháp", color: "bg-slate-100 text-slate-800" };
      case "PendingReview":
        return { label: "Chờ duyệt", color: "bg-yellow-100 text-yellow-800" };
      case "Published":
        return { label: "Đã xuất bản", color: "bg-green-100 text-green-800" };
      case "Rejected":
        return { label: "Đã từ chối", color: "bg-red-100 text-red-800" };
      case "Expired":
        return { label: "Đã hết hạn", color: "bg-red-100 text-red-800" };
      default:
        return { label: status, color: "bg-slate-100 text-slate-800" };
    }
  };

  const statusDisplay = getStatusDisplay(challenge.status ?? "");

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-medium"
        >
          <ArrowLeft size={20} />
          Quay lại
        </button>

        {/* Challenge Info */}
        <div className="bg-white rounded-lg border border-slate-200 p-8 mb-6">
          {/* Title and Status */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-3">
              <h1 className="text-3xl font-bold text-slate-900">{challenge.title}</h1>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${statusDisplay.color}`}>
                {statusDisplay.label}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-3">Mô tả</h2>
            <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">
              {challenge.description}
            </p>
          </div>

          {/* Expected Solution */}
          {challenge.expectedSolution && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-slate-900 mb-3">Giải pháp mong đợi</h2>
              <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">
                {challenge.expectedSolution}
              </p>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg mb-8">
            <div>
              <p className="text-sm text-slate-500">Ngày tạo</p>
              <p className="text-sm font-semibold text-slate-900">{createdDate}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Hạn chót</p>
              <p className="text-sm font-semibold text-slate-900">{deadline}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Trạng thái</p>
              <p className="text-sm font-semibold text-slate-900">{statusDisplay.label}</p>
            </div>
            {challenge.reviewedById && (
              <div>
                <p className="text-sm text-slate-500">Duyệt bởi</p>
                <p className="text-sm font-semibold text-slate-900">ID: {challenge.reviewedById}</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSubmitForReview}
              disabled={isSubmitting || challenge.status !== "Draft"}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} />
              Gửi
            </button>
            <button
              onClick={handlePublishNow}
              disabled={isSubmitting || challenge.status !== "PendingReview"}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle2 size={18} />
              Tự xuất bản ngay
            </button>
          </div>
        </div>

        {/* Submissions List */}
        <div className="bg-white rounded-lg border border-slate-200 p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Danh sách đã nộp</h2>
          
          {isLoadingSubmissions ? (
            <div className="text-center py-12">
              <CustomLoading />
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle size={48} className="mx-auto text-slate-400 mb-4" />
              <p className="text-slate-500">Chưa có bài nộp nào</p>
            </div>
          ) : (
            <div className="space-y-3">
              {submissions.map((submission) => (
                <div key={submission.id}>
                  {/* Submission Item Row */}
                  <div className="border border-slate-200 rounded-lg hover:border-slate-300 hover:shadow-sm transition-all bg-white">
                    <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center">
                      {/* Email */}
                      <div className="col-span-2">
                        <p className="text-xs text-slate-500 mb-1">Email</p>
                        <p className="text-sm text-slate-600 truncate">{submission.userEmail}</p>
                      </div>

                      {/* User Info */}
                      <div className="col-span-3">
                        <p className="text-xs text-slate-500 mb-1">Người nộp</p>
                        <div className="flex items-center gap-2">
                          <img
                            src={submission.userAvatar}
                            alt={submission.userName}
                            className="w-8 h-8 rounded-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src =
                                "https://via.placeholder.com/32?text=Avatar";
                            }}
                          />
                          <span className="text-sm text-slate-900 font-medium">{submission.userName}</span>
                        </div>
                      </div>

                      {/* Submit Time */}
                      <div className="col-span-2">
                        <p className="text-xs text-slate-500 mb-1">Thời điểm nộp</p>
                        <p className="text-sm text-slate-600">{formatToLocalTime(submission.submittedAt)}</p>
                      </div>

                      {/* Score */}
                      <div className="col-span-1">
                        <p className="text-xs text-slate-500 mb-1">Điểm</p>
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-full font-semibold text-sm">
                          {submission.evaluationScore}
                        </span>
                      </div>

                      {/* Attempt Count */}
                      <div className="col-span-1">
                        <p className="text-xs text-slate-500 mb-1">Lần nộp</p>
                        <p className="text-sm text-slate-600">{submission.attemptCount}</p>
                      </div>

                      {/* Expand Button */}
                      <div className="col-span-1 flex justify-center">
                        <button
                          onClick={() => {
                            setExpandedSubmissionId(
                              expandedSubmissionId === submission.id ? null : submission.id
                            );
                          }}
                          className="inline-flex items-center justify-center p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                        >
                          {expandedSubmissionId === submission.id ? (
                            <ChevronUp size={18} />
                          ) : (
                            <ChevronDown size={18} />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {expandedSubmissionId === submission.id && (
                      <div className="border-t border-slate-200 px-6 py-4 bg-slate-50">
                        <div className="space-y-4">
                          {/* Submission Content */}
                          <div>
                            <h4 className="text-sm font-semibold text-slate-900 mb-2">Nội dung bài nộp</h4>
                            <p className="text-sm text-slate-600 whitespace-pre-wrap bg-white rounded p-3 border border-slate-200">
                              {submission.submissionContent || "Không có nội dung"}
                            </p>
                          </div>

                          {/* GitHub Link */}
                          {submission.gitHubLink && (
                            <div>
                              <h4 className="text-sm font-semibold text-slate-900 mb-2">GitHub Link</h4>
                              <a
                                href={submission.gitHubLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:text-blue-700 hover:underline break-all"
                              >
                                {submission.gitHubLink}
                              </a>
                            </div>
                          )}

                          {/* Evaluation Details */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-sm font-semibold text-slate-900 mb-1">Ngày đánh giá</h4>
                              <p className="text-sm text-slate-600">
                                {submission.evaluatedAt
                                  ? formatToLocalTime(submission.evaluatedAt)
                                  : "Chưa đánh giá"}
                              </p>
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-slate-900 mb-1">Trạng thái đánh giá</h4>
                              <p className="text-sm text-slate-600">
                                {submission.evaluationStatus === "Pending"
                                  ? "Chờ đánh giá"
                                  : submission.evaluationStatus === "Completed"
                                  ? "Đã đánh giá"
                                  : submission.evaluationStatus}
                              </p>
                            </div>
                          </div>

                          {/* Feedback */}
                          {submission.feedback && (
                            <div>
                              <h4 className="text-sm font-semibold text-slate-900 mb-2">Nhận xét</h4>
                              <p className="text-sm text-slate-600 whitespace-pre-wrap bg-white rounded p-3 border border-slate-200">
                                {submission.feedback}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}