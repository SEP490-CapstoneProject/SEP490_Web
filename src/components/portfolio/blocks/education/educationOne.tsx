import React from 'react';
import { EducationItem } from '@/services/portfolio.api';
import { BookOpen } from 'lucide-react';

interface EducationOneProps {
  data: EducationItem[];
}

const EducationOne: React.FC<EducationOneProps> = ({ data }) => {
  const educations = Array.isArray(data) ? data : [];

  return (
    <div className="education-block bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 rounded-lg">
          <BookOpen size={24} className="text-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Học vấn</h3>
      </div>

      {educations.length > 0 ? (
        <div className="space-y-4">
          {educations.map((edu: EducationItem, index: number) => (
            <div key={index} className="pb-4 border-b border-gray-100 last:border-b-0">
              <h4 className="font-semibold text-gray-900 text-lg">{edu.school}</h4>
              <p className="text-blue-600 font-medium text-sm mt-1">{edu.major}</p>
              <p className="text-gray-500 text-sm mt-1">{edu.time}</p>
              {edu.description && (
                <p className="text-gray-600 text-sm mt-3">{edu.description}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">No education added yet</div>
      )}
    </div>
  );
};

export default EducationOne;
