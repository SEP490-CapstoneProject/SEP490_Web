import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Zap, Clock, Rocket, Trophy, Users, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
const portfolioData = [
  {
    id: "PORT-001",
    username: "creative_cat",
    fullName: "Lê Nguyễn An Nhiên",
    email: "annhien@gmail.com",
    phone: "0123456789",
    field: "UI/UX Designer",
    skills: ["Thiết kế 2D/3D", "Xử lí ảnh", "Figma"],
    experience: {
      period: "2021 - 2025",
      position: "Nhà thiết kế sản phẩm cao cấp",
      company: "Tech Inc",
      description:
        "Dẫn dắt thiết kế các sản phẩm chủ lực, cộng tác với các nhóm đa chức năng để cung cấp các giải pháp lấy người dùng làm trung tâm",
    },
    projects: [
      {
        name: "Bộ nhận diện thương hiệu cho nền tảng Freelanzy",
        description:
          "Thiết kế logo, bảng màu, typography và guideline hình ảnh...",
        role: "Graphic Designer",
      },
      // ... các project khác
    ],
    // Dữ liệu mới cho ảnh cuối
    achievement: {
      title: "Best employee of the year",
      organization: "Tech inc",
    },
    activity: {
      title: "Diễn giả tại TechMeeUp Hà Nội",
      date: "Tháng 8/2022",
    },
    time: "2026-01-26 14:30",
    color: "bg-red-50 text-red-500",
  },
];
export default function PortfolioDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const data = portfolioData.find((item) => item.id === id);

  if (!data)
    return <div className="p-8 text-center">Không tìm thấy dữ liệu hồ sơ.</div>;

  return (
    <div className="max-w-6xl mx-auto p-8 pb-24 space-y-16 animate-in fade-in duration-500">
      {/* Nút quay lại và Tiêu đề */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="rounded-full"
        >
          <ArrowLeft size={24}/>
        </Button>
        <h1 className="text-[24px] font-bold text-[#171A1F]">
          Chi tiết portfolio
        </h1>
      </div>

      {/* 1. Phần Avatar & Thông tin cơ bản (Đã làm ở bước trước) */}
      <div className="flex justify-start">
        <Avatar className="w-[213px] h-[213px] border-4 border-white shadow-sm">
          <AvatarImage
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${data.username}`}
          />
          <AvatarFallback>AN</AvatarFallback>
        </Avatar>
      </div>

      <div className="space-y-6">
        <h2 className="text-[24px] font-bold text-[#171A1F]">
          Thông tin cơ bản
        </h2>
        <Card className="border-[#DEE1E6] shadow-sm">
          <CardContent className="p-10 grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-20">
            <InfoField label="Tên tài khoản" value={data.username} />
            <InfoField label="Họ và tên" value={data.fullName} />
            <InfoField label="Công việc chính" value={data.field} />
            <InfoField label="Email" value={data.email} />
            <div className="md:col-span-2">
              <InfoField label="SĐT" value={data.phone} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4. Kỹ năng nổi bật (Dựa trên ảnh mới) */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="bg-[#3B82F6] p-3 rounded-full shadow-lg shadow-blue-200">
            <Zap className="text-white" size={28} fill="white" />
          </div>
          <h2 className="text-[24px] font-bold text-[#171A1F]">
            Kỹ năng nổi bật
          </h2>
        </div>

        <Card className="border-[#DEE1E6] shadow-sm">
          <CardContent className="p-10 flex flex-wrap gap-12">
            {data.skills.map((skill, index) => (
              <div
                key={index}
                className="px-8 py-3 bg-[#F9FAFB] border-2 border-[#E2E8F0] rounded-[15px] text-[20px] font-bold text-black/50"
              >
                {skill}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* 5. Kinh nghiệm làm việc (Dựa trên ảnh mới) */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="bg-[#3B82F6] p-3 rounded-full shadow-lg shadow-blue-200">
            <Clock className="text-white" size={28} />
          </div>
          <h2 className="text-[24px] font-bold text-[#171A1F]">
            Kinh nghiệm làm việc
          </h2>
        </div>

        <Card className="border-[#DEE1E6] shadow-sm">
          <CardContent className="p-10 space-y-4">
            <p className="text-[22px] font-semibold text-[#3B82F6]">
              {data.experience.period}
            </p>
            <div className="flex items-center gap-12">
              <h3 className="text-[24px] font-bold text-black">
                {data.experience.position}
              </h3>
              <span className="text-[24px] font-bold text-black">-</span>
              <h3 className="text-[24px] font-bold text-black">
                {data.experience.company}
              </h3>
            </div>
            <p className="text-[20px] font-medium text-black leading-relaxed">
              {data.experience.description}
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="bg-[#3B82F6] p-3 rounded-full shadow-lg shadow-blue-200">
            <Rocket className="text-white" size={28} fill="white" />
          </div>
          <h2 className="text-[24px] font-bold text-[#171A1F]">
            Dự án nổi bật
          </h2>
        </div>

        <div className="space-y-8">
          {data.projects.map((project, index) => (
            <Card key={index} className="border-[#DEE1E6] shadow-sm rounded-xl">
              <CardContent className="p-10 flex flex-col items-center text-center space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-[20px] font-bold">•</span>
                  <p className="text-[20px] font-medium text-black">
                    <span className="font-bold text-slate-700">Tên dự án:</span>{" "}
                    {project.name}
                  </p>
                </div>

                <div className="flex items-start gap-2 max-w-4xl">
                  <span className="text-[20px] font-bold">•</span>
                  <p className="text-[20px] font-medium text-black leading-relaxed">
                    <span className="font-bold text-slate-700">
                      Mô tả ngắn gọn:
                    </span>{" "}
                    {project.description}
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <span className="text-[20px] font-bold">•</span>
                  <p className="text-[20px] font-medium text-black">
                    <span className="font-bold text-slate-700">Vị trí:</span>{" "}
                    {project.role}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      {/* 4. Thành tựu & Hoạt động (Dựa trên ảnh mới nhất) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Thành tựu nổi bật */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="bg-[#3B82F6] p-3 rounded-full shadow-lg shadow-blue-200">
              <Trophy className="text-white" size={28} />
            </div>
            <h2 className="text-[24px] font-bold text-[#171A1F]">
              Thành tựu nổi bật
            </h2>
          </div>
          <Card className="border-[#DEE1E6] shadow-sm bg-white h-[180px]">
            <CardContent className="p-8 space-y-2">
              <p className="text-[22px] font-bold text-black">
                {data.achievement.title}
              </p>
              <p className="text-[20px] font-bold text-black/40 uppercase tracking-wide">
                {data.achievement.organization}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Hoạt động */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="bg-[#3B82F6] p-3 rounded-full shadow-lg shadow-blue-200">
              <Users className="text-white" size={28} />
            </div>
            <h2 className="text-[24px] font-bold text-[#171A1F]">Hoạt động</h2>
          </div>
          <Card className="border-[#DEE1E6] shadow-sm bg-white h-[180px]">
            <CardContent className="p-8 space-y-2">
              <p className="text-[22px] font-bold text-black">
                {data.activity.title}
              </p>
              <p className="text-[20px] font-bold text-black/40 tracking-wide">
                {data.activity.date}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 5. Nút Phê duyệt / Từ chối (Căn phải theo ảnh) */}
      <div className="flex justify-end items-center gap-4 pt-2">
        <Button
          className="bg-[#1DD75B] hover:bg-[#19b64c] text-white font-bold h-12 px-10 rounded-lg shadow-md transition-all active:scale-95"
          onClick={() => alert("Đã phê duyệt!")}
        >
          Đồng ý
        </Button>
        <Button
          className="bg-[#EF4444] hover:bg-[#dc3535] text-white font-bold h-12 px-10 rounded-lg shadow-md transition-all active:scale-95"
          onClick={() => alert("Đã từ chối!")}
        >
          Từ chối
        </Button>
      </div>
    </div>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[20px] font-bold text-black/50 whitespace-nowrap">
        {label}:
      </span>
      <span className="text-[20px] font-bold text-black/50">{value}</span>
    </div>
  );
}
