import React from 'react';
import { BlockData } from '@/services/portfolio.api';

interface IntroBlockProps {
  data: BlockData;
}

const IntroBlock: React.FC<IntroBlockProps> = ({ data }) => {
  const { fullName, title, bio } = data.content;

  return (
    <div className="intro-block bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-gray-900">{fullName || 'Full Name'}</h2>
        <p className="text-lg text-blue-600 font-medium">{title || 'Job Title'}</p>
        <p className="text-gray-700 leading-relaxed">{bio || 'Bio goes here'}</p>
      </div>
    </div>
  );
};

export default IntroBlock;
