import { useState, useEffect, useCallback, useRef } from 'react';
import { createApplication } from '@/services/application.api';
import { fetchPortfoliosByEmployeeId } from '@/services/portfolio.api';
import { PortfolioMainBlockItem } from '@/services/portfolio.api';
import { useAppSelector } from '@/store/hook';
import { ArrowLeft } from 'lucide-react';

interface ApplicationModalProps {
  postId: number;
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess?: (applicationId: number) => void;
  postTitle?: string;
  companyName?: string;
}

export const ApplicationModal = ({
  postId,
  isOpen,
  onClose,
  onSubmitSuccess,
  postTitle,
  companyName,
}: ApplicationModalProps) => {
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<number | null>(null);
  const [portfolios, setPortfolios] = useState<PortfolioMainBlockItem[]>([]);
  const [isLoadingPortfolios, setIsLoadingPortfolios] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<'load' | 'submit' | null>(null);

  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const user = useAppSelector((state) => state.auth.user);

  // Store companyPostId (passed as postId prop) in ref to ensure it doesn't change during submission
  const postIdRef = useRef<number>(postId);

  // Update refs when props change
  useEffect(() => {
    postIdRef.current = postId;
    console.log("📋 ApplicationModal props updated:", { companyPostId: postId, isOpen });
  }, [postId, isOpen]);

  // Fetch portfolios when modal opens
  const loadPortfolios = useCallback(async () => {
    if (!accessToken || !user?.id) {
      setError("Không có quyền truy cập. Vui lòng đăng nhập lại.");
      return;
    }
    
    try {
      setIsLoadingPortfolios(true);
      setError(null);
      setErrorType(null);
      setPortfolios([]); // Reset portfolios before loading
      setSelectedPortfolioId(null);
      console.log("📥 Fetching user portfolios for employee:", user.employeeId || user.id);

      const data = await fetchPortfoliosByEmployeeId(user.employeeId || user.id, accessToken);
      console.log("✅ Portfolios loaded:", data);
      
      if (!data || data.length === 0) {
        setPortfolios([]);
        console.warn("⚠️ No portfolios returned from API");
        return;
      }

      setPortfolios(data);

      // Auto-select first portfolio if available
      if (data.length > 0) {
        setSelectedPortfolioId(data[0].portfolioId);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Không thể tải danh sách Portfolio";
      console.error("❌ Error loading portfolios:", errorMessage);
      setError(errorMessage);
      setErrorType('load');
      setPortfolios([]);
    } finally {
      setIsLoadingPortfolios(false);
    }
  }, [accessToken, user?.id]);

  useEffect(() => {
    if (isOpen && accessToken) {
      loadPortfolios();
    }
  }, [isOpen, accessToken, loadPortfolios]);

  const handleSubmit = async () => {
    if (!selectedPortfolioId || !accessToken) {
      setError("Please select a portfolio");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      setErrorType(null);
      
      // Use refs to get the current/stable values
      const safeCompanyPostId = postIdRef.current;
      
      console.log("💾 Submitting application...", { 
        companyPostId: safeCompanyPostId, 
        portfolioId: selectedPortfolioId 
      });
      
      if (!safeCompanyPostId || safeCompanyPostId <= 0) {
        throw new Error(`Invalid companyPostId: ${safeCompanyPostId}`);
      }

      const result = await createApplication(safeCompanyPostId, selectedPortfolioId, accessToken);
      console.log("✅ Application submitted successfully:", result);

      onSubmitSuccess?.(result.applicationId);
      onClose();
    } catch (err) {
      let errorMessage = err instanceof Error ? err.message : "Failed to submit application";
      console.error("❌ Error submitting application:", errorMessage);
      
      // Handle 409 error (already applied)
      if (errorMessage.includes("409") || errorMessage.toLowerCase().includes("already")) {
        errorMessage = "Bạn đã ứng tuyển vào công ty này rồi! Hãy tìm bài đăng khác nhé";
      }
      
      setError(errorMessage);
      setErrorType('submit');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-4 py-4 md:px-6 md:py-5">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Chọn Portfolio để Ứng Tuyển</h1>
          </div>
          {postTitle && companyName && (
            <div className="ml-11 text-gray-600">
              <p className="text-sm">
                Vị trí: <span className="font-semibold text-gray-900">{postTitle}</span>
              </p>
              <p className="text-sm">
                Công ty: <span className="font-semibold text-gray-900">{companyName}</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50 px-4 py-6 md:px-6 md:py-8">
        <div className="max-w-6xl mx-auto">
          {isLoadingPortfolios ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600 text-base">Đang tải danh sách Portfolio...</p>
            </div>
          ) : error ? (
            <div className="max-w-md mx-auto">
              {errorType === 'submit' ? (
                // Submission error - prettier display
                <div className="bg-white rounded-xl p-8 text-center shadow-lg border-2 border-amber-200">
                  <div className="text-6xl mb-4 animate-bounce">📋</div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">
                    {error.includes("đã ứng tuyển") ? "Đã ứng tuyển rồi!" : "Không thể nộp hồ sơ"}
                  </h2>
                  <p className="text-gray-600 text-base leading-relaxed mb-6">
                    {error}
                  </p>
                  {error.includes("đã ứng tuyển") ? (
                    <button
                      onClick={onClose}
                      className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
                    >
                      Tìm bài đăng khác
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setError(null);
                        setErrorType(null);
                      }}
                      className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
                    >
                      Thử lại
                    </button>
                  )}
                </div>
              ) : (
                // Loading error
                <div className="bg-white rounded-lg p-8 text-center shadow-sm">
                  <div className="text-red-500 text-5xl mb-4">⚠️</div>
                  <p className="text-red-700 font-semibold text-lg mb-2">Lỗi tải Portfolio</p>
                  <p className="text-gray-600 text-sm mb-6">{error}</p>
                  <button
                    onClick={loadPortfolios}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Thử tải lại
                  </button>
                </div>
              )}
            </div>
          ) : portfolios.length === 0 ? (
            <div className="max-w-md mx-auto bg-white rounded-lg p-8 text-center shadow-sm">
              <div className="text-gray-400 text-5xl mb-4">📋</div>
              <p className="text-gray-900 font-semibold text-lg mb-2">Bạn chưa có Portfolio nào</p>
              <p className="text-gray-600 text-sm mb-6">Hãy tạo portfolio để nộp hồ sơ ứng tuyển</p>
              <a
                href="/portfolio/create"
                className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                Tạo Portfolio ngay
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {portfolios.map((portfolio) => {
              const _blocks = Array.isArray(portfolio.blocks) ? portfolio.blocks : [portfolio.blocks];
              const introData = (_blocks[0]?.data) || {};
              const isSelected = selectedPortfolioId === portfolio.portfolioId;
                
                return (
                  <div
                    key={portfolio.portfolioId}
                    onClick={() => setSelectedPortfolioId(portfolio.portfolioId)}
                    className={`
                      rounded-lg border-2 cursor-pointer transition-all duration-200 p-6
                      ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50 shadow-md'
                          : 'border-gray-200 bg-white hover:border-blue-300 shadow-sm hover:shadow-md'
                      }
                    `}
                  >
                    <div className="flex items-start gap-4">
                      {/* Checkbox */}
                      <input
                        type="radio"
                        name="portfolio"
                        value={portfolio.portfolioId}
                        checked={isSelected}
                        onChange={() => setSelectedPortfolioId(portfolio.portfolioId)}
                        className="w-6 h-6 mt-1 cursor-pointer"
                      />
                      
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        {/* Avatar & Name */}
                        <div className="flex items-center gap-3 mb-4">
                          {introData.avatar ? (
                            <img
                              src={introData.avatar}
                              alt={introData.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-lg">
                              {introData.name?.[0] || 'P'}
                            </div>
                          )}
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {introData.name || 'Unknown'}
                            </h3>
                            <p className="text-sm text-blue-600 font-medium">
                              {introData.title || introData.studyField || 'Portfolio'}
                            </p>
                          </div>
                        </div>

                        {/* Portfolio Name */}
                        <div className="mb-3">
                          <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Tên hồ sơ</p>
                          <p className="font-semibold text-gray-900 text-base">
                            {portfolio.portfolio.name}
                          </p>
                        </div>

                        {/* Description */}
                        {introData.description && (
                          <div className="mb-3">
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {introData.description}
                            </p>
                          </div>
                        )}

                        {/* Meta Info */}
                        <div className="flex flex-wrap gap-3 pt-3 border-t border-gray-200">
                          {introData.email && (
                            <div className="text-xs">
                              <span className="text-gray-500">Email: </span>
                              <span className="text-gray-900 font-medium">{introData.email}</span>
                            </div>
                          )}
                          {introData.phone && (
                            <div className="text-xs">
                              <span className="text-gray-500">SĐT: </span>
                              <span className="text-gray-900 font-medium">{introData.phone}</span>
                            </div>
                          )}
                          {portfolio.createdAt && (
                            <div className="text-xs text-gray-500">
                              Tạo: {new Date(portfolio.createdAt).toLocaleDateString('vi-VN')}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 bg-white px-4 py-4 md:px-6 md:py-5">
        <div className="max-w-6xl mx-auto flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              isLoadingPortfolios ||
              !selectedPortfolioId ||
              portfolios.length === 0
            }
            className="px-8 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Đang nộp...</span>
              </>
            ) : (
              'Nộp Hồ Sơ'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationModal;
