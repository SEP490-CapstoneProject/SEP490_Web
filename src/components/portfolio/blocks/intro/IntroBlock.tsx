import React from 'react';
import IntroOne from './introOne';

interface IntroBlockProps {
  data: { fullName?: string; title?: string; description?: string; avatar?: string; email?: string; phone?: string };
  variant: string;
}

const IntroBlock: React.FC<IntroBlockProps> = ({ data, variant }) => {
  switch (variant.toUpperCase()) {
    case 'INTROONE':
      return <IntroOne data={data} />;
    default:
      return <IntroOne data={data} />;
  }
};

export default IntroBlock;
