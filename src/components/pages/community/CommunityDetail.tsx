import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MoreHorizontal, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
const communityPosts = [
  {
    id: "1",
    name: "Nguyễn Vương Hạnh Uyên",
    handle: "@hanhvuyenvuong",
    role: "Product Designer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hanh",
    status: "Verified",
    time: "2 tiếng trước",
    content:
      "Vừa hoàn thành xong một dự án thiết kế lại bảng điều khiển tuyệt vời! Khách hàng rất hài lòng với kết quả. Mong sớm được chia sẻ thêm chi tiết. Rất mong được nghe ý kiến của các bạn về xu hướng UX bảng điều khiển hiện đại!",
    attachments: ["/project-preview-1.jpg", "/project-preview-2.jpg"],
    stats: { waiting: 24, approved: 18, rejected: 6, today: 7 },
  },
  // ... các bài đăng khác
];
export default function CommunityDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = communityPosts.find((p) => p.id === id);

  if (!post)
    return <div className="p-10 text-center">Không tìm thấy bài viết</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      {/* Header điều hướng */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full"
          >
            <ArrowLeft size={24} />
          </Button>
          <h1 className="text-2xl font-bold text-slate-900">
            Chi tiết bài đăng cộng đồng
          </h1>
        </div>
        <Button variant="ghost" size="icon">
          <MoreHorizontal size={20} />
        </Button>
      </div>

      {/* Nội dung bài viết chính */}
      <Card className="border-slate-100 shadow-sm overflow-hidden">
        <CardContent className="p-8 space-y-6">
          {/* Thông tin người đăng */}
          <div className="flex justify-between items-start">
            <div className="flex gap-4">
              <Avatar className="h-14 w-14 border border-slate-100">
                <AvatarImage src={post.avatar} />
                <AvatarFallback>{post.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg text-slate-900">
                    {post.name}
                  </h3>
                  {post.status === "Verified" && (
                    <Badge className="bg-green-500 hover:bg-green-600 text-white text-[10px] px-2 h-5 border-none">
                      <ShieldCheck size={12} className="mr-1" /> Verified
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-slate-500">
                  {post.handle} • {post.role}
                </p>
              </div>
            </div>
            <span className="text-sm text-slate-400 font-medium">
              {post.time}
            </span>
          </div>

          {/* Nội dung văn bản */}
          <div className="space-y-4">
            <p className="text-slate-700 text-lg leading-relaxed whitespace-pre-line">
              {post.content}
            </p>
          </div>

          {/* Hình ảnh đính kèm (nếu có) */}
          {post.attachments && (
            <div className="grid grid-cols-2 gap-4 rounded-xl overflow-hidden border border-slate-100">
              {post.attachments.map(( idx) => (
                <div
                  key={idx}
                  className="bg-slate-100 aspect-video flex items-center justify-center text-slate-400"
                >
                  [Hình ảnh dự án {idx + 1}]
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Phần dành cho Admin duyệt (Dựa trên ảnh caad67) */}
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
