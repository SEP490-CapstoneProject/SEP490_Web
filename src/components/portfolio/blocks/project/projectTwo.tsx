import React from 'react';
import { ProjectItem } from '@/services/portfolio.api';

interface ProjectTwoProps {
  data: ProjectItem[];
}

const ProjectTwo: React.FC<ProjectTwoProps> = ({ data }) => {
  const projects = Array.isArray(data) ? data : [];

  return (
    <div className="project-block bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Dự án nổi bật</h3>
      
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project: ProjectItem, index: number) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow flex flex-col"
            >
              {project.image && (
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-56 object-cover"
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
