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
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  PortfolioMainBlockItem,
  portfolioService,
} from "@/services/portfolio.api";
import { PremiumAndTips } from "@/components/common/Premium";
import { useAppSelector } from "@/store/hook";
import { notify } from "@/lib/toast";
import CustomLoading from "@/components/Loading/Loading";

const ProfileCard = ({
  data,
  onViewDetail,
  onEdit,
  onDelete,
  isPrimary,
  onSetPrimary,
  onUnsetPrimary,
  isPublic,
  onSetPublic,
  onUnsetPublic,
  portfolioCategoryLabel,
}: {
  data: PortfolioMainBlockItem;
  onViewDetail: (portfolioId: number) => void;
  onViewPreview: (portfolioId: number) => void;
  onEdit: (portfolioId: number) => void;
  onDelete: (portfolioId: number) => void;
  isPrimary: boolean;
  onSetPrimary: (portfolioId: number) => void;
  onUnsetPrimary: (portfolioId: number) => void;
  isPublic: boolean;
  onSetPublic: (portfolioId: number) => void;
  onUnsetPublic: (portfolioId: number) => void;
  portfolioCategoryLabel: string;
}) => {
  const [showMenu, setShowMenu] = useState(false);
  // Extract data from INTRO block - prioritize user name
  const introData = data.blocks?.data || {};
  const fullName = introData.fullName || introData.name || "Chưa cập nhật tên";
  const title = introData.title || introData.studyField || "Chưa cập nhật chức vụ";
  const email = introData.email || "";
  const phone = introData.phone || "";
  const avatar = introData.avatar || "";
  
  const statusLabel = isPrimary ? "Bản chính" : "Bản nháp";
  const status = isPrimary ? "active" : "draft";

  return (
    <div className="bg-white  border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative group">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <span
          className={`text-xs font-semibold px-2 py-1 rounded ${
            status === "active"
              ? "bg-emerald-100 text-emerald-700  "
              : "bg-slate-100 text-slate-600  "
          }`}
        >
          {statusLabel}
        </span>

        {/* nút 3 chấm */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-slate-400 hover:text-slate-600  p-1 rounded-full hover:bg-slate-100  transition-colors cursor-pointer"
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
              <div className="absolute right-0 mt-2 w-40 bg-white  border border-slate-200  rounded-xl shadow-xl z-20 py-2 overflow-hidden animate-in fade-in zoom-in duration-200">
                {isPrimary ? (
                  <button
                    onClick={() => {
                      onUnsetPrimary(data.portfolioId);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 cursor-pointer"
                    style={{ backgroundColor: "#DCFCE7", color: "#1B8442" }}
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
                    style={{ backgroundColor: "#DCFCE7", color: "#1B8442" }}
                  >
                    <Edit3 size={14} /> Đặt làm bản chính
                  </button>
                )}
                <div className="border-t border-slate-100  my-1"></div>
                <button
                  onClick={() => {
                    if (isPublic) {
                      onUnsetPublic(data.portfolioId);
                    } else {
                      onSetPublic(data.portfolioId);
                    }
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-slate-50  cursor-pointer"
                >
                  <Eye size={14} /> {isPublic ? "Hủy" : "Đặt"} công khai
                </button>
                <button
                  onClick={() => {
                    onViewDetail(data.portfolioId);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-slate-50  cursor-pointer"
                >
                  <Eye size={14} /> Xem chi tiết
                </button>
                <button
                  onClick={() => {
                    onEdit(data.portfolioId);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-slate-50  cursor-pointer"
                >
                  <Edit3 size={14} /> Chỉnh sửa
                </button>
                <button
                  onClick={() => {
                    onDelete(data.portfolioId);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 text-red-500 hover:bg-red-50  cursor-pointer"
                >
                  <Trash2 size={14} /> Xóa
                </button>

                <div className="border-t border-slate-100  my-1"></div>
                <button className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-slate-50  cursor-pointer">
                  <Share2 size={14} /> Chia sẻ
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-50  mb-4">
          <img
            alt="Profile"
            className="w-full h-full object-cover"
            src={
              avatar ||
              "https://api.dicebear.com/7.x/avataaars/svg?seed=default"
            }
          />
        </div>
        <h3 className="text-xl font-bold mb-1">
          {fullName}
        </h3>
        <p className="text-blue-500 font-medium text-sm mb-4">
          {title}
        </p>
        <p className="text-slate-600  text-sm leading-relaxed mb-6 max-w-sm">
          {data.portfolio.name}
        </p>

        <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-500  mb-8">
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

        <div className="w-full pt-6 border-t border-slate-100  text-slate-400 text-sm font-medium">
          {portfolioCategoryLabel}
        </div>
      </div>
    </div>
  );
};

export default function ProfileManagement() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [portfolios, setPortfolios] = useState<PortfolioMainBlockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { accessToken } = useAppSelector((state) => state.auth);
  const user = useAppSelector((state) => state.auth.user);

  const orderedCategoryLabels = [
    "Hồ sơ xin việc",
    "Hồ sơ thực tập",
    "Hồ sơ học bổng",
    "Hồ sơ học bổng",
    "Hồ sơ thực tập",
  ];

  // Debug log on mount and when deps change
  useEffect(() => {
    console.log("🔍 [PortfolioManagement] Component mounted or deps changed");
    console.log("🔍 [PortfolioManagement] Current user:", user);
    console.log("🔍 [PortfolioManagement] Current user?.employeeId:", user?.employeeId);
    console.log("🔍 [PortfolioManagement] Current accessToken exists:", !!accessToken);
    console.log("🔍 [PortfolioManagement] Auth state:", {
      user: user,
      hasAccessToken: !!accessToken,
      accessTokenLength: accessToken?.length,
    });
  }, [user, accessToken]);

  console.log("🔍 [PortfolioManagement] Render - user:", user);
  console.log("🔍 [PortfolioManagement] Render - accessToken exists:", !!accessToken);

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        console.log("🔍 [PortfolioManagement] useEffect triggered");
        console.log("🔍 [PortfolioManagement] user:", user);
        console.log("🔍 [PortfolioManagement] accessToken:", !!accessToken);

        setLoading(true);
        setError(null);

        // Check if user is authenticated
        if (!accessToken) {
          console.warn("⚠️ [PortfolioManagement] No access token found");
          notify.error("Please login to view your portfolios");
          navigate("/login");
          return;
        }

        // Get employeeId from auth state
        if (!user?.id && !user?.employeeId) {
          console.warn("⚠️ [PortfolioManagement] No user id or employeeId found in auth state");
          console.warn("⚠️ [PortfolioManagement] user object:", user);
          notify.error("User information not loaded. Please login again");
          navigate("/login");
          return;
        }

        console.log("📡 [PortfolioManagement] Fetching portfolios for employee:", user.employeeId || user.id);

        // Use the working employee ID endpoint instead of /me
        const data = await portfolioService.fetchPortfoliosByEmployeeId(
          user.employeeId || user.id,
          accessToken,
        );
        
        console.log("📡 [PortfolioManagement] Received data from API:", data);
        console.log("📡 [PortfolioManagement] Data length:", data?.length);
        
        setPortfolios(data);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to load portfolios";
        console.error("❌ [PortfolioManagement] Error fetching portfolios:", errorMessage);
        console.error("❌ [PortfolioManagement] Error object:", error);
        setError(errorMessage);
        notify.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, [accessToken, user, navigate, searchParams]);

  const handleViewDetail = (portfolioId: number) => {
    navigate(`/portfolio/${portfolioId}`);
  };

  const handleViewPreview = (portfolioId: number) => {
    navigate(`/portfolio/${portfolioId}/preview`);
  };

  const handleEdit = (portfolioId: number) => {
    navigate(`/portfolio/${portfolioId}/edit`);
  };

  const handleCreate = () => {
    navigate("/portfolio/create");
  };

  const handleToggleMainPortfolio = async (portfolioId: number) => {
    try {
      const tokenToUse = accessToken || localStorage.getItem("access_token");
      
      if (!tokenToUse) {
        notify.error("Vui lòng đăng nhập để thay đổi portfolio chính");
        navigate("/login");
        return;
      }

      // Call toggle main API
      const updatedPortfolioData = await portfolioService.toggleMainPortfolio(
        portfolioId,
        tokenToUse,
      );

      console.log("✅ [handleToggleMainPortfolio] Response data:", updatedPortfolioData);
      console.log("✅ [handleToggleMainPortfolio] isMain value:", updatedPortfolioData.isMain);

      // Update the portfolio in the list with all fields from response, keep original blocks
      setPortfolios((prevPortfolios) =>
        prevPortfolios.map((p) =>
          p.portfolioId === portfolioId
            ? {
                ...p,
                isMain: updatedPortfolioData.isMain,
                isPublic: updatedPortfolioData.isPublic,
                status: updatedPortfolioData.status,
                updatedAt: updatedPortfolioData.updatedAt,
                portfolioName: updatedPortfolioData.portfolioName,
                // Keep the original blocks to avoid losing display data
              }
            : // When setting a portfolio as main, automatically set all others to non-main (draft)
            updatedPortfolioData.isMain
              ? {
                  ...p,
                  isMain: false,
                }
              : p,
        ),
      );

      console.log("✅ [handleToggleMainPortfolio] State updated");

      // Show success message
      const action = updatedPortfolioData.isMain ? "Đặt làm" : "Hủy";
      notify.success(`${action} bản chính thành công!`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Không thể thay đổi trạng thái portfolio";
      console.error("❌ Error toggling main portfolio:", errorMessage);
      notify.error(errorMessage);
    }
  };

  const handleTogglePublicPortfolio = async (portfolioId: number) => {
    try {
      const tokenToUse = accessToken || localStorage.getItem("access_token");
      
      if (!tokenToUse) {
        notify.error("Vui lòng đăng nhập để thay đổi chế độ công khai");
        navigate("/login");
        return;
      }

      // Call toggle public API
      const updatedPortfolioData = await portfolioService.togglePublicPortfolio(
        portfolioId,
        tokenToUse,
      );

      console.log("✅ [handleTogglePublicPortfolio] Response data:", updatedPortfolioData);
      console.log("✅ [handleTogglePublicPortfolio] isPublic value:", updatedPortfolioData.isPublic);

      // Update the portfolio in the list with all fields from response, keep original blocks
      setPortfolios((prevPortfolios) =>
        prevPortfolios.map((p) =>
          p.portfolioId === portfolioId
            ? {
                ...p,
                isMain: updatedPortfolioData.isMain,
                isPublic: updatedPortfolioData.isPublic,
                status: updatedPortfolioData.status,
                updatedAt: updatedPortfolioData.updatedAt,
                portfolioName: updatedPortfolioData.portfolioName,
                // Keep the original blocks to avoid losing display data
              }
            : p,
        ),
      );

      console.log("✅ [handleTogglePublicPortfolio] State updated");

      // Show success message
      const action = updatedPortfolioData.isPublic ? "Đặt" : "Hủy";
      notify.success(`${action} công khai thành công!`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Không thể thay đổi chế độ công khai";
      console.error("❌ Error toggling public portfolio:", errorMessage);
      notify.error(errorMessage);
    }
  };

  const handleDeletePortfolio = async (portfolioId: number) => {
    try {
      const confirmed = window.confirm(
        "Bạn chắc chắn muốn xóa portfolio này? Hành động này không thể hoàn tác.",
      );

      if (!confirmed) {
        return;
      }

      const tokenToUse = accessToken || localStorage.getItem("access_token");
      
      if (!tokenToUse) {
        notify.error("Vui lòng đăng nhập để xóa portfolio");
        navigate("/login");
        return;
      }

      // Call delete API
      await portfolioService.deletePortfolio(portfolioId, tokenToUse);

      // Update state immediately to remove portfolio from UI
      const updatedPortfolios = portfolios.filter((p) => p.portfolioId !== portfolioId);
      setPortfolios(updatedPortfolios);

      // Show success message
      notify.success("Portfolio đã được xóa thành công!");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Không thể xóa portfolio";
      console.error("❌ Error deleting portfolio:", errorMessage);
      notify.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-200 mt-4">
      <div className="max-w-7xl mx-auto flex min-h-screen flex-col lg:flex-row">
        <main className="w-full lg:w-2/3 px-4 md:px-10 lg:pr-8 text-slate-900">
          <header className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-slate-200  rounded-full transition-colors cursor-pointer" onClick={() => navigate(-1)}>
                <ArrowLeft size={24} />
              </button>
              <h1 className="text-2xl font-bold tracking-tight">
                Quản lý hồ sơ
              </h1>
            </div>
            <button
              onClick={handleCreate}
              className="bg-blue-500 hover:bg-blue-600 cursor-pointer text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 shadow-sm transition-all active:scale-95"
            >
              <Plus size={20} /> Thêm hồ sơ mới
            </button>
          </header>

          <div className="mb-6">
            <h2 className="text-slate-500  font-medium">
              Danh sách hồ sơ ({portfolios.length})
            </h2>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {loading ? (
            <CustomLoading />
          ) : portfolios.length > 0 ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {portfolios.map((portfolio, index) => {
                console.log(`📋 [PortfolioCard] Portfolio #${index}:`, {
                  portfolioId: portfolio.portfolioId,
                  isMain: portfolio.isMain,
                  isPrimaryProp: portfolio.isMain || false,
                });
                
                return (
                  <ProfileCard
                    key={portfolio.portfolioId}
                    data={portfolio}
                    onViewDetail={handleViewDetail}
                    onViewPreview={handleViewPreview}
                    onEdit={handleEdit}
                    onDelete={handleDeletePortfolio}
                    isPrimary={portfolio.isMain || false}
                    onSetPrimary={handleToggleMainPortfolio}
                    onUnsetPrimary={handleToggleMainPortfolio}
                    isPublic={portfolio.isPublic || false}
                    onSetPublic={handleTogglePublicPortfolio}
                    onUnsetPublic={handleTogglePublicPortfolio}
                    portfolioCategoryLabel={orderedCategoryLabels[index] ?? "Hồ sơ xin việc"}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-500">Không có hồ sơ nào</p>
            </div>
          )}
        </main>

        <aside className="w-full lg:w-1/3 px-4 md:px-10 lg:px-6 pt-2 pb-8 shrink-0">
          <PremiumAndTips />
        </aside>
      </div>
    </div>
  );
}