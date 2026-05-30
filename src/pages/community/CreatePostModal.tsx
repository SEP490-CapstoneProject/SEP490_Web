import React, { useState, useRef, useEffect } from "react";
import { X, Image as ImageIcon, Plus, Crown, Zap } from "lucide-react";
import { useUserProfile } from "@/hook/useUserProfile";
import { useAppSelector } from "@/store/hook";
import { notify } from "@/lib/toast";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreatePostModal = ({
  isOpen,
  onClose,
  onSuccess,
}: CreatePostModalProps) => {
  const [content, setContent] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { profile } = useUserProfile();
  const { accessToken, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      // Reset state khi đóng modal
      setContent("");
      setSelectedFiles([]);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...filesArray]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // --- Logic tích hợp API ---
  const handleCreatePost = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();

      // 1. Chuẩn bị postJson
      const postData = {
        description: content,
        status: 1, // Mặc định Public
        portfolioId: null,
        // Nếu có files, lấy file đầu tiên làm cover (ví dụ)
        coverImageKey: null,
      };

      formData.append("postJson", JSON.stringify(postData));

      // 2. Thêm các files vào FormData
      selectedFiles.forEach((file) => {
        formData.append("files", file);
      });

      // 3. Gọi API
      const response = await fetch(
        "https://community-service.redmushroom-1d023c6a.southeastasia.azurecontainerapps.io/api/community/posts",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData, // Trình duyệt tự set Content-Type: multipart/form-data kèm boundary
        },
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Tạo bài viết thành công:", result);
        notify.success("Tạo bài viết thành công!");
        onSuccess();
        onClose();
      } else {
        const error = await response.json();
        notify.error(`Lỗi: ${error.message || "Không thể tạo bài viết"}`);
      }
    } catch (err) {
      console.error("Lỗi kết nối:", err);
      notify.error("Đã xảy ra lỗi khi kết nối đến máy chủ");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden relative z-10 animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-center w-full text-gray-900">
            Tạo bài viết
          </h2>
          <button
            onClick={onClose}
            className="absolute right-4 p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto flex-1 custom-scrollbar">
          <div className="flex items-center gap-3 mb-4">
            {/* Khối Avatar bọc hiệu ứng Vương miện / Huy hiệu */}
            <div className="relative inline-block group">
              {/* 1. Vương miện / Huy hiệu đội nghiêng */}
              {profile?.planName && profile.planName !== "Free" && (
                <div
                  className={`absolute z-10 transition-all duration-300 -top-1.5 -right-2 rotate-[35deg] group-hover:rotate-[25deg] group-hover:scale-110`}
                >
                  {profile.planName === "Premium" ? (
                    <div className="bg-yellow-400 text-white p-0.5 rounded-md shadow-[0_4px_12px_rgba(234,179,8,0.5)] border-[1.5px] border-white">
                      <Crown size={14} fill="currentColor" strokeWidth={2.5} />
                    </div>
                  ) : (
                    <div className="bg-blue-600 text-white p-0.5 rounded-md shadow-[0_4px_12px_rgba(37,99,235,0.5)] border-[1.5px] border-white">
                      <Zap size={14} fill="currentColor" strokeWidth={2.5} />
                    </div>
                  )}
                </div>
              )}

              {/* 2. Ảnh Avatar gốc (Đã thay đổi w-11 h-11 thành w-12 h-12 như code mẫu của bạn để khớp vương miện) */}
              <img
                src={profile?.avatar || "/user_placeholder.png"}
                className={`w-12 h-12 rounded-full border-2 object-cover transition-all duration-300 ${
                  profile?.planName === "Premium"
                    ? "border-yellow-400"
                    : profile?.planName === "Pro"
                      ? "border-blue-500"
                      : "border-gray-100"
                }`}
                alt="Avatar"
              />

              {/* 3. Tick xanh cho doanh nghiệp */}
              {user?.role === 2 && (
                <div className="absolute -bottom-0.5 -right-0.5 transform z-20">
                  <img
                    src="/blue-tick-company.png"
                    alt="Verified"
                    className="w-4 h-4 bg-white rounded-full border border-white shadow-sm"
                  />
                </div>
              )}
            </div>

            {/* Khối hiển thị tên bên cạnh */}
            <div>
              <p className="font-bold text-gray-900 text-sm">
                {profile?.displayName || "Người dùng"}
              </p>
              {/* <span className="text-[10px] text-gray-500 font-medium">
      CÔNG KHAI
    </span> */}
            </div>
          </div>

          <textarea
            placeholder="Bạn đang nghĩ gì thế?"
            disabled={isLoading}
            className="w-full min-h-[120px] text-lg bg-transparent border-none focus:ring-0 resize-none text-gray-800 outline-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          {selectedFiles.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mt-4">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="relative group rounded-xl overflow-hidden border border-gray-100 h-40 cursor-pointer"
                >
                  {file.type.startsWith("video/") ? (
                    <video
                      className="w-full h-full object-cover"
                      src={URL.createObjectURL(file)}
                    />
                  ) : (
                    <img
                      className="w-full h-full object-cover"
                      src={URL.createObjectURL(file)}
                      alt="preview"
                    />
                  )}
                  <button
                    onClick={() => removeFile(index)}
                    className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70 transition-all"
                  >
                    <X size={14} />
                  </button>
                  {/* {index === 0 && (
                    <span className="absolute bottom-2 left-2 bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded">
                      Ảnh bìa
                    </span>
                  )} */}
                </div>
              ))}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 transition-all cursor-pointer"
              >
                <Plus size={24} />
                <span className="text-xs font-medium mt-1">Thêm</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 cursor-pointer">
          <div className="border border-gray-200 rounded-xl p-3 flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-gray-600 ml-1">
              Thêm vào bài viết
            </span>
            <div className="flex items-center gap-1">
              <input
                type="file"
                multiple
                hidden
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*,video/*"
              />
              <button
                disabled={isLoading}
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-green-500 hover:bg-green-50 rounded-full transition-colors cursor-pointer"
              >
                <ImageIcon size={24} />
              </button>
            </div>
          </div>

          <button
            onClick={handleCreatePost}
            disabled={
              isLoading || (!content.trim() && selectedFiles.length === 0)
            }
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                {/* Container cho Spinner và Text */}
                <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-4">
                  {/* Vòng tròn Loading Spinner */}
                  <div className="relative">
                    {/* Vòng tròn nhạt phía dưới */}
                    <div className="w-12 h-12 border-4 border-blue-100 rounded-full"></div>
                    {/* Vòng xoay chính */}
                    <div className="absolute top-0 left-0 w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </div>
              </div>
            ) : (
              "Đăng bài viết"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
