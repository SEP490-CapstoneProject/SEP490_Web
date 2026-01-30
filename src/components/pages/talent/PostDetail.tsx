import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockCompanyPosts } from '@/data/mockCompanyPost';
import { Button } from '@/components/ui/button';
import ArrowBackIcon from './../../../assets/myWeb/arrowback.png';
import BookmarkIcon from './../../../assets/myWeb/bookmark.png';
import ShareIcon from './../../../assets/myWeb/share1.png';
import Dot from './../../../assets/myWeb/dots 1.png';
import LightIcon from './../../../assets/myWeb/light.png';
export const PostDetail = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);

  const post = mockCompanyPosts.find((p) => p.postId === Number(postId));

  if (!post) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Bài đăng không tìm thấy</h1>
          <Button onClick={() => navigate(-1)}>Quay lại</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
     
        <div className="max-w-7xl mx-auto px-4  py-4 sticky flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <img src={ArrowBackIcon} alt="Back" className="w-6 h-6" />
            <span>Quay lại</span>
          </button>
          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsSaved(!isSaved)}
              className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-lg bg-white hover:border-gray-400"
            >
              <img src={BookmarkIcon} alt="Bookmark" className="w-5 h-5" style={{ filter: 'invert(48%) sepia(75%) saturate(733%) hue-rotate(205deg)' }} />
              <span>Lưu tin</span>
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
              <div className="h-48 bg-gradient-to-br from-green-200 to-green-400 relative"></div>

              {/* Content Section with Overlapping Avatar */}
              <div className="relative px-6 pb-6">
                {/* Avatar positioned to overlap header and content */}
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
                  <div className="w-20 h-20 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold text-lg">
                      {post.companyName.charAt(0)}
                    </div>
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
                  <h2 className="text-lg font-bold text-gray-900 mb-4">
                    Mô tả công việc
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-8">{post.jobDescription}</p>
                </div>

                {/* Requirements */}
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-4">
                    Yêu cầu chuyên môn
                  </h2>

                  {/* Mandatory Requirements */}
                  <div className="mb-6">
                    <div className="inline-block bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-semibold mb-3">
                      Bắt buộc
                    </div>
                    <ul className="space-y-2 text-gray-700">
                      {post.requirementsMandatory.split(',').map((req, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                        <span className="text-black font-bold mt-1">•</span>
                          <span>{req.trim()}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Preferred Requirements */}
                  <div className="mb-8">
                    <div className="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold mb-3">
                      Ưu tiên
                    </div>
                    <ul className="space-y-2 text-gray-700">
                      {post.requirementsPreferred.split(',').map((req, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                        <span className="text-black font-bold mt-1">•</span>
                          <span>{req.trim()}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Benefits */}
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-4">
                    Quyền lợi & đãi ngộ
                  </h2>
                  <ul className="space-y-2 text-gray-700">
                    {post.benefits.split(',').map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-black font-bold mt-1">•</span>
                        <span>{benefit.trim()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Job Info & Apply */}
          <div className="col-span-1">
            {/* Info Card */}
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-24">
              <div className="space-y-4">
                {/* Salary */}
                <div>
                  <h3 className="text-sm text-gray-600 font-semibold mb-2">
                    Mức lương đề xuất
                  </h3>
                  <p className="text-lg font-bold" style={{ color: '#3B82F6' }}>{post.salary} VND</p>
                </div>

                {/* Location */}
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm text-gray-600 font-semibold">
                      Địa điểm làm việc
                    </h3>
                    <p className="text-gray-900 text-right text-sm">{post.address}</p>
                  </div>
                </div>

                {/* Employment Type */}
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm text-gray-600 font-semibold">
                      Hình thức
                    </h3>
                    <p className="text-gray-900">{post.employmentType}</p>
                  </div>
                </div>

                {/* Experience */}
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm text-gray-600 font-semibold">
                      Yêu cầu kinh nghiệm
                    </h3>
                    <p className="text-gray-900">+{post.experienceYear} năm</p>
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm text-gray-600 font-semibold">
                      Số lượng
                    </h3>
                    <p className="text-gray-900">{post.quantity} ứng viên</p>
                  </div>
                </div>

                {/* Apply Button & More Options */}
                <div className="flex gap-2 pt-2 items-stretch">
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold">
                    Ứng tuyển ngay
                  </Button>
                  <button className="px-3 py-0 text-gray-600 hover:bg-gray-100 rounded-lg font-semibold flex items-center justify-center">
                    <img src={Dot} alt="More options" className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>

            {/* Tips Section */}
            <div className="mt-6 p-6 rounded-lg" style={{ backgroundColor: '#EFF6FF' }}>
              <div className="flex gap-3 items-start">
                <img src={LightIcon} alt="Light" className="w-6 h-6 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2" style={{ color: '#3B82F6' }}>Mẹo cho bạn</h3>
                  <p className="text-sm text-gray-700">Hoàn thiện hồ sơ với sự chi tiết cao sẽ giúp tăng 40% cơ hội được nhà tuyển dụng chú ý!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
