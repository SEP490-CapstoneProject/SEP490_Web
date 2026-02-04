import PremiumAndTips from "@/components/common/PremiumAndTips";
import {
  ArrowLeft,
  Plus,
  MoreVertical,
  Mail,
  Phone,
  Share2,
  Eye,
  Edit3,
  Trash2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PortfolioMainBlockItem, portfolioService } from "@/services/portfolio.api";

const ProfileCard = ({
  data,
  onViewDetail,
  isPrimary,
  onSetPrimary,
  onUnsetPrimary,
}: {
  data: PortfolioMainBlockItem;
  onViewDetail: (portfolioId: number) => void;
  isPrimary: boolean;
  onSetPrimary: (portfolioId: number) => void;
  onUnsetPrimary: (portfolioId: number) => void;
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const { fullName, title, email, phone, avatar } = data.blocks.data;
  const statusLabel = isPrimary ? "Đang dùng" : "Bản nháp";
  const status = isPrimary ? "active" : "draft";

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative group">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <span
          className={`text-xs font-semibold px-2 py-1 rounded ${
            status === "active"
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
          }`}
        >
          {statusLabel}
        </span>

        {/* nút 3 chấm */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <MoreVertical size={20} />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              ></div>

              {/* function button */}
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-20 py-2 overflow-hidden animate-in fade-in zoom-in duration-200">
                {isPrimary ? (
                  <button
                    onClick={() => {
                      onUnsetPrimary(data.portfolioId);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 cursor-pointer"
                    style={{ backgroundColor: '#DCFCE7', color: '#1B8442' }}
                  >
                     Hủy bản chính
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onSetPrimary(data.portfolioId);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 cursor-pointer"
                    style={{ backgroundColor: '#DCFCE7', color: '#1B8442' }}
                  >
                    <Edit3 size={14} /> Đặt làm bản chính
                  </button>
                )}
                <div className="border-t border-slate-100 dark:border-slate-700 my-1"></div>
                <button
                  onClick={() => {
                    onViewDetail(data.portfolioId);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
                >
                  <Eye size={14} /> Xem chi tiết
                </button>
                <button className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer">
                  <Edit3 size={14} /> Chỉnh sửa
                </button> 
                <button className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer">
                  <Trash2 size={14} /> Xóa 
                </button>
                
                <div className="border-t border-slate-100 dark:border-slate-700 my-1"></div>
                  <button className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer">
                    <Share2 size={14} /> Chia sẻ
                  </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-50 dark:border-slate-800 mb-4">
          <img
            alt="Profile"
            className="w-full h-full object-cover"
            src={avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=default"}
          />
        </div>
        <h3 className="text-xl font-bold mb-1">{fullName || "Chưa cập nhật tên"}</h3>
        <p className="text-blue-500 font-medium text-sm mb-4">
          {title || "Chưa cập nhật chức vụ"}
        </p>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6 max-w-sm">
          {data.portfolio.name}
        </p>

        <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-8">
          {email && (
            <div className="flex items-center gap-1.5">
              <Mail size={16} /> {email}
            </div>
          )}
          {phone && (
            <div className="flex items-center gap-1.5">
              <Phone size={16} /> {phone}
            </div>
          )}
        </div>

        <div className="w-full pt-6 border-t border-slate-100 dark:border-slate-800 text-slate-400 text-sm font-medium">
          Hồ sơ xin việc
        </div>
      </div>
    </div>
  );
};

export default function ProfileManagement() {
  const navigate = useNavigate();
  const [portfolios, setPortfolios] = useState<PortfolioMainBlockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [primaryPortfolioId, setPrimaryPortfolioId] = useState<number | null>(null);

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        setLoading(true);
        const userId = 2; // Mock user ID
        const data = await portfolioService.fetchMainPortfoliosManagerByUser(userId);
        setPortfolios(data);
        // Đặt portfolio đầu tiên là bản chính mặc định
        if (data.length > 0) {
          setPrimaryPortfolioId(data[0].portfolioId);
        }
      } catch (error) {
        console.error("Error fetching portfolios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, []);

  const handleViewDetail = (portfolioId: number) => {
    navigate(`/portfolio/${portfolioId}`);
  };

  const handleSetPrimary = (portfolioId: number) => {
    setPrimaryPortfolioId(portfolioId);
  };

  const handleUnsetPrimary = (portfolioId: number) => {
    setPrimaryPortfolioId(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <div className="max-w-360 mx-auto flex min-h-screen">
        <main className="w-2/3 md:px-10 pr-4 border-slate-200 dark:border-slate-800">
          <header className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
                <ArrowLeft size={24} />
              </button>
              <h1 className="text-2xl font-bold tracking-tight">
                Quản lý hồ sơ
              </h1>
            </div>
            <button className="bg-blue-500 hover:bg-blue-600 cursor-pointer text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 shadow-sm transition-all active:scale-95">
              <Plus size={20} /> Thêm hồ sơ mới
            </button>
          </header>

          <div className="mb-6">
            <h2 className="text-slate-500 dark:text-slate-400 font-medium">
              Danh sách hồ sơ ({portfolios.length})
            </h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : portfolios.length > 0 ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {portfolios.map((portfolio) => (
                <ProfileCard
                  key={portfolio.portfolioId}
                  data={portfolio}
                  onViewDetail={handleViewDetail}
                  isPrimary={primaryPortfolioId === portfolio.portfolioId}
                  onSetPrimary={handleSetPrimary}
                  onUnsetPrimary={handleUnsetPrimary}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-500">Không có hồ sơ nào</p>
            </div>
          )}
        </main>

        <PremiumAndTips />
      </div>
    </div>
  );
}
