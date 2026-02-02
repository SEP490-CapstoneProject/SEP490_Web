import React from 'react';
import { BlockData } from '@/services/portfolio.api';

interface CertificationBlockProps {
  data: BlockData;
}

const CertificationBlock: React.FC<CertificationBlockProps> = ({ data }) => {
  const { name, issuer, date, credentialUrl } = data.content;

  return (
    <div className="certification-block bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Certification</h3>
      <div className="space-y-2">
        <p className="text-lg font-semibold text-gray-800">{name || 'Certification Name'}</p>
        <p className="text-gray-700">{issuer || 'Issuer'}</p>
        {date && <p className="text-sm text-gray-500">{date}</p>}
        {credentialUrl && (
          <a href={credentialUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
            View Credential →
          </a>
        )}
      </div>
    </div>
  );
};

export default CertificationBlock;
