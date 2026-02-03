import React from 'react';
import ExperienceOne from './experienceOne';
import { ExperienceItem } from '@/services/portfolio.api';

interface ExperienceBlockProps {
  data: ExperienceItem[];
  variant: string;
}

const ExperienceBlock: React.FC<ExperienceBlockProps> = ({ data, variant }) => {
  switch (variant.toUpperCase()) {
    case 'EXPERIENCEONE':
      return <ExperienceOne data={data} />;
    default:
      return <ExperienceOne data={data} />;
  }
};

export default ExperienceBlock;
