import React from 'react';
import { ProjectItem } from '@/services/portfolio.api';
import StartupIcon from '../../../../assets/myWeb/start-up 2.png';

interface ProjectOneProps {
  data: ProjectItem[];
}

/**
 * ProjectOne - Dự án nổi bật
 * Hiển thị các dự án quan trọng của người dùng
 */
const ProjectOne: React.FC<ProjectOneProps> = ({ data }) => {
  const projects = Array.isArray(data) ? data : [];

  return (
    <div className="project-block bg-white px-6 py-8 border-b border-gray-200 last:border-b-0">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
          <img src={StartupIcon} alt="Dự án" className="w-6 h-6" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Dự án nổi bật</h3>
      </div>
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project: ProjectItem, index: number) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
              {project.image && (
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-40 object-cover"
                />
              )}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{project.name || 'Project'}</h3>
                <p className="text-gray-700 text-sm mb-3 flex-1">{project.description || 'N/A'}</p>
                <div className="space-y-1 mb-4">
                  {project.technology && <p className="text-gray-600 text-sm"><strong>Tech:</strong> {project.technology}</p>}
                  {project.role && <p className="text-gray-600 text-sm"><strong>Role:</strong> {project.role}</p>}
                </div>
                {project.projectLinks && Array.isArray(project.projectLinks) && project.projectLinks.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.projectLinks.map((link: { type: string; link: string }, idx: number) => (
                      <a
                        key={idx}
                        href={link.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        {link.type}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">No projects added yet</div>
      )}
    </div>
  );
};

export default ProjectOne;
