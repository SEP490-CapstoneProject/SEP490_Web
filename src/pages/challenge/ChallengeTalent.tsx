import { ArrowLeft, Clock, Calendar, ShieldCheck, Inbox } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/hook";
import { fetchPublicChallenges } from "@/services/challenge.api";
import { Challenge } from "@/types/challenge";
import CustomLoading from "@/components/Loading/Loading";
import { notify } from "@/lib/toast";

function ChallengeCard({
  challenge,
  onClick,
}: {
  challenge: Challenge;
  onClick: () => void;
}) {
  const deadline = new Date(challenge.deadline);
  const now = new Date();
  const daysLeft = Math.ceil(
    (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );

  const difficulty =
    challenge.activeVersion?.difficultyLabel ||
    challenge.difficultyLabel ||
    "Unknown";

  const difficultyConfig: Record<string, { label: string; color: string }> = {
    Easy: { label: "Dễ", color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
    Medium: { label: "Vừa", color: "bg-amber-50 text-amber-700 border-amber-100" },
    Hard: { label: "Khó", color: "bg-rose-50 text-rose-700 border-rose-100" },
  };

  const currentDifficulty = difficultyConfig[difficulty] || {
    label: difficulty || "Không xác định",
    color: "bg-slate-50 text-slate-700 border-slate-200",
  };

  return (
    <div
      onClick={onClick}
      className="flex flex-col justify-between p-6 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-xl hover:shadow-slate-100 transition-all duration-300 cursor-pointer group"
    >
      <div>
        {/* Title and Badges */}
        <div className="mb-4">
          <h3 className="text-base font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
            {challenge.title}
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${currentDifficulty.color}`}
            >
              {currentDifficulty.label}
            </span>
            {daysLeft > 0 && (
              <div className="inline-flex items-center gap-1 text-xs bg-orange-50 border border-orange-100 text-orange-600 px-2.5 py-0.5 rounded-full font-medium animate-pulse">
                <Clock size={12} />
                Còn {daysLeft} ngày
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {challenge.description && (
          <p className="text-sm text-slate-500 mb-5 line-clamp-2 leading-relaxed">
            {challenge.description}
          </p>
        )}
      </div>

      <div>
        {/* Info Meta */}
        <div className="space-y-2.5 text-xs mb-5 border-t border-slate-100 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 flex items-center gap-1">
              <Calendar size={13} />
              Hạn chót:
            </span>
            <span className="text-slate-700 font-semibold">
              {deadline.toLocaleDateString("vi-VN")}
            </span>
          </div>
          {challenge.activeVersion?.criteria && (
            <div className="flex justify-between items-center">
              <span className="text-slate-400 flex items-center gap-1">
                <ShieldCheck size={13} />
                Tiêu chí đánh giá:
              </span>
              <span className="text-slate-700 font-semibold bg-slate-100 px-2 py-0.5 rounded">
                {challenge.activeVersion.criteria.length} tiêu chí
              </span>
            </div>
          )}
        </div>

        {/* Action Button Interaction */}
        <button className="w-full py-2.5 px-4 bg-slate-50 border border-slate-200 text-slate-700 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 rounded-xl font-medium text-sm transition-all duration-300 shadow-sm">
          Xem chi tiết thử thách
        </button>
      </div>
    </div>
  );
}

export default function ChallengeTalent() {
  const navigate = useNavigate();
  const { accessToken } = useAppSelector((state) => state.auth);
  const [publicChallenges, setPublicChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPublicChallenges = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log("📡 [ChallengeTalent] Loading public challenges...");
      const response = await fetchPublicChallenges(0, 50);
      setPublicChallenges(response.items || []);
      console.log(
        "✅ [ChallengeTalent] Loaded:",
        response.items?.length,
        "challenges",
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Có lỗi khi tải dữ liệu";
      console.error("❌ Error loading public challenges:", errorMessage);
      setError(errorMessage);
      notify.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPublicChallenges();
  }, [accessToken]);

  const handleChallengeClick = (challenge: Challenge) => {
    navigate(`/talent-challenge/${challenge.id}`);
  };

  if (isLoading) {
    return <CustomLoading />;
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 mb-2 font-medium transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            Quay lại trang trước
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-950 tracking-tight">
              Thử thách đang diễn ra
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Khám phá năng lực bản thân và chinh phục các bài kiểm tra kỹ thuật thực chiến
            </p>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-sm font-medium">
            ⚠️ {error}
          </div>
        )}

        {/* Grid List / Empty State */}
        {publicChallenges.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-xl mx-auto p-6">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <Inbox size={26} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Chưa có thử thách nào khả dụng
            </h3>
            <p className="text-sm text-slate-500 max-w-xs mx-auto">
              Hệ thống hiện tại chưa ghi nhận thử thách công khai nào. Vui lòng quay lại sau ít phút nhé!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publicChallenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                onClick={() => handleChallengeClick(challenge)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}