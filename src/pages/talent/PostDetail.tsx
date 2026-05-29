import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCompanyPostDetail, saveCompanyPost } from '@/services/company.api';
import { CompanyPostDetail } from '@/types/companyPost';
import { Button } from '@/components/ui/button';
import { useAppSelector, useAppDispatch } from '@/store/hook';
import { addSavedPost, removeSavedPost } from '@/store/features/savedPosts/savedPostsSlice';
import { notify } from '@/lib/toast';
import { ApplicationModal } from './ApplicationModal';
import { ReportPostModal } from './ReportpostModal';
import ArrowBackIcon from './../../assets/myWeb/arrowback.png';
import BookmarkIcon from './../../assets/myWeb/bookmark.png';
import ShareIcon from './../../assets/myWeb/share1.png';
import Dot from './../../assets/myWeb/dots 1.png';
import LightIcon from './../../assets/myWeb/light.png';

export const PostDetail = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [post, setPost] = useState<CompanyPostDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const savedPostIds = useAppSelector((state) => state.savedPosts.savedPostIds);
  const isSaved = postId ? savedPostIds.includes(Number(postId)) : false;

  useEffect(() => {
    console.log("🔍 PostDetail - postId from URL params:", postId, "Type:", typeof postId);
  }, [postId]);

  useEffect(() => {
    const loadPostDetail = async () => {
      if (!postId) {
        setError("Post ID not found");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        console.log("📥 Fetching post detail for postId:", postId);
        
        const data = await fetchCompanyPostDetail(Number(postId));
        console.log("✅ Post detail loaded:", data);
        
        setPost(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load post details";
        console.error("❌ Error loading post detail:", errorMessage);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadPostDetail();
  }, [postId]);

  const handleSavePost = async () => {
    if (!postId || isSaving) return;

    try {
      setIsSaving(true);
      console.log("💾 Toggling post:", postId);
      
      await saveCompanyPost(Number(postId), accessToken || undefined);
      
      if (isSaved) {
        dispatch(removeSavedPost(Number(postId)));
        notify.success("Đã xóa bài viết khỏi danh sách lưu");
        console.log("✅ Post removed from saved");
      } else {
        dispatch(addSavedPost(Number(postId)));
        notify.success("Đã lưu bài viết");
        console.log("✅ Post saved successfully");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save post";
      console.error("❌ Error saving post:", errorMessage);
      notify.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleApplicationSuccess = (applicationId: number) => {
    console.log("✅ Application submitted successfully:", applicationId);
    setApplicationSuccess(true);
    
    setTimeout(() => {
      setApplicationSuccess(false);
    }, 3000);
  };

  const handleOpenApplicationModal = () => {
    if (!accessToken) {
      navigate('/login');
      return;
    }
    setIsApplicationModalOpen(true);
  };

  const handleOpenReportModal = () => {
    if (!accessToken) {
      navigate('/login');
      return;
    }
    setIsReportModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin công việc...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Bài đăng không tìm thấy</h1>
          <p className="text-gray-600 mb-6">{error || "Không thể tải thông tin công việc"}</p>
          <Button onClick={() => navigate(-1)}>Quay lại</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 py-4 sticky flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <img src={ArrowBackIcon} alt="Back" className="w-6 h-6" />
          <span>Quay lại</span>
        </button>
        <div className="flex items-center gap-6">
          <button
            onClick={handleSavePost}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-lg bg-white hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all group"
            title={isSaved ? "Xóa bài viết khỏi danh sách lưu" : "Lưu bài viết"}
          >
            <img src={BookmarkIcon} alt="Bookmark" className="w-5 h-5 transition-all duration-300" style={{ filter: isSaved ? 'brightness(0) saturate(100%) invert(82%) sepia(76%) saturate(417%) hue-rotate(4deg)' : 'brightness(0) saturate(100%) invert(100%)' }} />
            <span>{isSaved ? 'Đã lưu' : 'Lưu tin'}</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-lg bg-white hover:border-gray-400">
            <img src={ShareIcon} alt="Share" className="w-5 h-5" style={{ filter: 'brightness(0)' }} />
            <span>Chia sẻ</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="col-span-2 space-y-6">
            {/* Main Job Post Section */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              {/* Header Background */}
              <div 
                className="h-48 relative bg-cover bg-center"
                style={{
                  backgroundImage: post.coverImageUrl 
                    ? `url(${post.coverImageUrl})` 
                    : post.media?.[0]?.url 
                    ? `url(${post.media[0].url})`
                    : undefined,
                  backgroundColor: !post.coverImageUrl && !post.media?.[0]?.url ? '#86efac' : undefined
                }}
              >
                {(post.coverImageUrl || post.media?.[0]?.url) && (
                  <div className="absolute inset-0 bg-black/5"></div>
                )}
              </div>

              {/* Content Section */}
              <div className="relative px-6 pb-6">
                {/* Avatar */}
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
                  <div className="w-20 h-20 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                    {post.companyAvatar ? (
                      <img 
                        src={post.companyAvatar} 
                        alt={post.companyName}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-linear-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold text-lg">
                        {post.companyName.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Company Name & Position */}
                <div className="pt-16 pb-6 text-center border-b border-gray-200">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#3B82F6' }}></div>
                    <span className="text-xl font-bold" style={{ color: '#3B82F6' }}>{post.companyName}</span>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900">{post.position}</h1>
                </div>

                {/* Job Description */}
                <div className="pt-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Mô tả công việc</h2>
                  <p className="text-gray-700 leading-relaxed mb-8">
                    {post.jobDescription || "Không có mô tả công việc"}
                  </p>
                </div>

                {/* Requirements */}
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Yêu cầu chuyên môn</h2>

                  {post.requirementsMandatory && (
                    <div className="mb-6">
                      <div className="inline-block bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-semibold mb-3">
                        Bắt buộc
                      </div>
                      <ul className="space-y-2 text-gray-700">
                        {post.requirementsMandatory.split('.').filter((req) => req.trim()).map((req, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-black font-bold mt-1">•</span>
                            <span>{req.trim()}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {post.requirementsPreferred && (
                    <div className="mb-8">
                      <div className="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold mb-3">
                        Ưu tiên
                      </div>
                      <ul className="space-y-2 text-gray-700">
                        {post.requirementsPreferred.split('.').filter((req) => req.trim()).map((req, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-black font-bold mt-1">•</span>
                            <span>{req.trim()}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {!post.requirementsMandatory && !post.requirementsPreferred && (
                    <p className="text-gray-600">Không có yêu cầu chuyên môn</p>
                  )}
                </div>

                {/* Benefits */}
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Quyền lợi & đãi ngộ</h2>
                  {post.benefits ? (
                    <ul className="space-y-2 text-gray-700">
                      {post.benefits.split('.').filter((benefit) => benefit.trim()).map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-black font-bold mt-1">•</span>
                          <span>{benefit.trim()}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-600">Không có quyền lợi được liệt kê</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="col-span-1">
            {/* Info Card */}
            <div className="bg-white rounded-lg p-6 shadow-sm top-24">
              <div className="space-y-4">
                {/* Salary */}
                <div>
                  <h3 className="text-sm text-gray-600 font-semibold mb-2">Mức lương đề xuất</h3>
                  <p className="text-lg font-bold" style={{ color: '#3B82F6' }}>{post.salary} VND</p>
                </div>

                {/* Location */}
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm text-gray-600 font-semibold">Địa điểm làm việc</h3>
                    <p className="text-gray-900 text-right text-sm">{post.address}</p>
                  </div>
                </div>

                {/* Employment Type */}
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm text-gray-600 font-semibold">Hình thức</h3>
                    <p className="text-gray-900">{post.employmentType}</p>
                  </div>
                </div>

                {/* Experience */}
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm text-gray-600 font-semibold">Yêu cầu kinh nghiệm</h3>
                    <p className="text-gray-900">
                      {post.experienceYear != null ? `+${post.experienceYear} năm` : "Không yêu cầu"}
                    </p>
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm text-gray-600 font-semibold">Số lượng</h3>
                    <p className="text-gray-900">
                      {post.quantity != null ? `${post.quantity} ứng viên` : "Không xác định"}
                    </p>
                  </div>
                </div>

                {/* Apply Button & More Options */}
                <div className="flex gap-2 pt-2 items-stretch flex-col">
                  {applicationSuccess && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-700 font-semibold">✓ Nộp hồ sơ thành công!</p>
                    </div>
                  )}
                  <div className="flex gap-2 items-stretch">
                    <Button 
                      onClick={handleOpenApplicationModal}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                    >
                      Ứng tuyển ngay
                    </Button>
                    <button className="px-3 py-0 text-gray-600 hover:bg-gray-100 rounded-lg font-semibold flex items-center justify-center">
                      <img src={Dot} alt="More options" className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips Section */}
            <div className="mt-6 p-6 rounded-lg" style={{ backgroundColor: '#EFF6FF' }}>
              <div className="flex gap-3 items-start">
                <img src={LightIcon} alt="Light" className="w-6 h-6 mt-1 shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2" style={{ color: '#3B82F6' }}>Mẹo cho bạn</h3>
                  <p className="text-sm text-gray-700">Hoàn thiện hồ sơ với sự chi tiết cao sẽ giúp tăng 40% cơ hội được nhà tuyển dụng chú ý!</p>
                </div>
              </div>
            </div>

            {/* Report Button */}
            <div className="mt-3 flex justify-center">
              <button
                onClick={handleOpenReportModal}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors py-1 px-2 rounded hover:bg-red-50"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6H13.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
                Báo cáo bài đăng
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {postId && post && (
        <ApplicationModal
          postId={Number(postId)}
          isOpen={isApplicationModalOpen}
          onClose={() => setIsApplicationModalOpen(false)}
          onSubmitSuccess={handleApplicationSuccess}
          postTitle={post.position}
          companyName={post.companyName}
        />
      )}

      {/* Report Modal */}
      {postId && (
        <ReportPostModal
          postId={Number(postId)}
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
        />
      )}
    </div>
  );
};

export default PostDetail;