import React from 'react';
import { BlockData } from '@/services/portfolio.api';
import IntroBlock from '../blocks/IntroBlock';
import SkillBlock from '../blocks/SkillBlock';
import EducationBlock from '../blocks/EducationBlock';
import ExperienceBlock from '../blocks/ExperienceBlock';
import ProjectBlock from '../blocks/ProjectBlock';
import CertificationBlock from '../blocks/CertificationBlock';

interface BlockRendererProps {
  blockData: BlockData;
}

const BlockRenderer: React.FC<BlockRendererProps> = ({ blockData }) => {
  const renderBlock = () => {
    switch (blockData.type.toLowerCase()) {
      case 'intro':
        return <IntroBlock data={blockData} />;
      case 'skill':
        return <SkillBlock data={blockData} />;
      case 'education':
        return <EducationBlock data={blockData} />;
      case 'experience':
        return <ExperienceBlock data={blockData} />;
      case 'project':
        return <ProjectBlock data={blockData} />;
      case 'certification':
        return <CertificationBlock data={blockData} />;
      default:
        return (
          <div className="p-4 bg-red-100 border border-red-400 rounded">
            <p className="text-red-800">Unknown block type: {blockData.type}</p>
          </div>
        );
    }
  };

  return <div className="block-renderer">{renderBlock()}</div>;
};

export default BlockRenderer;
