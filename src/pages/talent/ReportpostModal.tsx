import { useState } from 'react';
import { reportCompanyPost } from '@/services/company.api';
import { notify } from '@/lib/toast';
import { useAppSelector } from '@/store/hook';

interface ReportPostModalProps {
  postId: number;
  isOpen: boolean;
  onClose: () => void;
}

const REPORT_REASONS = [
  { value: 'WRONG_INFO', label: 'Sai lệch thông tin công việc/mức lương so với mô tả' },
  { value: 'DUPLICATE_SPAM', label: 'Bài đăng trùng lặp, spam hoặc sai chuyên mục' },
  { value: 'INAPPROPRIATE', label: 'Ngôn từ không phù hợp, phân biệt đối xử' },
  { value: 'OTHER', label: 'Lý do khác' },
];

export const ReportPostModal = ({ postId, isOpen, onClose }: ReportPostModalProps) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!selectedReason) {
      notify.error('Vui lòng chọn lý do báo cáo');
      return;
    }

    const isOther = selectedReason === 'OTHER';

    if (isOther && !customReason.trim()) {
      notify.error('Vui lòng nhập lý do cụ thể');
      return;
    }

    if (!description.trim()) {
      notify.error('Vui lòng nhập mô tả chi tiết');
      return;
    }

    const reasonLabel = isOther
      ? customReason.trim()
      : REPORT_REASONS.find((r) => r.value === selectedReason)?.label || selectedReason;

    try {
      setIsSubmitting(true);
      await reportCompanyPost(
        postId,
        { reason: reasonLabel, description: description.trim() },
        accessToken || undefined
      );
      notify.success('Báo cáo đã được gửi thành công');
      handleClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gửi báo cáo thất bại';
      notify.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedReason('');
    setCustomReason('');
    setDescription('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">Báo cáo bài đăng</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Đóng"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Reason Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Lý do tố cáo <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedReason}
            onChange={(e) => {
              setSelectedReason(e.target.value);
              if (e.target.value !== 'OTHER') setCustomReason('');
            }}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="">-- Chọn lý do --</option>
            {REPORT_REASONS.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>

        {/* Custom reason input (only for OTHER) */}
        {selectedReason === 'OTHER' && (
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nhập lý do cụ thể <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder="Nhập lý do của bạn..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Mô tả chi tiết <span className="text-red-500">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Mô tả chi tiết vấn đề bạn gặp phải..."
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Đang gửi...' : 'Gửi báo cáo'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportPostModal;