import { X, Trash2, Edit2 } from "lucide-react";
import { useState } from "react";
import { type ExperienceOneDraft } from "@/pages/portfolio/editor/experienceOneDraft";

type ExperienceOneEditorProps = {
  initialData: ExperienceOneDraft;
  existingItems?: Array<{ jobName: string; address: string; time: string; description: string }>;
  onSave: (nextDraft: ExperienceOneDraft) => void;
  onCancel: () => void;
  onDeleteItem?: (index: number) => void;
};

export default function ExperienceOneEditor({
  initialData,
  existingItems = [],
  onSave,
  onCancel,
  onDeleteItem,
}: ExperienceOneEditorProps) {
  const [draft, setDraft] = useState<ExperienceOneDraft>(initialData);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const hasContent = [draft.jobName, draft.address, draft.time, draft.description].some(
    (value) => value.trim().length > 0,
  );

  const updateDraftField = (field: keyof ExperienceOneDraft, value: string) => {
    setDraft((prevDraft) => ({
      ...prevDraft,
      [field]: value,
    }));
  };

  const handleSave = () => {
    if (!hasContent) {
      return;
    }

    onSave({
      jobName: draft.jobName.trim(),
      address: draft.address.trim(),
      time: draft.time.trim(),
      description: draft.description.trim(),
    });

    // Reset form
    setDraft({
      jobName: "",
      address: "",
      time: "",
      description: "",
    });
    setEditingIndex(null);
  };

  const handleEditItem = (index: number) => {
    const item = existingItems[index];
    if (item) {
      setDraft(item);
      setEditingIndex(index);
    }
  };

  const handleDeleteItem = (index: number) => {
    if (onDeleteItem) {
      onDeleteItem(index);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d7dfeb] bg-[#EFF6FF]">
      <div className="flex items-start justify-between border-b border-[#d7dfeb] px-4 py-3">
        <div>
          <h3 className="text-[30px] font-bold leading-tight text-slate-800">Kinh nghiệm làm việc</h3>
          <p className="mt-1 text-sm text-slate-500">
            Hãy thêm kinh nghiệm làm việc để hiển thị trong hồ sơ của bạn ({existingItems.length} kinh nghiệm)
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

      <div className="space-y-4 p-3">
        {/* Danh sách kinh nghiệm đã thêm */}
        {existingItems.length > 0 && (
          <div className="rounded-xl border border-[#d7dfeb] bg-white p-4">
            <h4 className="mb-3 font-semibold text-slate-700">Danh sách kinh nghiệm ({existingItems.length})</h4>
            <div className="space-y-2">
              {existingItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between rounded-lg bg-slate-50 p-3 hover:bg-slate-100"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-800">{item.jobName}</p>
                    <p className="text-sm text-slate-600">{item.address}</p>
                    <p className="text-xs text-slate-500">{item.time}</p>
                  </div>
                  <div className="ml-2 flex gap-1">
                    <button
                      type="button"
                      onClick={() => handleEditItem(index)}
                      className="rounded-lg bg-blue-100 p-2 text-blue-600 transition-colors hover:bg-blue-200"
                      title="Sửa"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(index)}
                      className="rounded-lg bg-red-100 p-2 text-red-600 transition-colors hover:bg-red-200"
                      title="Xóa"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Form thêm/sửa kinh nghiệm */}
        <div className="rounded-xl border border-[#d7dfeb] bg-white p-3">
          <h4 className="mb-3 font-semibold text-slate-700">
            {editingIndex !== null ? "Sửa kinh nghiệm" : "Thêm kinh nghiệm mới"}
          </h4>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-600">Công việc</label>
            <input
              value={draft.jobName}
              onChange={(event) => updateDraftField("jobName", event.target.value)}
              placeholder="Nhập tên/loại công việc"
              className="h-10 w-full rounded-xl border border-[#d1d5db] bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-600">Địa điểm</label>
            <input
              value={draft.address}
              onChange={(event) => updateDraftField("address", event.target.value)}
              placeholder="Nhập địa điểm bạn làm công việc này"
              className="h-10 w-full rounded-xl border border-[#d1d5db] bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-600">Thời gian</label>
            <input
              value={draft.time}
              onChange={(event) => updateDraftField("time", event.target.value)}
              placeholder="Nhập thời gian bạn đã làm việc (vd: 2021 - 2023)"
              className="h-10 w-full rounded-xl border border-[#d1d5db] bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-600">Mô tả</label>
            <textarea
              value={draft.description}
              onChange={(event) => updateDraftField("description", event.target.value)}
              placeholder="Thêm mô tả cho công việc"
              className="min-h-28 w-full resize-none rounded-xl border border-[#d1d5db] bg-white p-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3 border-t border-[#d7dfeb] bg-[#EFF6FF] px-3 py-4">
        <button
          type="button"
          onClick={() => {
            setEditingIndex(null);
            setDraft({
              jobName: "",
              address: "",
              time: "",
              description: "",
            });
            onCancel();
          }}
          className="h-10 flex-1 rounded-xl bg-[#e6eaf1] text-sm font-semibold text-slate-600 transition-colors hover:bg-[#dde3ec]"
        >
          Đóng
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={!hasContent}
          className="h-10 flex-1 rounded-xl bg-[#4A79E8] text-sm font-semibold text-white transition-colors hover:bg-[#3d68d0] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {editingIndex !== null ? "Cập nhật" : "Thêm kinh nghiệm"}
        </button>
      </div>
    </div>
  );
}

