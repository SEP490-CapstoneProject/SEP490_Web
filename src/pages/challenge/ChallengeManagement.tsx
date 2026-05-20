import { ArrowLeft, Plus, MoreVertical, Edit3, Trash2, AlertCircle, Eye } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/hook";
import { fetchCreatorChallenges, deleteChallenge } from "@/services/challenge.api";
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

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleViewDetailClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewDetail(challenge.id);
    setShowMenu(false);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(challenge.id);
    setShowMenu(false);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(challenge.id);
    setShowMenu(false);
  };

 const formattedDeadline = formatToLocalTime(challenge.deadline);

  // Logic so sánh hạn chót vẫn cần ép về đúng mốc UTC/Local để tránh so lệch 7 tiếng
  const cleanDeadlineStr = challenge.deadline.endsWith("Z") ? challenge.deadline : challenge.deadline + "Z";
  const isExpired = new Date(cleanDeadlineStr) < new Date();

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
    <div className="p-5 rounded-lg border border-slate-200 bg-white hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-900 mb-1">{challenge.title}</h3>
          <div className="inline-block">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusDisplay.color}`}>
              {statusDisplay.label}
            </span>
          </div>
        </div>

        {/* Menu button */}
        <div className="relative">
          <button
            onClick={handleMenuClick}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            title="Tùy chọn"
          >
            <MoreVertical size={18} className="text-slate-600" />
          </button>

          {/* Dropdown menu */}
          {showMenu && (
            <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden z-10">
              <button
                onClick={handleViewDetailClick}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50 text-slate-700 transition-colors text-sm"
              >
                <Eye size={14} />
                <span>Chi tiết</span>
              </button>
              <button
                onClick={handleEditClick}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50 text-slate-700 transition-colors text-sm"
              >
                <Edit3 size={14} />
                <span>Chỉnh sửa</span>
              </button>
              <button
                onClick={handleDeleteClick}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-red-50 text-red-600 transition-colors text-sm"
              >
                <Trash2 size={14} />
                <span>Xóa</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {challenge.description && (
        <p className="text-sm text-slate-600 mb-3 line-clamp-2">{challenge.description}</p>
      )}

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-500">Hạn chót:</span>
          <span className="text-slate-900 font-medium">{formattedDeadline}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Trạng thái:</span>
          <span className={`font-medium ${isExpired ? "text-red-600" : "text-green-600"}`}>
            {isExpired ? "Đã hết hạn" : "Còn hạn"}
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
      setChallenges(challenges.filter((c) => c.id !== deletingChallengeId));
      notify.success("Xóa thử thách thành công");
      setDeletingChallengeId(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Có lỗi khi xóa thử thách";
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
      const errorMessage = err instanceof Error ? err.message : "Có lỗi khi tải dữ liệu";
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
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 font-medium"
          >
            <ArrowLeft size={20} />
            Quay lại
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Quản lý thử thách</h1>
              <p className="text-slate-500 mt-1">Tạo và quản lý các thử thách cho ứng viên</p>
            </div>
            <button
              onClick={() => {
                setEditingChallengeId(null);
                setShowCreateForm(true);
              }}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <Plus size={20} />
              Thêm thử thách
            </button>
          </div>
        </div>

        {/* Content */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle size={20} className="text-red-600 mt-0.5 shrink-0" />
            <div>
              <h3 className="font-semibold text-red-900">Lỗi</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {challenges.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
            <AlertCircle size={48} className="mx-auto text-slate-400 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Chưa có thử thách nào</h3>
            <p className="text-slate-500 mb-6">Hãy tạo thử thách đầu tiên để bắt đầu</p>
            <button
              onClick={() => {
                setEditingChallengeId(null);
                setShowCreateForm(true);
              }}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              <Plus size={18} />
              Tạo thử thách
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

        {/* Delete Confirmation Modal */}
        {deletingChallengeId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-sm w-full p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-3">Xác nhận xóa</h2>
              <p className="text-slate-600 mb-6">
                Bạn có chắc chắn muốn xóa thử thách này? Hành động này không thể hoàn tác.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleCancelDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors disabled:opacity-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors disabled:opacity-50"
                >
                  {isDeleting ? "Đang xóa..." : "Xóa"}
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
