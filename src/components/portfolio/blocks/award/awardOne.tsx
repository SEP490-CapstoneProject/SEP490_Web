import React from 'react';
import { AwardItem } from '@/services/portfolio.api';
import CupIcon from '../../../../assets/myWeb/cup 2.png';

interface AwardOneProps {
  data: AwardItem[];
}

/**
 * AwardOne - Danh hiệu & giải thưởng
 * Hiển thị các giải thưởng và danh hiệu của người dùng
 */
const AwardOne: React.FC<AwardOneProps> = ({ data }) => {
  const awards = Array.isArray(data) ? data : [];

  return (
    <div className="award-block bg-white px-6 py-8 border-b border-gray-200 last:border-b-0">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
          <img src={CupIcon} alt="Giải thưởng" className="w-6 h-6" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Danh hiệu & giải thưởng</h3>
      </div>

      {awards.length > 0 ? (
        <div className="space-y-4">
          {awards.map((award: AwardItem, index: number) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <h4 className="font-bold text-gray-900 text-lg">{award.name}</h4>
              <p className="text-blue-600 text-sm mt-1">
                {award.date}. {award.organization}
              </p>
              {award.description && (
                <p className="text-gray-600 text-sm mt-2">{award.description}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">No awards added yet</div>
      )}
    </div>
  );
};

export default AwardOne;
