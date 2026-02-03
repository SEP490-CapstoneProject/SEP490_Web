import React from 'react';
import SkillOne from './skillOne';
import { SkillItem } from '@/services/portfolio.api';

interface SkillBlockProps {
  data: SkillItem[];
  variant: string;
}

const SkillBlock: React.FC<SkillBlockProps> = ({ data, variant }) => {
  switch (variant.toUpperCase()) {
    case 'SKILLONE':
      return <SkillOne data={data} />;
    default:
      return <SkillOne data={data} />;
  }
};

export default SkillBlock;
