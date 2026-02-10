import React from 'react';
import AwardOne from './awardOne';
import { AwardItem } from '@/services/portfolio.api';

interface AwardBlockProps {
  data: AwardItem[];
  variant: string;
}

const AwardBlock: React.FC<AwardBlockProps> = ({ data, variant }) => {
  switch (variant.toUpperCase()) {
    case 'AWARDONE':
      return <AwardOne data={data} />;
    default:
      return <AwardOne data={data} />;
  }
};

export default AwardBlock;
