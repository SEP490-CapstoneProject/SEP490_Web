import React from 'react';
import { CertificateItem } from '@/services/portfolio.api';
import { Award } from 'lucide-react';

interface CertificationOneProps {
  data: CertificateItem[];
}

const CertificationOne: React.FC<CertificationOneProps> = ({ data }) => {
  const certificates = Array.isArray(data) ? data : [];

  return (
    <div className="certification-block bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-yellow-50 rounded-lg">
          <Award size={24} className="text-yellow-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Chứng chỉ</h3>
      </div>

      {certificates.length > 0 ? (
        <div className="space-y-4">
          {certificates.map((cert: CertificateItem, index: number) => (
            <div key={index} className="pb-4 border-b border-gray-100 last:border-b-0">
              <h4 className="font-semibold text-gray-900">{cert.name}</h4>
              <div className="flex items-start justify-between mt-2">
                <div>
                  <p className="text-gray-600 text-sm">{cert.issuer}</p>
                  <p className="text-gray-500 text-xs mt-1">Năm: {cert.year}</p>
                </div>
              </div>
              {cert.link && (
                <a
                  href={cert.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm inline-block mt-3"
                >
                  Xem chứng chỉ →
                </a>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">No certificates added yet</div>
      )}
    </div>
  );
};

export default CertificationOne;
