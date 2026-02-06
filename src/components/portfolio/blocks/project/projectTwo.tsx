import React from 'react';
import { ProjectItem } from '@/services/portfolio.api';
import StartupIcon from '../../../../assets/myWeb/start-up 2.png';

interface ProjectTwoProps {
  data: ProjectItem[];
}

/**
 * ProjectTwo - Dự án nổi bật (Biến thể 2)
 * Hiển thị các dự án với layout compakt hơn
 */
const ProjectTwo: React.FC<ProjectTwoProps> = ({ data }) => {
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
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow flex flex-col"
            >
              {project.image && (
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-40 object-cover"
                />
              )}
              <div className="p-4 flex flex-col flex-1">
                <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {project.name}
                </h4>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-1">
                  {project.description}
                </p>

                <div className="space-y-2 mb-4">
                  {project.role && (
                    <p className="text-xs text-gray-700">
                      <strong>Vai trò:</strong> {project.role}
                    </p>
                  )}
                  {project.technology && (
                    <p className="text-xs text-gray-700">
                      <strong>Công nghệ:</strong> {project.technology}
                    </p>
                  )}
                </div>

                {project.projectLinks && Array.isArray(project.projectLinks) && project.projectLinks.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.projectLinks.map((link: { type: string; link: string }, idx: number) => (
                      <a
                        key={idx}
                        href={link.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs px-2 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded border border-blue-200 transition-colors"
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
        <div className="text-center py-8 text-gray-500">Không có dự án nào</div>
      )}
    </div>
  );
};

export default ProjectTwo;
