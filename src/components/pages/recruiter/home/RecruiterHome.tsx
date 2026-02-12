import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, X, Phone, Mail, Plus, ChevronDown } from "lucide-react";
import { Button } from "../../../ui/button";
import { Badge } from "../../../ui/badge";
import SortIcon from "../../../../assets/myWeb/sort.png";
import ConnectIcon from "../../../../assets/myWeb/connect.png";
import BookmarkIcon from "../../../../assets/myWeb/bookmark.png";
import ShareIcon from "../../../../assets/myWeb/share1.png";
import { portfolioService, PortfolioResponse } from "@/services/portfolio.api";
import PortfolioRenderer from "@/components/portfolio/render/PortfolioRenderer";

// Mock data cho ứng viên
interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  title: string;
  description: string;
  skills: string[];
  education: {
    degree: string;
    school: string;
    major: string;
    gpa: string;
    years: string;
    achievements: string[];
  };
  isPremium: boolean;
}

const mockCandidates: Candidate[] = [
  {
    id: "1",
    name: "Phạm An Nhiên",
    email: "annhien@gmail.com",
    phone: "0123456789",
    avatar: "https://i.pravatar.cc/300?img=5",
    title: "Nhà thiết kế UI/UX & Lập trình viên Frontend",
    description: "Mặt nhìn thể sợ nhưng chuyên nghề lại khá ổn. Tôi xin nhận trung vào việc tạo ra những trải nghiệm người dùng trực quan, đẹp mắt và giải quyết các vấn đề phức tạp bằng các giải pháp thiết kế lấy con người làm trung tâm",
    skills: ["JavaScript", "React", "Figma", "Design", "Tạo mẫu", "Thiết kế UI", ".Net"],
    education: {
      degree: "Đại học Bách khoa (2016 - 2020)",
      school: "Cơ nhân khoa học máy tính",
      major: "Khoa học máy tính",
      gpa: "GPA: 3.6/4.0 (loại nghiệp loại giỏi)",
      years: "2016 - 2020",
      achievements: [
        "GPA: 3.6/4.0 (loại nghiệp loại giỏi)",
        "Thành viên tích cực của các lớp học về tin học sinh viên"
      ]
    },
    isPremium: true
  },
  {
    id: "2",
    name: "Nguyễn Văn A",
    email: "nguyenvana@gmail.com",
    phone: "0987654321",
    avatar: "https://i.pravatar.cc/300?img=12",
    title: "Backend Developer",
    description: "Chuyên phát triển hệ thống backend với kinh nghiệm 3 năm làm việc với Node.js, Python và các hệ quản trị cơ sở dữ liệu",
    skills: ["Node.js", "Python", "MongoDB", "PostgreSQL", "Docker", "AWS"],
    education: {
      degree: "Đại học Công nghệ (2015 - 2019)",
      school: "Đại học Quốc Gia Hà Nội",
      major: "Công nghệ thông tin",
      gpa: "GPA: 3.4/4.0",
      years: "2015 - 2019",
      achievements: [
        "GPA: 3.4/4.0",
        "Giải nhất cuộc thi lập trình sinh viên"
      ]
    },
    isPremium: false
  },
  {
    id: "3",
    name: "Trần Thị B",
    email: "tranthib@gmail.com",
    phone: "0912345678",
    avatar: "https://i.pravatar.cc/300?img=9",
    title: "Full Stack Developer",
    description: "Đam mê phát triển web với kinh nghiệm làm việc cả frontend và backend. Yêu thích học hỏi công nghệ mới",
    skills: ["React", "Vue", "Node.js", "Express", "MySQL", "TypeScript"],
    education: {
      degree: "Đại học Bách khoa (2017 - 2021)",
      school: "Đại học Bách khoa Hà Nội",
      major: "Khoa học máy tính",
      gpa: "GPA: 3.8/4.0",
      years: "2017 - 2021",
      achievements: [
        "GPA: 3.8/4.0 (xuất sắc)",
        "Học bổng toàn phần 4 năm"
      ]
    },
    isPremium: true
  }
];

export default function RecruiterHome() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filters, setFilters] = useState({
    position: '',
    skills: '',
    location: ''
  });
  const [filteredCandidates, setFilteredCandidates] = useState(mockCandidates);
  const [isLoading, setIsLoading] = useState(false);
  const [skillTags, setSkillTags] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [portfolio, setPortfolio] = useState<PortfolioResponse | null>(null);
  const [loadingPortfolio, setLoadingPortfolio] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const currentCandidate = filteredCandidates[currentIndex];

  const handleNext = () => {
    if (currentIndex < filteredCandidates.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsExpanded(false);
      setPortfolio(null);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsExpanded(false);
      setPortfolio(null);
    }
  };

  const handleApplyFilter = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      let results = mockCandidates;

      if (filters.position.trim()) {
        results = results.filter(candidate =>
          candidate.title.toLowerCase().includes(filters.position.toLowerCase())
        );
      }

      // Lọc theo skill tags
      if (skillTags.length > 0) {
        results = results.filter(candidate =>
          skillTags.some(tag =>
            candidate.skills.some(skill =>
              skill.toLowerCase().includes(tag.toLowerCase())
            )
          )
        );
      }

      setFilteredCandidates(results);
      setCurrentIndex(0);
      setIsLoading(false);
    }, 300);
  };

  const handleResetFilter = () => {
    setFilters({
      position: '',
      skills: '',
      location: ''
    });
    setSkillTags([]);
    setSkillInput("");
    setFilteredCandidates(mockCandidates);
    setCurrentIndex(0);
  };

  const handleAddSkillTag = () => {
    if (skillInput.trim() && !skillTags.includes(skillInput.trim())) {
      setSkillTags([...skillTags, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const handleRemoveSkillTag = (tagToRemove: string) => {
    setSkillTags(skillTags.filter(tag => tag !== tagToRemove));
  };

  const handleSkip = () => {
    handleNext();
  };

  const handleViewMore = async () => {
    if (!isExpanded) {
      setLoadingPortfolio(true);
      try {
        // Fetch portfolio data - using candidate id as portfolio id
        const portfolioId = parseInt(currentCandidate.id);
        const data = await portfolioService.fetchPortfolioById(portfolioId);
        if (data) {
          setPortfolio(data);
        }
        setIsExpanded(true);
      } catch (error) {
        console.error('Error loading portfolio:', error);
        // If portfolio not found, still expand with basic info
        setIsExpanded(true);
      } finally {
        setLoadingPortfolio(false);
      }
    } else {
      // Scroll down to see more content
      if (contentRef.current) {
        contentRef.current.scrollBy({ top: 300, behavior: 'smooth' });
      }
    }
  };

  const handleRefresh = () => {
    // Refresh candidate list
    setFilteredCandidates([...mockCandidates]);
    setCurrentIndex(0);
  };

  const handleBookmark = () => {
    console.log("Bookmark candidate:", currentCandidate.id);
    // TODO: Implement bookmark functionality
  };

  const handleShare = () => {
    console.log("Share candidate:", currentCandidate.id);
    // TODO: Implement share functionality
  };

  if (!currentCandidate) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Không tìm thấy ứng viên nào</p>
          <Button onClick={handleResetFilter} className="bg-[#0288D1]">
            Đặt lại bộ lọc
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex gap-0 pt-10 min-h-screen">
        {/* Left Filter Sidebar */}
        <div className="fixed left-3 h-screen z-10">
          <div className="w-89 bg-white rounded-lg p-6 shadow-md h-fit items-start ml-2">
            <div className="flex items-center gap-2 mb-6">
              <img src={SortIcon} alt="Sort" className="w-8 h-8"/>
              <h2 className="text-2xl font-bold text-gray-900">Bộ lọc ứng viên</h2>
            </div>
            
            <div className="space-y-4">
              {/* Position Filter */}
              <div>
                <label className="text-sm font-bold text-gray-700 mb-2 block">
                  Vị trí công việc
                </label>
                <input
                  type="text"
                  placeholder="Nhập vị trí..."
                  value={filters.position}
                  onChange={(e) => setFilters({...filters, position: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300"
                  style={{ backgroundColor: '#EFF6FF' }}
                />
              </div>

              {/* Skills Filter with Tags */}
              <div >
                <label className="text-sm font-bold text-gray-700 mb-2 block">
                  Kỹ năng
                </label>
                <div className="flex gap-2 mb-11">
                  <input
                    type="text"
                    placeholder="Nhập kỹ năng..."
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddSkillTag()}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300"
                    style={{ backgroundColor: '#EFF6FF' }}
                  />
                  <button
                    onClick={handleAddSkillTag}
                    className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1"
                  >
                    <Plus size={16} />
                    Thêm
                  </button>
                </div>
                {skillTags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {skillTags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="px-2 py-1 text-sm cursor-pointer hover:bg-gray-300"
                        onClick={() => handleRemoveSkillTag(tag)}
                      >
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

             
              {/* Apply Filter Button */}
              <button
                onClick={handleApplyFilter}
                disabled={isLoading}
                className="w-full mt-6 py-2 rounded-lg font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2"
                style={{ 
                  backgroundColor: isLoading ? '#1E40AF' : '#3B82F6',
                  opacity: isLoading ? 0.8 : 1
                }}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang tìm kiếm...</span>
                  </>
                ) : (
                  <span>Áp dụng bộ lọc</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content - Candidate Card */}
        <div className="flex-1 flex items-center justify-center gap-8 ml-72 mr-8">
          {/* Left Arrow */}
          <button 
            onClick={handlePrev}
            disabled={currentIndex === 0 || filteredCandidates.length === 0}
            className="p-2 rounded-full hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            <ChevronLeft size={32} className="text-slate-600" />
          </button>

          {/* Candidate Card or Empty State */}
          {filteredCandidates.length === 0 ? (
            // Màn hình không tìm thấy
            <div className="relative w-125 h-205 rounded-2xl overflow-hidden shadow-lg shrink-0 bg-white flex flex-col items-center justify-center">
              <div className="text-center space-y-6 px-8">
                <div className="text-6xl">😕</div>
                <h2 className="text-3xl font-bold text-gray-900">Không tìm thấy ứng viên</h2>
                <p className="text-gray-600 text-lg">
                  Không có ứng viên phù hợp với tiêu chí tìm kiếm của bạn. Vui lòng thử lại với các tiêu chí khác.
                </p>
                <button
                  onClick={handleResetFilter}
                  className="mt-8 px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
                >
                  Quay lại danh sách gốc
                </button>
              </div>
            </div>
          ) : (
            // Candidate Card
          <div className="w-full max-w-2xl">
            {/* Navigation Counter */}
            <div className="flex justify-center items-center mb-4">
              <span className="text-sm text-gray-600">
                {currentIndex + 1} / {filteredCandidates.length}
              </span>
            </div>

            {/* Candidate Card with Scroll */}
            <div 
              ref={contentRef}
              className={`bg-white rounded-2xl shadow-lg p-8 relative transition-all duration-300 ${
                isExpanded ? 'max-h-150 overflow-y-auto' : 'max-h-auto'
              }`}
            >
              {/* Premium Badge */}
              {currentCandidate.isPremium && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-blue-500 text-white px-3 py-1">Premium</Badge>
                </div>
              )}

              {/* Header with Avatar and Name */}
              <div className="flex flex-col items-center mb-6">
                <img
                  src={currentCandidate.avatar}
                  alt={currentCandidate.name}
                  className="w-32 h-32 rounded-full object-cover mb-4"
                />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {currentCandidate.name}
                </h1>
                <p className="text-[#0288D1] text-center font-medium mb-4">
                  {currentCandidate.title}
                </p>
                <p className="text-gray-600 text-center text-sm leading-relaxed">
                  {currentCandidate.description}
                </p>
              </div>

              {/* Contact Info */}
              <div className="flex justify-center gap-8 mb-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Mail size={16} />
                  <span>{currentCandidate.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} />
                  <span>{currentCandidate.phone}</span>
                </div>
              </div>

              {/* Skills Section */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-bold">⚡</span>
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">Kỹ năng kỹ thuật</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentCandidate.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Education Section */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-bold">🎓</span>
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">Học vấn</h2>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-1">
                    {currentCandidate.education.degree}
                  </h3>
                  <p className="text-blue-600 text-sm mb-1">
                    {currentCandidate.education.school}
                  </p>
                  <p className="text-gray-700 text-sm mb-2">
                    Chuyên ngành: {currentCandidate.education.major}
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {currentCandidate.education.achievements.map((achievement, index) => (
                      <li key={index}>{achievement}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Portfolio Section - Only show when expanded */}
              {isExpanded && portfolio && (
                <div className="mb-8 pt-6 border-t border-gray-200">
                  <PortfolioRenderer blocks={portfolio.blocks} />
                </div>
              )}

              {/* View More Button */}
              <div className="mb-6">
                <Button
                  onClick={handleViewMore}
                  disabled={loadingPortfolio}
                  className="w-full bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
                >
                  {loadingPortfolio ? (
                    <>
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                      <span>Đang tải...</span>
                    </>
                  ) : (
                    <>
                      <span>Xem thêm</span>
                      <ChevronDown size={16} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </>
                  )}
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center items-center gap-8 py-6 rounded-lg" style={{ backgroundColor: '#EFF6FF' }}>
                <button
                  onClick={handleSkip}
                  className="flex items-center justify-center hover:opacity-70 transition-opacity bg-transparent border-none cursor-pointer"
                  title="Bỏ qua"
                >
                  <X className="text-red-500" size={30} />
                </button>
                <button
                  onClick={handleRefresh}
                  className="flex items-center justify-center hover:opacity-70 transition-opacity bg-transparent border-none cursor-pointer"
                  title="Kết nối"
                >
                  <img src={ConnectIcon} alt="Connect" className="w-7.5 h-7.5" style={{ filter: 'brightness(0) saturate(100%) invert(45%) sepia(98%) saturate(1726%) hue-rotate(200deg) brightness(98%) contrast(93%)' }} />
                </button>
                <button
                  onClick={handleBookmark}
                  className="flex items-center justify-center hover:opacity-70 transition-opacity bg-transparent border-none cursor-pointer"
                  title="Lưu"
                >
                  <img src={BookmarkIcon} alt="Bookmark" className="w-7.5 h-7.5" style={{ filter: 'brightness(0) saturate(100%) invert(45%) sepia(98%) saturate(1726%) hue-rotate(200deg) brightness(98%) contrast(93%)' }} />
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center justify-center hover:opacity-70 transition-opacity bg-transparent border-none cursor-pointer"
                  title="Chia sẻ"
                >
                  <img src={ShareIcon} alt="Share" className="w-7.5 h-7.5" style={{ filter: 'brightness(0) saturate(100%)' }} />
                </button>
              </div>
            </div>
          </div>
          )}

          {/* Right Arrow */}
          <button 
            onClick={handleNext}
            disabled={currentIndex === filteredCandidates.length - 1 || filteredCandidates.length === 0}
            className="p-2 rounded-full hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            <ChevronRight size={32} className="text-slate-600" />
          </button>
        </div>

        {/* Right Premium Section */}
        <aside className="hidden lg:block w-96 shrink-0 py-6 pr-6">
          <div className="sticky top-24">
            <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
              {/* Premium Badge */}
              <div className="mb-6">
                <span className="inline-block bg-blue-500 text-white px-6 py-2 rounded-xl text-sm font-bold">
                  Premium
                </span>
              </div>
              
              {/* Title */}
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Tuyển dụng nhanh hơn gấp 2 lần!
              </h2>
              
              {/* Description */}
              <p className="text-gray-700 text-base leading-relaxed mb-8">
                Nâng cấp để tuyển dụng nhanh hơn với các ứng viên được phân tích từ AI phù hợp với yêu cầu của bạn.
              </p>
              
              {/* CTA Button */}
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-xl transition-colors">
                Đăng ký ngay
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
