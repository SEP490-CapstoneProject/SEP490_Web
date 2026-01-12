import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  DollarSign,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
const jobDetailData = [
  {
    id: "1",
    company: "Google Inc",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_Logo.png", // Link logo thật hoặc placeholder
    position: "Senior UX design",
    location: "1/1/1, Long Thạnh Mỹ, Hồ Chí Minh",
    salary: "25.000.000 - 30.000.000 vnđ",
    description: [
      "Chúng tôi đang tìm kiếm 1 Senior UX/UI Designer tài năng để tham gia vào đội ngũ phát triển của chúng tôi. Bạn sẽ chịu trách nhiệm chính trong thiết kế trải nghiệm người dùng, tối ưu cho các sản phẩm mobile app.",
      "Phân tích yêu cầu người dùng và xây dựng user flow, wireframe.",
      "Thiết kế giao diện UI hiện đại, clean và đảm bảo tính nhất quán của Design System.",
      "Phối hợp chặt chẽ với team Product và Dev để đảm bảo chất lượng đầu ra.",
      "Mentoring cho các bạn Junior trong team.",
    ],
    requirements: {
      mandatory: [
        "Có ít nhất 3 năm kinh nghiệm với vị trí tương đương.",
        "Thành thạo Figma và các công cụ prototyping (Protopie, Principle).",
      ],
      preferred: [
        "Có tư duy thẩm mỹ tốt, cập nhật các xu hướng thiết kế mới nhất.",
        "Khả năng giao tiếp tiếng anh tốt là một lợi thế.",
      ],
    },
    benefits: [
      "Cấp laptop công việc.",
      "Đóng bảo hiểm sức khỏe miễn phí.",
      "Du lịch và team building cùng công ty mỗi năm.",
      "Review lương mỗi năm một lần.",
    ],
  },
];
export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const job = jobDetailData.find((j) => j.id === id);

  if (!job)
    return (
      <div className="p-10 text-center">Không tìm thấy bài đăng tuyển dụng</div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header điều hướng */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="rounded-full"
        >
          <ArrowLeft size={24} />
        </Button>
        <h1 className="text-2xl font-bold text-slate-900">Chi tiết bài đăng</h1>
      </div>

      {/* 1. Tổng quan công việc */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-8 relative">
          <div className="flex justify-between items-start">
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4">
                Tổng quan công việc
              </h2>
              <div className="grid grid-cols-2 gap-y-4 gap-x-12">
                <div className="flex items-center gap-3">
                  <Briefcase size={18} className="text-slate-400" />
                  <span className="font-bold text-slate-900">
                    {job.position}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-slate-400" />
                  <span className="text-slate-500">{job.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-blue-500" />
                  <span className="text-slate-500">{job.company}</span>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign size={18} className="text-slate-400" />
                  <span className="text-slate-500">{job.salary}</span>
                </div>
              </div>
            </div>
            {/* Logo công ty góc phải */}
            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-100">
              <img
                src={job.logo}
                alt={job.company}
                className="w-10 h-10 object-contain brightness-0 invert"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Mô tả công việc */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-8 space-y-4">
          <h2 className="text-lg font-bold text-slate-800">Mô tả công việc</h2>
          <div className="text-slate-600 leading-relaxed space-y-2">
            <p>{job.description[0]}</p>
            <ul className="list-disc pl-5 space-y-1">
              {job.description.slice(1).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* 3. Yêu cầu chuyên môn */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-8 space-y-4">
          <h2 className="text-lg font-bold text-slate-800">
            Yêu cầu chuyên môn
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-red-500 font-bold mb-2">Bắt buộc</p>
              <ul className="list-disc pl-5 text-slate-600 space-y-1">
                {job.requirements.mandatory.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-blue-500 font-bold mb-2">Ưu tiên</p>
              <ul className="list-disc pl-5 text-slate-600 space-y-1">
                {job.requirements.preferred.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Quyền lợi và đãi ngộ */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-8 space-y-4">
          <h2 className="text-lg font-bold text-slate-800">
            Quyền lợi và đãi ngộ
          </h2>
          <ul className="list-disc pl-5 text-slate-600 space-y-2">
            {job.benefits.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Nút hành động Admin (Đồng bộ với các trang khác) */}
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
