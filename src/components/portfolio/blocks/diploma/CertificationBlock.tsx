import React from 'react';
import CertificationOne from './certificationOne';
import { CertificateItem } from '@/services/portfolio.api';

interface CertificationBlockProps {
  data: CertificateItem[];
  variant: string;
}

const CertificationBlock: React.FC<CertificationBlockProps> = ({ data, variant }) => {
  switch (variant.toUpperCase()) {
    case 'CERTIFICATEONE':
      return <CertificationOne data={data} />;
    case 'DIPLOMA':
      return <CertificationOne data={data} />;
    default:
      return <CertificationOne data={data} />;
  }
};

export default CertificationBlock;
