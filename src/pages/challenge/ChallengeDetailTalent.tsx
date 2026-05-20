import {
  ArrowLeft,
  Clock,
  Code2,
  Link as LinkIcon,
  Send,
  AlertCircle,
  Award,
  ExternalLink,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchPublicChallengeDetail,
  createSubmission,
  getMyChallengeSubmissions,
} from "@/services/challenge.api";
import { useAppSelector } from "@/store/hook";
import { Challenge, MyChallengeSubmissionsResponse } from "@/types/challenge";
import CustomLoading from "@/components/Loading/Loading";
import { notify } from "@/lib/toast";
import { formatToLocalTime } from "@/utils/time";

export default function ChallengeDetailTalent() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [submissions, setSubmissions] =
    useState<MyChallengeSubmissionsResponse | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Chỉ còn 2 tab: details và criteria
  const [activeTab, setActiveTab] = useState<"details" | "criteria">("details");

  // Form states
  const [code, setCode] = useState("");
  const [submissionLink, setSubmissionLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { accessToken } = useAppSelector((state) => state.auth);

  // Load challenge detail
  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        setIsLoading(true);
        const data = await fetchPublicChallengeDetail(id);
        setChallenge(data);
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Có lỗi khi tải dữ liệu";
        setError(msg);
        notify.error(msg);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  // Load my submissions
  useEffect(() => {
    if (!id || !accessToken) return;

    const loadSubmissions = async () => {
      try {
        setIsLoadingSubmissions(true);
        const data = await getMyChallengeSubmissions(id, 0, 20, accessToken);
        setSubmissions(data);
      } catch (err) {
        console.error("Lỗi tải bài nộp:", err);
      } finally {
        setIsLoadingSubmissions(false);
      }
    };

    loadSubmissions();
  }, [id, accessToken]);

  const handleSubmit = async () => {
    if (!code.trim() && !submissionLink.trim()) {
      notify.warning("Vui lòng nhập mã code hoặc link GitHub");
      return;
    }
    if (!id || !accessToken) return;

    try {
      setIsSubmitting(true);
      const payload = { content: code, githubUrl: submissionLink };
      await createSubmission(id, payload, accessToken);

      notify.success("Nộp bài thành công!");

      // Reset form
      setCode("");
      setSubmissionLink("");

      // Refresh danh sách bài nộp
      const refreshed = await getMyChallengeSubmissions(id, 0, 20, accessToken);
      setSubmissions(refreshed);
    } catch (err) {
      notify.error(err instanceof Error ? err.message : "Có lỗi khi nộp bài");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <CustomLoading />;

  if (error || !challenge) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">
            {error || "Không tìm thấy thử thách"}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:underline"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const deadline = new Date(challenge.deadline);
  const daysLeft = Math.ceil(
    (deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );
  const difficulty =
    challenge.activeVersion?.difficultyLabel ||
    challenge.difficultyLabel ||
    "Unknown";

  const difficultyConfig: Record<string, { label: string; color: string }> = {
    Easy: { label: "Dễ", color: "bg-green-100 text-green-800" },
    Medium: { label: "Vừa", color: "bg-yellow-100 text-yellow-800" },
    Hard: { label: "Khó", color: "bg-red-100 text-red-800" },
  };

  const currentDifficulty = difficultyConfig[difficulty] || {
    label: difficulty,
    color: "bg-slate-100 text-slate-800",
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Nút quay lại và Tiêu đề */}
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-medium"
          >
            <ArrowLeft size={20} />
            Quay lại
          </button>

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-slate-900 mb-3">
              {challenge.title}
            </h1>
            <div className="flex items-center gap-3 flex-wrap">
              <span
                className={`px-3 py-1 rounded text-sm font-medium ${currentDifficulty.color}`}
              >
                {currentDifficulty.label}
              </span>
              {daysLeft > 0 ? (
                <span className="flex items-center gap-1 text-sm text-orange-600 font-medium">
                  <Clock size={14} /> Còn {daysLeft} ngày
                </span>
              ) : (
                <span className="flex items-center gap-1 text-sm text-red-600 font-medium">
                  <AlertCircle size={14} /> Đã hết hạn
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Khối Grid phía trên: Chi tiết & Form nộp bài */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Content (Details & Criteria) */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
            <div className="flex border-b border-slate-200 mb-6">
              <button
                onClick={() => setActiveTab("details")}
                className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
                  activeTab === "details"
                    ? "text-blue-600 border-blue-600"
                    : "text-slate-600 border-transparent hover:text-slate-900"
                }`}
              >
                Chi tiết
              </button>
              <button
                onClick={() => setActiveTab("criteria")}
                className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
                  activeTab === "criteria"
                    ? "text-blue-600 border-blue-600"
                    : "text-slate-600 border-transparent hover:text-slate-900"
                }`}
              >
                Tiêu chí ({challenge.activeVersion?.criteria?.length || 0})
              </button>
            </div>

            {/* Tab Contents */}
            {activeTab === "details" && (
              <div className="space-y-6">
                {challenge.description && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-slate-800">
                      Mô tả
                    </h3>
                    <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">
                      {challenge.description}
                    </p>
                  </div>
                )}
                {challenge.expectedSolution && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-slate-800">
                      Giải pháp mong đợi
                    </h3>
                    <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">
                      {challenge.expectedSolution}
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "criteria" && (
              <div className="space-y-4">
                {challenge.activeVersion?.criteria?.map((c) => (
                  <div
                    key={c.id}
                    className="p-4 border border-slate-200 rounded-lg bg-slate-50/50"
                  >
                    <h4 className="font-semibold text-slate-800">{c.name}</h4>
                    <p className="text-sm text-slate-600 mt-1">
                      {c.description}
                    </p>
                    <p className="text-blue-600 text-sm font-medium mt-2">
                      {c.maxScore} điểm
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Form Nộp Bài */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-slate-200 p-6 sticky top-8 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Send size={18} className="text-blue-600" />
                Nộp bài
              </h3>

              <div className="mb-5">
                <div className="flex items-center gap-2 mb-2">
                  <Code2 size={16} className="text-slate-600" />
                  <label className="text-sm font-semibold text-slate-900">
                    Mã nguồn
                  </label>
                </div>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Dán code tại đây..."
                  className="w-full h-40 p-3 border border-slate-300 rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <LinkIcon size={16} className="text-slate-600" />
                  <label className="text-sm font-semibold text-slate-900">
                    Link GitHub
                  </label>
                </div>
                <input
                  type="url"
                  value={submissionLink}
                  onChange={(e) => setSubmissionLink(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting || daysLeft <= 0}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
              >
                <Send size={18} />
                {isSubmitting ? "Đang nộp bài..." : "Nộp bài"}
              </button>

              {daysLeft <= 0 && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
                  <AlertCircle size={16} />
                  Thử thách đã hết hạn nộp bài.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Khối phía dưới: Bài nộp của tôi (Đã được chuyển xuống đây) */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <div className="border-b border-slate-200 pb-4 mb-6 flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Award size={22} className="text-blue-600" />
              Bài nộp của tôi
            </h3>
            <span className="bg-slate-100 text-slate-700 text-sm font-semibold px-2.5 py-1 rounded-full">
              Tổng số: {submissions?.totalCount || 0}
            </span>
          </div>

          <div className="space-y-6">
            {isLoadingSubmissions ? (
              <p className="text-center py-12 text-slate-500">
                Đang tải bài nộp...
              </p>
            ) : submissions?.items?.length ? (
              <div className="grid grid-cols-1 gap-6">
                {submissions.items.map((sub) => (
                  <div
                    key={sub.id}
                    className="border border-slate-200 rounded-xl p-6 hover:shadow-md transition-all bg-slate-50/30"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-sm text-slate-500">
                          Nộp lúc: {formatToLocalTime(sub.submittedAt)}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          sub.evaluationStatus === "GRADED" ||
                          sub.submissionStatus === "GRADED"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {sub.submissionStatus === "Graded"
                          ? "Đã chấm điểm"
                          : sub.submissionStatus}
                      </span>
                    </div>

                    {sub.evaluationScore !== null && (
                      <div className="flex items-center gap-2 mb-4 bg-amber-50/60 w-fit px-4 py-2 rounded-lg border border-amber-100">
                        <span className="text-3xl font-bold text-amber-700">
                          {sub.evaluationScore}
                        </span>
                        <span className="text-sm text-amber-600 font-medium">
                          điểm
                        </span>
                      </div>
                    )}

                    {sub.gitHubLink && (
                      <a
                        href={sub.gitHubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 mb-4 w-fit"
                      >
                        <ExternalLink size={18} />
                        Xem dự án trên GitHub
                      </a>
                    )}

                    {sub.submissionContent && (
                      <div className="mb-5">
                        <p className="font-semibold text-sm mb-2 text-slate-700">
                          Mã nguồn đã nộp:
                        </p>
                        <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm font-mono whitespace-pre-wrap overflow-auto max-h-80 shadow-inner">
                          {sub.submissionContent}
                        </pre>
                      </div>
                    )}

                    {sub.feedback && (
                      <div>
                        <p className="font-semibold text-sm mb-2 text-slate-700">
                          Nhận xét từ AI:
                        </p>
                        <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg text-slate-700 whitespace-pre-wrap leading-relaxed">
                          {sub.feedback}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Code2 className="mx-auto text-slate-400 mb-3" size={40} />
                <p className="font-medium">
                  Bạn chưa có bài nộp nào cho thử thách này.
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  Hãy chuẩn bị mã nguồn và nộp bài ở khung bên trên nhé!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
