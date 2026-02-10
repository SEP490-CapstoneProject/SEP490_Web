import React from 'react';
import { ReferenceItem } from '@/services/portfolio.api';
import ConnectIcon from '../../../../assets/myWeb/connect.png';

interface ReferenceOneProps {
  data: ReferenceItem[];
}

/**
 * ReferenceOne - Người giới thiệu
 * Hiển thị thông tin người giới thiệu
 */
const ReferenceOne: React.FC<ReferenceOneProps> = ({ data }) => {
  const references = Array.isArray(data) ? data : [];

  return (
    <div className="reference-block px-6 py-8 border-b border-gray-200 last:border-b-0 w-[600px] mx-auto "  style={{ backgroundColor: '#EFF6FF' }} >
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-center gap-3 mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Người giới thiệu</h3>
        </div>

        {references.length > 0 ? (
          <div className="space-y-6">
            {references.map((reference: ReferenceItem, index: number) => (
              <div key={index} className="text-center">
                <h4 className="font-bold text-gray-900 text-lg">{reference.name}</h4>
                <p className="text-gray-600 text-sm mt-1">{reference.position}</p>
                <div className="mt-3 space-y-1">
                  <a 
                    href={`mailto:${reference.mail}`} 
                    className="text-blue-600 hover:underline text-sm block"
                  >
                    {reference.mail}
                  </a>
                  <a 
                    href={`tel:${reference.phone}`} 
                    className="text-gray-700 text-sm block"
                  >
                    {reference.phone}
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">No references added yet</div>
        )}
      </div>
    </div>
  );
};

export default ReferenceOne;
