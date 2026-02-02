import React from 'react';
import { BlockData } from '@/services/portfolio.api';

interface EducationBlockProps {
  data: BlockData;
}

const EducationBlock: React.FC<EducationBlockProps> = ({ data }) => {
  const { school, degree, year } = data.content;

  return (
    <div className="education-block bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Education</h3>
      <div className="space-y-2">
        <p className="text-lg font-semibold text-gray-800">{degree || 'Degree Name'}</p>
        <p className="text-gray-700">{school || 'School/University'}</p>
        {year && <p className="text-sm text-gray-500">{year}</p>}
      </div>
    </div>
  );
};

export default EducationBlock;
