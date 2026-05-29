import {
  Clock,
  Calendar,
  Inbox,
  Award,
  CheckCircle,
  MessageSquare,
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

  // Xử lý dữ liệu chung dựa vào loại tab
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

  // Difficulty / Thẻ trạng thái góc trái
  const difficulty = isPublicChallenge
    ? (challenge as Challenge).activeVersion?.difficultyLabel ||
      (challenge as Challenge).difficultyLabel ||
      "Unknown"
    : "Completed";

  const difficultyConfig: Record<string, { label: string; color: string }> = {
    Easy: {
      label: "Dễ",
      color: "bg-emerald-50 text-emerald-700 border-emerald-100",
    },
    Medium: {
      label: "Vừa",
      color: "bg-amber-50 text-amber-700 border-amber-100",
    },
    Hard: { label: "Khó", color: "bg-rose-50 text-rose-700 border-rose-100" },
    Completed: {
      label: "Đã hoàn thành",
      color: "bg-violet-50 text-violet-700 border-violet-100",
    },
  };

  const currentDifficulty = difficultyConfig[difficulty] || {
    label: difficulty,
    color: "bg-slate-50 text-slate-700 border-slate-200",
  };

  // Dữ liệu riêng cho tab Đã hoàn thành
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

  // Hàm chuyển đổi trạng thái đánh giá
  const translateEvaluationStatus = (status: string) => {
    const map: Record<string, string> = {
      Completed: "Thành công",
      Pending: "Đang chờ",
    };
    return map[status] || status;
  };
  return (
    <div
      // Chỉ kích hoạt onClick chuyển trang nếu đây là thử thách Đang diễn ra
      onClick={!isCompleted ? onClick : undefined}
      className={`flex flex-col justify-between p-6 rounded-xl border bg-white transition-all duration-300 h-full relative
        ${
          isCompleted
            ? "border-violet-200 shadow-sm shadow-violet-50/50" // Card hoàn thành tĩnh, không đổi border hoặc con trỏ link
            : isExpired
              ? "border-rose-100 bg-rose-50/10 hover:border-rose-300 cursor-pointer group"
              : "border-slate-200 hover:border-blue-400 hover:shadow-xl hover:shadow-slate-100 cursor-pointer group"
        }`}
    >
      {/* Badge góc trên bên phải */}
      {isCompleted && (
        <div className="absolute top-4 right-4 px-3 py-1 bg-violet-600 text-white text-xs font-semibold rounded-full flex items-center gap-1 shadow-sm z-10">
          <Award size={14} />
          ĐÃ HOÀN THÀNH
        </div>
      )}

      <div>
        {/* Tiêu đề thử thách */}
        <div className="mb-4 pr-28">
          {" "}
          {/* Thêm padding right để tránh đè chữ vào badge ĐÃ HOÀN THÀNH */}
          <h3
            className={`text-base font-bold mb-3 transition-colors line-clamp-2 leading-snug ${
              isCompleted
                ? "text-violet-800"
                : "text-slate-900 group-hover:text-blue-600"
            }`}
          >
            {title}
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${currentDifficulty.color}`}
            >
              {currentDifficulty.label}
            </span>

            {isCompleted ? (
              <div className="inline-flex items-center gap-1 text-xs bg-emerald-50 border border-emerald-100 text-emerald-700 px-3 py-0.5 rounded-full font-medium">
                <CheckCircle size={12} />
                {translateSubmissionStatus(status)}
                {score !== null && ` • ${score}đ`}
              </div>
            ) : (
              daysLeft > 0 && (
                <div className="inline-flex items-center gap-1 text-xs bg-orange-50 border border-orange-100 text-orange-600 px-2.5 py-0.5 rounded-full font-medium animate-pulse">
                  <Clock size={12} />
                  Còn {daysLeft} ngày
                </div>
              )
            )}
          </div>
        </div>

        {/* Mô tả thử thách */}
        {description && (
          <p
            className={`text-sm mb-5 line-clamp-2 leading-relaxed ${isCompleted ? "text-slate-600" : "text-slate-500"}`}
          >
            {description}
          </p>
        )}

        {/* THÔNG TIN CHI TIẾT DÀNH RIÊNG CHO THỬ THÁCH ĐÃ HOÀN THÀNH */}
        {isCompleted && (
          <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs space-y-2 mb-4">
            <div className="font-semibold text-slate-700 text-xs border-b border-slate-200/60 pb-1.5 mb-1.5 flex items-center gap-1">
              <CheckCircle size={13} className="text-violet-600" /> Chi tiết kết
              quả nộp bài:
            </div>

            {submittedAt && (
              <div className="flex justify-between">
                <span className="text-slate-500">Nộp bài lần cuối vào:</span>
                <span className="font-medium text-slate-800">
                  {submittedAt.toLocaleString("vi-VN")}
                </span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-slate-500">
                Trạng thái chấm (Evaluation):
              </span>
              <span
                className={`font-medium ${evaluationStatus === "Completed" ? "text-emerald-600" : "text-amber-600"}`}
              >
                {translateEvaluationStatus(evaluationStatus)}
              </span>
            </div>

            {feedback && (
              <div className="pt-2.5 border-t border-slate-200/60 mt-2">
                <span className="text-slate-500 flex items-center gap-1 font-medium mb-1.5">
                  <MessageSquare size={12} className="text-slate-400" /> Nhận
                  xét từ Giám khảo:
                </span>
                {/* Đã loại bỏ line-clamp-3, thêm leading-relaxed và break-words để chữ tự xuống dòng trọn vẹn */}
                <p className="text-slate-700 bg-white p-3 rounded-lg border border-slate-100 italic whitespace-pre-line leading-relaxed break-words h-auto text-[11px] md:text-xs">
                  "{feedback}"
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Phần chân Card (Metadata & Button) */}
      <div>
        <div className="space-y-2.5 text-xs mb-4 border-t border-slate-100 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 flex items-center gap-1">
              <Calendar size={13} />
              Hạn chót thử thách:
            </span>
            <span
              className={`font-semibold ${isExpired ? "text-rose-600" : "text-slate-700"}`}
            >
              {deadlineDate.toLocaleDateString("vi-VN")}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400 flex items-center gap-1">
              <Award size={13} />
              Số lần đã nộp:
            </span>
            <span className="text-slate-700 font-semibold">
              {attemptCount} lần
            </span>
          </div>
        </div>

        {/* NÚT XEM CHI TIẾT - CHỈ HIỂN THỊ Ở TAB ĐANG DIỄN RA */}
        {!isCompleted && (
          <button className="w-full py-2.5 px-4 rounded-xl font-medium text-sm transition-all duration-300 shadow-sm bg-slate-50 border border-slate-200 text-slate-700 group-hover:bg-blue-600 group-hover:text-white">
            Xem chi tiết thử thách
          </button>
        )}
      </div>
    </div>
  );
}

export default function ChallengeTalent() {
  const navigate = useNavigate();
  const { accessToken } = useAppSelector((state) => state.auth);

  const [publicChallenges, setPublicChallenges] = useState<Challenge[]>([]);
  const [completedChallenges, setCompletedChallenges] = useState<
    MyCompletedChallenge[]
  >([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Có lỗi khi tải thử thách đã hoàn thành";
      console.error("❌ Error loading completed challenges:", errorMessage);
      notify.error(errorMessage);
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      setIsLoading(true);
      setError(null);

      await Promise.all([loadPublicChallenges(), loadCompletedChallenges()]);

      setIsLoading(false);
    };

    loadAll();
  }, [accessToken]);

  const handleChallengeClick = (
    challenge: DisplayChallenge,
    isCompleted: boolean,
  ) => {
    // Chỉ xử lý navigate cho public challenge (active tab). Completed tab giờ không cần click nữa.
    if (!isCompleted) {
      const publicChallenge = challenge as Challenge;
      navigate(`/talent-challenge/${publicChallenge.id}`);
    }
  };

  const displayChallenges =
    activeTab === "active" ? publicChallenges : completedChallenges;
  const isCompletedTab = activeTab === "completed";

  if (isLoading) {
    return <CustomLoading />;
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-950 tracking-tight">
            Thử thách của tôi
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Khám phá và theo dõi tiến độ các thử thách kỹ năng
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-sm font-medium">
            ⚠️ {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-slate-200 mb-6 gap-8">
          <button
            onClick={() => setActiveTab("active")}
            className={`pb-3 text-sm font-semibold transition-all relative ${
              activeTab === "active"
                ? "text-blue-600"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Đang diễn ra
            <span
              className={`ml-1.5 px-1.5 py-0.5 text-xs rounded-full ${
                activeTab === "active"
                  ? "bg-blue-50 text-blue-600"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {publicChallenges.length}
            </span>
            {activeTab === "active" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("completed")}
            className={`pb-3 text-sm font-semibold transition-all relative ${
              activeTab === "completed"
                ? "text-violet-600"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Đã hoàn thành
            <span
              className={`ml-1.5 px-1.5 py-0.5 text-xs rounded-full ${
                activeTab === "completed"
                  ? "bg-violet-50 text-violet-600"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {completedChallenges.length}
            </span>
            {activeTab === "completed" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600 rounded-full" />
            )}
          </button>
        </div>

        {/* Content */}
        {displayChallenges.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-xl mx-auto p-6">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <Inbox size={26} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {activeTab === "active"
                ? "Không có thử thách nào đang diễn ra"
                : "Bạn chưa hoàn thành thử thách nào"}
            </h3>
            <p className="text-sm text-slate-500 max-w-xs mx-auto">
              {activeTab === "active"
                ? "Các thử thách hiện tại đã kết thúc hoặc chưa được mở."
                : "Khi bạn nộp bài và được chấm, kết quả sẽ xuất hiện tại đây."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
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
