import { Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "react-router-dom";

const portfolioData = [
  {
    id: "PORT-001",
    username: "creative_cat",
    field: "UI/UX Designer",
    time: "2026-01-26 14:30",
    color: "bg-red-50 text-red-500",
  },
  {
    id: "PORT-002",
    username: "design_guru",
    field: "Full Stack Developer",
    time: "2026-01-26 10:15",
    color: "bg-pink-50 text-pink-500",
  },
  {
    id: "PORT-003",
    username: "art_lover_99",
    field: "BlockChain",
    time: "2026-01-25 18:00",
    color: "bg-red-50 text-red-500",
  },
  {
    id: "PORT-004",
    username: "photo_master",
    field: "Nhiếp ảnh gia",
    time: "2026-01-25 11:45",
    color: "bg-blue-50 text-blue-500",
  },
  {
    id: "PORT-005",
    username: "vector_vixen",
    field: "Data analysis",
    time: "2026-10-24 09:00",
    color: "bg-blue-50 text-blue-500",
  },
  {
    id: "PORT-006",
    username: "dev_wiz",
    field: "UI/UX Designer",
    time: "2026-10-24 16:20",
    color: "bg-red-50 text-red-500",
  },
];

export default function PortfolioPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Search Bar Section - Theo style xanh bo tròn trong ảnh */}
      <div className="flex items-center bg-blue-500 rounded-full px-4 py-2 w-full max-w-md shadow-lg shadow-blue-500/20">
        <Menu className="text-white mr-3 cursor-pointer" size={20} />
        <Input
          className="bg-transparent border-none focus:border-primary text-white placeholder:text-blue-100 focus-visible:ring-0 focus-visible:ring-offset-0 h-8"
          placeholder="Tìm username"
        />
        <Search className="text-white ml-2 cursor-pointer" size={20} />
      </div>

      <div className="space-y-6">
        <h1 className="text-xl font-bold text-slate-800">
          Danh sách các portfolio cần được duyệt
        </h1>

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-50 overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="font-semibold py-4">
                  Portfolio ID
                </TableHead>
                <TableHead className="font-semibold">Username</TableHead>
                <TableHead className="font-semibold">
                  Lĩnh vực hoạt động
                </TableHead>
                <TableHead className="font-semibold">Thời gian tạo</TableHead>
                <TableHead className="text-right font-semibold pr-8">
                  Hành động
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {portfolioData.map((item) => (
                <TableRow
                  key={item.id}
                  className="hover:bg-slate-50/30 transition-colors"
                >
                  <TableCell className="py-4 text-slate-600">
                    {item.id}
                  </TableCell>
                  <TableCell className="font-semibold text-slate-800">
                    {item.username}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-4 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${item.color}`}
                    >
                      {item.field}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-500 text-sm">
                    {item.time}
                  </TableCell>
                  <Link to={`/dashboard/portfolio/${item.id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-blue-600 border-slate-200 hover:bg-blue-50 hover:text-blue-700 text-xs px-4"
                    >
                      Xem chi tiết
                    </Button>
                  </Link>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination Section */}
          <div className="flex items-center justify-center gap-2 py-6 border-t border-slate-50">
            <Button variant="ghost" size="sm" className="text-slate-400">
              ← Previous
            </Button>
            <div className="flex gap-1">
              <Button
                size="sm"
                className="bg-blue-500 hover:bg-blue-600 h-8 w-8 p-0"
              >
                1
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                2
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                3
              </Button>
              <span className="px-2 text-slate-300 self-end pb-2">...</span>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                9
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                10
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-600 font-medium"
            >
              Next →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
