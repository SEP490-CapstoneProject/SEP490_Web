import {
  ArrowLeft,
  Briefcase,
  CircleDollarSign,
  MapPin,
  Send,
  Upload,
  Users,
} from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "@/store/hook";
import { fetchCompanyPostDetail, updateCompanyPostFull } from "@/services/company.api";
import CustomLoading from "@/components/Loading/Loading";
import { formatErrorForDisplay } from "@/lib/errorTranslator";

type EmploymentType = "fulltime" | "parttime";

type RecruitmentFormData = {
  title: string;
  location: string;
  salary: string;
  experienceYears: string;
  quantity: string;
  employmentType: EmploymentType;
  description: string;
  mandatoryRequirements: string;
  preferredRequirements: string;
  benefits: string;
};

const initialFormData: RecruitmentFormData = {
  title: "",
  location: "",
  salary: "",
  experienceYears: "",
  quantity: "",
  employmentType: "fulltime",
  description: "",
  mandatoryRequirements: "",
  preferredRequirements: "",
  benefits: "",
};

export default function EditRecruitmentPost() {
  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { accessToken } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState<RecruitmentFormData>(initialFormData);
  const [bannerFileName, setBannerFileName] = useState<string>("");
  const [bannerPreview, setBannerPreview] = useState<string>("");
  const [bannerMediaType, setBannerMediaType] = useState<"image" | "video">("image");
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [isExistingMedia, setIsExistingMedia] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof RecruitmentFormData, string>>
  >({});

  // Load post details on mount
  useEffect(() => {
    const loadPostDetails = async () => {
      try {
        if (!postId || !accessToken) {
          setError("Invalid post ID or no access token");
          return;
        }

        console.log("📡 Loading post details for ID:", postId);
        const postDetail = await fetchCompanyPostDetail(parseInt(postId), accessToken);

        console.log("📦 Loaded post detail:", postDetail);

        // Map API data to form data
        setFormData({
          title: postDetail.position || "",
          location: postDetail.address || "",
          salary: postDetail.salary || "",
          experienceYears: postDetail.experienceYear?.toString() || "",
          quantity: postDetail.quantity?.toString() || "",
          employmentType: 
            postDetail.employmentType?.toLowerCase().includes("part") ? "parttime" : "fulltime",
          description: postDetail.jobDescription || "",
          mandatoryRequirements: postDetail.requirementsMandatory || "",
          preferredRequirements: postDetail.requirementsPreferred || "",
          benefits: postDetail.benefits || "",
        });

        // Set existing image/banner
        if (postDetail.media && postDetail.media.length > 0) {
          const primaryMedia = postDetail.media[0];
          setBannerPreview(primaryMedia.url);
          setBannerMediaType(primaryMedia.type);
          setBannerFileName(`${primaryMedia.type} media`);
          setIsExistingMedia(true);
        } else if (postDetail.coverImageUrl) {
          setBannerPreview(postDetail.coverImageUrl);
          setBannerMediaType("image");
          setBannerFileName("Cover image");
          setIsExistingMedia(true);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Có lỗi khi tải chi tiết bài đăng";
        console.error("❌ Error loading post:", errorMessage);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadPostDetails();

    // Cleanup function
    return () => {
      // No cleanup needed since we're managing banner state internally
    };
  }, [postId, accessToken]);

  const updateField =
    (field: keyof RecruitmentFormData) =>
    (
      event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => {
      const value = event.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      // Validate field and set error if any
      const error = validateField(field, value);
      if (error) {
        setFieldErrors((prev) => ({
          ...prev,
          [field]: error,
        }));
      } else {
        // Clear error if field is now valid
        setFieldErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }

      setError(null);
    };

  const validateTitle = (value: string): string | null => {
    if (!value.trim()) return "Vị trí tuyển dụng bắt buộc";
    if (value.trim().length < 2)
      return "Vị trí tuyển dụng phải ít nhất 2 ký tự";
    return null;
  };

  const validateSalary = (value: string): string | null => {
    if (!value.trim()) return "Mức lương bắt buộc";
    const numValue = parseFloat(value);
    if (isNaN(numValue) || !Number.isInteger(numValue)) {
      return "Mức lương phải là số nguyên dương";
    }
    if (numValue <= 0) return "Mức lương phải lớn hơn 0";
    return null;
  };

  const validateExperienceYears = (value: string): string | null => {
    if (!value.trim()) {
      return "Số năm kinh nghiệm bắt buộc";
    }
    const numValue = parseFloat(value);
    if (isNaN(numValue) || !Number.isInteger(numValue)) {
      return "Số năm kinh nghiệm phải là số nguyên";
    }
    if (numValue < 0) {
      return "Số năm kinh nghiệm không được nhỏ hơn 0";
    }
    if (numValue > 100) {
      return "Số năm kinh nghiệm không hợp lệ";
    }
    return null;
  };

  const validateQuantity = (value: string): string | null => {
    if (!value.trim()) {
      return "Số lượng tuyển bắt buộc";
    }
    const numValue = parseFloat(value);
    if (isNaN(numValue) || !Number.isInteger(numValue)) {
      return "Số lượng tuyển phải là số nguyên";
    }
    if (numValue < 0) {
      return "Số lượng tuyển không được nhỏ hơn 0";
    }
    if (numValue === 0) {
      return "Số lượng tuyển phải lớn hơn 0";
    }
    return null;
  };

  const validateField = (
    field: keyof RecruitmentFormData,
    value: string,
  ): string | null => {
    switch (field) {
      case "title":
        return validateTitle(value);
      case "salary":
        return validateSalary(value);
      case "experienceYears":
        return validateExperienceYears(value);
      case "quantity":
        return validateQuantity(value);
      default:
        return null;
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (bannerPreview && !bannerPreview.startsWith("http")) {
      URL.revokeObjectURL(bannerPreview);
    }

    setBannerFileName(file.name);
    setBannerFile(file);
    
    // Detect media type from file
    const isVideo = file.type.startsWith("video/");
    setBannerMediaType(isVideo ? "video" : "image");
    setBannerPreview(URL.createObjectURL(file));
    setIsExistingMedia(false); // Mark as new file
    setError(null);
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof RecruitmentFormData, string>> = {};

    // Validate all required fields
    const titleError = validateTitle(formData.title);
    if (titleError) errors.title = titleError;

    const salaryError = validateSalary(formData.salary);
    if (salaryError) errors.salary = salaryError;

    const experienceError = validateExperienceYears(formData.experienceYears);
    if (experienceError) errors.experienceYears = experienceError;

    const quantityError = validateQuantity(formData.quantity);
    if (quantityError) errors.quantity = quantityError;

    if (!formData.location.trim()) {
      errors.location = "Vui lòng nhập địa điểm làm việc";
    }

    if (!formData.description.trim()) {
      errors.description = "Vui lòng nhập mô tả công việc";
    }

    if (!formData.mandatoryRequirements.trim()) {
      errors.mandatoryRequirements = "Vui lòng nhập các yêu cầu bắt buộc";
    }

    // If there are any field errors, set them and show error message
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      const firstError = Object.values(errors)[0];
      setError(firstError || "Vui lòng kiểm tra lại các trường nhập liệu");
      return false;
    }

    setFieldErrors({});
    return true;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm() || !postId) {
      return;
    }

    await submitPost();
  };

  const submitPost = async () => {
    try {
      setIsSaving(true);
      setError(null);
      setSuccess(null);

      console.log("📝 Submitting updated recruitment post:", formData);

      // Prepare post data for API
      const postData = {
        position: formData.title,
        address: formData.location,
        salary: formData.salary,
        employmentType:
          formData.employmentType === "fulltime" ? "Full-time" : "Part-time",
        experienceYear: formData.experienceYears
          ? parseInt(formData.experienceYears)
          : undefined,
        quantity: formData.quantity ? parseInt(formData.quantity) : undefined,
        jobDescription: formData.description,
        requirementsMandatory: formData.mandatoryRequirements,
        requirementsPreferred: formData.preferredRequirements,
        benefits: formData.benefits,
      };

      // Only prepare files array if a new file was selected
      // If no new file is selected, don't pass files at all - backend will keep existing media
      const filesToUpload = bannerFile ? [bannerFile] : undefined;

      console.log("📋 Final submission - new file?", bannerFile ? "Yes" : "No (keeping existing)");

      // Call API using /full endpoint
      const response = await updateCompanyPostFull(
        parseInt(postId!),
        postData,
        filesToUpload,
        accessToken || undefined
      );

      console.log("✅ Recruitment post updated:", response);

      setSuccess(`Bài đăng tuyển dụng "${formData.title}" đã được cập nhật thành công!`);

      // Redirect after 1.5 seconds
      setTimeout(() => {
        navigate("/recruitment-management");
      }, 1500);
    } catch (err) {
      const errorMessage = formatErrorForDisplay(err);
      console.error("❌ Error updating post:", err);
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
        <CustomLoading />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-3 py-4 sm:px-6">
      <form
        onSubmit={handleSubmit}
        className="mx-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
      >
        <div className="mb-5 flex items-center gap-3">
          <button
            type="button"
            className="rounded-full p-2 text-slate-700 hover:bg-slate-100"
            onClick={() => navigate(-1)}
            aria-label="Quay lại"
            disabled={isSaving}
          >
            <ArrowLeft size={22} />
          </button>
          <h1 className="text-xl font-bold text-slate-900">Chỉnh sửa thông tin tuyển dụng</h1>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-700">Lỗi cập nhật</p>
                <p className="mt-1 text-sm text-red-600">{error}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  submitPost();
                }}
                disabled={isSaving}
                className="ml-2 shrink-0 rounded px-3 py-1 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Thử lại
              </button>
            </div>
          </div>
        )}

        {/* Success message */}
        {success && (
          <div className="mb-4 rounded-lg border border-green-300 bg-green-50 p-3 text-sm text-green-700">
            {success}
          </div>
        )}

        {/* Loading overlay */}
        {isSaving && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
            <CustomLoading />
          </div>
        )}

        <div className="space-y-5">
          <button
            type="button"
            onClick={handleUploadClick}
            disabled={isSaving}
            className="flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-blue-300 bg-blue-50/40 px-4 py-6 text-center hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {bannerPreview ? (
              bannerMediaType === "video" ? (
                <video
                  src={bannerPreview}
                  className="mb-2 h-32 w-full rounded-lg object-cover"
                  controls
                />
              ) : (
                <img
                  src={bannerPreview}
                  alt="Banner preview"
                  className="mb-2 h-32 w-full rounded-lg object-cover"
                />
              )
            ) : (
              <Upload size={24} className="mb-2 text-blue-500" />
            )}
            
            {/* Status badge */}
            {bannerPreview && (
              <div className="mb-2">
                {isExistingMedia ? (
                  <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                    ✓ Media hiện tại (không thay đổi)
                  </span>
                ) : (
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                    ✓ Media mới (sẽ cập nhật)
                  </span>
                )}
              </div>
            )}
            
            <p className="text-base font-semibold text-slate-700">
              {bannerPreview ? "Chạm để thay đổi ảnh/video" : "Chạm để tải lên"}
            </p>
            <p className="text-xs text-slate-500">Video hoặc ảnh 16/4</p>
            {bannerFileName && (
              <p className="mt-2 truncate text-xs font-medium text-blue-600">
                {bannerFileName}
              </p>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            hidden
            onChange={handleFileChange}
            disabled={isSaving}
          />

          {/* Job Position */}
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              <Briefcase size={16} className="mb-1 inline-block mr-2" />
              Vị trí tuyển dụng
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={updateField("title")}
              placeholder="VD: Frontend Developer"
              className={`w-full rounded-lg border bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none ${
                fieldErrors.title ? "border-red-500" : "border-slate-300"
              }`}
              disabled={isSaving}
            />
            {fieldErrors.title && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.title}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              <MapPin size={16} className="mb-1 inline-block mr-2" />
              Địa điểm
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={updateField("location")}
              placeholder="VD: TP. Hồ Chí Minh"
              className={`w-full rounded-lg border bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none ${
                fieldErrors.location ? "border-red-500" : "border-slate-300"
              }`}
              disabled={isSaving}
            />
            {fieldErrors.location && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.location}</p>
            )}
          </div>

          {/* Salary */}
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              <CircleDollarSign size={16} className="mb-1 inline-block mr-2" />
              Mức lương
            </label>
            <input
              inputMode="numeric"
              value={formData.salary}
              onChange={updateField("salary")}
              placeholder="VD: 10000000"
              pattern="\d*"
              className={`w-full rounded-lg border bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none ${
                fieldErrors.salary ? "border-red-500" : "border-slate-300"
              }`}
              disabled={isSaving}
            />
            {fieldErrors.salary && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.salary}</p>
            )}
          </div>

          {/* Experience & Quantity */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Kinh nghiệm (năm)
              </label>
              <input
                inputMode="numeric"
                value={formData.experienceYears}
                onChange={updateField("experienceYears")}
                placeholder="VD: 2"
                pattern="\d*"
                className={`w-full rounded-lg border bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none ${
                  fieldErrors.experienceYears ? "border-red-500" : "border-slate-300"
                }`}
                disabled={isSaving}
              />
              {fieldErrors.experienceYears && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.experienceYears}</p>
              )}
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                <Users size={16} className="mb-1 inline-block mr-2" />
                Số lượng tuyển
              </label>
              <input
                inputMode="numeric"
                value={formData.quantity}
                onChange={updateField("quantity")}
                placeholder="VD: 5"
                pattern="\d*"
                className={`w-full rounded-lg border bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none ${
                  fieldErrors.quantity ? "border-red-500" : "border-slate-300"
                }`}
                disabled={isSaving}
              />
              {fieldErrors.quantity && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.quantity}</p>
              )}
            </div>
          </div>

          {/* Employment Type */}
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Loại công việc
            </label>
            <select
              value={formData.employmentType}
              onChange={updateField("employmentType")}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none appearance-none"
              disabled={isSaving}
            >
              <option value="fulltime">Full-time</option>
              <option value="parttime">Part-time</option>
            </select>
          </div>

          {/* Job Description */}
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Mô tả công việc
            </label>
            <textarea
              value={formData.description}
              onChange={updateField("description")}
              placeholder="Nhập mô tả chi tiết về công việc..."
              className={`w-full rounded-lg border bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none ${
                fieldErrors.description ? "border-red-500" : "border-slate-300"
              }`}
              rows={4}
              disabled={isSaving}
            />
            {fieldErrors.description && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.description}</p>
            )}
          </div>

          {/* Mandatory Requirements */}
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Yêu cầu bắt buộc
            </label>
            <textarea
              value={formData.mandatoryRequirements}
              onChange={updateField("mandatoryRequirements")}
              placeholder="Nhập các yêu cầu bắt buộc..."
              className={`w-full rounded-lg border bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none ${
                fieldErrors.mandatoryRequirements ? "border-red-500" : "border-slate-300"
              }`}
              rows={3}
              disabled={isSaving}
            />
            {fieldErrors.mandatoryRequirements && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.mandatoryRequirements}</p>
            )}
          </div>

          {/* Preferred Requirements */}
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Yêu cầu mong muốn (tùy chọn)
            </label>
            <textarea
              value={formData.preferredRequirements}
              onChange={updateField("preferredRequirements")}
              placeholder="Nhập các yêu cầu mong muốn..."
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
              rows={3}
              disabled={isSaving}
            />
          </div>

          {/* Benefits */}
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Quyền lợi (tùy chọn)
            </label>
            <textarea
              value={formData.benefits}
              onChange={updateField("benefits")}
              placeholder="Nhập các quyền lợi..."
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
              rows={3}
              disabled={isSaving}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSaving}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-500 px-6 py-3 font-bold text-white transition-colors hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
            {isSaving ? "Đang cập nhật..." : "Cập nhật bài đăng"}
          </button>
        </div>
      </form>
    </div>
  );
}
