import {
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const stats = [
  {
    id: 1,
    label: "Đang chờ",
    value: "24",
    icon: Clock,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    id: 2,
    label: "Người dùng được duyệt",
    value: "18",
    icon: CheckCircle2,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    id: 3,
    label: "Chưa được duyệt",
    value: "6",
    icon: AlertCircle,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    id: 4,
    label: "Hôm nay",
    value: "7",
    icon: Calendar,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
];

const posts = [
  {
    id: 1,
    name: "Nguyễn Vương Hạnh Uyên",
    handle: "@hanhvuyenvuong",
    role: "Product Designer",
    time: "2 tiếng trước",
    status: "Verified",
    content:
      "Vừa hoàn thành xong một dự án thiết kế lại bảng điều khiển tuyệt vời! Khách hàng rất hài lòng với kết quả. Mong sớm được chia sẻ thêm chi tiết. Rất mong được nghe ý kiến của các bạn về xu hướng UX bảng điều khiển hiện đại!",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hanh",
  },
  {
    id: 2,
    name: "Mai Trí Thức",
    handle: "@maitrithuc09",
    role: "Full Stack Developer",
    time: "5 tiếng trước",
    status: "Not Verified",
    content:
      "Rất vui mừng thông báo rằng tôi đã sẵn sàng nhận các dự án tự do! Chuyên về React, Node.js và kiến trúc đám mây. Hãy xem portfolio của tôi để xem các mẫu công việc gần đây. Tôi sẵn sàng hợp tác cả ngắn hạn và dài hạn.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Thuc",
  },
  {
    id: 3,
    name: "Nguyễn Thị Minh Khai",
    handle: "@mknt",
    role: "Content Strategist",
    time: "10 tiếng trước",
    status: "Verified",
    content:
      "Tôi đang tìm kiếm lời khuyên về các công cụ quản lý dự án tốt nhất dành cho các nhóm làm việc từ xa. Chúng tôi đã sử dụng một số nền tảng nhưng cần một công cụ tích hợp tốt hơn. Công cụ nào đang hoạt động tốt cho nhóm của bạn?",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Khai",
  },
];

export default function CommunityPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Những bài đăng đang chờ được duyệt
          </h1>
          <p className="text-sm text-slate-500">
            Xem qua các bài đăng đang chờ và duyệt chúng
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <Input
              className="pl-10 bg-white border-slate-200"
              placeholder="Tìm bài đăng"
            />
          </div>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-slate-100 shadow-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold mt-1 text-slate-900">
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.bg} p-3 rounded-xl`}>
                <stat.icon className={stat.color} size={24} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Posts List Section */}
      <div className="space-y-4">
        {posts.map((post) => (
          <Card
            key={post.id}
            className="border-slate-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4">
                  <Avatar className="h-12 w-12 border border-slate-100">
                    <AvatarImage src={post.avatar} />
                    <AvatarFallback>{post.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900">{post.name}</h3>
                      <Badge
                        variant={
                          post.status === "Verified" ? "default" : "secondary"
                        }
                        className="text-[10px] h-5 px-2 bg-green-500 hover:bg-green-600 text-white border-none"
                      >
                        {post.status === "Verified"
                          ? "✓ Verified"
                          : "Not Verified"}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500">
                      {post.handle} • {post.role}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-slate-400">{post.time}</span>
              </div>

              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                {post.content}
              </p>
              <Link to={`/dashboard/community/${post.id}`}>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 font-semibold">
                  Xem chi tiết
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
