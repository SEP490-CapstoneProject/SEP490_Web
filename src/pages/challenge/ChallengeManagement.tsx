import {
  Plus,
  MoreVertical,
  Edit3,
  Trash2,
  AlertCircle,
  Eye,
  Calendar,
  Clock,
} from "lucide-react";
import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/hook";
import {
  fetchCreatorChallenges,
  deleteChallenge,
} from "@/services/challenge.api";
import { Challenge } from "@/types/challenge";
import CustomLoading from "@/components/Loading/Loading";
import { notify } from "@/lib/toast";
import CreateChallengeForm from "./CreateChallengeForm";
import { formatToLocalTime } from "@/utils/time";

function ChallengeCard({
  challenge,
  onEdit,
  onDelete,
  onViewDetail,
}: {
  challenge: Challenge;
  onEdit: (challengeId: string) => void;
  onDelete: (challengeId: string) => void;
  onViewDetail: (challengeId: string) => void;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const formattedDeadline = formatToLocalTime(challenge.deadline);
  const cleanDeadlineStr = challenge.deadline.endsWith("Z")
    ? challenge.deadline
    : challenge.deadline + "Z";
  const isExpired = new Date(cleanDeadlineStr) < new Date();

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "Draft":
        return { label: "Bản nháp", color: "bg-slate-100 text-slate-700" };
      case "PendingReview":
        return { label: "Chờ duyệt", color: "bg-amber-100 text-amber-700" };
      case "Published":
        return { label: "Đã xuất bản", color: "bg-emerald-100 text-emerald-700" };
      case "Rejected":
        return { label: "Từ chối", color: "bg-rose-100 text-rose-700" };
      case "Expired":
        return { label: "Hết hạn", color: "bg-neutral-200 text-neutral-700" };
      default:
        return { label: status, color: "bg-slate-100 text-slate-700" };
    }
  };

  const statusDisplay = getStatusDisplay(challenge.status ?? "");

  return (
    <div
      onClick={() => onViewDetail(challenge.id)}
      className={`group relative flex flex-col justify-between p-6 rounded-3xl border bg-white 
        transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-xl
        ${isExpired 
          ? "border-rose-200 hover:border-rose-300 bg-rose-50/50" 
          : "border-slate-200 hover:border-blue-200"}`}
    >
      {/* Expired Badge */}
      {isExpired && (
        <div className="absolute top-4 right-4 px-3 py-1 bg-rose-600 text-white text-xs font-semibold rounded-full flex items-center gap-1 shadow-md">
          <AlertCircle size={14} />
          Hết hạn
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="space-y-2 flex-1">
          <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 line-clamp-2 transition-colors leading-tight">
            {challenge.title}
          </h3>

          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusDisplay.color}`}
          >
            <span className="w-2 h-2 rounded-full bg-current mr-1.5" />
            {statusDisplay.label}
          </span>
        </div>

        {/* Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={handleMenuClick}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-colors"
          >
            <MoreVertical size={20} />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-1 z-30 overflow-hidden">
              <button
                onClick={(e) => { e.stopPropagation(); onViewDetail(challenge.id); setShowMenu(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-slate-700 text-sm font-medium"
              >
                <Eye size={18} className="text-slate-400" />
                Xem chi tiết
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(challenge.id); setShowMenu(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-slate-700 text-sm font-medium"
              >
                <Edit3 size={18} className="text-slate-400" />
                Chỉnh sửa
              </button>
              <div className="border-t border-slate-100 my-1" />
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(challenge.id); setShowMenu(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-rose-50 text-rose-600 text-sm font-medium"
              >
                <Trash2 size={18} />
                Xóa thử thách
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {challenge.description && (
        <p className="text-slate-600 line-clamp-3 mb-6 text-[15px] leading-relaxed">
          {challenge.description}
        </p>
      )}

      {/* Footer */}
      <div className="pt-5 border-t border-slate-100 space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-slate-500">
            <Calendar size={16} />
            Hạn nộp
          </span>
          <span className="font-medium text-slate-700">{formattedDeadline}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-slate-500">
            <Clock size={16} />
            Trạng thái
          </span>
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full ${
              isExpired 
                ? "bg-rose-100 text-rose-700" 
                : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {isExpired ? "Đã hết hạn" : "Đang nhận"}
          </span>
        </div>
      </div>
    </div>
  );
}

// ====================== MAIN COMPONENT ======================

export default function ChallengeManagement() {
  const navigate = useNavigate();
  const { accessToken } = useAppSelector((state) => state.auth);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingChallengeId, setDeletingChallengeId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingChallengeId, setEditingChallengeId] = useState<string | null>(null);

  const handleEdit = (challengeId: string) => {
    setEditingChallengeId(challengeId);
    setShowCreateForm(true);
  };

  const handleViewDetail = (challengeId: string) => {
    navigate(`/challenge/${challengeId}`);
  };

  const handleDelete = (challengeId: string) => {
    setDeletingChallengeId(challengeId);
  };

  const handleConfirmDelete = async () => {
    if (!deletingChallengeId || !accessToken) return;
    try {
      setIsDeleting(true);
      await deleteChallenge(deletingChallengeId, accessToken);
      setChallenges((prev) => prev.filter((c) => c.id !== deletingChallengeId));
      notify.success("Xóa thử thách thành công");
      setDeletingChallengeId(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Có lỗi khi xóa thử thách";
      notify.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => setDeletingChallengeId(null);
  const handleFormClose = () => {
    setShowCreateForm(false);
    setEditingChallengeId(null);
  };
  const handleFormSuccess = () => {
    loadChallenges();
    handleFormClose();
  };

  const loadChallenges = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      if (!accessToken) {
        setError("Token xác thực không tìm thấy. Vui lòng đăng nhập lại.");
        return;
      }
      const response = await fetchCreatorChallenges(0, 100, accessToken);
      setChallenges(response.items || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Có lỗi khi tải dữ liệu";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    loadChallenges();
  }, [loadChallenges]);

  if (isLoading) return <CustomLoading />;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              Quản lý thử thách
            </h1>
            <p className="text-slate-600 mt-2 text-lg">
              Tạo và quản lý các thử thách dành cho ứng viên
            </p>
          </div>

          <button
            onClick={() => {
              setEditingChallengeId(null);
              setShowCreateForm(true);
            }}
            className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-2xl font-semibold shadow-lg shadow-blue-200 hover:shadow-xl transition-all active:scale-[0.98]"
          >
            <Plus size={22} />
            Thêm thử thách mới
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-8 p-5 bg-rose-50 border border-rose-100 rounded-2xl flex gap-4">
            <AlertCircle size={24} className="text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-rose-900">Đã xảy ra lỗi</h3>
              <p className="text-rose-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {challenges.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <div className="mx-auto w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mb-6">
              <AlertCircle size={42} className="text-slate-400" />
            </div>
            <h3 className="text-2xl font-semibold text-slate-900 mb-3">
              Chưa có thử thách nào
            </h3>
            <p className="text-slate-600 max-w-md mx-auto mb-8">
              Hãy tạo thử thách đầu tiên để bắt đầu đánh giá năng lực ứng viên
            </p>
            <button
              onClick={() => {
                setEditingChallengeId(null);
                setShowCreateForm(true);
              }}
              className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg shadow-blue-200"
            >
              <Plus size={24} />
              Tạo thử thách đầu tiên
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onViewDetail={handleViewDetail}
              />
            ))}
          </div>
        )}

        {/* Delete Modal */}
        {deletingChallengeId && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl">
              <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Trash2 size={32} className="text-rose-600" />
              </div>
              <h2 className="text-2xl font-bold text-center text-slate-900 mb-3">
                Xóa thử thách?
              </h2>
              <p className="text-center text-slate-600 mb-8 leading-relaxed">
                Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan sẽ bị xóa vĩnh viễn.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={handleCancelDelete}
                  disabled={isDeleting}
                  className="flex-1 py-4 border border-slate-300 rounded-2xl font-medium hover:bg-slate-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="flex-1 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-semibold transition-colors disabled:opacity-70"
                >
                  {isDeleting ? "Đang xóa..." : "Xác nhận xóa"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create/Edit Form */}
        {showCreateForm && (
          <CreateChallengeForm
            challengeId={editingChallengeId}
            onClose={handleFormClose}
            onSuccess={handleFormSuccess}
          />
        )}
      </div>
    </div>
  );
}