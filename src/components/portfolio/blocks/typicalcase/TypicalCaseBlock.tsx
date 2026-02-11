import React from 'react';
import TypicalCaseOne from './typicalCaseOne';
import { TypicalCaseItem } from '@/services/portfolio.api';

interface TypicalCaseBlockProps {
  data: TypicalCaseItem[];
  variant: string;
}

const TypicalCaseBlock: React.FC<TypicalCaseBlockProps> = ({ data, variant }) => {
  switch (variant.toUpperCase()) {
    case 'TYPICALCASEONE':
      return <TypicalCaseOne data={data} />;
    default:
      return <TypicalCaseOne data={data} />;
  }
};

export default TypicalCaseBlock;
