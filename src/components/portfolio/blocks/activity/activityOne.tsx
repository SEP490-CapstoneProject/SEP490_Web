import React from 'react';
import { ActivityItem } from '@/services/portfolio.api';
import UnityIcon from '../../../../assets/myWeb/unity 2.png';

interface ActivityOneProps {
  data: ActivityItem[];
}

/**
 * ActivityOne - Hoạt động
 * Hiển thị các hoạt động của người dùng
 */
const ActivityOne: React.FC<ActivityOneProps> = ({ data }) => {
  const activities = Array.isArray(data) ? data : [];

  return (
    <div className="activity-block bg-white px-6 py-8 border-b border-gray-200 last:border-b-0">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
          <img src={UnityIcon} alt="Hoạt động" className="w-6 h-6" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Hoạt động</h3>
      </div>

      {activities.length > 0 ? (
        <div className="space-y-4">
          {activities.map((activity: ActivityItem, index: number) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <h4 className="font-bold text-gray-900 text-lg">{activity.name}</h4>
              <p className="text-blue-600 text-sm mt-1">{activity.date}</p>
              {activity.description && (
                <p className="text-gray-600 text-sm mt-2">{activity.description}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">No activities added yet</div>
      )}
    </div>
  );
};

export default ActivityOne;
