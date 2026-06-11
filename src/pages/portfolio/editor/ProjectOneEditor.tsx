import { Plus, Trash2, Upload, X } from "lucide-react";
import {
  type ChangeEvent,
  type DragEvent,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";
import { type ProjectOneDraft } from "@/pages/portfolio/editor/projectOneDraft";
import { portfolioService } from "@/services/portfolio.api";
import { notify } from "@/lib/toast";

type ProjectOneEditorProps = {
  initialData: ProjectOneDraft;
  initialList?: ProjectOneDraft[];
  onSave: (nextDraft: ProjectOneDraft) => void;
  onSaveList?: (projectList: ProjectOneDraft[]) => void;
  onCancel: () => void;
};

const normalizeDraft = (draft: ProjectOneDraft): ProjectOneDraft => {
  return {
    image: draft.image.trim(),
    name: draft.name.trim(),
    description: draft.description.trim(),
    role: draft.role.trim(),
    technology: draft.technology.trim(),
    githubLink: draft.githubLink.trim(),
    figmaLink: draft.figmaLink.trim(),
    appLink: draft.appLink.trim(),
    websiteLink: draft.websiteLink.trim(),
  };
};

export default function ProjectOneEditor({
  initialData,
  initialList = [],
  onSave,
  onSaveList,
  onCancel,
}: ProjectOneEditorProps) {
  const [draft, setDraft] = useState<ProjectOneDraft>(initialData);
  const [projectList, setProjectList] = useState<ProjectOneDraft[]>(initialList);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [projectImageFile, setProjectImageFile] = useState<File | null>(null);

  const imagePreviewUrl = useMemo(() => {
    if (projectImageFile) {
      return URL.createObjectURL(projectImageFile);
    }
    if (draft.image.startsWith("http://") || draft.image.startsWith("https://")) {
      return draft.image;
    }
    return null;
  }, [projectImageFile, draft.image]);

  const updateDraftField = (field: keyof ProjectOneDraft, value: string) => {
    setDraft((prevDraft) => ({
      ...prevDraft,
      [field]: value,
    }));
  };

  const hasContent = [
    draft.image,
    draft.name,
    draft.description,
    draft.role,
    draft.technology,
    draft.githubLink,
    draft.figmaLink,
    draft.appLink,
    draft.websiteLink,
  ].some((value) => value.trim().length > 0);

  const handleAddProject = () => {
    if (!hasContent) {
      return;
    }

    // Image file is already stored via uploadPortfolioImage in applyProjectImage
    // No need to store again here
    const newProject = normalizeDraft(draft);
    const updatedList = [...projectList, newProject];
    setProjectList(updatedList);

    // Reset form
    setDraft({
      image: "",
      name: "",
      description: "",
      role: "",
      technology: "",
      githubLink: "",
      figmaLink: "",
      appLink: "",
      websiteLink: "",
    });
    // Clear image states
    setProjectImageFile(null);
    setIsDraggingImage(false);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }

    if (onSaveList) {
      onSaveList(updatedList);
    } else {
      onSave(newProject);
    }
  };

  const handleRemoveProject = (index: number) => {
    const updatedList = projectList.filter((_, i) => i !== index);
    setProjectList(updatedList);

    if (onSaveList) {
      onSaveList(updatedList);
    }
  };

  const applyProjectImage = async (file: File | null) => {
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      notify.error("Vui lòng chọn tệp ảnh.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      notify.error("Ảnh không được quá 5MB.");
      return;
    }

    try {
      setIsUploadingImage(true);
      console.log("📸 Processing project image:", file.name);

      // Upload image to get reference ID
      const referenceId = await portfolioService.uploadPortfolioImage(file);
      console.log("✅ Project image processed successfully:", referenceId);

      // Store file locally for preview and later upload
      setProjectImageFile(file);
      updateDraftField("image", referenceId);
      notify.success("Ảnh đã được chọn! Sẽ tải lên khi lưu hồ sơ.");
    } catch (error) {
      console.error("❌ Project image upload error:", error);
      notify.error(error instanceof Error ? error.message : "Lỗi khi tải ảnh");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleImageInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    await applyProjectImage(file);
    event.target.value = "";
  };

  const handleImageDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDraggingImage(false);

    const file = event.dataTransfer.files?.[0] ?? null;
    await applyProjectImage(file);
  };

  const linkFieldClassName =
    "h-10 w-full rounded-xl border border-[#d1d5db] bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]";

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d7dfeb] bg-[#EFF6FF]">
      <div className="flex items-start justify-between border-b border-[#d7dfeb] px-4 py-3">
        <div>
          <h3 className="text-[30px] font-bold leading-tight text-slate-800">Thêm dự án mới</h3>
          <p className="mt-1 text-sm text-slate-500">
            Hãy điền thông tin dự án để hiển thị trong hồ sơ của bạn
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

      {/* List of existing projects */}
      {projectList.length > 0 && (
        <div className="border-b border-[#d7dfeb] px-3 py-3">
          <h4 className="mb-3 text-sm font-semibold text-slate-700">
            Danh sách dự án ({projectList.length})
          </h4>
          <div className="space-y-2">
            {projectList.map((project, index) => (
              <div
                key={index}
                className="flex items-start justify-between gap-3 rounded-lg border border-[#d1d5db] bg-white p-3"
              >
                <div className="flex flex-1 gap-3">
                  {(project.image.startsWith("http://") || project.image.startsWith("https://")) && (
                    <img
                      src={project.image}
                      alt={project.name}
                      className="h-12 w-12 rounded-lg border border-[#d7dfeb] object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800">{project.name}</p>
                    {project.technology && (
                      <p className="text-xs text-slate-600">{project.technology}</p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveProject(index)}
                  className="rounded-lg p-1.5 text-red-600 transition-colors hover:bg-red-50"
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
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-600">Ảnh dự án</label>

          <input
            ref={imageInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={handleImageInputChange}
            disabled={isUploadingImage}
            className="hidden"
          />

          <div
            onDragEnter={(event) => {
              event.preventDefault();
              event.stopPropagation();
              if (!isUploadingImage) {
                setIsDraggingImage(true);
              }
            }}
            onDragOver={(event) => {
              event.preventDefault();
              event.stopPropagation();
              if (!isUploadingImage) {
                setIsDraggingImage(true);
              }
            }}
            onDragLeave={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setIsDraggingImage(false);
            }}
            onDrop={handleImageDrop}
            className={cn(
              "rounded-xl border border-dashed bg-white px-3 py-4 text-center transition-colors",
              isDraggingImage && !isUploadingImage
                ? "border-[#4A79E8] bg-[#edf3ff]"
                : "border-[#bfc8d8]",
            )}
          >
            {imagePreviewUrl ? (
              <div className="space-y-3">
                <img
                  src={imagePreviewUrl}
                  alt="Project"
                  className="h-24 w-full object-cover rounded-lg"
                  onError={(e) => {
                    console.warn("❌ Failed to load project image preview");
                    e.currentTarget.style.display = "none";
                  }}
                />
                <p className="text-xs text-slate-500">Kéo thả ảnh mới hoặc bấm Chọn ảnh để thay thế</p>
              </div>
            ) : (
              <div>
                <div className="mb-2 flex justify-center text-[#5f84d7]">
                  <Upload size={28} />
                </div>
                <p className="text-sm font-semibold text-slate-600">
                  Kéo thả ảnh vào đây hoặc chọn ảnh từ máy
                </p>
                <p className="mt-1 text-xs text-slate-500">JPG/PNG, gợi ý kích thước 1600x900 hoặc 4:3</p>
              </div>
            )}

            <div className="mt-3 flex items-center justify-center">
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                disabled={isUploadingImage}
                className="inline-flex h-9 items-center justify-center rounded-xl border border-[#acb4c3] bg-[#f4f6fa] px-5 text-sm font-semibold text-slate-700 transition-colors hover:bg-[#eaedf3] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isUploadingImage ? "Đang tải..." : "Chọn ảnh"}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-600">Tên dự án</label>
          <input
            value={draft.name}
            onChange={(event) => updateDraftField("name", event.target.value)}
            placeholder="Nhập tên dự án, ví dụ: Dashboard phân tích dữ liệu"
            className={linkFieldClassName}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-600">Mô tả dự án</label>
          <textarea
            value={draft.description}
            onChange={(event) => updateDraftField("description", event.target.value)}
            placeholder="Mục tiêu dự án và kết quả đạt được (50 - 100 từ)"
            className="min-h-24 w-full resize-none rounded-xl border border-[#d1d5db] bg-white p-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#4A79E8]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-600">Vai trò</label>
          <input
            value={draft.role}
            onChange={(event) => updateDraftField("role", event.target.value)}
            placeholder="Vai trò của bạn trong dự án này là gì?"
            className={linkFieldClassName}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-600">Công nghệ</label>
          <input
            value={draft.technology}
            onChange={(event) => updateDraftField("technology", event.target.value)}
            placeholder="Công nghệ bạn đã sử dụng trong dự án này là gì?"
            className={linkFieldClassName}
          />
        </div>

        <div className="rounded-xl border border-[#d7dfeb] bg-[#edf2fb] p-3">
          <h4 className="text-sm font-semibold text-slate-700">Đường dẫn công khai</h4>
          <p className="mt-1 text-xs text-slate-500">
            Đường dẫn công khai giúp nhà tuyển dụng có thể xem chi tiết hơn dự án của bạn
          </p>

          <div className="mt-3 space-y-2.5">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-600">Github</label>
              <input
                value={draft.githubLink}
                onChange={(event) => updateDraftField("githubLink", event.target.value)}
                className={linkFieldClassName}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-600">Figma hoặc nơi bạn thiết kế dự án</label>
              <input
                value={draft.figmaLink}
                onChange={(event) => updateDraftField("figmaLink", event.target.value)}
                className={linkFieldClassName}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-600">Ứng dụng</label>
              <input
                value={draft.appLink}
                onChange={(event) => updateDraftField("appLink", event.target.value)}
                className={linkFieldClassName}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-600">Website</label>
              <input
                value={draft.websiteLink}
                onChange={(event) => updateDraftField("websiteLink", event.target.value)}
                className={linkFieldClassName}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-[#d7dfeb] bg-[#EFF6FF] px-3 py-4">
        <button
          type="button"
          onClick={onCancel}
          className="h-9 min-w-24 rounded-xl bg-[#e6eaf1] px-4 text-sm font-semibold text-slate-600 transition-colors hover:bg-[#dde3ec]"
        >
          Hủy
        </button>
        <button
          type="button"
          onClick={handleAddProject}
          disabled={!hasContent}
          className="flex h-9 min-w-36 items-center justify-center gap-2 rounded-xl bg-[#4A79E8] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#3d68d0] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus size={18} strokeWidth={2} />
          Thêm dự án mới
        </button>
      </div>
    </div>
  );
}
