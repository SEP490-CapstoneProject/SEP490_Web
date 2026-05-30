import { X } from "lucide-react";
import { useEffect } from "react";
import { SkillHistory } from "@/types/challenge";
import { formatToLocalTime } from "@/utils/time";

interface SkillsHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  skills: SkillHistory[];
  isLoading?: boolean;
  userName?: string;
}

// 🟢 ĐÃ ĐỔI: Toàn bộ cấu hình màu chuyển về tone Xanh lá (Emerald/Green)
const SKILL_THEME = {
  bg: "#E1F5EE",        // Nền nhạt cho icon placeholder (Emerald 100)
  bar: "#1D9E75",       // Màu chủ đạo cho thanh tiến trình và label chính (Emerald 600)
  badge: { 
    bg: "#E1F5EE",      // Nền nhạt cho badge điểm
    text: "#085041"     // Chữ đậm màu xanh rêu cho badge điểm (Emerald 900)
  },
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getMasteryLabel(score: number) {
  if (score >= 80) return "Thành thạo";
  if (score >= 50) return "Đang phát triển";
  return "Mới bắt đầu";
}

export const SkillsHistoryModal = ({
  isOpen,
  onClose,
  skills,
  isLoading,
  userName = "User",
}: SkillsHistoryModalProps) => {
  // Khóa cuộn trang khi modal mở
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Sắp xếp kĩ năng: Ưu tiên điểm số độ thành thạo cao nhất lên đầu
  const sortedSkills = skills ? [...skills].sort((a, b) => b.masteryScore - a.masteryScore) : [];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {/* Avatar - Giữ màu tím gốc hoặc bạn có thể đổi sang SKILL_THEME tùy ý, ở đây tôi đổi đồng bộ sang xanh lá */}
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0"
              style={{ background: SKILL_THEME.bg, color: SKILL_THEME.badge.text }}
            >
              {getInitials(userName)}
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900 leading-tight">
                {userName}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {sortedSkills.length} kĩ năng đã tích lũy
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              {/* 🟢 ĐÃ ĐỔI: Loading spinner sang màu xanh lá border-emerald-500 */}
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500" />
            </div>
          ) : sortedSkills && sortedSkills.length > 0 ? (
            <div className="flex flex-col gap-3">
              {sortedSkills.map((skill) => {
                const masteryPct = Math.min(skill.masteryScore, 100);
                const masteryLabel = getMasteryLabel(skill.masteryScore);
                
                // Điều kiện xác định kĩ năng nổi bật (Thành thạo)
                const isTopSkill = skill.masteryScore >= 80;

                return (
                  <div
                    key={skill.skillId}
                    className={`border rounded-xl p-4 transition-all hover:bg-gray-50/50 ${
                      isTopSkill
                        ? "border-emerald-200 bg-emerald-50/10 shadow-sm hover:border-emerald-300" // 🟢 ĐÃ ĐỔI: Viền và nền nổi bật sang tone Xanh lá
                        : "border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Color dot / icon placeholder */}
                        <div
                          className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center text-base font-bold"
                          style={{ background: SKILL_THEME.bg, color: SKILL_THEME.bar }}
                        >
                          {skill.skillName.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-semibold text-gray-900 truncate leading-tight">
                              {skill.skillName}
                            </p>
                            {/* Badge Nổi bật (Top Skill) */}
                            {isTopSkill && (
                              <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                                ⭐ Top
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {skill.challengeCount} challenge{skill.challengeCount !== 1 ? "s" : ""} hoàn thành
                          </p>
                        </div>
                      </div>
                      
                      {/* Points badge */}
                      <span
                        className="flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ background: SKILL_THEME.badge.bg, color: SKILL_THEME.badge.text }}
                      >
                        {skill.totalPoints} điểm
                      </span>
                    </div>

                    {/* Mastery bar */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-gray-400">Độ thành thạo</span>
                        <span className="text-xs font-semibold" style={{ color: SKILL_THEME.bar }}>
                          {skill.masteryScore} · {masteryLabel}
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${masteryPct}%`, background: SKILL_THEME.bar }}
                        />
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100">
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wide">Lần đầu</p>
                        <p className="text-xs font-medium text-gray-700 mt-0.5">
                          {formatToLocalTime(skill.firstVerifiedAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wide">Gần nhất</p>
                        <p className="text-xs font-medium text-gray-700 mt-0.5">
                          {formatToLocalTime(skill.lastVerifiedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-sm text-gray-400">Chưa có kĩ năng nào</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-4 py-3 bg-gray-50/80">
          <button
            onClick={onClose}
            className="w-full py-2 text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity"
            style={{ background: SKILL_THEME.bar, color: "#fff" }} // 🟢 ĐÃ ĐỔI: Nút đóng sang màu xanh lá chủ đạo luôn cho hợp rơ
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};