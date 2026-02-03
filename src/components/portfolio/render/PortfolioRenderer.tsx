import React from 'react';
import BlockRenderer from './BlockRenderer';
import { PortfolioBlock } from '@/services/portfolio.api';

interface PortfolioRendererProps {
  blocks: PortfolioBlock[];
}

const PortfolioRenderer: React.FC<PortfolioRendererProps> = ({ blocks }) => {
  const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      {sortedBlocks.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </div>
  );
};

export default PortfolioRenderer;
