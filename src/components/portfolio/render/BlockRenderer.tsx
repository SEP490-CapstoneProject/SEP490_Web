import React from 'react';
import { PortfolioBlock } from '@/services/portfolio.api';
import IntroBlock from '../blocks/intro/IntroBlock';
import SkillBlock from '../blocks/skill/SkillBlock';
import EducationBlock from '../blocks/education/EducationBlock';
import ExperienceBlock from '../blocks/experience/ExperienceBlock';
import ProjectBlock from '../blocks/project/ProjectBlock';
import CertificationBlock from '../blocks/certification/CertificationBlock';

interface BlockRendererProps {
  block: PortfolioBlock;
}

const BlockRenderer: React.FC<BlockRendererProps> = ({ block }) => {
  const { type, variant, data } = block;

  const renderBlock = () => {
    const blockType = type.toLowerCase();
    const blockVariant = variant.toUpperCase();

    switch (blockType) {
      case 'intro':
        return <IntroBlock data={data} variant={blockVariant} />;
      case 'skill':
        return <SkillBlock data={data} variant={blockVariant} />;
      case 'education':
        return <EducationBlock data={data} variant={blockVariant} />;
      case 'experience':
        return <ExperienceBlock data={data} variant={blockVariant} />;
      case 'project':
        return <ProjectBlock data={data} variant={blockVariant} />;
      case 'certificate':
        return <CertificationBlock data={data} variant={blockVariant} />;
      default:
        return (
          <div className="p-4 bg-red-100 border border-red-400 rounded">
            <p className="text-red-800">Unknown block type: {type}</p>
          </div>
        );
    }
  };

  return <div className="block-renderer">{renderBlock()}</div>;
};

export default BlockRenderer;
