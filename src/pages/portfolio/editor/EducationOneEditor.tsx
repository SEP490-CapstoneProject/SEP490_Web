import { Plus, Trash2, X, Calendar } from "lucide-react";
import { useState } from "react";
import { type EducationOneDraft } from "@/pages/portfolio/editor/educationOneDraft";

type EducationOneEditorProps = {
  initialData: EducationOneDraft;
  initialList?: EducationOneDraft[];
  onSave: (nextDraft: EducationOneDraft) => void;
  onSaveList?: (educationList: EducationOneDraft[]) => void;
  onCancel: () => void;
};

export default function EducationOneEditor({
  initialData,
  initialList = [],
  onSave,
  onSaveList,
  onCancel,
}: EducationOneEditorProps) {
  const [draft, setDraft] = useState<EducationOneDraft>(initialData);
  const [educationList, setEducationList] =
    useState<EducationOneDraft[]>(initialList);

  const hasContent = [draft.schoolName, draft.startTime, draft.department].some(
    (value) => value?.toString().trim().length > 0,
  );

  const updateDraftField = <K extends keyof EducationOneDraft>(
    field: K,
    value: EducationOneDraft[K],
  ) => {
    setDraft((prevDraft) => ({
      ...prevDraft,
      [field]: value,
    }));
  };

  const handleAddEducation = () => {
    if (!hasContent) return;

    const newEducation: EducationOneDraft = {
      schoolName: draft.schoolName.trim(),
      startTime: draft.startTime.trim(),
      endTime: draft.endTime?.trim() || "",
      isCurrent: draft.isCurrent,
      department: draft.department.trim(),
      certificate: draft.certificate.trim(),
      description: draft.description.trim(),
    };

    const updatedList = [...educationList, newEducation];
    setEducationList(updatedList);

    // Reset form
    setDraft({
      schoolName: "",
      startTime: "",
      endTime: "",
      isCurrent: false,
      department: "",
      certificate: "",
      description: "",
    });

    if (onSaveList) {
      onSaveList(updatedList);
    } else {
      onSave(newEducation);
    }
  };

  const handleRemoveEducation = (index: number) => {
    const updatedList = educationList.filter((_, i) => i !== index);
    setEducationList(updatedList);

    if (onSaveList) {
      onSaveList(updatedList);
    }
  };

  // Helper hiển thị thời gian
  const formatEducationTime = (edu: EducationOneDraft): string => {
    if (edu.isCurrent) {
      return `${edu.startTime} - Hiện tại`;
    }
    if (edu.endTime) {
      return `${edu.startTime} - ${edu.endTime}`;
    }
    return edu.startTime;
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d7dfeb] bg-[#EFF6FF]">
      <div className="flex items-start justify-between border-b border-[#d7dfeb] px-4 py-3">
        <div>
          <h3 className="text-[30px] font-bold leading-tight text-slate-800">
            Thêm học vấn
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Hãy điền thêm học vấn để hiển thị trong hồ sơ của bạn
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

      {/* Danh sách học vấn đã thêm */}
      {educationList.length > 0 && (
        <div className="border-b border-[#d7dfeb] px-3 py-3">
          <h4 className="mb-3 text-sm font-semibold text-slate-700">
            Danh sách học vấn ({educationList.length})
          </h4>
          <div className="space-y-2">
            {educationList.map((education, index) => (
              <div
                key={index}
                className="flex items-start justify-between rounded-lg border border-[#d1d5db] bg-white p-3"
              >
                <div className="flex-1 pr-3">
                  <p className="font-semibold text-slate-800">
                    {education.schoolName}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {formatEducationTime(education)}
                  </p>
                  {education.department && (
                    <p className="text-xs text-slate-600 mt-0.5">
                      {education.department}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveEducation(index)}
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

      {/* Form nhập học vấn mới */}
      <div className="space-y-3 p-3">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-600">
            Tên trường / cơ sở / tổ chức
          </label>
          <input
            value={draft.schoolName || ""}
            onChange={(e) => updateDraftField("schoolName", e.target.value)}
            placeholder="Nhập tên trường / cơ sở / tổ chức bạn đã học"
            className="h-10 w-full rounded-xl border border-[#d1d5db] bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
          />
        </div>

        {/* Thời gian - Sử dụng date picker month */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-600 flex items-center gap-1.5">
              <Calendar size={16} />
              Thời gian bắt đầu
            </label>
            <input
              type="month"
              value={draft.startTime || ""}
              onChange={(e) => updateDraftField("startTime", e.target.value)}
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
              value={draft.isCurrent ? "" : draft.endTime || ""}
              onChange={(e) => updateDraftField("endTime", e.target.value)}
              disabled={draft.isCurrent}
              className="h-10 w-full rounded-xl border border-[#d1d5db] bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8] disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {/* Checkbox đang học */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="isCurrent"
            // ĐẢM BẢO CÓ DÒNG NÀY (Dùng checked thay vì value):
            checked={!!draft.isCurrent}
            onChange={(e) => {
              const checked = e.target.checked;
              setDraft((prev) => ({
                ...prev,
                isCurrent: checked,
                endTime: checked ? "" : prev.endTime,
              }));
            }}
            className="h-4 w-4 rounded border-slate-300 accent-[#4A79E8] focus:ring-[#4A79E8]"
          />
          <label
            htmlFor="isCurrent"
            className="text-sm text-slate-600 cursor-pointer select-none"
          >
            Tôi đang học tại đây
          </label>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-600">
            Chuyên ngành
          </label>
          <input
            value={draft.department || ""}
            onChange={(e) => updateDraftField("department", e.target.value)}
            placeholder="Nhập chuyên ngành bạn đã hoàn thành"
            className="h-10 w-full rounded-xl border border-[#d1d5db] bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-600">
            Chứng chỉ
          </label>
          <input
            value={draft.certificate || ""}
            onChange={(e) => updateDraftField("certificate", e.target.value)}
            placeholder="Nhập chứng chỉ bạn đạt được (nếu có)"
            className="h-10 w-full rounded-xl border border-[#d1d5db] bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-600">
            Giới thiệu
          </label>
          <textarea
            value={draft.description || ""}
            onChange={(e) => updateDraftField("description", e.target.value)}
            placeholder="Thêm chút giới thiệu những gì bạn đã đạt được..."
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
          onClick={handleAddEducation}
          disabled={!hasContent}
          className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-[#4A79E8] text-sm font-semibold text-white transition-colors hover:bg-[#3d68d0] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus size={18} strokeWidth={2} />
          Thêm học vấn mới
        </button>
      </div>
    </div>
  );
}
