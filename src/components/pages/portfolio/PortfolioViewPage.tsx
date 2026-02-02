import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Portfolio, mockPortfolio, mockBlockData } from '@/services/portfolio.api';
import PortfolioRenderer from '@/components/portfolio/render/PortfolioRenderer';

const PortfolioViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true);

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Mock: Fetch portfolio by ID
        // In real app, replace with actual API call
        if (!id) {
          throw new Error('Portfolio ID is required');
        }

        const portfolioId = parseInt(id, 10);

        // For demo: return mockPortfolio if ID matches
        if (portfolioId === mockPortfolio.id) {
          setPortfolio(mockPortfolio);
        } else {
          // Try to find or return mock data
          console.warn(`Portfolio ${portfolioId} not found in mock data, showing default`);
          setPortfolio(mockPortfolio);
        }

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

  // Loading state
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

  // Error state
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

  // Render portfolio
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <PortfolioRenderer portfolio={portfolio} blockDataMap={mockBlockData} />
    </div>
  );
};

export default PortfolioViewPage;
