import React from 'react';
import { SkillItem } from '@/services/portfolio.api';

interface SkillOneProps {
  data: SkillItem[];
}

const SkillOne: React.FC<SkillOneProps> = ({ data }) => {
  const skills = Array.isArray(data) ? data : [];

  return (
    <div className="skill-block bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Kỹ năng kỹ thuật</h3>
      {skills.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {skills.map((skill: SkillItem, index: number) => (
            <span
              key={index}
              className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-full text-sm font-medium border border-gray-300 hover:bg-gray-200 transition-colors"
            >
              {skill.name}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No skills added yet</p>
      )}
    </div>
  );
};

export default SkillOne;
