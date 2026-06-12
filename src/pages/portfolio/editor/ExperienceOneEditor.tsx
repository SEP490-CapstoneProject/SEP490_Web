import { Plus, Trash2, X, Calendar, AlertCircle } from "lucide-react";
import { useState } from "react";
import {
  type ExperienceOneDraft,
  composeExperienceOneTime,
} from "@/pages/portfolio/editor/experienceOneDraft";

type ExperienceOneEditorProps = {
  initialData: ExperienceOneDraft;
  initialList?: ExperienceOneDraft[];
  onSave: (nextDraft: ExperienceOneDraft) => void;
  onSaveList?: (experienceList: ExperienceOneDraft[]) => void;
  onCancel: () => void;
};

const EMPTY_DRAFT: ExperienceOneDraft = {
  jobName: "",
  address: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
  description: "",
};
const getCurrentMonth = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};
export default function ExperienceOneEditor({
  initialData,
  initialList = [],
  onSave,
  onSaveList,
  onCancel,
}: ExperienceOneEditorProps) {
  const [draft, setDraft] = useState<ExperienceOneDraft>(initialData);
  const [experienceList, setExperienceList] =
    useState<ExperienceOneDraft[]>(initialList);
  const [error, setError] = useState<string | null>(null);
  const currentMonth = getCurrentMonth();
  const hasContent = [draft.jobName, draft.address, draft.startDate].some(
    (value) => value?.toString().trim().length > 0,
  );

  const updateDraftField = <K extends keyof ExperienceOneDraft>(
    field: K,
    value: ExperienceOneDraft[K],
  ) => {
    setDraft((prevDraft) => ({
      ...prevDraft,
      [field]: value,
    }));
  };
  const validateTimeRange = (): string | null => {
    if (draft.startDate && draft.startDate > currentMonth) {
      return "Thời gian bắt đầu không được ở tương lai.";
    }

    if (!draft.isCurrent && draft.startDate && draft.endDate) {
      if (draft.startDate > draft.endDate) {
        return "Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc.";
      }
    }

    return null;
  };
  const handleAddExperience = () => {
    if (!hasContent) return;
    const validationError = validateTimeRange();
    if (validationError) {
      setError(validationError);
      return; // dừng lại, KHÔNG thêm vào list, KHÔNG gọi onSave/onSaveList
    }
    const newExperience: ExperienceOneDraft = {
      jobName: draft.jobName.trim(),
      address: draft.address.trim(),
      startDate: draft.startDate.trim(),
      endDate: draft.isCurrent ? "" : draft.endDate?.trim() || "",
      isCurrent: draft.isCurrent,
      description: draft.description.trim(),
    };

    const updatedList = [...experienceList, newExperience];
    setExperienceList(updatedList);

    setDraft(EMPTY_DRAFT);

    if (onSaveList) {
      onSaveList(updatedList);
    } else {
      onSave(newExperience);
    }
  };

  const handleRemoveExperience = (index: number) => {
    const updatedList = experienceList.filter((_, i) => i !== index);
    setExperienceList(updatedList);

    if (onSaveList) {
      onSaveList(updatedList);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d7dfeb] bg-[#EFF6FF]">
      <div className="flex items-start justify-between border-b border-[#d7dfeb] px-4 py-3">
        <div>
          <h3 className="text-[30px] font-bold leading-tight text-slate-800">
            Kinh nghiệm làm việc
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Hãy thêm kinh nghiệm làm việc để hiển thị trong hồ sơ của bạn
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full p-1 text-slate-700 transition-colors hover:bg-slate-200"
          title="Đóng"
        >
          <X size={24} strokeWidth={2.5} />
        </button>
      </div>

      {/* Danh sách kinh nghiệm đã thêm */}
      {experienceList.length > 0 && (
        <div className="border-b border-[#d7dfeb] px-3 py-3">
          <h4 className="mb-3 text-sm font-semibold text-slate-700">
            Danh sách kinh nghiệm ({experienceList.length})
          </h4>
          <div className="space-y-2">
            {experienceList.map((experience, index) => (
              <div
                key={index}
                className="flex items-start justify-between rounded-lg border border-[#d1d5db] bg-white p-3"
              >
                <div className="flex-1 pr-3">
                  <p className="font-semibold text-slate-800">
                    {experience.jobName}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {composeExperienceOneTime(experience)}
                  </p>
                  {experience.address && (
                    <p className="text-xs text-slate-600 mt-0.5">
                      {experience.address}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveExperience(index)}
                  className="ml-2 rounded-lg p-1.5 text-red-600 transition-colors hover:bg-red-50"
                  title="Xóa"
                >
                  <Trash2 size={18} strokeWidth={2} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Form nhập kinh nghiệm mới */}
      <div className="space-y-3 p-3">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-600">
            Công việc
          </label>
          <input
            value={draft.jobName || ""}
            onChange={(e) => updateDraftField("jobName", e.target.value)}
            placeholder="Nhập tên/loại công việc"
            className="h-10 w-full rounded-xl border border-[#d1d5db] bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-600">
            Địa điểm
          </label>
          <input
            value={draft.address || ""}
            onChange={(e) => updateDraftField("address", e.target.value)}
            placeholder="Nhập địa điểm bạn làm công việc này"
            className="h-10 w-full rounded-xl border border-[#d1d5db] bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
          />
        </div>

        {/* Thời gian - date picker month */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-600 flex items-center gap-1.5">
              <Calendar size={16} />
              Thời gian bắt đầu
            </label>
            <input
              type="month"
              value={draft.startDate || ""}
              max={currentMonth}
              onChange={(e) => updateDraftField("startDate", e.target.value)}
              className="h-10 w-full rounded-xl border border-[#d1d5db] bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-600 flex items-center gap-1.5">
              <Calendar size={16} />
              Thời gian kết thúc
            </label>
            <input
              type="month"
              value={draft.isCurrent ? "" : draft.endDate || ""}
              min={draft.startDate || undefined}
              onChange={(e) => updateDraftField("endDate", e.target.value)}
              disabled={draft.isCurrent}
              className="h-10 w-full rounded-xl border border-[#d1d5db] bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8] disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>
        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            <AlertCircle size={16} className="shrink-0" />
            {error}
          </div>
        )}

        {/* Checkbox đang làm việc */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="isCurrentJob"
            checked={!!draft.isCurrent}
            onChange={(e) => {
              const checked = e.target.checked;
              setDraft((prev) => ({
                ...prev,
                isCurrent: checked,
                endDate: checked ? "" : prev.endDate,
              }));
            }}
            className="h-4 w-4 rounded border-slate-300 accent-[#4A79E8] focus:ring-[#4A79E8]"
          />
          <label
            htmlFor="isCurrentJob"
            className="text-sm text-slate-600 cursor-pointer select-none"
          >
            Tôi đang làm việc tại đây
          </label>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-600">Mô tả</label>
          <textarea
            value={draft.description || ""}
            onChange={(e) => updateDraftField("description", e.target.value)}
            placeholder="Thêm mô tả cho công việc"
            className="min-h-28 w-full resize-none rounded-xl border border-[#d1d5db] bg-white p-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
          />
        </div>
      </div>

      <div className="flex gap-3 border-t border-[#d7dfeb] bg-[#EFF6FF] px-3 py-4">
        <button
          type="button"
          onClick={onCancel}
          className="h-10 flex-1 rounded-xl bg-[#e6eaf1] text-sm font-semibold text-slate-600 transition-colors hover:bg-[#dde3ec]"
        >
          Hủy
        </button>
        <button
          type="button"
          onClick={handleAddExperience}
          disabled={!hasContent}
          className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-[#4A79E8] text-sm font-semibold text-white transition-colors hover:bg-[#3d68d0] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus size={18} strokeWidth={2} />
          Thêm kinh nghiệm mới
        </button>
      </div>
    </div>
  );
}
