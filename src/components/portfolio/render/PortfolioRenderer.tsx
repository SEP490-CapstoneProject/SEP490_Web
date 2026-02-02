import React, { useEffect, useState } from 'react';
import { Portfolio, BlockData, mockBlockData, portfolioService } from '@/services/portfolio.api';
import BlockRenderer from './BlockRenderer';

interface PortfolioRendererProps {
  portfolio: Portfolio;
  blockDataMap?: Record<number, BlockData>;
}

const PortfolioRenderer: React.FC<PortfolioRendererProps> = ({
  portfolio,
  blockDataMap = mockBlockData,
}) => {
  const [arrangeOrder, setArrangeOrder] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Parse arrange string (e.g., "[1, 3, 2]") to get block order
      const order = portfolioService.parseArrange(portfolio.arrange);
      if (!Array.isArray(order)) {
        throw new Error('Invalid arrange format');
      }
      setArrangeOrder(order);
      setError(null);
    } catch (err) {
      setError('Failed to parse portfolio arrangement');
      console.error('Arrange parse error:', err);
      setArrangeOrder([]);
    } finally {
      setLoading(false);
    }
  }, [portfolio.arrange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse text-gray-500">Loading portfolio...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700 font-medium">{error}</p>
      </div>
    );
  }

  if (arrangeOrder.length === 0) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-700 font-medium">No blocks configured in this portfolio</p>
      </div>
    );
  }

  return (
    <div className="portfolio-renderer max-w-4xl mx-auto">
      {/* Portfolio Header */}
      <div className="mb-8 pb-6 border-b border-gray-200">
        <h1 className="text-4xl font-bold text-gray-900">{portfolio.name}</h1>
        <div className="mt-2 flex gap-4 text-sm text-gray-600">
          <span>Portfolio #{portfolio.id}</span>
          <span className="capitalize px-2 py-1 bg-blue-100 text-blue-700 rounded">
            {portfolio.status}
          </span>
        </div>
      </div>

      {/* Render blocks in configured order */}
      <div className="space-y-6">
        {arrangeOrder.map((blockId, index) => {
          const blockData = blockDataMap[blockId];

          if (!blockData) {
            return (
              <div
                key={`block-${blockId}-${index}`}
                className="p-4 bg-gray-100 border border-gray-300 rounded-lg"
              >
                <p className="text-gray-600 text-center">
                  Block #{blockId} not found in data
                </p>
              </div>
            );
          }

          return (
            <div key={`block-${blockId}-${index}`} className="block-wrapper">
              <BlockRenderer blockData={blockData} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PortfolioRenderer;
