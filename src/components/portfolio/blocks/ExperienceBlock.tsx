import React from 'react';
import { BlockData } from '@/services/portfolio.api';

interface ExperienceBlockProps {
  data: BlockData;
}

const ExperienceBlock: React.FC<ExperienceBlockProps> = ({ data }) => {
  const { company, position, duration, description } = data.content;

  return (
    <div className="experience-block bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Experience</h3>
      <div className="space-y-3">
        <div>
          <p className="text-lg font-semibold text-gray-800">{position || 'Position'}</p>
          <p className="text-gray-600">{company || 'Company Name'}</p>
        </div>
        {duration && <p className="text-sm text-gray-500">{duration}</p>}
        {description && <p className="text-gray-700">{description}</p>}
      </div>
    </div>
  );
};

export default ExperienceBlock;
