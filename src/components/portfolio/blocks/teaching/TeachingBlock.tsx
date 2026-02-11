import React from 'react';
import TeachingOne from './teachingOne';
import { TeachingItem } from '@/services/portfolio.api';

interface TeachingBlockProps {
  data: TeachingItem[];
  variant: string;
}

const TeachingBlock: React.FC<TeachingBlockProps> = ({ data, variant }) => {
  switch (variant.toUpperCase()) {
    case 'TEACHINGONE':
      return <TeachingOne data={data} />;
    default:
      return <TeachingOne data={data} />;
  }
};

export default TeachingBlock;
