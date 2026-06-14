import { X, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/store/hook";
import {
  createChallenge,
  updateChallenge,
  getChallengeDetail,
} from "@/services/challenge.api";
import { CreateChallengePayload } from "@/types/challenge";
import { notify } from "@/lib/toast";

interface CreateChallengeFormProps {
  challengeId?: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData extends CreateChallengePayload {
  deadlineDateTime: string;
}

interface FormErrors {
  title?: string;
  description?: string;
  expectedSolution?: string;
  deadline?: string;
}

export default function CreateChallengeForm({
  challengeId,
  onClose,
  onSuccess,
}: CreateChallengeFormProps) {
  const { accessToken } = useAppSelector((state) => state.auth);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    expectedSolution: "",
    deadline: "",
    deadlineDateTime: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load challenge data khi edit
  useEffect(() => {
    if (challengeId && accessToken) {
      const loadChallenge = async () => {
        try {
          setIsLoading(true);
          const challenge = await getChallengeDetail(challengeId, accessToken);
          
          const date = new Date(challenge.deadline);
          const deadlineDateTime = date.toISOString().slice(0, 16);
          
          setFormData({
            title: challenge.title,
            description: challenge.description || "",
            expectedSolution: challenge.expectedSolution || "",
            deadline: challenge.deadline,
            deadlineDateTime,
          });
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      loadChallenge();
    }
  }, [challengeId, accessToken]);

  // Validate từng trường
  const validateField = (name: keyof FormData, value: string) => {
    const newErrors = { ...errors };

    switch (name) {
      case "title":
        if (!value.trim()) {
          newErrors.title = "Tên thử thách không được để trống";
        } else if (value.trim().length < 5) {
          newErrors.title = "Tên thử thách phải có ít nhất 5 ký tự";
        } else if (!/[a-zA-ZÀ-ỹ]/.test(value)) {
          newErrors.title = "Tên thử thách phải chứa ít nhất một chữ cái";
        } else {
          delete newErrors.title;
        }
        break;

      case "deadlineDateTime":
        if (!value) {
          newErrors.deadline = "Hạn chót không được để trống";
        } else {
          const selectedDate = new Date(value);
          const now = new Date();
          now.setSeconds(0, 0); // So sánh chính xác hơn

          if (selectedDate <= now) {
            newErrors.deadline = "Hạn chót phải là thời điểm trong tương lai";
          } else {
            delete newErrors.deadline;
          }
        }
        break;

      case "description":
        if (value.length > 1000) {
          newErrors.description = "Mô tả không được vượt quá 1000 ký tự";
        } else {
          delete newErrors.description;
        }
        break;

      case "expectedSolution":
        if (value.length > 1000) {
          newErrors.expectedSolution = "Giải pháp mong đợi không được vượt quá 1000 ký tự";
        } else {
          delete newErrors.expectedSolution;
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === "deadlineDateTime") {
      const isoString = value ? new Date(value).toISOString() : "";
      setFormData((prev) => ({
        ...prev,
        deadlineDateTime: value,
        deadline: isoString,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Validate realtime
    validateField(name as keyof FormData, value);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    validateField(name as keyof FormData, value);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim() || formData.title.trim().length < 5 || !/[a-zA-ZÀ-ỹ]/.test(formData.title)) {
      newErrors.title = "Tên thử thách không hợp lệ (ít nhất 5 ký tự và phải chứa chữ cái)";
    }

    if (!formData.deadlineDateTime) {
      newErrors.deadline = "Hạn chót không được để trống";
    } else {
      const selectedDate = new Date(formData.deadlineDateTime);
      if (selectedDate <= new Date()) {
        newErrors.deadline = "Hạn chót phải là thời điểm trong tương lai";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!accessToken) {
      setErrors({ title: "Token xác thực không tìm thấy. Vui lòng đăng nhập lại." });
      return;
    }

    try {
      setIsSubmitting(true);

      const payload: CreateChallengePayload = {
        title: formData.title.trim(),
        description: formData.description?.trim() || "",
        expectedSolution: formData.expectedSolution?.trim() || "",
        deadline: formData.deadline,
      };

      if (challengeId) {
        await updateChallenge(challengeId, payload, accessToken);
        notify.success("Cập nhật thử thách thành công");
      } else {
        await createChallenge(payload, accessToken);
        notify.success("Tạo thử thách thành công");
      }

      onSuccess();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Có lỗi khi lưu thử thách";
      setErrors({ title: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-8 py-6 flex items-center justify-between rounded-t-3xl">
          <h2 className="text-2xl font-bold text-slate-900">
            {challengeId ? "Chỉnh sửa thử thách" : "Tạo thử thách mới"}
          </h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X size={26} className="text-slate-500" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto max-h-[calc(92vh-85px)]">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin mx-auto h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full" />
              <p className="text-slate-600 mt-4">Đang tải thông tin...</p>
            </div>
          ) : (
            <>
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Tên thử thách <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting}
                  placeholder="Ví dụ: Xây dựng hệ thống Authentication"
                  className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 transition-all
                    ${errors.title ? "border-red-500 focus:ring-red-500" : "border-slate-300 focus:ring-blue-500"}`}
                />
                {errors.title && (
                  <p className="text-red-600 text-sm mt-1.5 flex items-center gap-1">
                    <AlertCircle size={16} /> {errors.title}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Mô tả</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting}
                  rows={4}
                  placeholder="Mô tả chi tiết thử thách, yêu cầu và tiêu chí đánh giá..."
                  className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 resize-none transition-all
                    ${errors.description ? "border-red-500" : "border-slate-300 focus:ring-blue-500"}`}
                />
                {errors.description && (
                  <p className="text-red-600 text-sm mt-1.5">{errors.description}</p>
                )}
              </div>

              {/* Expected Solution */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Giải pháp mong đợi</label>
                <textarea
                  name="expectedSolution"
                  value={formData.expectedSolution}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting}
                  rows={4}
                  placeholder="Mô tả giải pháp, công nghệ gợi ý, yêu cầu kỹ thuật..."
                  className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 resize-none transition-all
                    ${errors.expectedSolution ? "border-red-500" : "border-slate-300 focus:ring-blue-500"}`}
                />
                {errors.expectedSolution && (
                  <p className="text-red-600 text-sm mt-1.5">{errors.expectedSolution}</p>
                )}
              </div>

              {/* Deadline */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Hạn chót <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="deadlineDateTime"
                  value={formData.deadlineDateTime}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting}
                  className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 transition-all
                    ${errors.deadline ? "border-red-500 focus:ring-red-500" : "border-slate-300 focus:ring-blue-500"}`}
                />
                {errors.deadline && (
                  <p className="text-red-600 text-sm mt-1.5 flex items-center gap-1">
                    <AlertCircle size={16} /> {errors.deadline}
                  </p>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 border border-slate-300 rounded-2xl font-medium hover:bg-slate-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-semibold transition-all disabled:opacity-70"
                >
                  {isSubmitting
                    ? "Đang lưu..."
                    : challengeId
                    ? "Cập nhật thử thách"
                    : "Tạo thử thách"}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}