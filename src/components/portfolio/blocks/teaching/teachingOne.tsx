import React from 'react';
import { TeachingItem } from '@/services/portfolio.api';
import SchoolIcon from '../../../../assets/myWeb/school 1.png';

interface TeachingOneProps {
  data: TeachingItem[];
}

/**
 * TeachingOne - Kinh nghiệm giảng dạy
 * Hiển thị thông tin về các môn học và nơi giảng dạy
 */
const TeachingOne: React.FC<TeachingOneProps> = ({ data }) => {
  const teachings = Array.isArray(data) ? data : [];

  return (
    <div className="teaching-block bg-white px-6 py-8 border-b border-gray-200 last:border-b-0">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
          <img src={SchoolIcon} alt="Giảng dạy" className="w-6 h-6" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Giảng dạy</h3>
      </div>

      {teachings.length > 0 ? (
        <div className="space-y-4">
          {teachings.map((teaching: TeachingItem, index: number) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <h4 className="font-semibold text-gray-900 text-lg">{teaching.subject}</h4>
              <p className="font-medium text-sm mt-2 text-gray-500" >{teaching.teachingplace}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">No teaching experience added yet</div>
      )}
    </div>
  );
};

export default TeachingOne;
