import React, { useMemo } from "react";
import { BlockInfo } from "./blockCatalog";
import { cn } from "@/lib/utils";
import IntroOneEditor from "./editor/IntroOneEditor";
import IntroTwoEditor from "./editor/IntroTwoEditor";
import IntroThreeEditor from "./editor/IntroThreeEditor";
import IntroFourEditor from "./editor/IntroFourEditor";
import IntroFiveEditor from "./editor/IntroFiveEditor";
import SkillOneEditor from "./editor/SkillOneEditor";
import SkillTwoEditor from "./editor/SkillTwoEditor";
import SkillThreeEditor from "./editor/SkillThreeEditor";
import EducationOneEditor from "./editor/EducationOneEditor";
import EducationTwoEditor from "./editor/EducationTwoEditor";
import EducationThreeEditor from "./editor/EducationThreeEditor";
import ProjectOneEditor from "./editor/ProjectOneEditor";
import ProjectTwoEditor from "./editor/ProjectTwoEditor";
import ProjectThreeEditor from "./editor/ProjectThreeEditor";
import ExperienceOneEditor from "./editor/ExperienceOneEditor";
import AwardEditor from "./editor/AwardEditor";
import ActivityOneEditor from "./editor/ActivityOneEditor";
import CertificateOneEditor from "./editor/CertificateOneEditor";
import ReferenceEditor from "./editor/ReferenceEditor";
import ResearchOneEditor from "./editor/ResearchOneEditor";
import TeachingOneEditor from "./editor/TeachingOneEditor";
import TypicalCaseOneEditor from "./editor/TypicalCaseOneEditor";
import OtherInfoOneEditor from "./editor/OtherInfoOneEditor";
import OtherInfoTwoEditor from "./editor/OtherInfoTwoEditor";
import OtherInfoSixEditor from "./editor/OtherInfoSixEditor";
import OtherSevenEditor from "./editor/OtherInfoSevenEditor";
import OtherFiveEditor from "./editor/OtherFiveEditor";
import OtherEightEditor from "./editor/OtherEightEditor";
import OtherFourEditor from "./editor/OtherFourEditor";

// Mock data for preview
const getMockDataForVariant = (blockType: string, variant: string): unknown => {
  switch (blockType) {
    case "INTRO":
      return {
        fullName: "Nguyễn Văn A",
        title: "Full Stack Developer",
        description: "Passionate about building great products",
        avatar: "",
        email: "nguyenvana@example.com",
        phone: "+84 123 456 789",
        school: "University of Technology",
        department: "Information Technology",
        studyField: "Software Engineering",
        experience: "5 years",
        gpa: "3.8",
      };
    case "SKILL":
      if (variant === "SKILLONE") {
        return { skills: ["React", "TypeScript", "Node.js"] };
      }
      if (variant === "SKILLTWO") {
        return {
          languages: [{ name: "JavaScript" }, { name: "Python" }],
          frameworks: [{ name: "React" }, { name: "Express" }],
          tools: [{ name: "Git" }, { name: "Docker" }],
        };
      }
      if (variant === "SKILLTHREE") {
        return [];
      }
      return {};
    case "EDUCATION":
      if (variant === "EDUCATIONONE") {
        return {
          schoolName: "University of Technology",
          school: "University of Technology",
          time: "2020 - 2024",
          department: "Information Technology",
          major: "Information Technology",
          certificate: "Bachelor",
          description: "GPA: 3.8/4.0",
        };
      }
      if (variant === "EDUCATIONTWO") {
        return {
          schoolName: "University of Technology",
          department: "Information Technology",
          time: "2020 - 2024",
          description: "GPA: 3.8/4.0",
        };
      }
      if (variant === "EDUCATIONTHREE") {
        return {
          time: "2020 - 2024",
          gpa: "3.8",
          qualified: "With Merit",
          description: "Excellent academic performance",
        };
      }
      return {};
    case "EXPERIMENT":
      return {
        jobName: "Full Stack Developer",
        address: "Tech Company",
        time: "2023 - Present",
        startDate: "2023",
        endDate: "Present",
        description: "Developing web applications",
      };
    case "PROJECT":
      if (variant === "PROJECTONE") {
        return {
          name: "E-Commerce Platform",
          description: "Full stack e-commerce solution",
          role: "Lead Developer",
          technology: "React, Node.js, MongoDB",
          image: "",
          githubLink: "https://github.com/example",
          figmaLink: "",
          appLink: "",
          websiteLink: "",
        };
      }
      if (variant === "PROJECTTWO") {
        return {
          name: "Research Paper",
          action: "First Author",
          publisher: "IEEE Conference",
          description: "A novel approach to web development",
          link: "https://example.com",
        };
      }
      if (variant === "PROJECTTHREE") {
        return {
          name: "ML Project",
          action: "Lead Researcher",
          publisher: "University",
          time: "2023",
          description: "Machine learning model development",
          link: "https://example.com",
        };
      }
      return {};
    case "DIPLOMA":
      return {
        name: "AWS Certified Developer",
        issuer: "AWS",
        time: "2023",
        description: "Associate level certification",
      };
    case "AWARD":
      return {
        name: "Best Innovation Award",
        date: "2023",
        time: "2023",
        organization: "Tech Conference",
        issuer: "Tech Conference",
        description: "Won for innovative solution",
      };
    case "ACTIVITIES":
      if (variant === "ACTIVITYONE") {
        return {
          name: "Tech Meetup Organizer",
          date: "2023",
          time: "2023",
          description: "Organized monthly tech meetups",
        };
      }
      if (variant === "ACTIVITYTWO") {
        return {
          name: "Tech Meetup Organizer",
          date: "2023",
          time: "2023",
          description: "Organized monthly tech meetups for developers",
        };
      }
      return {};
    case "OTHERINFO":
      if (variant === "OTHERONE") {
        return [{ detail: "Photography" }, { detail: "Gaming" }];
      }
      if (variant === "OTHERTWO" || variant === "OTHERTHREE" || variant === "OTHERFOUR") {
        return { detail: "Sample description text about career goals and vision" };
      }
      if (variant === "OTHERFIVE" || variant === "OTHERSIX") {
        return [{ name: "Sample Item 1" }, { name: "Sample Item 2" }];
      }
      if (variant === "OTHERSEVEN") {
        return [
          { name: "Portfolio Link", link: "https://example.com" },
          { name: "GitHub Profile", link: "https://github.com/example" },
        ];
      }
      if (variant === "OTHEREIGHT") {
        return {
          title: "Medical License",
          licenseNumber: "12345",
          issuer: "Department of Health",
          status: "Active",
          detail: "Valid until 2025",
        };
      }
      return {};
    case "REFERENCE":
      return {
        name: "John Doe",
        company: "Tech Company",
        email: "john@example.com",
        phone: "+84 123 456 789",
      };
    case "RESEARCH":
      return {
        name: "Research Paper Title",
        publisher: "Journal Name",
        date: "2023",
        link: "https://example.com",
      };
    case "TEACHING":
      return {
        name: "Web Development 101",
        school: "University",
        time: "2023",
        description: "Taught full stack development",
      };
    case "TYPICALCASE":
      return {
        title: "Patient Case Study",
        situation: "Patient presentation",
        intervention: "Treatment plan",
        result: "Recovery assessment",
      };
    default:
      return {};
  }
};

interface EditorPreviewProps {
  blockType: string;
  variant: string;
  isSelected: boolean;
  onSelect: (variant: string) => void;
}

const EditorPreview: React.FC<EditorPreviewProps> = ({
  blockType,
  variant,
  isSelected,
  onSelect,
}) => {
  const mockData = useMemo(() => getMockDataForVariant(blockType, variant), [blockType, variant]);

  const renderEditorPreview = () => {
    try {
      const dummyCallbacks: {
        onSave: () => void;
        onCancel: () => void;
        onSaveList: () => void;
        onDeleteItem: () => void;
      } = {
        onSave: () => {},
        onCancel: () => {},
        onSaveList: () => {},
        onDeleteItem: () => {},
      };

      switch (`${blockType}.${variant}`) {
        case "INTRO.INTROONE":
          return <IntroOneEditor initialData={mockData as any} {...dummyCallbacks} />;
        case "INTRO.INTROTWO":
          return <IntroTwoEditor initialData={mockData as any} {...dummyCallbacks} />;
        case "INTRO.INTROTHREE":
          return <IntroThreeEditor initialData={mockData as any} {...dummyCallbacks} />;
        case "INTRO.INTROFOUR":
          return <IntroFourEditor initialData={mockData as any} {...dummyCallbacks} />;
        case "INTRO.INTROFIVE":
          return <IntroFiveEditor initialData={mockData as any} {...dummyCallbacks} />;
        case "SKILL.SKILLONE":
          return <SkillOneEditor initialData={mockData as any} {...dummyCallbacks} />;
        case "SKILL.SKILLTWO":
          return <SkillTwoEditor initialData={mockData as any} {...dummyCallbacks} />;
        case "SKILL.SKILLTHREE":
          return <SkillThreeEditor initialData={mockData as any} {...dummyCallbacks} />;
        case "EDUCATION.EDUCATIONONE":
          return <EducationOneEditor initialData={mockData as any} initialList={[]} {...dummyCallbacks} />;
        case "EDUCATION.EDUCATIONTWO":
          return <EducationTwoEditor initialData={mockData as any} {...dummyCallbacks} />;
        case "EDUCATION.EDUCATIONTHREE":
          return <EducationThreeEditor initialData={{} as any} latestData={mockData as any} {...dummyCallbacks} />;
        case "EXPERIMENT.EXPERIMENTONE":
          return <ExperienceOneEditor initialData={mockData as any}  {...dummyCallbacks} />;
        case "PROJECT.PROJECTONE":
          return <ProjectOneEditor initialData={mockData as any} initialList={[]} {...dummyCallbacks} />;
        case "PROJECT.PROJECTTWO":
          return <ProjectTwoEditor initialData={mockData as any} {...dummyCallbacks} />;
        case "PROJECT.PROJECTTHREE":
          return <ProjectThreeEditor initialData={mockData as any} {...dummyCallbacks} />;
        case "DIPLOMA.DIPLOMAONE":
          return <CertificateOneEditor initialData={mockData as any} initialList={[]} {...dummyCallbacks} />;
        case "AWARD.AWARDONE":
          return <AwardEditor initialData={mockData as any} initialList={[]} {...dummyCallbacks} />;
        case "ACTIVITIES.ACTIVITYONE":
          return <ActivityOneEditor initialData={mockData as any} initialList={[]} {...dummyCallbacks} />;
        case "REFERENCE.REFERENCEONE":
          return <ReferenceEditor initialData={mockData as any} {...dummyCallbacks} />;
        case "RESEARCH.RESEARCHONE":
          return <ResearchOneEditor initialData={mockData as any} {...dummyCallbacks} />;
        case "TEACHING.TEACHINGONE":
          return <TeachingOneEditor initialData={mockData as any} {...dummyCallbacks} />;
        case "TYPICALCASE.TYPICALCASEONE":
          return <TypicalCaseOneEditor initialData={mockData as any} {...dummyCallbacks} />;
        case "OTHERINFO.OTHERONE":
          return <OtherInfoOneEditor initialData={mockData as any} {...dummyCallbacks} />;
        case "OTHERINFO.OTHERTWO":
          return <OtherInfoTwoEditor initialData={mockData as any} {...dummyCallbacks} />;
        case "OTHERINFO.OTHERSIX":
          return <OtherInfoSixEditor initialData={mockData as any} {...dummyCallbacks} />;
        case "OTHERINFO.OTHERSEVEN":
          return <OtherSevenEditor initialData={{} as any} {...dummyCallbacks} />;
        case "OTHERINFO.OTHERFIVE":
          return <OtherFiveEditor initialData={mockData as any} {...dummyCallbacks} />;
        case "OTHERINFO.OTHEREIGHT":
          return <OtherEightEditor initialData={mockData as any} {...dummyCallbacks} />;
        case "OTHERINFO.OTHERFOUR":
          return <OtherFourEditor initialData={mockData as any} {...dummyCallbacks} />;
        default:
          return (
            <div className="p-4 text-sm text-slate-500">
              Không có preview cho {blockType}.{variant}
            </div>
          );
      }
    } catch (error) {
      console.error(`Error rendering editor preview for ${blockType}.${variant}:`, error);
      return (
        <div className="p-4">
          <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
            Lỗi hiển thị preview: {error instanceof Error ? error.message : "Unknown error"}
          </div>
        </div>
      );
    }
  };

  return (
    <button
      type="button"
      onClick={() => onSelect(variant)}
      className={cn(
        "rounded-lg border-2 overflow-hidden transition-all text-left",
        isSelected
          ? "border-blue-500 bg-blue-50 shadow-md"
          : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm"
      )}
    >
      {/* Header */}
      <div className="px-3 py-2 border-b border-slate-200 bg-slate-50">
        <p className="text-xs font-semibold text-slate-700">Preview</p>
      </div>

      {/* Editor Preview - Scaled down */}
      <div className="overflow-hidden bg-white">
        <div className="scale-[0.6] origin-top-left w-[166.67%] pointer-events-none">
          {renderEditorPreview()}
        </div>
      </div>
    </button>
  );
};

interface VariantPreviewGridProps {
  blockInfo: BlockInfo;
  selectedVariant: string | null;
  onSelectVariant: (variant: string) => void;
}

export const VariantPreviewGrid: React.FC<VariantPreviewGridProps> = ({
  blockInfo,
  selectedVariant,
  onSelectVariant,
}) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {blockInfo.variants.map((variant) => (
        <EditorPreview
          key={variant.variant}
          blockType={blockInfo.type}
          variant={variant.variant}
          isSelected={selectedVariant === variant.variant}
          onSelect={onSelectVariant}
        />
      ))}
    </div>
  );
};

export default VariantPreviewGrid;
