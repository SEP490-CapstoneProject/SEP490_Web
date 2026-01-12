import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "react-router-dom";

// Dữ liệu mẫu dựa trên ảnh của bạn
const jobData = [
  { id: 1, company: "Tech Innovations Inc.", position: "Software Engineer", status: "Đồng ý", date: "2023-10-26", statusColor: "text-blue-500 bg-blue-50" },
  { id: 2, company: "Global Solutions", position: "Product Manager", status: "Đang chờ", date: "2023-10-25", statusColor: "text-slate-500 bg-slate-100" },
  { id: 3, company: "Creative Minds Agency", position: "UX Designer", status: "Đồng ý", date: "2023-10-24", statusColor: "text-blue-500 bg-blue-50" },
  { id: 4, company: "Fintech Pioneers", position: "Financial Analyst", status: "Từ chối", date: "2023-10-23", statusColor: "text-red-500 bg-red-50" },
  { id: 5, company: "HealthCare Systems", position: "Data Scientist", status: "Đồng ý", date: "2023-10-22", statusColor: "text-blue-500 bg-blue-50" },
];

export default function JobPostPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* 1. Phần Lọc bài đăng tuyển dụng */}
      <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-8 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Lọc bài đăng tuyển dụng</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          {/* Filter Trạng thái */}
          <div className="md:col-span-3 space-y-2">
            <label className="text-sm font-semibold text-slate-500">Trạng thái</label>
            <Select>
              <SelectTrigger className="w-full bg-white border-slate-200 h-11">
                <SelectValue placeholder="Tất cả trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="approved">Đồng ý</SelectItem>
                <SelectItem value="pending">Đang chờ</SelectItem>
                <SelectItem value="rejected">Từ chối</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Ô Tìm kiếm */}
          <div className="md:col-span-6 space-y-2">
            <label className="text-sm font-semibold text-slate-500 invisible">Tìm kiếm</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input 
                className="pl-10 h-11 border-slate-200 shadow-none focus-visible:ring-1" 
                placeholder="Tìm kiếm theo tên công ty hoặc vị trí" 
              />
            </div>
          </div>

          {/* Nút thao tác */}
          <div className="md:col-span-3 flex gap-3">
            <Button className="flex-1 bg-indigo-500 hover:bg-indigo-600 h-11 font-semibold shadow-md shadow-indigo-100">
              Apply Filters
            </Button>
            <Button variant="outline" className="h-11 border-slate-200 text-slate-600 font-semibold">
              Clear Filters
            </Button>
          </div>
        </div>
      </section>

      {/* 2. Bảng danh sách bài đăng */}
      <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
              <TableHead className="py-5 font-bold text-slate-500 px-6">Tên công ty</TableHead>
              <TableHead className="font-bold text-slate-500">Vị trí tuyển</TableHead>
              <TableHead className="font-bold text-slate-500">Trạng thái</TableHead>
              <TableHead className="font-bold text-slate-500">Ngày đăng</TableHead>
              <TableHead className="text-right font-bold text-slate-500 px-6">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobData.map((job, index) => (
              <TableRow key={index} className="hover:bg-slate-50/30 transition-colors">
                <TableCell className="py-5 font-medium text-slate-700 px-6">{job.company}</TableCell>
                <TableCell className="text-slate-600">{job.position}</TableCell>
                <TableCell>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${job.statusColor}`}>
                    {job.status}
                  </span>
                </TableCell>
                <TableCell className="text-slate-500">{job.date}</TableCell>
                <TableCell className="text-right px-6">
                  <Link to={`/dashboard/job/${job.id}`}>
                  <Button variant="outline" size="sm" className="text-indigo-600 border-indigo-100 hover:bg-indigo-50 font-bold px-4">
                    Xem chi tiết
                  </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* 3. Phân trang (Pagination) */}
        <div className="flex items-center justify-center gap-2 py-6 border-t border-slate-50">
          <Button variant="ghost" size="sm" className="text-slate-400 flex items-center gap-1">
            <ChevronLeft size={16} /> Previous
          </Button>
          
          <div className="flex gap-1">
            <Button size="sm" className="bg-blue-500 hover:bg-blue-600 h-8 w-8 p-0 font-bold">1</Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-600">2</Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-600">3</Button>
            <span className="px-2 text-slate-300">...</span>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-600">9</Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-600">10</Button>
          </div>

          <Button variant="ghost" size="sm" className="text-slate-600 flex items-center gap-1 font-medium">
            Next <ChevronRight size={16} />
          </Button>
        </div>
      </section>
    </div>
  );
}