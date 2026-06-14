import {
  Clock,
  Calendar,
  Inbox,
  Award,
  CheckCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/hook";
import {
  fetchPublicChallenges,
  fetchMyCompletedChallenges,
} from "@/services/challenge.api";
import { Challenge } from "@/types/challenge";
import { MyCompletedChallenge } from "@/types/challenge";
import CustomLoading from "@/components/Loading/Loading";
import { notify } from "@/lib/toast";

type TabType = "active" | "completed";
type DisplayChallenge = Challenge | MyCompletedChallenge;

function ChallengeCard({
  challenge,
  onClick,
  isCompleted = false,
}: {
  challenge: DisplayChallenge;
  onClick: () => void;
  isCompleted?: boolean;
}) {
  const isPublicChallenge = !isCompleted;

  const title = isPublicChallenge
    ? (challenge as Challenge).title
    : (challenge as MyCompletedChallenge).challengeTitle;

  const description = isPublicChallenge
    ? (challenge as Challenge).description
    : (challenge as MyCompletedChallenge).challengeDescription;

  const deadline = isPublicChallenge
    ? (challenge as Challenge).deadline
    : (challenge as MyCompletedChallenge).challengeDeadline;

  const deadlineDate = new Date(deadline);
  const now = new Date();
  const isExpired = deadlineDate < now;

  const daysLeft = Math.ceil(
    (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );

  const difficulty = isPublicChallenge
    ? (challenge as Challenge).activeVersion?.difficultyLabel ||
      (challenge as Challenge).difficultyLabel ||
      "Unknown"
    : "Completed";

  const difficultyConfig: Record<string, { label: string; color: string }> = {
    Easy: { label: "Dễ", color: "bg-emerald-100 text-emerald-700" },
    Medium: { label: "Vừa", color: "bg-amber-100 text-amber-700" },
    Hard: { label: "Khó", color: "bg-rose-100 text-rose-700" },
    Completed: {
      label: "Đã hoàn thành",
      color: "bg-violet-100 text-violet-700",
    },
  };

  const currentDifficulty = difficultyConfig[difficulty] || {
    label: difficulty,
    color: "bg-slate-100 text-slate-700",
  };

  // Dữ liệu cho Completed
  const completedData = challenge as MyCompletedChallenge;
  const score = completedData.latestEvaluationScore;
  const status = completedData.latestSubmissionStatus;
  const attemptCount = completedData.attemptCount || 1;
  const evaluationStatus = completedData.latestEvaluationStatus;
  const feedback = completedData.latestFeedback;
  const submittedAt = completedData.latestSubmittedAt
    ? new Date(completedData.latestSubmittedAt)
    : null;

  const translateSubmissionStatus = (status: string) => {
    const map: Record<string, string> = {
      Pending: "Đang chờ chấm",
      Submitted: "Đã nộp bài",
      Processing: "Đang xử lý",
      Graded: "Đã chấm điểm",
    };
    return map[status] || status;
  };

  const translateEvaluationStatus = (status: string) => {
    const map: Record<string, string> = {
      Completed: "Thành công",
      Pending: "Đang chờ",
    };
    return map[status] || status;
  };

  return (
    <div
      onClick={!isCompleted ? onClick : undefined}
      className={`group flex flex-col justify-between p-6 rounded-3xl border bg-white transition-all duration-300 h-full relative
        ${
          isCompleted
            ? "border-violet-200 hover:border-violet-300 shadow-sm"
            : isExpired
              ? "border-rose-200 bg-rose-50/50 hover:border-rose-300 hover:shadow-xl cursor-pointer"
              : "border-slate-200 hover:border-blue-200 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
        }`}
    >
      {/* Badge Expired / Completed */}
      {isCompleted ? (
        <div className="absolute top-4 right-4 px-3 py-1 bg-violet-600 text-white text-xs font-semibold rounded-full flex items-center gap-1 shadow-sm">
          <Award size={14} />
          ĐÃ HOÀN THÀNH
        </div>
      ) : isExpired && (
        <div className="absolute top-4 right-4 px-3 py-1 bg-rose-600 text-white text-xs font-semibold rounded-full flex items-center gap-1 shadow-sm">
          <Clock size={14} />
          Hết hạn
        </div>
      )}

      <div>
        {/* Title & Badges */}
        <div className="mb-5">
          <h3 className={`text-lg font-semibold mb-3 line-clamp-2 leading-tight transition-colors
            ${isCompleted ? "text-violet-800" : "text-slate-900 group-hover:text-blue-600"}`}>
            {title}
          </h3>

          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${currentDifficulty.color}`}>
              {currentDifficulty.label}
            </span>

            {!isCompleted && daysLeft > 0 && (
              <div className="inline-flex items-center gap-1.5 text-xs bg-emerald-100 border border-emerald-200 text-emerald-700 px-3 py-1 rounded-full font-medium">
                <Clock size={14} />
                Còn {daysLeft} ngày
              </div>
            )}

            {isCompleted && (
              <div className="inline-flex items-center gap-1 text-xs bg-emerald-100 border border-emerald-200 text-emerald-700 px-3 py-1 rounded-full font-medium">
                <CheckCircle size={14} />
                {translateSubmissionStatus(status)}
                {score !== null && ` • ${score}đ`}
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {description && (
          <p className={`text-sm mb-6 line-clamp-3 leading-relaxed ${isCompleted ? "text-slate-600" : "text-slate-600"}`}>
            {description}
          </p>
        )}

        {/* Completed Details */}
        {isCompleted && (
          <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-3 mb-5">
            <div className="font-semibold text-slate-700 border-b border-slate-200 pb-2 flex items-center gap-2">
              <CheckCircle size={15} className="text-violet-600" />
              Chi tiết kết quả
            </div>

            {submittedAt && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Nộp lần cuối:</span>
                <span className="font-medium text-slate-800">
                  {submittedAt.toLocaleString("vi-VN")}
                </span>
              </div>
            )}

            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Trạng thái chấm:</span>
              <span className={`font-medium ${evaluationStatus === "Completed" ? "text-emerald-600" : "text-amber-600"}`}>
                {translateEvaluationStatus(evaluationStatus)}
              </span>
            </div>

            {feedback && (
              <div className="pt-3 border-t border-slate-200">
                <p className="text-slate-500 text-xs mb-1.5">Nhận xét từ giám khảo:</p>
                <p className="text-slate-700 bg-white p-3 rounded-xl border border-slate-100 italic text-[13px] leading-relaxed whitespace-pre-line">
                  "{feedback}"
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="pt-5 border-t border-slate-100 space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span className="flex items-center gap-2 text-slate-500">
            <Calendar size={16} />
            Hạn chót:
          </span>
          <span className={`font-medium ${isExpired ? "text-rose-600" : "text-slate-700"}`}>
            {deadlineDate.toLocaleDateString("vi-VN", { 
              day: "numeric", 
              month: "short", 
              year: "numeric" 
            })}
          </span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="flex items-center gap-2 text-slate-500">
            <Award size={16} />
            Số lần nộp:
          </span>
          <span className="font-semibold text-slate-700">{attemptCount} lần</span>
        </div>

        {/* Button chỉ hiển thị ở tab Đang diễn ra */}
        {!isCompleted && (
          <button className="w-full mt-3 py-3 bg-white border border-slate-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 text-slate-700 font-medium rounded-2xl transition-all duration-200 text-sm">
            Xem chi tiết thử thách
          </button>
        )}
      </div>
    </div>
  );
}

// ====================== MAIN COMPONENT ======================

export default function ChallengeTalent() {
  const navigate = useNavigate();
  const { accessToken } = useAppSelector((state) => state.auth);

  const [publicChallenges, setPublicChallenges] = useState<Challenge[]>([]);
  const [completedChallenges, setCompletedChallenges] = useState<MyCompletedChallenge[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("active");

  const loadPublicChallenges = async () => {
    try {
      const response = await fetchPublicChallenges(0, 50);
      setPublicChallenges(response.items || []);
    } catch (err) {
      console.error("❌ Error loading public challenges:", err);
    }
  };

  const loadCompletedChallenges = async () => {
    if (!accessToken) return;
    try {
      const response = await fetchMyCompletedChallenges(0, 30, accessToken);
      setCompletedChallenges(response.items || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Có lỗi khi tải dữ liệu";
      notify.error(errorMessage);
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      setIsLoading(true);
      await Promise.all([loadPublicChallenges(), loadCompletedChallenges()]);
      setIsLoading(false);
    };
    loadAll();
  }, [accessToken]);

  const handleChallengeClick = (challenge: DisplayChallenge, isCompleted: boolean) => {
    if (!isCompleted) {
      const publicChallenge = challenge as Challenge;
      navigate(`/talent-challenge/${publicChallenge.id}`);
    }
  };

  const displayChallenges = activeTab === "active" ? publicChallenges : completedChallenges;
  const isCompletedTab = activeTab === "completed";

  if (isLoading) return <CustomLoading />;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            Thử thách của tôi
          </h1>
          <p className="text-slate-600 mt-2 text-lg">
            Khám phá và theo dõi tiến độ các thử thách kỹ năng
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 mb-8 gap-8">
          <button
            onClick={() => setActiveTab("active")}
            className={`pb-4 text-base font-semibold transition-all relative ${
              activeTab === "active" ? "text-blue-600" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Đang diễn ra
            <span className={`ml-2 px-2.5 py-0.5 text-xs rounded-full font-medium ${
              activeTab === "active" ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"
            }`}>
              {publicChallenges.length}
            </span>
            {activeTab === "active" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("completed")}
            className={`pb-4 text-base font-semibold transition-all relative ${
              activeTab === "completed" ? "text-violet-600" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Đã hoàn thành
            <span className={`ml-2 px-2.5 py-0.5 text-xs rounded-full font-medium ${
              activeTab === "completed" ? "bg-violet-100 text-violet-600" : "bg-slate-100 text-slate-500"
            }`}>
              {completedChallenges.length}
            </span>
            {activeTab === "completed" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600 rounded" />
            )}
          </button>
        </div>

        {displayChallenges.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Inbox size={42} className="text-slate-400" />
            </div>
            <h3 className="text-2xl font-semibold text-slate-900 mb-3">
              {activeTab === "active"
                ? "Không có thử thách nào đang diễn ra"
                : "Chưa có thử thách nào hoàn thành"}
            </h3>
            <p className="text-slate-600 max-w-md mx-auto">
              {activeTab === "active"
                ? "Các thử thách hiện tại đã kết thúc hoặc chưa được công bố."
                : "Kết quả nộp bài sẽ xuất hiện ở đây sau khi bạn tham gia và được chấm điểm."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayChallenges.map((challenge, index) => (
              <ChallengeCard
                key={index}
                challenge={challenge}
                onClick={() => handleChallengeClick(challenge, isCompletedTab)}
                isCompleted={isCompletedTab}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}