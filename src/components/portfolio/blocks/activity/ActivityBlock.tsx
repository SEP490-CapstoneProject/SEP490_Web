import React from 'react';
import ActivityOne from './activityOne';
import { ActivityItem } from '@/services/portfolio.api';

interface ActivityBlockProps {
  data: ActivityItem[];
  variant: string;
}

const ActivityBlock: React.FC<ActivityBlockProps> = ({ data, variant }) => {
  switch (variant.toUpperCase()) {
    case 'ACTIVITYONE':
      return <ActivityOne data={data} />;
    default:
      return <ActivityOne data={data} />;
  }
};

export default ActivityBlock;
