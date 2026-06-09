import {
  ArrowLeft,
  Briefcase,
  ChevronDown,
  CircleDollarSign,
  MapPin,
  Send,
  Upload,
  Users,
} from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/hook";
import { createCompanyPost } from "@/services/company.api";
import CustomLoading from "@/components/Loading/Loading";
import { useTokenExpirationCheck } from "@/hook/useTokenExpirationCheck";

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

export default function CreateRecruitmentPost() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { accessToken } = useAppSelector((state) => state.auth);

  // Auto-refresh token if expired/expiring
  useTokenExpirationCheck();

  const [formData, setFormData] =
    useState<RecruitmentFormData>(initialFormData);
  const [bannerFileName, setBannerFileName] = useState<string>("");
  const [bannerPreview, setBannerPreview] = useState<string>("");
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof RecruitmentFormData, string>>
  >({});

  useEffect(() => {
    return () => {
      if (bannerPreview) {
        URL.revokeObjectURL(bannerPreview);
      }
    };
  }, [bannerPreview]);

  const updateField =
    (field: keyof RecruitmentFormData) =>
    (
      event: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
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

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (bannerPreview) {
      URL.revokeObjectURL(bannerPreview);
    }

    setBannerFileName(file.name);
    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
    setError(null);
  };

  const validateTitle = (value: string): string | null => {
    if (!value.trim()) return "Vị trí tuyển dụng bắt buộc";
    if (value.trim().length < 2)
      return "Vị trí tuyển dụng phải ít nhất 2 ký tự";
    // Remove the ASCII-only regex — Vietnamese titles are valid
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

    if (!bannerFile) {
      setError("Vui lòng tải lên ảnh hoặc video cho bài đăng");
      return false;
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

    if (!validateForm()) {
      return;
    }

    // Check if token exists
    if (!accessToken) {
      console.error("❌ No access token found. User may not be authenticated.");
      setError("Vui lòng đăng nhập lại để tiếp tục.");
      return;
    }

    console.log("🔐 Access token available:", !!accessToken);
    console.log("🔐 Token length:", accessToken.length);

    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      console.log("📝 Submitting recruitment post form:", formData);

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

      // Prepare files array
      const filesToUpload = bannerFile ? [bannerFile] : [];

      // Call API
      const response = await createCompanyPost(
        postData,
        filesToUpload,
        accessToken || undefined,
      );

      console.log("✅ Recruitment post created:", response);

      setSuccess(
        `Bài đăng tuyển dụng "${formData.title}" đã được tạo thành công!`,
      );

      // Redirect after 1.5 seconds
      setTimeout(() => {
        navigate("/recruitment-management");
      }, 1500);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Có lỗi khi tạo bài đăng";
      console.error("❌ Error creating post:", errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-3 py-4 sm:px-6">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="mx-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
      >
        <div className="mb-5 flex items-center gap-3">
          <button
            type="button"
            className="rounded-full p-2 text-slate-700 hover:bg-slate-100"
            onClick={() => navigate(-1)}
            aria-label="Quay lại"
            disabled={isLoading}
          >
            <ArrowLeft size={22} />
          </button>
          <h1 className="text-xl font-bold text-slate-900">
            Tạo thông tin tuyển dụng
          </h1>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Success message */}
        {success && (
          <div className="mb-4 rounded-lg border border-green-300 bg-green-50 p-3 text-sm text-green-700">
            {success}
          </div>
        )}

        {/* Loading overlay */}
        {isLoading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
            <CustomLoading />
          </div>
        )}

        <div className="space-y-5">
          <button
            type="button"
            onClick={handleUploadClick}
            disabled={isLoading}
            className="flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-blue-300 bg-blue-50/40 px-4 py-6 text-center hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {bannerPreview ? (
              <img
                src={bannerPreview}
                alt="Banner preview"
                className="mb-2 h-32 w-full rounded-lg object-cover"
              />
            ) : (
              <Upload size={24} className="mb-2 text-blue-500" />
            )}
            <p className="text-base font-semibold text-slate-700">
              Chạm để tải lên
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
            disabled={isLoading}
          />

          <div className="rounded-xl border border-slate-200 p-3 sm:p-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <FieldWrapper icon={<Briefcase size={16} />}>
                  <input
                    value={formData.title}
                    onChange={updateField("title")}
                    disabled={isLoading}
                    placeholder="Vị trí tuyển dụng (VD: Senior UX/UI)"
                    className={`h-10 w-full rounded-lg border bg-slate-50 px-3 text-sm outline-none focus:border-blue-400 disabled:opacity-50 ${
                      fieldErrors.title ? "border-red-500" : "border-slate-200"
                    }`}
                  />
                </FieldWrapper>
                {fieldErrors.title && (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.title}
                  </p>
                )}
              </div>

              <div>
                <FieldWrapper icon={<MapPin size={16} />}>
                  <input
                    value={formData.location}
                    onChange={updateField("location")}
                    disabled={isLoading}
                    placeholder="Địa điểm làm việc"
                    className={`h-10 w-full rounded-lg border bg-slate-50 px-3 text-sm outline-none focus:border-blue-400 disabled:opacity-50 ${
                      fieldErrors.location
                        ? "border-red-500"
                        : "border-slate-200"
                    }`}
                  />
                </FieldWrapper>
                {fieldErrors.location && (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.location}
                  </p>
                )}
              </div>

              <div>
                <FieldWrapper icon={<CircleDollarSign size={16} />}>
                  <input
                    value={formData.salary}
                    inputMode="numeric"
                    onChange={updateField("salary")}
                    disabled={isLoading}
                    placeholder="Mức lương (VD: 20000000)"
                    pattern="\d*"
                    className={`h-10 w-full rounded-lg border bg-slate-50 px-3 text-sm outline-none focus:border-blue-400 disabled:opacity-50 ${
                      fieldErrors.salary ? "border-red-500" : "border-slate-200"
                    }`}
                  />
                </FieldWrapper>
                {fieldErrors.salary && (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.salary}
                  </p>
                )}
              </div>

              <div>
                <div className="relative">
                  <select
                    value={formData.employmentType}
                    onChange={updateField("employmentType")}
                    disabled={isLoading}
                    className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 px-3 pr-9 text-sm text-slate-700 outline-none focus:border-blue-400 disabled:opacity-50"
                  >
                    <option value="fulltime">Fulltime</option>
                    <option value="parttime">Parttime</option>
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
              </div>

              <div>
                <FieldWrapper icon={<Users size={16} />}>
                  <input
                    inputMode="numeric"
                    value={formData.experienceYears}
                    onChange={updateField("experienceYears")}
                    disabled={isLoading}
                    placeholder="Số năm KN (VD: 5)"
                    pattern="\d*"
                    className={`h-10 w-full rounded-lg border bg-slate-50 px-3 text-sm outline-none focus:border-blue-400 disabled:opacity-50 ${
                      fieldErrors.experienceYears
                        ? "border-red-500"
                        : "border-slate-200"
                    }`}
                  />
                </FieldWrapper>
                {fieldErrors.experienceYears && (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.experienceYears}
                  </p>
                )}
              </div>

              <div>
                <FieldWrapper icon={<Users size={16} />}>
                  <input
                    inputMode="numeric"
                    value={formData.quantity}
                    onChange={updateField("quantity")}
                    disabled={isLoading}
                    placeholder="Số lượng tuyển (VD: 5)"
                    pattern="\d*"
                    className={`h-10 w-full rounded-lg border bg-slate-50 px-3 text-sm outline-none focus:border-blue-400 disabled:opacity-50 ${
                      fieldErrors.quantity
                        ? "border-red-500"
                        : "border-slate-200"
                    }`}
                  />
                </FieldWrapper>
                {fieldErrors.quantity && (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.quantity}
                  </p>
                )}
              </div>
            </div>
          </div>

          <SectionTitle title="Mô tả công việc" />
          <textarea
            value={formData.description}
            onChange={updateField("description")}
            disabled={isLoading}
            placeholder="Mô tả chi tiết công việc, trách nhiệm chính..."
            className={`min-h-28 w-full rounded-xl border bg-slate-50 p-3 text-sm outline-none focus:border-blue-400 disabled:opacity-50 ${
              fieldErrors.description ? "border-red-500" : "border-slate-200"
            }`}
          />
          {fieldErrors.description && (
            <p className="mt-1 text-xs text-red-600">
              {fieldErrors.description}
            </p>
          )}

          <SectionTitle title="Yêu cầu chuyên môn" />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <div className="rounded-xl border border-red-100 bg-red-50/60 p-3">
                <p className="mb-2 inline-block rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-600">
                  Bắt buộc
                </p>
                <textarea
                  value={formData.mandatoryRequirements}
                  onChange={updateField("mandatoryRequirements")}
                  disabled={isLoading}
                  placeholder="Các kỹ năng bắt buộc"
                  className={`min-h-28 w-full resize-none rounded-lg border bg-white p-3 text-sm outline-none focus:border-red-300 disabled:opacity-50 ${
                    fieldErrors.mandatoryRequirements
                      ? "border-red-500"
                      : "border-red-100"
                  }`}
                />
              </div>
              {fieldErrors.mandatoryRequirements && (
                <p className="mt-1 text-xs text-red-600">
                  {fieldErrors.mandatoryRequirements}
                </p>
              )}
            </div>

            <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-3">
              <p className="mb-2 inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-600">
                Ưu tiên
              </p>
              <textarea
                value={formData.preferredRequirements}
                onChange={updateField("preferredRequirements")}
                disabled={isLoading}
                placeholder="Các kỹ năng bổ trợ"
                className="min-h-28 w-full resize-none rounded-lg border border-blue-100 bg-white p-3 text-sm outline-none focus:border-blue-300 disabled:opacity-50"
              />
            </div>
          </div>

          <SectionTitle title="Quyền lợi & đãi ngộ" />
          <textarea
            value={formData.benefits}
            onChange={updateField("benefits")}
            disabled={isLoading}
            placeholder="Chế độ lương thưởng, phúc lợi..."
            className="min-h-24 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-blue-400 disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              "Đang tạo..."
            ) : (
              <>
                Đăng tuyển dụng <Send size={16} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <h2 className="border-l-4 border-blue-400 pl-2 text-base font-semibold text-slate-900">
      {title}
    </h2>
  );
}

function FieldWrapper({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
        {icon}
      </span>
      <div className="pl-7">{children}</div>
    </div>
  );
}
