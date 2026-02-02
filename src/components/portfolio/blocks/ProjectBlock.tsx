import React from 'react';
import { BlockData } from '@/services/portfolio.api';

interface ProjectBlockProps {
  data: BlockData;
}

const ProjectBlock: React.FC<ProjectBlockProps> = ({ data }) => {
  const { title, description, technologies, link } = data.content;

  return (
    <div className="project-block bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title || 'Project Title'}</h3>
      <p className="text-gray-700 mb-4">{description || 'Project description goes here'}</p>
      {Array.isArray(technologies) && technologies.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {technologies.map((tech: string, index: number) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
              {tech}
            </span>
          ))}
        </div>
      )}
      {link && (
        <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
          View Project →
        </a>
      )}
    </div>
  );
};

export default ProjectBlock;
