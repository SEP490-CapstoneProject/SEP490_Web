import React from 'react';
import { SkillItem } from '@/services/portfolio.api';
import ThunderIcon from '../../../../assets/myWeb/thunder 1.png';

interface SkillOneProps {
  data: SkillItem[];
}

/**
 * SkillOne - Kỹ năng kỹ thuật
 * Hiển thị danh sách các kỹ năng kỹ thuật của người dùng
 */
const SkillOne: React.FC<SkillOneProps> = ({ data }) => {
  const skills = Array.isArray(data) ? data : [];

  return (
    <div className="skill-block bg-white px-6 py-8 border-b border-gray-200 last:border-b-0">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
          <img src={ThunderIcon} alt="Kỹ năng" className="w-6 h-6" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Kỹ năng kỹ thuật</h3>
      </div>
      {skills.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {skills.map((skill: SkillItem, index: number) => (
            <span
              key={index}
              className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-base font-medium border border-gray-300 hover:bg-gray-200 transition-colors"
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
