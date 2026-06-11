import React from 'react';
import { EducationItem } from '@/services/portfolio.api';
import GraduationIcon from '../../../../assets/myWeb/graduation-cap-1 1.png';

// Mở rộng kiểu dữ liệu tạm thời phòng trường hợp API trả về isCurrent dạng string hoặc boolean
interface ExtendedEducationItem extends EducationItem {
  isCurrent?: boolean | string;
}

interface EducationOneProps {
  data: ExtendedEducationItem[];
}

/**
 * EducationOne - Học vấn
 * Hiển thị quá trình học tập và bằng cấp của người dùng
 */
const EducationOne: React.FC<EducationOneProps> = ({ data }) => {
  const educations = Array.isArray(data) ? data : [];

  // Hàm helper xử lý chuỗi hiển thị thời gian (ví dụ: "2021-09 - Hiện tại" hoặc "2021-09 - 2025-06")
  const formatEducationTime = (edu: ExtendedEducationItem): string => {
    const start = edu.startTime ? edu.startTime.trim() : '';
    const end = edu.endTime ? edu.endTime.trim() : '';
    
    // Ép kiểu isCurrent về boolean chuẩn
    const isCurrent = edu.isCurrent === true || edu.isCurrent === 'true' || edu.isCurrent === '1';

    if (isCurrent || (!end && start)) {
      return `${start} - Hiện tại`;
    }
    if (start && end) {
      return `${start} - ${end}`;
    }
    return start || end || 'N/A';
  };

  return (
    <div className="education-block bg-white px-6 py-8 border-b border-gray-200 last:border-b-0">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
          <img src={GraduationIcon} alt="Học vấn" className="w-6 h-6" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Học vấn</h3>
      </div>

      {educations.length > 0 ? (
        <div className="space-y-4">
          {educations.map((edu: ExtendedEducationItem, index: number) => {
            const school = edu.school ?? edu.schoolName ?? 'N/A';
            const major = edu.major ?? edu.department ?? 'N/A';

            return (
              <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg">{school}</h4>
                    <p className="text-blue-600 font-medium text-sm mt-0.5">{major}</p>
                  </div>
                  {/* Gộp dòng thời gian lại thành một chuỗi duy nhất */}
                  <span className="text-gray-500 text-xs font-medium whitespace-nowrap bg-gray-200/60 px-2 py-1 rounded self-start sm:self-auto">
                    {formatEducationTime(edu)}
                  </span>
                </div>

                {edu.description && (
                  <p className="text-gray-600 text-sm mt-3 leading-relaxed border-t border-gray-200/60 pt-2">
                    {edu.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">No education added yet</div>
      )}
    </div>
  );
};

export default EducationOne;