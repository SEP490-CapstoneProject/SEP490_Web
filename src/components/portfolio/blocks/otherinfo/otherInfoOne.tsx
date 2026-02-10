import React from 'react';
import { OtherInfoItem } from '@/services/portfolio.api';

interface OtherInfoOneProps {
  data: OtherInfoItem[];
}

/**
 * OtherInfoOne - Sở thích cá nhân
 * Hiển thị các sở thích và hoạt động cá nhân của người dùng
 */
const OtherInfoOne: React.FC<OtherInfoOneProps> = ({ data }) => {
  const otherInfo = Array.isArray(data) ? data : [];

  return (
    <div className="otherinfo-block bg-white px-6 py-8 border-b border-gray-200 last:border-b-0 ">
      <div className="flex items-center gap-3 mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Sở thích cá nhân</h3>
      </div>

      {otherInfo.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {otherInfo.map((info: OtherInfoItem, index: number) => (
            <span
              key={index}
              className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-base font-medium border border-gray-300 hover:bg-gray-200 transition-colors"
            >
              {info.detail}
            </span>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">No interests added yet</div>
      )}
    </div>
  );
};

export default OtherInfoOne;
