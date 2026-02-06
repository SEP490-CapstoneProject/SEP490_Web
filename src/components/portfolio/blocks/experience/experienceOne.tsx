import React from 'react';
import { ExperienceItem } from '@/services/portfolio.api';
import WorkingTimeIcon from '../../../../assets/myWeb/working-time 2.png';

interface ExperienceOneProps {
  data: ExperienceItem[];
}

/**
 * ExperienceOne - Kinh nghiệm làm việc
 * Hiển thị lịch sử công việc và kinh nghiệm chuyên môn của người dùng
 */
const ExperienceOne: React.FC<ExperienceOneProps> = ({ data }) => {
  const experiences = Array.isArray(data) ? data : [];

  return (
    <div className="experience-block">
      <div className="flex items-center gap-3 mb-6 px-6 pt-6">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
          <img src={WorkingTimeIcon} alt="Kinh nghiệm" className="w-6 h-6" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Kinh nghiệm làm việc</h3>
      </div>
      {experiences.length > 0 ? (
        <div className="space-y-4">
          {experiences.map((exp: ExperienceItem, index: number) => (
            <div key={index} className="pb-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 p-3 rounded-lg transition-colors">
              <h3 className="text-xl font-bold text-gray-900">{exp.jobName || 'Job Title'}</h3>
              <p className="text-gray-600 text-sm">{exp.address || 'Company'}</p>
              <p className="text-sm text-gray-500 mt-2">{exp.startDate && exp.endDate ? `${exp.startDate} - ${exp.endDate}` : 'N/A'}</p>
              {exp.description && <p className="text-gray-700 text-sm mt-3">{exp.description}</p>}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">No experience added yet</div>
      )}
    </div>
  );
};

export default ExperienceOne;
