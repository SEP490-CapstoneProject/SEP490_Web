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
    <div className="experience-block bg-white px-6 py-8 border-b border-gray-200 last:border-b-0">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
          <img src={WorkingTimeIcon} alt="Kinh nghiệm" className="w-6 h-6" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Kinh nghiệm làm việc</h3>
      </div>
      {experiences.length > 0 ? (
        <div className="space-y-0">
          {experiences.map((exp: ExperienceItem, index: number) => (
            <div key={index} className="flex gap-6 pb-8 relative last:pb-0">
              {/* Timeline */}
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full border-4 border-white shadow-md"></div>
                {index !== experiences.length - 1 && (
                  <div className="w-0.5 h-24 bg-gradient-to-b from-blue-500 to-blue-200 mt-2"></div>
                )}
              </div>
              {/* Content */}
              <div className="flex-1 pb-4">
                <p className="text-blue-600 font-bold text-lg">
                  {exp.startDate && exp.endDate ? `${exp.startDate} - ${exp.endDate}` : 'N/A'}
                </p>
                <h3 className="text-xl font-bold text-gray-900 mt-2">{exp.jobName || 'Job Title'}</h3>
                <p className="text-gray-600 text-sm mt-1">{exp.address || 'Company'}</p>
                {exp.description && <p className="text-gray-700 text-sm mt-3">{exp.description}</p>}
              </div>
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
