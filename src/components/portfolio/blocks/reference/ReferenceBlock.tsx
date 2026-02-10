import React from 'react';
import ReferenceOne from './referenceOne';
import { ReferenceItem } from '@/services/portfolio.api';

interface ReferenceBlockProps {
  data: ReferenceItem[];
  variant: string;
}

const ReferenceBlock: React.FC<ReferenceBlockProps> = ({ data, variant }) => {
  switch (variant.toUpperCase()) {
    case 'REFERENCEONE':
      return <ReferenceOne data={data} />;
    default:
      return <ReferenceOne data={data} />;
  }
};

export default ReferenceBlock;
