import React from 'react';
import { BlockData } from '@/services/portfolio.api';

interface SkillBlockProps {
  data: BlockData;
}

const SkillBlock: React.FC<SkillBlockProps> = ({ data }) => {
  const { skills = [] } = data.content;

  return (
    <div className="skill-block bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Skills</h3>
      <div className="flex flex-wrap gap-2">
        {Array.isArray(skills) && skills.length > 0 ? (
          skills.map((skill: string, index: number) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
            >
              {skill}
            </span>
          ))
        ) : (
          <p className="text-gray-500">No skills added yet</p>
        )}
      </div>
    </div>
  );
};

export default SkillBlock;
