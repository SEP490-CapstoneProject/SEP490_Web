import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import shareIcon from '@/assets/myWeb/share1.png';
import { PortfolioResponse, portfolioService } from '@/services/portfolio.api';
import PortfolioRenderer from '@/components/portfolio/render/PortfolioRenderer';
import PremiumAndTips from '@/components/common/PremiumAndTips';

const PortfolioViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState<PortfolioResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true);

        if (!id) {
          throw new Error('Portfolio ID is required');
        }

        const data = await portfolioService.fetchPortfolioById();
        setPortfolio(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load portfolio');
        console.error('Portfolio fetch error:', err);
        setPortfolio(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [id]);

  const handleShare = () => {
    // Placeholder for share functionality
    console.log('Share portfolio');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="max-w-md w-full">
          <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
            <h2 className="text-lg font-bold text-red-900 mb-2">Error Loading Portfolio</h2>
            <p className="text-red-700">{error || 'Portfolio not found'}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-full px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="appearance-none border-none bg-transparent p-0 text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
            title="Quay về"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Hồ sơ cá nhân</h1>
          <button
            onClick={handleShare}
            className="appearance-none border-none bg-transparent p-0 text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
            title="Chia sẻ"
          >
            <img src={shareIcon} alt="Share" className="w-6 h-6 brightness-0" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto flex min-h-screen">
        <main className="w-2/3 pr-4 py-8">
          <div className="max-w-2xl">
            <PortfolioRenderer blocks={portfolio.blocks} />
          </div>
        </main>
        
        {/* Premium and Tips Section */}
        <PremiumAndTips />
      </div>
    </div>
  );
};

export default PortfolioViewPage;
