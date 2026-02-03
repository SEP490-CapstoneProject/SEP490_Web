import React from 'react';
import EducationOne from './educationOne';
import { EducationItem } from '@/services/portfolio.api';

interface EducationBlockProps {
  data: EducationItem[];
  variant: string;
}

const EducationBlock: React.FC<EducationBlockProps> = ({ data, variant }) => {
  switch (variant.toUpperCase()) {
    case 'EDUCATIONONE':
      return <EducationOne data={data} />;
    default:
      return <EducationOne data={data} />;
  }
};

export default EducationBlock;
