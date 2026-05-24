import { X } from "lucide-react";
import { useEffect } from "react";
import { SkillHistory } from "@/types/challenge";
import { formatToLocalTime} from "@/utils/time"; // hoặc utility của bạn


interface SkillsHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  skills: SkillHistory[];
  isLoading?: boolean;
  userName?: string;
}

export const SkillsHistoryModal = ({
  isOpen,
  onClose,
  skills,
  isLoading,
  userName = "User",
}: SkillsHistoryModalProps) => {
  // Chặn scroll khi modal mở
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay mờ */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Các kĩ năng</h2>
            <p className="text-sm text-gray-500 mt-1"> Lịch sử kĩ năng của {userName} </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : skills && skills.length > 0 ? (
            <div className="space-y-4">
              {skills.map((skill) => (
                <div
                  key={skill.skillId}
                  className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/30 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {skill.skillName}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {skill.challengeCount} challenge{skill.challengeCount !== 1 ? "s" : ""} completed
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                        {skill.totalPoints} điểm
                      </div>
                    </div>
                  </div>

                  {/* Mastery Score Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-gray-600">
                        Điểm thành thạo
                      </span>
                      <span className="text-sm font-bold text-gray-900">
                        {skill.masteryScore} điểm
                      </span>
                    </div>
                  </div>


                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500">Lần xác minh đầu</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatToLocalTime(skill.firstVerifiedAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Lần xác minh cuối</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatToLocalTime(skill.lastVerifiedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Chưa có kĩ năng nào</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};