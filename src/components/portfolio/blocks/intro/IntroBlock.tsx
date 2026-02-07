import React from 'react';
import IntroOne from './introOne';
import IntroTwo from './introTwo';
import IntroFour from './introFour';

interface IntroBlockProps {
  data: { fullName?: string; title?: string; description?: string; avatar?: string; email?: string; phone?: string };
  variant: string;
}

const IntroBlock: React.FC<IntroBlockProps> = ({ data, variant }) => {
  switch (variant.toUpperCase()) {
    case 'INTROONE':
      return <IntroOne data={data} />;
    case 'INTROTWO':
      return <IntroTwo data={data} />;
    case 'INTROFOUR':
      return <IntroFour data={data} />;
    default:
      return <IntroOne data={data} />;
  }
};

export default IntroBlock;
