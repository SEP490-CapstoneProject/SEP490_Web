import React from 'react';
import OtherInfoOne from './otherInfoOne';
import { OtherInfoItem } from '@/services/portfolio.api';

interface OtherInfoBlockProps {
  data: OtherInfoItem[];
  variant: string;
}

const OtherInfoBlock: React.FC<OtherInfoBlockProps> = ({ data, variant }) => {
  switch (variant.toUpperCase()) {
    case 'OTHERONE':
      return <OtherInfoOne data={data} />;
    default:
      return <OtherInfoOne data={data} />;
  }
};

export default OtherInfoBlock;
