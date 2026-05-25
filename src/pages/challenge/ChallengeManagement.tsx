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

  // Đóng menu khi click ra ngoài card
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
        return {
          label: "Bản nháp",
          color: "bg-slate-100 text-slate-700 border-slate-200",
        };
      case "PendingReview":
        return {
          label: "Chờ duyệt",
          color: "bg-amber-50 text-amber-700 border-amber-200",
        };
      case "Published":
        return {
          label: "Đã xuất bản",
          color: "bg-emerald-50 text-emerald-700 border-emerald-200",
        };
      case "Rejected":
        return {
          label: "Từ chối",
          color: "bg-rose-50 text-rose-700 border-rose-200",
        };
      case "Expired":
        return {
          label: "Hết hạn",
          color: "bg-neutral-100 text-neutral-600 border-neutral-300",
        };
      default:
        return {
          label: status,
          color: "bg-slate-100 text-slate-800 border-transparent",
        };
    }
  };

  const statusDisplay = getStatusDisplay(challenge.status ?? "");

  return (
    <div
      onClick={() => onViewDetail(challenge.id)}
      className={`group relative flex flex-col justify-between p-6 rounded-xl border bg-white hover:shadow-lg transition-all duration-300 cursor-pointer
        ${
          isExpired
            ? "border-rose-200 hover:border-rose-300 bg-rose-50/30"
            : "border-slate-200 hover:border-blue-300 hover:shadow-slate-100"
        }`}
    >
      <div>
        {isExpired && (
          <div className="absolute top-3 right-3 px-3 py-1 bg-rose-600 text-white text-xs font-medium rounded-full flex items-center gap-1 shadow-sm">
            <AlertCircle size={14} />
            Đã hết hạn
          </div>
        )}
        {/* Header Card */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="space-y-1.5 flex-1">
            <h3 className="text-base font-semibold text-slate-900 group-hover:text-blue-600 line-clamp-1 transition-colors">
              {challenge.title}
            </h3>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusDisplay.color}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse" />
              {statusDisplay.label}
            </span>
          </div>

          {/* Menu Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={handleMenuClick}
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
              title="Tùy chọn"
            >
              <MoreVertical size={18} />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-xl border border-slate-100 py-1 z-20 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewDetail(challenge.id);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-slate-50 text-slate-700 font-medium transition-colors text-sm"
                >
                  <Eye size={15} className="text-slate-400" />
                  Chi tiết
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(challenge.id);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-slate-50 text-slate-700 font-medium transition-colors text-sm"
                >
                  <Edit3 size={15} className="text-slate-400" />
                  Chỉnh sửa
                </button>
                <div className="border-t border-slate-100 my-1" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(challenge.id);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-rose-50 text-rose-600 font-medium transition-colors text-sm"
                >
                  <Trash2 size={15} />
                  Xóa bài viết
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {challenge.description && (
          <p className="text-sm text-slate-500 line-clamp-2 mb-5 leading-relaxed">
            {challenge.description}
          </p>
        )}
      </div>

      {/* Footer Card */}
      <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-slate-400">
            <Calendar size={14} />
            Hạn chót:
          </span>
          <span className="text-slate-700 font-medium">
            {formattedDeadline}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-slate-400">
            <Clock size={14} />
            Thời hạn:
          </span>
          <span
            className={`px-2 py-0.5 rounded font-medium ${isExpired ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"}`}
          >
            {isExpired ? "Đã hết hạn" : "Còn hạn nhận"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ChallengeManagement() {
  const navigate = useNavigate();
  const { accessToken } = useAppSelector((state) => state.auth);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingChallengeId, setDeletingChallengeId] = useState<string | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingChallengeId, setEditingChallengeId] = useState<string | null>(
    null,
  );

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
      setChallenges(challenges.filter((c) => c.id !== deletingChallengeId));
      notify.success("Xóa thử thách thành công");
      setDeletingChallengeId(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Có lỗi khi xóa thử thách";
      console.error("❌ Error deleting challenge:", errorMessage);
      notify.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setDeletingChallengeId(null);
  };

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
        setIsLoading(false);
        return;
      }

      const response = await fetchCreatorChallenges(0, 100, accessToken);
      setChallenges(response.items || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Có lỗi khi tải dữ liệu";
      console.error("❌ Error loading challenges:", errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    loadChallenges();
  }, [loadChallenges]);

  if (isLoading) {
    return <CustomLoading />;
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-950 tracking-tight">
              Quản lý thử thách
            </h1>
            <p className="text-sm text-slate-500">
              Tạo, phân phối và theo dõi tiến độ các thử thách cho ứng viên
            </p>
          </div>
          <button
            onClick={() => {
              setEditingChallengeId(null);
              setShowCreateForm(true);
            }}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-medium shadow-sm shadow-blue-100 hover:shadow-md transition-all active:scale-[0.98]"
          >
            <Plus size={20} />
            Thêm thử thách mới
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3">
            <AlertCircle size={20} className="text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-rose-900 text-sm">
                Hệ thống ghi nhận lỗi
              </h3>
              <p className="text-rose-700 text-sm mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {challenges.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-xl mx-auto p-6">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <AlertCircle size={28} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Kho thử thách đang trống
            </h3>
            <p className="text-sm text-slate-500 max-w-xs mx-auto mb-6">
              Bạn chưa có bài khảo sát hoặc thử thách kỹ thuật nào dành cho ứng
              viên.
            </p>
            <button
              onClick={() => {
                setEditingChallengeId(null);
                setShowCreateForm(true);
              }}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
            >
              <Plus size={18} />
              Tạo ngay bài đầu tiên
            </button>
          </div>
        ) : (
          /* Grid List */
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

        {/* Delete Confirmation Modal */}
        {deletingChallengeId && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100 animate-in zoom-in-95 duration-200">
              <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mb-4">
                <Trash2 size={24} className="text-rose-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">
                Xác nhận xóa thử thách?
              </h2>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                Hành động này sẽ xóa vĩnh viễn bài thử thách khỏi hệ thống.
                Những dữ liệu liên quan và bài nộp của ứng viên (nếu có) có thể
                bị ảnh hưởng và không thể khôi phục.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={handleCancelDelete}
                  disabled={isDeleting}
                  className="px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-medium transition-colors disabled:opacity-50 text-sm"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="px-5 py-2.5 bg-rose-600 text-white rounded-xl hover:bg-rose-700 font-medium transition-colors disabled:opacity-50 text-sm shadow-sm shadow-rose-100"
                >
                  {isDeleting ? "Đang tiến hành xóa..." : "Xác nhận xóa"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create/Edit Form Modal */}
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
