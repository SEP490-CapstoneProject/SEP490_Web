import { Plus, Trash2, X, Calendar, AlertCircle } from "lucide-react";
import { useState } from "react";
import { type ActivityOneDraft } from "@/pages/portfolio/editor/activityOneDraft";

type ActivityOneEditorProps = {
  initialData: ActivityOneDraft;
  initialList?: ActivityOneDraft[];
  onSave: (nextDraft: ActivityOneDraft) => void;
  onSaveList?: (activityList: ActivityOneDraft[]) => void;
  onCancel: () => void;
};

const getCurrentMonth = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};

export default function ActivityOneEditor({
  initialData,
  initialList = [],
  onSave,
  onSaveList,
  onCancel,
}: ActivityOneEditorProps) {
  const [error, setError] = useState<string | null>(null);
  const currentMonth = getCurrentMonth();
  const [draft, setDraft] = useState<ActivityOneDraft>(initialData);
  const [activityList, setActivityList] = useState<ActivityOneDraft[]>(initialList);

  const hasContent = [draft.name, draft.date, draft.description].some(
    (value) => value?.toString().trim().length > 0,
  );

  const updateDraftField = <K extends keyof ActivityOneDraft>(
    field: K,
    value: ActivityOneDraft[K],
  ) => {
    setDraft((prevDraft) => ({
      ...prevDraft,
      [field]: value,
    }));
    // Xóa lỗi khi người dùng thay đổi dữ liệu
    if (error) setError(null);
  };

  const validateTime = (): string | null => {
    if (draft.date && draft.date > currentMonth) {
      return "Thời gian hoạt động không được ở tương lai.";
    }
    return null;
  };

  const handleAddActivity = () => {
    if (!hasContent) return;

    const validationError = validateTime();
    if (validationError) {
      setError(validationError);
      return; // Dừng lại, không thêm vào list
    }

    const newActivity: ActivityOneDraft = {
      name: draft.name.trim(),
      date: draft.date.trim(),
      description: draft.description.trim(),
    };

    const updatedList = [...activityList, newActivity];
    setActivityList(updatedList);

    // Reset form
    setDraft({
      name: "",
      date: "",
      description: "",
    });
    setError(null);

    if (onSaveList) {
      onSaveList(updatedList);
    } else {
      onSave(newActivity);
    }
  };

  const handleRemoveActivity = (index: number) => {
    const updatedList = activityList.filter((_, i) => i !== index);
    setActivityList(updatedList);

    if (onSaveList) {
      onSaveList(updatedList);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d7dfeb] bg-[#EFF6FF]">
      <div className="flex items-start justify-between border-b border-[#d7dfeb] px-4 py-3">
        <div>
          <h3 className="text-[30px] font-bold leading-tight text-slate-800">Thêm hoạt động</h3>
          <p className="mt-1 text-sm text-slate-500">
            Hãy điền thêm hoạt động để hiển thị trong hồ sơ của bạn
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

      {/* List of existing activities */}
      {activityList.length > 0 && (
        <div className="border-b border-[#d7dfeb] px-3 py-3">
          <h4 className="mb-3 text-sm font-semibold text-slate-700">
            Danh sách hoạt động ({activityList.length})
          </h4>
          <div className="space-y-2">
            {activityList.map((activity, index) => (
              <div
                key={index}
                className="flex items-start justify-between rounded-lg border border-[#d1d5db] bg-white p-3"
              >
                <div className="flex-1 pr-3">
                  <p className="font-semibold text-slate-800">{activity.name}</p>
                  {activity.date && (
                    <p className="mt-0.5 text-xs text-slate-500">{activity.date}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveActivity(index)}
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

      <div className="space-y-3 p-3">
        {/* Tên hoạt động */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-600">Tên hoạt động</label>
          <input
            value={draft.name || ""}
            onChange={(event) => updateDraftField("name", event.target.value)}
            placeholder="Nhập tên hoạt động"
            className="h-10 w-full rounded-xl border border-[#d1d5db] bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
          />
        </div>

        {/* Thời gian tổ chức */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-600">
            <Calendar size={16} />
            Thời gian
          </label>
          <input
            type="month"
            value={draft.date || ""}
            max={currentMonth}
            onChange={(event) => updateDraftField("date", event.target.value)}
            className="h-10 w-full rounded-xl border border-[#d1d5db] bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
          />
        </div>

        {/* Hiển thị lỗi validation */}
        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            <AlertCircle size={16} className="shrink-0" />
            {error}
          </div>
        )}

        {/* Mô tả */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-600">Mô tả</label>
          <textarea
            value={draft.description || ""}
            onChange={(event) => updateDraftField("description", event.target.value)}
            placeholder="Thêm chút mô tả hoạt động của bạn"
            className="min-h-28 w-full resize-none rounded-xl border border-[#d1d5db] bg-white p-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
          />
        </div>
      </div>

      {/* Button Actions */}
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
          onClick={handleAddActivity}
          disabled={!hasContent}
          className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-[#4A79E8] text-sm font-semibold text-white transition-colors hover:bg-[#3d68d0] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus size={18} strokeWidth={2} />
          Thêm hoạt động mới
        </button>
      </div>
    </div>
  );
}