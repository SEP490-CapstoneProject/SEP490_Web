import { Clock, Calendar, ShieldCheck, Inbox, AlertCircle } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
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
  const isExpired = deadline < now;

  const daysLeft = Math.ceil(
    (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
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
      className={`flex flex-col justify-between p-6 rounded-xl border bg-white transition-all duration-300 cursor-pointer group relative h-full
        ${isExpired 
          ? "border-rose-100 bg-rose-50/10 hover:border-rose-300 hover:shadow-xl hover:shadow-rose-100/40" 
          : "border-slate-200 hover:border-blue-400 hover:shadow-xl hover:shadow-slate-100"
        }`}
    >
      {isExpired && (
        <div className="absolute top-4 right-4 px-3 py-1 bg-rose-600 text-white text-xs font-semibold rounded-full flex items-center gap-1 shadow-sm z-10">
          <AlertCircle size={14} />
          ĐÃ HẾT HẠN
        </div>
      )}

      <div>
        <div className="mb-4">
          <h3 className={`text-base font-bold mb-3 transition-colors line-clamp-2 leading-snug ${
            isExpired ? "text-slate-600 group-hover:text-rose-600" : "text-slate-900 group-hover:text-blue-600"
          }`}>
            {challenge.title}
          </h3>
          
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${currentDifficulty.color}`}>
              {currentDifficulty.label}
            </span>

            {isExpired ? (
              <div className="inline-flex items-center gap-1 text-xs bg-rose-100 border border-rose-200 text-rose-700 px-3 py-0.5 rounded-full font-medium">
                <Clock size={12} />
                Đã kết thúc
              </div>
            ) : daysLeft > 0 && (
              <div className="inline-flex items-center gap-1 text-xs bg-orange-50 border border-orange-100 text-orange-600 px-2.5 py-0.5 rounded-full font-medium animate-pulse">
                <Clock size={12} />
                Còn {daysLeft} ngày
              </div>
            )}
          </div>
        </div>

        {challenge.description && (
          <p className={`text-sm mb-5 line-clamp-2 leading-relaxed ${isExpired ? "text-slate-400" : "text-slate-500"}`}>
            {challenge.description}
          </p>
        )}
      </div>

      <div>
        <div className="space-y-2.5 text-xs mb-5 border-t border-slate-100 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 flex items-center gap-1">
              <Calendar size={13} />
              Hạn chót:
            </span>
            <span className={`font-semibold ${isExpired ? "text-rose-600" : "text-slate-700"}`}>
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

        <button 
          className={`w-full py-2.5 px-4 rounded-xl font-medium text-sm transition-all duration-300 shadow-sm ${
            isExpired 
              ? "bg-rose-50 border border-rose-200 text-rose-700 group-hover:bg-rose-600 group-hover:text-white group-hover:border-rose-600" 
              : "bg-slate-50 border border-slate-200 text-slate-700 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600"
          }`}
        >
          {isExpired ? "Xem lại thử thách" : "Xem chi tiết thử thách"}
        </button>
      </div>
    </div>
  );
}

type TabType = "active" | "expired";

export default function ChallengeTalent() {
  const navigate = useNavigate();
  const { accessToken } = useAppSelector((state) => state.auth);
  const [publicChallenges, setPublicChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 🔴 STATE QUẢN LÝ TAB ĐANG CHỌN
  const [activeTab, setActiveTab] = useState<TabType>("active");

  const loadPublicChallenges = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetchPublicChallenges(0, 50);
      setPublicChallenges(response.items || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Có lỗi khi tải dữ liệu";
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

  // 🔴 SỬ DỤNG useMemo ĐỂ PHÂN LOẠI DANH SÁCH THỬ THÁCH THEO THỜI GIAN THỰC
  const { activeChallenges, expiredChallenges } = useMemo(() => {
    const now = new Date();
    const active: Challenge[] = [];
    const expired: Challenge[] = [];

    publicChallenges.forEach((item) => {
      if (new Date(item.deadline) < now) {
        expired.push(item);
      } else {
        active.push(item);
      }
    });

    return { activeChallenges: active, expiredChallenges: expired };
  }, [publicChallenges]);

  // Chọn danh sách hiển thị dựa vào Tab hiện tại
  const displayChallenges = activeTab === "active" ? activeChallenges : expiredChallenges;

  if (isLoading) {
    return <CustomLoading />;
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-950 tracking-tight">
              Thử thách công khai
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Khám phá năng lực bản thân và chinh phục các bài kiểm tra kỹ thuật thực chiến
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-sm font-medium">
            ⚠️ {error}
          </div>
        )}

        {/* 🔴 GIAO DIỆN TABS PHÂN LOẠI */}
        <div className="flex border-b border-slate-200 mb-6 gap-6">
          <button
            onClick={() => setActiveTab("active")}
            className={`pb-3 text-sm font-semibold transition-all relative ${
              activeTab === "active"
                ? "text-blue-600"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Đang diễn ra
            <span className={`ml-1.5 px-1.5 py-0.5 text-xs rounded-full ${
              activeTab === "active" ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-500"
            }`}>
              {activeChallenges.length}
            </span>
            {activeTab === "active" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("expired")}
            className={`pb-3 text-sm font-semibold transition-all relative ${
              activeTab === "expired"
                ? "text-rose-600"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Đã hết hạn
            <span className={`ml-1.5 px-1.5 py-0.5 text-xs rounded-full ${
              activeTab === "expired" ? "bg-rose-50 text-rose-600" : "bg-slate-100 text-slate-500"
            }`}>
              {expiredChallenges.length}
            </span>
            {activeTab === "expired" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-600 rounded-full" />
            )}
          </button>
        </div>

        {/* Grid List / Empty State */}
        {displayChallenges.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-xl mx-auto p-6 transition-all">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <Inbox size={26} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {activeTab === "active" ? "Không có thử thách nào đang diễn ra" : "Không có thử thách nào đã hết hạn"}
            </h3>
            <p className="text-sm text-slate-500 max-w-xs mx-auto">
              {activeTab === "active" 
                ? "Các thử thách hiện tại đã kết thúc hoặc chưa được mở công khai." 
                : "Hệ thống chưa lưu trữ dữ liệu các thử thách đã kết thúc cũ."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {displayChallenges.map((challenge) => (
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