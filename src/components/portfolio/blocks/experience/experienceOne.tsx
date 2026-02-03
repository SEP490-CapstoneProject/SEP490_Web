import React from 'react';
import { ExperienceItem } from '@/services/portfolio.api';

interface ExperienceOneProps {
  data: ExperienceItem[];
}

const ExperienceOne: React.FC<ExperienceOneProps> = ({ data }) => {
  const experiences = Array.isArray(data) ? data : [];

  return (
    <div className="experience-block space-y-4">
      {experiences.length > 0 ? (
        experiences.map((exp: ExperienceItem, index: number) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-gray-900">{exp.jobName || 'Job Title'}</h3>
            <p className="text-gray-600 text-sm">{exp.address || 'Company'}</p>
            <p className="text-sm text-gray-500 mt-2">{exp.startDate && exp.endDate ? `${exp.startDate} - ${exp.endDate}` : 'N/A'}</p>
            {exp.description && <p className="text-gray-700 text-sm mt-3">{exp.description}</p>}
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-gray-500">No experience added yet</div>
      )}
    </div>
  );
};

export default ExperienceOne;
