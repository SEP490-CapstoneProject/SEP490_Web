import React from 'react';
import { TypicalCaseItem } from '@/services/portfolio.api';
import ListIcon from '../../../../assets/myWeb/list11 1.png';

interface TypicalCaseOneProps {
  data: TypicalCaseItem[];
}

/**
 * TypicalCaseOne - Trường hợp điển hình
 * Hiển thị các trường hợp bệnh điển hình với layout ngang
 */
const TypicalCaseOne: React.FC<TypicalCaseOneProps> = ({ data }) => {
  const cases = Array.isArray(data) ? data : [];

  return (
    <div className="typical-case-block bg-white px-6 py-8 border-b border-gray-200 last:border-b-0">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
          <img src={ListIcon} alt="Trường hợp điển hình" className="w-6 h-6" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Trường hợp điển hình</h3>
      </div>

      {cases.length > 0 ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {cases.map((caseItem: TypicalCaseItem, index: number) => (
            <div 
              key={index} 
              className="min-w-87.5 p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors shrink-0"
            >
              <h4 className="font-bold text-gray-900 text-lg">
                {caseItem.patient}, {caseItem.age} tuổi
              </h4>
              <p className="text-gray-500 text-sm mt-1">{caseItem.caseName}</p>
              
              <div className="mt-4 space-y-3">
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Tình trạng</p>
                  <p className="text-gray-700 text-sm mt-1">{caseItem.stage}</p>
                </div>
                
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Phác đồ</p>
                  <p className="text-gray-700 text-sm mt-1">{caseItem.regiment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">No typical cases added yet</div>
      )}
    </div>
  );
};

export default TypicalCaseOne;
