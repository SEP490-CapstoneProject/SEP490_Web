import {
  ArrowLeft,
  Save,
  Trash2,
  Target,
  Lightbulb,
  Users,
  FileText,
  ScrollText,
  Briefcase,
  Pencil,
  X,
  Layers,
  Sparkles,
} from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BLOCK_CATALOG, getBlockInfo } from "./blockCatalog";
import VariantSelector from "./VariantSelector";
import ActivityOneEditor from "./editor/ActivityOneEditor";
import AwardEditor from "./editor/AwardEditor";
import IntroTwoEditor from "./editor/IntroTwoEditor";
import OtherFiveEditor from "./editor/OtherFiveEditor";
import OtherInfoOneEditor from "./editor/OtherInfoOneEditor";
import OtherEightEditor from "./editor/OtherEightEditor";
import OtherInfoSevenEditor from "./editor/OtherInfoSevenEditor";
import OtherInfoTwoEditor from "./editor/OtherInfoTwoEditor";
import OtherInfoSixEditor from "./editor/OtherInfoSixEditor";
import ResearchOneEditor from "./editor/ResearchOneEditor";
import ReferenceEditor from "./editor/ReferenceEditor";
import CertificateOneEditor from "@/pages/portfolio/editor/CertificateOneEditor";
import EducationOneEditor from "@/pages/portfolio/editor/EducationOneEditor";
import EducationTwoEditor from "@/pages/portfolio/editor/EducationTwoEditor";
import EducationThreeEditor from "@/pages/portfolio/editor/EducationThreeEditor";
import ExperienceOneEditor from "@/pages/portfolio/editor/ExperienceOneEditor";
import IntroOneEditor from "@/pages/portfolio/editor/IntroOneEditor";
import IntroFourEditor from "@/pages/portfolio/editor/IntroFourEditor";
import IntroFiveEditor from "@/pages/portfolio/editor/IntroFiveEditor";
import IntroThreeEditor from "@/pages/portfolio/editor/IntroThreeEditor";
import SkillOneEditor from "@/pages/portfolio/editor/SkillOneEditor";
import SkillThreeEditor from "@/pages/portfolio/editor/SkillThreeEditor";
import SkillTwoEditor from "@/pages/portfolio/editor/SkillTwoEditor";
import TeachingOneEditor from "@/pages/portfolio/editor/TeachingOneEditor";
import TypicalCaseOneEditor from "@/pages/portfolio/editor/TypicalCaseOneEditor";
import ProjectOneEditor from "./editor/ProjectOneEditor";
import ProjectTwoEditor from "./editor/ProjectTwoEditor";
import ProjectThreeEditor from "./editor/ProjectThreeEditor";
import {
  createCertificateOneDraft,
  type CertificateOneDraft,
} from "@/pages/portfolio/editor/certificateOneDraft";
import {
  createActivityOneDraft,
  type ActivityOneDraft,
} from "./editor/activityOneDraft";
import {
  createAwardOneDraft,
  type AwardOneDraft,
} from "./editor/awardOneDraft";
import {
  createOtherFiveDraft,
  type OtherFiveDraft,
} from "./editor/otherFiveDraft";
import {
  createOtherEightDraft,
  type OtherEightDraft,
} from "./editor/otherEightDraft";
import {
  createOtherInfoOneDraft,
  type OtherInfoOneDraft,
} from "./editor/otherInfoOneDraft";
import {
  createOtherInfoTwoDraft,
  type OtherInfoTwoDraft,
} from "./editor/otherInfoTwoDraft";
import {
  createOtherInfoSixDraft,
  type OtherInfoSixDraft,
} from "./editor/otherInfoSixDraft";
import {
  createOtherSevenDraft,
  type OtherSevenDraft,
} from "./editor/otherSevenDraft";
import {
  createResearchOneDraft,
  type ResearchOneDraft,
} from "./editor/researchOneDraft";
import {
  createReferenceOneDraft,
  type ReferenceOneDraft,
} from "./editor/referenceOneDraft";
import {
  createEducationOneDraft,
  type EducationOneDraft,
} from "@/pages/portfolio/editor/educationOneDraft";
import {
  createEducationTwoDraft,
  type EducationTwoDraft,
} from "@/pages/portfolio/editor/educationTwoDraft";
import {
  createEducationThreeDraft,
  createEmptyEducationThreeDraft,
  type EducationThreeDraft,
} from "@/pages/portfolio/editor/educationThreeDraft";
import {
  createExperienceOneDraft,
  type ExperienceOneDraft,
  composeExperienceOneTime
} from "@/pages/portfolio/editor/experienceOneDraft";
import {
  createIntroOneDraft,
  type IntroOneDraft,
} from "@/pages/portfolio/editor/introOneDraft";
import {
  createIntroFourDraft,
  type IntroFourDraft,
} from "@/pages/portfolio/editor/introFourDraft";
import {
  createIntroFiveDraft,
  type IntroFiveDraft,
} from "@/pages/portfolio/editor/introFiveDraft";
import {
  createIntroThreeDraft,
  type IntroThreeDraft,
} from "@/pages/portfolio/editor/introThreeDraft";
import {
  createIntroTwoDraft,
  type IntroTwoDraft,
} from "./editor/introTwoDraft";
import {
  createSkillOneDraft,
  type SkillOneDraft,
} from "@/pages/portfolio/editor/skillOneDraft";
import {
  createEmptySkillThreeDraft,
  type SkillThreeDraft,
} from "@/pages/portfolio/editor/skillThreeDraft";
import {
  createSkillTwoDraft,
  type SkillTwoDraft,
} from "@/pages/portfolio/editor/skillTwoDraft";
import {
  createEmptyTeachingOneDraft,
  type TeachingOneDraft,
} from "@/pages/portfolio/editor/teachingOneDraft";
import {
  createEmptyTypicalCaseOneDraft,
  type TypicalCaseOneDraft,
} from "@/pages/portfolio/editor/typicalCaseOneDraft";
import {
  createEmptyProjectThreeDraft,
  createProjectThreeDraft,
  type ProjectThreeDraft,
} from "./editor/projectThreeDraft";
import {
  createProjectOneDraft,
  type ProjectOneDraft,
} from "./editor/projectOneDraft";
import {
  createProjectTwoDraft,
  type ProjectTwoDraft,
} from "./editor/projectTwoDraft";
import PortfolioRenderer from "@/components/portfolio/render/PortfolioRenderer";
import { cn } from "@/lib/utils";
import { PortfolioBlock, portfolioService } from "@/services/portfolio.api";
import {
  fetchEmployeeProfile,
  type EmployeeProfile,
} from "@/services/profile.api";
import { useAppSelector } from "@/store/hook";
import { notify } from "@/lib/toast";

// ─── Types ────────────────────────────────────────────────────────────────────

type EditorTab = "template" | "component";

type EditableBlockType =
  | "INTRO"
  | "SKILL"
  | "EDUCATION"
  | "EXPERIMENT"
  | "PROJECT"
  | "AWARD"
  | "ACTIVITIES"
  | "OTHERINFO"
  | "REFERENCE"
  | "DIPLOMA";

type ExtendedEditorBlockType =
  | EditableBlockType
  | "RESEARCH"
  | "TEACHING"
  | "TYPICALCASE";

// ─── Constants ────────────────────────────────────────────────────────────────

const BLOCK_LABELS: Record<string, string> = {
  INTRO: "Giới thiệu",
  SKILL: "Kỹ năng",
  EDUCATION: "Học vấn",
  EXPERIMENT: "Kinh nghiệm",
  PROJECT: "Dự án",
  DIPLOMA: "Chứng chỉ",
  AWARD: "Giải thưởng",
  ACTIVITIES: "Hoạt động",
  OTHERINFO: "Thông tin bổ sung",
  REFERENCE: "Người tham chiếu",
  RESEARCH: "Nghiên cứu",
  TEACHING: "Giảng dạy",
  TYPICALCASE: "Ca điển hình",
};

const BLOCK_VARIANTS: Record<string, string[]> = {
  INTRO: ["INTROONE", "INTROTWO", "INTROTHREE", "INTROFOUR", "INTROFIVE"],
  SKILL: ["SKILLONE", "SKILLTWO", "SKILLTHREE"],
  EDUCATION: ["EDUCATIONONE", "EDUCATIONTWO", "EDUCATIONTHREE"],
  EXPERIMENT: ["EXPERIMENTONE"],
  PROJECT: ["PROJECTONE", "PROJECTTWO", "PROJECTTHREE"],
  DIPLOMA: ["DIPLOMAONE"],
  AWARD: ["AWARDONE"],
  ACTIVITIES: ["ACTIVITYONE", "ACTIVITYTWO"],
  OTHERINFO: [
    "OTHERONE",
    "OTHERTWO",
    "OTHERTHREE",
    "OTHERFOUR",
    "OTHERFIVE",
    "OTHERSIX",
    "OTHERSEVEN",
    "OTHEREIGHT",
  ],
  REFERENCE: ["REFERENCEONE"],
  RESEARCH: ["RESEARCHONE"],
  TEACHING: ["TEACHINGONE"],
  TYPICALCASE: ["TYPICALCASEONE"],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const normalizeBlockType = (type: string): string => {
  const upper = type.toUpperCase();
  if (upper === "EXPERIENCE") return "EXPERIMENT";
  return upper;
};

const getDefaultVariant = (type: string): string => {
  const normalizedType = normalizeBlockType(type);
  return BLOCK_VARIANTS[normalizedType]?.[0] ?? "INTROONE";
};

const sortAndReindexBlocks = (blocks: PortfolioBlock[]): PortfolioBlock[] => {
  return [...blocks]
    .sort((a, b) => a.order - b.order)
    .map((block, index) => ({ ...block, order: index + 1 }));
};

const deepClone = <T,>(value: T): T => {
  if (value === null || value === undefined) return value;
  try {
    return JSON.parse(JSON.stringify(value)) as T;
  } catch {
    return value;
  }
};

const toRecord = (value: unknown): Record<string, unknown> => {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return { ...(value as Record<string, unknown>) };
  }
  return {};
};

const toRecordArray = (value: unknown): Record<string, unknown>[] => {
  if (!Array.isArray(value)) return [];
  return value.map((item) =>
    item && typeof item === "object" && !Array.isArray(item)
      ? { ...(item as Record<string, unknown>) }
      : {},
  );
};

const toText = (value: unknown): string => {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return "";
};

const createDefaultBlockData = (type: string, variant: string): unknown => {
  const normalizedType = normalizeBlockType(type);
  const normalizedVariant = variant.toUpperCase();

  switch (normalizedType) {
    case "INTRO":
      return {
        fullName: "",
        title: "",
        description: "",
        avatar: "",
        email: "",
        phone: "",
      };
    case "SKILL":
      if (normalizedVariant === "SKILLTWO")
        return { languages: [], frameworks: [], tools: [] };
      return [];
    case "EDUCATION":
    case "EXPERIMENT":
    case "PROJECT":
    case "DIPLOMA":
    case "AWARD":
    case "ACTIVITIES":
    case "REFERENCE":
    case "RESEARCH":
    case "TEACHING":
    case "TYPICALCASE":
      return [];
    case "OTHERINFO":
      if (normalizedVariant === "OTHERONE") return [];
      if (["OTHERTWO", "OTHERTHREE", "OTHERFOUR"].includes(normalizedVariant))
        return { detail: "" };
      if (["OTHERFIVE", "OTHERSIX", "OTHERSEVEN"].includes(normalizedVariant))
        return [];
      if (normalizedVariant === "OTHEREIGHT") {
        return {
          title: "",
          licenseNumber: "",
          issuer: "",
          status: "",
          detail: "",
        };
      }
      return [];
    default:
      return {};
  }
};

const isBlockDataEmpty = (data: unknown): boolean => {
  if (data === null || data === undefined) return true;
  if (Array.isArray(data)) return data.length === 0;
  if (typeof data === "object") {
    const vals = Object.values(data as Record<string, unknown>);
    return vals.every(
      (v) =>
        v === null ||
        v === undefined ||
        v === "" ||
        (Array.isArray(v) && v.length === 0),
    );
  }
  return false;
};

const getOrderedBlockCatalog = (): typeof BLOCK_CATALOG => {
  const blockOrder: Record<string, number> = {
    INTRO: 0,
    SKILL: 1,
    EDUCATION: 2,
    EXPERIMENT: 3,
    PROJECT: 4,
    DIPLOMA: 5,
    AWARD: 6,
    ACTIVITIES: 7,
    REFERENCE: 8,
    RESEARCH: 9,
    TEACHING: 10,
    TYPICALCASE: 11,
  };
  return [...BLOCK_CATALOG].sort(
    (a, b) => (blockOrder[a.type] ?? 999) - (blockOrder[b.type] ?? 999),
  );
};

// ─── Global borderless editor styles (injected once) ─────────────────────────
//
// Any editor component rendered inside `.inline-editor-mode` will have its
// inputs/textareas/selects overridden to borderless bottom-line style so they
// blend with the portfolio content. We inject a <style> tag once at module level.
//
const INLINE_EDITOR_STYLE = `
.inline-editor-mode input[type="text"],
.inline-editor-mode input[type="email"],
.inline-editor-mode input[type="tel"],
.inline-editor-mode input[type="url"],
.inline-editor-mode input[type="number"],
.inline-editor-mode input:not([type="file"]):not([type="checkbox"]):not([type="radio"]):not([type="submit"]):not([type="button"]):not([type="date"]),
.inline-editor-mode textarea {
  background: transparent !important;
  border: none !important;
  border-bottom: 1.5px solid #cbd5e1 !important;
  border-radius: 0 !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
  outline: none !important;
  box-shadow: none !important;
  transition: border-color 0.15s;
}
.inline-editor-mode input:not([type="file"]):not([type="checkbox"]):not([type="radio"]):not([type="submit"]):not([type="button"]):not([type="date"]):focus,
.inline-editor-mode textarea:focus {
  border-bottom-color: #3b82f6 !important;
  box-shadow: none !important;
}
.inline-editor-mode select {
  background: #f8fafc !important;
  border: 1px solid #e2e8f0 !important;
  border-radius: 6px !important;
}
.inline-editor-mode input[type="date"] {
  background: #f8fafc !important;
  border: 1px solid #e2e8f0 !important;
  border-radius: 6px !important;
  padding: 4px 8px !important;
  cursor: pointer !important;
}
.inline-editor-mode .rounded-xl,
.inline-editor-mode .rounded-2xl,
.inline-editor-mode .rounded-lg {
  border-radius: 8px !important;
}
`;

let _styleInjected = false;
function injectInlineEditorStyle() {
  if (_styleInjected || typeof document === "undefined") return;
  const style = document.createElement("style");
  style.textContent = INLINE_EDITOR_STYLE;
  document.head.appendChild(style);
  _styleInjected = true;
}

// ─── Inline Edit Wrapper ──────────────────────────────────────────────────────

/**
 * Notion/Canva-style click-to-edit wrapper.
 *
 * VIEW MODE  — renders block content as-is, no chrome.
 *              On hover: dashed blue border + small pencil badge (top-right).
 *
 * EDIT MODE  — block content stays visible above.
 *              Below it: a floating edit panel (white card, subtle shadow)
 *              containing the Editor component in borderless CSS context,
 *              plus a micro-toolbar with "Hủy" and "Xóa nội dung".
 */
function InlineEditWrapper({
  blockId,
  blockType,
  isOpen,
  onToggle,
  onClear,
  children,
  editor,
}: {
  blockId: number;
  blockType: string;
  isEmpty: boolean;
  isOpen: boolean;
  onToggle: () => void;
  onClear: () => void;
  children: React.ReactNode;
  editor: React.ReactNode;
}) {
  // Inject global styles once
  useEffect(() => {
    injectInlineEditorStyle();
  }, []);

  const label = BLOCK_LABELS[normalizeBlockType(blockType)] || blockType;

  return (
    <div id={`block-${blockId}`} className="relative">
      {/* ── View layer ────────────────────────────────────────────────────── */}
      <div
        className={cn(
          "group relative rounded-xl transition-all duration-150",
          // VIEW MODE: transparent border, hover shows dashed blue ring
          !isOpen &&
            "cursor-pointer border-2 border-transparent hover:border-blue-300/60",
          // EDIT MODE: solid blue ring so user knows which block is active
          isOpen && "border-2 border-blue-400/70 rounded-xl",
          // Dashed border style injected via outline trick on hover
        )}
        style={!isOpen ? { outlineOffset: "0px" } : undefined}
        onClick={() => !isOpen && onToggle()}
      >
        {/* Dashed hover ring (pseudo-border effect via outline) */}
        {!isOpen && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-150 group-hover:opacity-100"
            style={{
              outline: "2px dashed #93c5fd",
              outlineOffset: "2px",
            }}
          />
        )}

        {/* Pencil badge — top-right on hover (view mode) */}
        {!isOpen && (
          <div className="absolute right-2 top-2 z-10 flex items-center gap-1 rounded-md bg-white/90 px-2 py-1 opacity-0 shadow-sm ring-1 ring-blue-200 backdrop-blur-sm transition-opacity duration-150 group-hover:opacity-100">
            <Pencil size={11} className="text-blue-500" />
            <span className="text-[11px] font-semibold text-blue-600">
              {label}
            </span>
          </div>
        )}

        {/* Block content */}
        {children}
      </div>

      {/* ── Edit panel (floats below, separated visually) ──────────────────── */}
      {isOpen && (
        <div
          className="mt-1.5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md"
          style={{
            boxShadow:
              "0 4px 24px 0 rgba(59,130,246,0.08), 0 1.5px 4px 0 rgba(0,0,0,0.06)",
          }}
        >
          {/* Micro-toolbar */}
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 py-2">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-blue-400" />
              <span className="text-xs font-semibold text-slate-600">
                Đang chỉnh sửa: <span className="text-blue-600">{label}</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={onClear}
                className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-semibold text-red-500 transition-colors hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 size={11} />
                Xóa nội dung
              </button>
              <div className="h-3.5 w-px bg-slate-200" />
              <button
                type="button"
                onClick={onToggle}
                className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={11} />
                Hủy
              </button>
            </div>
          </div>

          {/* Editor body — borderless CSS context */}
          <div className="inline-editor-mode px-4 py-4">{editor}</div>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CreatePortfolio() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const { user, accessToken } = useAppSelector((state) => state.auth);

  // ── State ──────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<EditorTab>(
    isEditMode ? "component" : "template",
  );
  const [employeeProfile, setEmployeeProfile] =
    useState<EmployeeProfile | null>(null);
  const [activeTemplateId] = useState<number | null>(null);
  const [allowedBlockTypes, setAllowedBlockTypes] = useState<Set<string>>(
    new Set(),
  );
  const [portfolioName, setPortfolioName] = useState("Hồ sơ mới");
  const [blocks, setBlocks] = useState<PortfolioBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasStartedEditing, setHasStartedEditing] = useState(isEditMode);

  // Track which block's inline editor is open (by block id)
  const [openEditorBlockId, setOpenEditorBlockId] = useState<number | null>(
    null,
  );

  // Reset keys per block so editors reinitialise after save
  const [blockResetKeys, setBlockResetKeys] = useState<Record<number, number>>(
    {},
  );

  const [showVariantSelector, setShowVariantSelector] = useState(false);
  const [selectedBlockTypeForVariant, setSelectedBlockTypeForVariant] =
    useState<string | null>(null);

  const nextTempBlockIdRef = useRef(-1);

  const allocateTempBlockId = (): number => {
    const id = nextTempBlockIdRef.current;
    nextTempBlockIdRef.current -= 1;
    return id;
  };

  const getUserInfo = useCallback(() => {
    if (!user) return undefined;
    return {
      fullName:
        employeeProfile?.name ||
        (user as any).fullName ||
        (user as any).name ||
        undefined,
      email: user.email,
      phone: employeeProfile?.phone || (user as any).phone || undefined,
      name: employeeProfile?.name || (user as any).name || undefined,
    };
  }, [user, employeeProfile]);

  // ── Effects ────────────────────────────────────────────────────────────────

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!user || !accessToken) return;
        const profile = await fetchEmployeeProfile(accessToken);
        setEmployeeProfile(profile);
      } catch {
        // silently ignore
      }
    };
    fetchProfile();
  }, [user, accessToken]);

  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true);
        setError(null);
        if (isEditMode && id) {
          const portfolioId = Number(id);
          if (!accessToken)
            throw new Error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
          const detail = await portfolioService.fetchPortfolioByIdAPI(
            portfolioId,
            accessToken,
          );
          if (!detail)
            throw new Error("Không tìm thấy portfolio cần chỉnh sửa.");

          const sortedBlocks = sortAndReindexBlocks(detail.blocks).map(
            (block) => ({
              ...block,
              data: deepClone(block.data),
            }),
          );

          setBlocks(sortedBlocks);
          setActiveTab("component");
          setPortfolioName(detail.portfolioName || `Portfolio ${portfolioId}`);
          return;
        }

        setBlocks([]);
        setPortfolioName("Hồ sơ mới");
        setAllowedBlockTypes(new Set());
        setHasStartedEditing(false);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Không thể khởi tạo màn tạo hồ sơ.",
        );
      } finally {
        setLoading(false);
      }
    };
    initialize();
  }, [id, isEditMode, accessToken]);

  const updateBlockDataById = useCallback(
    (blockId: number, updater: (current: unknown) => unknown) => {
      setBlocks((prev) =>
        prev.map((block) => {
          if (block.id !== blockId) return block;
          return { ...block, data: updater(deepClone(block.data)) };
        }),
      );
    },
    [],
  );

  const clearBlockData = useCallback((blockId: number) => {
    setBlocks((prev) =>
      prev.map((block) => {
        if (block.id !== blockId) return block;
        return {
          ...block,
          data: createDefaultBlockData(block.type, block.variant),
        };
      }),
    );
    setBlockResetKeys((prev) => ({
      ...prev,
      [blockId]: (prev[blockId] ?? 0) + 1,
    }));
    setOpenEditorBlockId(null);
  }, []);

  // ── addBlockFromCatalog ────────────────────────────────────────────────────

  // ── addBlockFromCatalog ────────────────────────────────────────────────────

  const addBlockFromCatalog = (type: string, forcedVariant?: string) => {
    const normalizedType = normalizeBlockType(type);
    if (
      !isEditMode &&
      activeTemplateId &&
      !allowedBlockTypes.has(normalizedType)
    ) {
      setError(
        `Loại block "${BLOCK_LABELS[normalizedType] || normalizedType}" không được hỗ trợ bởi template này.`,
      );
      return;
    }

    const variant = (
      forcedVariant?.toUpperCase() || getDefaultVariant(type)
    ).toUpperCase();

    // Check if block already exists for this slot
    const existingBlock = blocks.find(
      (b) =>
        normalizeBlockType(b.type) === normalizedType &&
        b.variant.toUpperCase() === variant,
    );

    if (existingBlock) {
      // Scroll to and open that block for editing
      setOpenEditorBlockId(existingBlock.id);

      // CHỖ CẦN SỬA 1: Xóa hoặc comment dòng setActiveTab("template") dưới đây
      // để tránh nhảy sang tab Thiết kế mẫu khi block đã tồn tại
      // setActiveTab("template");

      setTimeout(() => {
        document
          .getElementById(`block-${existingBlock.id}`)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
      return;
    }

    const newBlock: PortfolioBlock = {
      id: allocateTempBlockId(),
      type: normalizedType,
      variant,
      order: blocks.length + 1,
      data: createDefaultBlockData(type, variant),
    };

    setBlocks((prev) => sortAndReindexBlocks([...prev, newBlock]));
    setHasStartedEditing(true);

    // Open editor for new block
    setOpenEditorBlockId(newBlock.id);

    // CHỖ CẦN SỬA 2: Xóa hoặc comment dòng setActiveTab("template") dưới đây
    // để giữ nguyên sidebar ở tab "Thành phần" khi thêm block mới thành công
    // setActiveTab("template");

    setTimeout(() => {
      document
        .getElementById(`block-${newBlock.id}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 150);
  };

  // ── Save ───────────────────────────────────────────────────────────────────

  const handleSave = async () => {
    if (!user || !accessToken) {
      setError("Bạn cần đăng nhập để lưu hồ sơ.");
      navigate("/login");
      return;
    }
    if (blocks.length === 0) {
      setError("Bạn cần thêm ít nhất một block trước khi lưu.");
      return;
    }
    try {
      setSaving(true);
      setError(null);

      const portfolioData = {
        employeeId: user.employeeId || user.id,
        name: portfolioName.trim() || "Hồ sơ mới",
        blocks: sortAndReindexBlocks(blocks).map((block) => ({
          id: block.id,
          type: normalizeBlockType(block.type),
          variant: block.variant.toUpperCase(),
          order: block.order,
          data: deepClone(block.data),
        })),
      };

      if (isEditMode && id) {
        await portfolioService.updatePortfolioAPI(
          Number(id),
          portfolioData,
          accessToken,
        );
        notify.success("Hồ sơ đã được cập nhật thành công!");
      } else {
        await portfolioService.createPortfolioAPI(portfolioData, accessToken);
        notify.success("Hồ sơ đã được lưu thành công!");
      }

      portfolioService.clearPortfolioImageFiles();
      navigate("/portfolioManagement?refresh=true", { replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Không thể lưu hồ sơ.";
      setError(msg);
      notify.error(msg);
    } finally {
      setSaving(false);
    }
  };

  // ── Scroll to block from component tab ────────────────────────────────────

  const handleScrollToBlock = (block: PortfolioBlock) => {
    setActiveTab("template");
    setTimeout(() => {
      const el = document.getElementById(`block-${block.id}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        setOpenEditorBlockId(block.id);
      }
    }, 80);
  };

  // ── Template apply ─────────────────────────────────────────────────────────

  const handleVariantSelect = (variant: string) => {
    if (!selectedBlockTypeForVariant) return;
    addBlockFromCatalog(selectedBlockTypeForVariant, variant);
    setSelectedBlockTypeForVariant(null);
    setShowVariantSelector(false);
  };

  // ── Per-block inline editor renderer ──────────────────────────────────────

  const renderBlockEditor = useCallback(
    (block: PortfolioBlock) => {
      const blockType = normalizeBlockType(
        block.type,
      ) as ExtendedEditorBlockType;
      const variant = block.variant.toUpperCase();
      const rawData = block.data;
      const resetKey = blockResetKeys[block.id] ?? 0;
      const editorKey = `editor-${block.id}-${resetKey}`;

      const scopedUpdate = (updater: (current: unknown) => unknown) => {
        updateBlockDataById(block.id, updater);
      };

      const handleSaveWrapper = (updatedData: unknown) => {
        updateBlockDataById(block.id, () => updatedData);
        setBlockResetKeys((prev) => ({
          ...prev,
          [block.id]: (prev[block.id] ?? 0) + 1,
        }));
        setOpenEditorBlockId(null);
      };

      // ── INTRO ──────────────────────────────────────────────────────────
      if (blockType === "INTRO" && variant === "INTROONE") {
        const initialData = createIntroOneDraft(rawData, getUserInfo());
        return (
          <IntroOneEditor
            key={editorKey}
            initialData={initialData}
            onSave={(draft: IntroOneDraft) => {
              handleSaveWrapper({
                fullName: draft.fullName,
                name: draft.fullName,
                studyField: draft.studyField,
                email: draft.email,
                phone: draft.phone,
                description: draft.description,
                avatar: draft.avatar,
              });
            }}
            onCancel={() => setOpenEditorBlockId(null)}
          />
        );
      }

      if (blockType === "INTRO" && variant === "INTROTWO") {
        const initialData = createIntroTwoDraft(rawData, getUserInfo());
        return (
          <IntroTwoEditor
            key={editorKey}
            initialData={initialData}
            onSave={(draft: IntroTwoDraft) => {
              handleSaveWrapper({
                fullName: draft.fullName,
                name: draft.fullName,
                position: draft.position,
                title: draft.position,
                yearOfStudy: draft.yearOfStudy,
                school: draft.school,
                studyField: draft.studyField,
                email: draft.email,
                phoneNumber: draft.phoneNumber,
                phone: draft.phoneNumber,
                avatar: draft.avatar,
              });
            }}
            onCancel={() => setOpenEditorBlockId(null)}
          />
        );
      }

      if (blockType === "INTRO" && variant === "INTROTHREE") {
        const initialData = createIntroThreeDraft(rawData, getUserInfo());
        return (
          <IntroThreeEditor
            key={editorKey}
            initialData={initialData}
            onSave={(draft: IntroThreeDraft) => {
              handleSaveWrapper({
                fullName: draft.fullName,
                name: draft.fullName,
                school: draft.school,
                department: draft.department,
                studyField: draft.studyField,
                title: draft.studyField,
                gpa: draft.gpa,
                avatar: draft.avatar,
              });
            }}
            onCancel={() => setOpenEditorBlockId(null)}
          />
        );
      }

      if (blockType === "INTRO" && variant === "INTROFOUR") {
        const initialData = createIntroFourDraft(rawData, getUserInfo());
        return (
          <IntroFourEditor
            key={editorKey}
            initialData={initialData}
            onSave={(draft: IntroFourDraft) => {
              handleSaveWrapper({
                fullName: draft.fullName,
                name: draft.fullName,
                school: draft.school,
                department: draft.department,
                studyField: draft.studyField,
                title: draft.studyField,
                gpa: draft.gpa,
                avatar: draft.avatar,
              });
            }}
            onCancel={() => setOpenEditorBlockId(null)}
          />
        );
      }

      if (blockType === "INTRO" && variant === "INTROFIVE") {
        const initialData = createIntroFiveDraft(rawData, getUserInfo());
        return (
          <IntroFiveEditor
            key={editorKey}
            initialData={initialData}
            onSave={(draft: IntroFiveDraft) => {
              handleSaveWrapper({
                fullName: draft.fullName,
                name: draft.fullName,
                school: draft.school,
                department: draft.department,
                experience: draft.experience,
                avatar: draft.avatar,
                studyField: draft.studyField,
                title: draft.title,
              });
            }}
            onCancel={() => setOpenEditorBlockId(null)}
          />
        );
      }

      // ── SKILL ──────────────────────────────────────────────────────────
      if (blockType === "SKILL" && variant === "SKILLONE") {
        const initialData = createSkillOneDraft(rawData);
        return (
          <SkillOneEditor
            key={editorKey}
            initialData={initialData}
            onSave={(draft: SkillOneDraft) => {
              handleSaveWrapper(draft.skills.map((name) => ({ name })));
            }}
            onCancel={() => setOpenEditorBlockId(null)}
          />
        );
      }

      if (blockType === "SKILL" && variant === "SKILLTWO") {
        const initialData = createSkillTwoDraft(rawData);
        return (
          <SkillTwoEditor
            key={editorKey}
            initialData={initialData}
            onSave={(draft: SkillTwoDraft) => {
              handleSaveWrapper({
                languages: draft.languages,
                frameworks: draft.frameworks,
                tools: draft.tools,
              });
            }}
            onCancel={() => setOpenEditorBlockId(null)}
          />
        );
      }

      if (blockType === "SKILL" && variant === "SKILLTHREE") {
        return (
          <SkillThreeEditor
            key={editorKey}
            initialData={createEmptySkillThreeDraft()}
            onSave={(draft: SkillThreeDraft) => {
              scopedUpdate((current) => {
                const items = toRecordArray(current);
                return [
                  ...items,
                  { name: draft.name, description: draft.description },
                ];
              });
              setBlockResetKeys((prev) => ({
                ...prev,
                [block.id]: (prev[block.id] ?? 0) + 1,
              }));
            }}
            onCancel={() => setOpenEditorBlockId(null)}
          />
        );
      }

      // ── EDUCATION ──────────────────────────────────────────────────────
      if (blockType === "EDUCATION" && variant === "EDUCATIONONE") {
        const listData = Array.isArray(rawData)
          ? rawData.map((item) => createEducationOneDraft(item))
          : [];
        const initialData = createEducationOneDraft(rawData);
        return (
          <EducationOneEditor
            key={editorKey}
            initialData={initialData}
            initialList={listData}
            onSave={(draft: EducationOneDraft) => {
              scopedUpdate((current) => {
                const items = toRecordArray(current);
                return [
                  ...items,
                  {
                    schoolName: draft.schoolName,
                    school: draft.schoolName,
                    startTime: draft.startTime,
                    endTime: draft.isCurrent ? "" : draft.endTime,
                    department: draft.department,
                    major: draft.department,
                    certificate: draft.certificate,
                    description: draft.description,
                  },
                ];
              });
              setBlockResetKeys((prev) => ({
                ...prev,
                [block.id]: (prev[block.id] ?? 0) + 1,
              }));
            }}
            onSaveList={(list: EducationOneDraft[]) => {
              handleSaveWrapper(
                list.map((e) => ({
                  schoolName: e.schoolName,
                  school: e.schoolName,
                  startTime: e.startTime,
                  endTime: e.isCurrent ? "" : e.endTime,
                  department: e.department,
                  major: e.department,
                  certificate: e.certificate,
                  description: e.description,
                })),
              );
            }}
            onCancel={() => setOpenEditorBlockId(null)}
          />
        );
      }

      if (blockType === "EDUCATION" && variant === "EDUCATIONTWO") {
        const initialData = createEducationTwoDraft(rawData);
        return (
          <EducationTwoEditor
            key={editorKey}
            initialData={initialData}
            onSave={(draft: EducationTwoDraft) => {
              scopedUpdate((current) => {
                const items = toRecordArray(current);
                return [
                  ...items,
                  {
                    time: draft.time,
                    department: draft.department,
                    schoolName: draft.schoolName,
                    description: draft.description,
                  },
                ];
              });
              setBlockResetKeys((prev) => ({
                ...prev,
                [block.id]: (prev[block.id] ?? 0) + 1,
              }));
            }}
            onCancel={() => setOpenEditorBlockId(null)}
          />
        );
      }

      if (blockType === "EDUCATION" && variant === "EDUCATIONTHREE") {
        const initialData = createEducationThreeDraft(rawData);
        return (
          <EducationThreeEditor
            key={editorKey}
            initialData={createEmptyEducationThreeDraft()}
            latestData={initialData}
            onSave={(draft: EducationThreeDraft) => {
              scopedUpdate((current) => {
                const items = toRecordArray(current);
                return [
                  ...items,
                  {
                    time: draft.time,
                    gpa: draft.gpa,
                    qualified: draft.qualified,
                    description: draft.description,
                  },
                ];
              });
              setBlockResetKeys((prev) => ({
                ...prev,
                [block.id]: (prev[block.id] ?? 0) + 1,
              }));
            }}
            onCancel={() => setOpenEditorBlockId(null)}
          />
        );
      }

      // ── EXPERIMENT ─────────────────────────────────────────────────────
      if (blockType === "EXPERIMENT" && variant === "EXPERIMENTONE") {
        const listData = Array.isArray(rawData)
          ? rawData.map((item) => createExperienceOneDraft(item))
          : [];
        const initialData = createExperienceOneDraft(rawData);
        return (
          <ExperienceOneEditor
            key={editorKey}
            initialData={initialData}
            initialList={listData}
            onSave={(draft: ExperienceOneDraft) => {
              scopedUpdate((current) => {
                const items = toRecordArray(current);
                return [
                  ...items,
                  {
                    jobName: draft.jobName,
                    address: draft.address,
                    startDate: draft.startDate,
                    endDate: draft.isCurrent ? "" : draft.endDate,
                    isCurrent: draft.isCurrent,
                    time: composeExperienceOneTime(draft),
                    description: draft.description,
                  },
                ];
              });
              setBlockResetKeys((prev) => ({
                ...prev,
                [block.id]: (prev[block.id] ?? 0) + 1,
              }));
            }}
            onSaveList={(list: ExperienceOneDraft[]) => {
              handleSaveWrapper(
                list.map((e) => ({
                  jobName: e.jobName,
                  address: e.address,
                  startDate: e.startDate,
                  endDate: e.isCurrent ? "" : e.endDate,
                  isCurrent: e.isCurrent,
                  time: composeExperienceOneTime(e),
                  description: e.description,
                })),
              );
            }}
            onCancel={() => setOpenEditorBlockId(null)}
          />
        );
      }

      // ── PROJECT ────────────────────────────────────────────────────────
      if (blockType === "PROJECT" && variant === "PROJECTONE") {
        const listData = Array.isArray(rawData)
          ? rawData.map((item) => createProjectOneDraft(item))
          : [];
        const initialData = createProjectOneDraft(rawData);
        const buildProjectLinks = (p: ProjectOneDraft) =>
          [
            { type: "github", link: p.githubLink.trim() },
            { type: "figma", link: p.figmaLink.trim() },
            { type: "app", link: p.appLink.trim() },
            { type: "website", link: p.websiteLink.trim() },
          ].filter((l) => l.link.length > 0);

        return (
          <ProjectOneEditor
            key={editorKey}
            initialData={initialData}
            initialList={listData}
            onSave={(draft: ProjectOneDraft) => {
              const projectLinks = buildProjectLinks(draft);
              scopedUpdate((current) => {
                const items = toRecordArray(current);
                return [
                  ...items,
                  {
                    image: draft.image,
                    name: draft.name,
                    description: draft.description,
                    role: draft.role,
                    technology: draft.technology,
                    projectLinks,
                    links: projectLinks,
                  },
                ];
              });
              setBlockResetKeys((prev) => ({
                ...prev,
                [block.id]: (prev[block.id] ?? 0) + 1,
              }));
            }}
            onSaveList={(list: ProjectOneDraft[]) => {
              handleSaveWrapper(
                list.map((p) => {
                  const projectLinks = buildProjectLinks(p);
                  return {
                    image: p.image,
                    name: p.name,
                    description: p.description,
                    role: p.role,
                    technology: p.technology,
                    projectLinks,
                    links: projectLinks,
                  };
                }),
              );
            }}
            onCancel={() => setOpenEditorBlockId(null)}
          />
        );
      }

      if (blockType === "PROJECT" && variant === "PROJECTTWO") {
        const initialData = createProjectTwoDraft(rawData);
        return (
          <ProjectTwoEditor
            key={editorKey}
            initialData={initialData}
            onSave={(draft: ProjectTwoDraft) => {
              const normalizedLink = draft.link.trim();
              const linkItems =
                normalizedLink.length > 0 ? [{ link: normalizedLink }] : [];
              scopedUpdate((current) => {
                const items = toRecordArray(current);
                return [
                  ...items,
                  {
                    name: draft.name,
                    action: draft.action,
                    publisher: draft.publisher,
                    description: draft.description,
                    projectLinks: linkItems,
                    links: linkItems,
                  },
                ];
              });
              setBlockResetKeys((prev) => ({
                ...prev,
                [block.id]: (prev[block.id] ?? 0) + 1,
              }));
            }}
            onCancel={() => setOpenEditorBlockId(null)}
          />
        );
      }

      if (blockType === "PROJECT" && variant === "PROJECTTHREE") {
        const initialData = createProjectThreeDraft(rawData);
        return (
          <ProjectThreeEditor
            key={editorKey}
            initialData={initialData ?? createEmptyProjectThreeDraft()}
            onSave={(draft: ProjectThreeDraft) => {
              const normalizedLink = draft.link.trim();
              const linkItems =
                normalizedLink.length > 0 ? [{ link: normalizedLink }] : [];
              scopedUpdate((current) => {
                const items = toRecordArray(current);
                return [
                  ...items,
                  {
                    name: draft.name,
                    action: draft.action,
                    publisher: draft.publisher,
                    description: draft.description,
                    projectLinks: linkItems,
                    links: linkItems,
                  },
                ];
              });
              setBlockResetKeys((prev) => ({
                ...prev,
                [block.id]: (prev[block.id] ?? 0) + 1,
              }));
            }}
            onCancel={() => setOpenEditorBlockId(null)}
          />
        );
      }

      // ── AWARD ──────────────────────────────────────────────────────────
      if (blockType === "AWARD" && variant === "AWARDONE") {
        const listData = Array.isArray(rawData)
          ? rawData.map((item) => createAwardOneDraft(item))
          : [];
        const initialData = createAwardOneDraft(rawData);
        return (
          <AwardEditor
            key={editorKey}
            initialData={initialData}
            initialList={listData}
            onSave={(draft: AwardOneDraft) => {
              scopedUpdate((current) => {
                const items = toRecordArray(current);
                return [
                  ...items,
                  {
                    name: draft.name,
                    date: draft.date,
                    time: draft.date,
                    organization: draft.organization,
                    issuer: draft.organization,
                    description: draft.description,
                  },
                ];
              });
              setBlockResetKeys((prev) => ({
                ...prev,
                [block.id]: (prev[block.id] ?? 0) + 1,
              }));
            }}
            onSaveList={(list: AwardOneDraft[]) => {
              handleSaveWrapper(
                list.map((a) => ({
                  name: a.name,
                  date: a.date,
                  time: a.date,
                  organization: a.organization,
                  issuer: a.organization,
                  description: a.description,
                })),
              );
            }}
            onCancel={() => setOpenEditorBlockId(null)}
          />
        );
      }

      // ── ACTIVITIES ─────────────────────────────────────────────────────
      if (blockType === "ACTIVITIES") {
        const listData = Array.isArray(rawData)
          ? rawData.map((item) => createActivityOneDraft(item))
          : [];
        const initialData = createActivityOneDraft(rawData);
        return (
          <ActivityOneEditor
            key={editorKey}
            initialData={initialData}
            initialList={listData}
            onSave={(draft: ActivityOneDraft) => {
              scopedUpdate((current) => {
                const items = toRecordArray(current);
                return [
                  ...items,
                  {
                    name: draft.name,
                    date: draft.date,
                    time: draft.date,
                    description: draft.description,
                  },
                ];
              });
              setBlockResetKeys((prev) => ({
                ...prev,
                [block.id]: (prev[block.id] ?? 0) + 1,
              }));
            }}
            onSaveList={(list: ActivityOneDraft[]) => {
              handleSaveWrapper(
                list.map((a) => ({
                  name: a.name,
                  date: a.date,
                  time: a.date,
                  description: a.description,
                })),
              );
            }}
            onCancel={() => setOpenEditorBlockId(null)}
          />
        );
      }

      // ── OTHERINFO ──────────────────────────────────────────────────────
      if (blockType === "OTHERINFO" && variant === "OTHERONE") {
        const initialData = createOtherInfoOneDraft(rawData);
        return (
          <OtherInfoOneEditor
            key={editorKey}
            initialData={initialData}
            onSave={(draft: OtherInfoOneDraft) => {
              handleSaveWrapper(
                draft.interests.map((name) => ({ detail: name })),
              );
            }}
            onCancel={() => setOpenEditorBlockId(null)}
          />
        );
      }

      if (
        blockType === "OTHERINFO" &&
        ["OTHERTWO", "OTHERTHREE", "OTHERFOUR"].includes(variant)
      ) {
        const initialData = createOtherInfoTwoDraft(rawData);
        return (
          <OtherInfoTwoEditor
            key={editorKey}
            initialData={initialData}
            onSave={(draft: OtherInfoTwoDraft) => {
              handleSaveWrapper({ detail: draft.detail });
            }}
            onCancel={() => setOpenEditorBlockId(null)}
          />
        );
      }

      if (blockType === "OTHERINFO" && variant === "OTHERFIVE") {
        const initialData = createOtherFiveDraft(rawData);
        return (
          <OtherFiveEditor
            key={editorKey}
            initialData={initialData}
            onSave={(draft: OtherFiveDraft) => {
              handleSaveWrapper(draft.topics.map((name) => ({ name })));
            }}
            onCancel={() => setOpenEditorBlockId(null)}
          />
        );
      }

      if (blockType === "OTHERINFO" && variant === "OTHERSIX") {
        const initialData = createOtherInfoSixDraft(rawData);
        return (
          <OtherInfoSixEditor
            key={editorKey}
            initialData={initialData}
            onSave={(draft: OtherInfoSixDraft) => {
              handleSaveWrapper(draft.softSkills.map((name) => ({ name })));
            }}
            onCancel={() => setOpenEditorBlockId(null)}
          />
        );
      }

      if (blockType === "OTHERINFO" && variant === "OTHERSEVEN") {
        const initialData = createOtherSevenDraft(rawData);
        return (
          <OtherInfoSevenEditor
            key={editorKey}
            initialData={initialData}
            onSave={(draft: OtherSevenDraft) => {
              scopedUpdate((current) => {
                const items = toRecordArray(current);
                return [...items, { name: draft.name, detail: draft.detail }];
              });
              setBlockResetKeys((prev) => ({
                ...prev,
                [block.id]: (prev[block.id] ?? 0) + 1,
              }));
            }}
            onCancel={() => setOpenEditorBlockId(null)}
          />
        );
      }

      if (blockType === "OTHERINFO" && variant === "OTHEREIGHT") {
        const initialData = createOtherEightDraft(rawData);
        return (
          <OtherEightEditor
            key={editorKey}
            initialData={initialData}
            onSave={(draft: OtherEightDraft) => {
              handleSaveWrapper({ ...toRecord(rawData), detail: draft.detail });
            }}
            onCancel={() => setOpenEditorBlockId(null)}
          />
        );
      }

      // ── REFERENCE ──────────────────────────────────────────────────────
      if (blockType === "REFERENCE" && variant === "REFERENCEONE") {
        const listData = Array.isArray(rawData)
          ? rawData.map((item) => createReferenceOneDraft(item))
          : [];
        const initialData = createReferenceOneDraft(rawData);
        return (
          <ReferenceEditor
            key={editorKey}
            initialData={initialData}
            initialList={listData}
            onSave={(draft: ReferenceOneDraft) => {
              scopedUpdate((current) => {
                const items = toRecordArray(current);
                return [
                  ...items,
                  {
                    name: draft.name,
                    position: draft.position,
                    mail: draft.email,
                    email: draft.email,
                    phone: draft.contactInfo,
                    detail: draft.contactInfo,
                  },
                ];
              });
              setBlockResetKeys((prev) => ({
                ...prev,
                [block.id]: (prev[block.id] ?? 0) + 1,
              }));
            }}
            onSaveList={(list: ReferenceOneDraft[]) => {
              handleSaveWrapper(
                list.map((r) => ({
                  name: r.name,
                  position: r.position,
                  mail: r.email,
                  email: r.email,
                  phone: r.contactInfo,
                  detail: r.contactInfo,
                })),
              );
            }}
            onCancel={() => setOpenEditorBlockId(null)}
          />
        );
      }

      // ── DIPLOMA ────────────────────────────────────────────────────────
      if (blockType === "DIPLOMA" && variant === "DIPLOMAONE") {
        const listData = Array.isArray(rawData)
          ? rawData.map((item) => createCertificateOneDraft(item))
          : [];
        const initialData = createCertificateOneDraft(rawData);
        return (
          <CertificateOneEditor
            key={editorKey}
            initialData={initialData}
            initialList={listData}
            onSave={(draft: CertificateOneDraft) => {
              scopedUpdate((current) => {
                const items = toRecordArray(current);
                return [
                  ...items,
                  {
                    name: draft.name,
                    issuer: draft.issuer,
                    provider: draft.issuer,
                    year: draft.year,
                    date: draft.year,
                    link: draft.link,
                  },
                ];
              });
              setBlockResetKeys((prev) => ({
                ...prev,
                [block.id]: (prev[block.id] ?? 0) + 1,
              }));
            }}
            onSaveList={(list: CertificateOneDraft[]) => {
              handleSaveWrapper(
                list.map((c) => ({
                  name: c.name,
                  issuer: c.issuer,
                  provider: c.issuer,
                  year: c.year,
                  date: c.year,
                  link: c.link,
                })),
              );
            }}
            onCancel={() => setOpenEditorBlockId(null)}
          />
        );
      }

      // ── RESEARCH ───────────────────────────────────────────────────────
      if (blockType === "RESEARCH" && variant === "RESEARCHONE") {
        const listData = Array.isArray(rawData)
          ? rawData.map((item) => createResearchOneDraft(item))
          : [];
        const initialData = createResearchOneDraft(rawData);
        return (
          <ResearchOneEditor
            key={editorKey}
            initialData={initialData}
            initialList={listData}
            onSave={(draft: ResearchOneDraft) => {
              scopedUpdate((current) => {
                const items = toRecordArray(current);
                return [
                  ...items,
                  {
                    name: draft.title,
                    time: draft.date,
                    description: draft.conference,
                    link: draft.link,
                    conference: draft.conference,
                  },
                ];
              });
              setBlockResetKeys((prev) => ({
                ...prev,
                [block.id]: (prev[block.id] ?? 0) + 1,
              }));
            }}
            onSaveList={(list: ResearchOneDraft[]) => {
              handleSaveWrapper(
                list.map((r) => ({
                  name: r.title,
                  time: r.date,
                  description: r.conference,
                  link: r.link,
                  conference: r.conference,
                })),
              );
            }}
            onCancel={() => setOpenEditorBlockId(null)}
          />
        );
      }

      // ── TEACHING ───────────────────────────────────────────────────────
      if (blockType === "TEACHING" && variant === "TEACHINGONE") {
        const listData = Array.isArray(rawData)
          ? rawData.map((item) => {
              if (item && typeof item === "object") {
                const r = item as Record<string, unknown>;
                return {
                  subject: toText(r.subject),
                  teachingplace: toText(r.teachingplace),
                };
              }
              return createEmptyTeachingOneDraft();
            })
          : [];
        return (
          <TeachingOneEditor
            key={editorKey}
            initialData={createEmptyTeachingOneDraft()}
            initialList={listData}
            onSave={(draft: TeachingOneDraft) => {
              scopedUpdate((current) => {
                const items = toRecordArray(current);
                return [
                  ...items,
                  {
                    subject: draft.subject,
                    teachingplace: draft.teachingplace,
                  },
                ];
              });
              setBlockResetKeys((prev) => ({
                ...prev,
                [block.id]: (prev[block.id] ?? 0) + 1,
              }));
            }}
            onSaveList={(list: TeachingOneDraft[]) => {
              handleSaveWrapper(
                list.map((t) => ({
                  subject: t.subject,
                  teachingplace: t.teachingplace,
                })),
              );
            }}
            onCancel={() => setOpenEditorBlockId(null)}
          />
        );
      }

      // ── TYPICALCASE ────────────────────────────────────────────────────
      if (blockType === "TYPICALCASE" && variant === "TYPICALCASEONE") {
        const listData = Array.isArray(rawData)
          ? rawData.map((item) => {
              if (item && typeof item === "object") {
                const r = item as Record<string, unknown>;
                return {
                  patient: toText(r.patient),
                  age: toText(r.age),
                  caseName: toText(r.caseName),
                  stage: toText(r.stage),
                  regiment: toText(r.regiment),
                };
              }
              return createEmptyTypicalCaseOneDraft();
            })
          : [];
        return (
          <TypicalCaseOneEditor
            key={editorKey}
            initialData={createEmptyTypicalCaseOneDraft()}
            initialList={listData}
            onSave={(draft: TypicalCaseOneDraft) => {
              scopedUpdate((current) => {
                const items = toRecordArray(current);
                return [
                  ...items,
                  {
                    patient: draft.patient,
                    age: draft.age,
                    caseName: draft.caseName,
                    stage: draft.stage,
                    regiment: draft.regiment,
                  },
                ];
              });
              setBlockResetKeys((prev) => ({
                ...prev,
                [block.id]: (prev[block.id] ?? 0) + 1,
              }));
            }}
            onSaveList={(list: TypicalCaseOneDraft[]) => {
              handleSaveWrapper(
                list.map((c) => ({
                  patient: c.patient,
                  age: c.age,
                  caseName: c.caseName,
                  stage: c.stage,
                  regiment: c.regiment,
                })),
              );
            }}
            onCancel={() => setOpenEditorBlockId(null)}
          />
        );
      }

      return (
        <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-3 text-sm text-slate-500">
          Block này chưa có form cấu hình.
        </p>
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [blocks, blockResetKeys, getUserInfo, updateBlockDataById],
  );

  // ── Loading ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-56px)] items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          <p className="text-sm text-slate-500">Đang tải màn tạo hồ sơ...</p>
        </div>
      </div>
    );
  }

  const blockInfoForVariantSelector = selectedBlockTypeForVariant
    ? getBlockInfo(selectedBlockTypeForVariant)
    : null;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      <div className="min-h-[calc(100vh-56px)] bg-slate-100">
        {/* ── Top bar ──────────────────────────────────────────────────────── */}
        <div className="border-b border-slate-200 bg-white px-4 py-3">
          <div className="mx-auto flex w-full items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="rounded-full p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                title="Quay lại"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-lg font-bold text-slate-900">
                {isEditMode ? "Chỉnh sửa hồ sơ" : "Tạo hồ sơ"}
              </h1>
            </div>

            <div className="flex flex-1 items-center gap-2 min-w-0">
              <input
                value={portfolioName}
                onChange={(e) => setPortfolioName(e.target.value)}
                className="h-10 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700 outline-none focus:border-blue-400"
                placeholder="Tên hồ sơ"
              />
              <button
                type="button"
                disabled={saving}
                onClick={handleSave}
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70 whitespace-nowrap"
              >
                <Save size={16} />
                {saving ? "Đang lưu..." : "Lưu hồ sơ"}
              </button>
            </div>
          </div>
        </div>

        {/* ── Body ─────────────────────────────────────────────────────────── */}
        <div className="mx-auto w-full px-3 py-4">
          {error && (
            <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* 2-column layout: sidebar left + preview center */}
          <div className="grid gap-4 lg:grid-cols-[300px_minmax(0,1fr)] items-start">
            {/* ── Left sidebar ─────────────────────────────────────────────── */}
            <aside className="rounded-2xl border border-slate-200 bg-white sticky top-4">
              {/* Tab bar */}
              <div className="flex border-b border-slate-200">
                {!isEditMode && (
                  <button
                    type="button"
                    onClick={() => setActiveTab("template")}
                    className={cn(
                      "flex-1 px-3 py-2.5 text-sm font-semibold transition-colors",
                      activeTab === "template"
                        ? "bg-blue-50 text-blue-600"
                        : "text-slate-500 hover:bg-slate-50",
                    )}
                  >
                    Thiết kế mẫu
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setActiveTab("component")}
                  className={cn(
                    isEditMode ? "w-full" : "flex-1",
                    "px-3 py-2.5 text-sm font-semibold transition-colors",
                    activeTab === "component"
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-500 hover:bg-slate-50",
                  )}
                >
                  Thành phần
                </button>
              </div>

              <div
                className={cn(
                  "p-3",
                  activeTab === "component" &&
                    "max-h-[calc(100vh-160px)] overflow-y-auto",
                )}
              >
                {/* ── Template tab ─────────────────────────────────────────── */}
                {!isEditMode && activeTab === "template" && (
                  <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center">
                    <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-blue-100">
                      <Sparkles size={18} className="text-blue-500" />
                    </div>
                    <p className="text-sm font-semibold text-slate-700">
                      Các mẫu thiết kế mới
                    </p>
                    <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                      Sẽ xuất hiện trong tương lai.
                      <br />
                      Hãy theo dõi cập nhật!
                    </p>
                  </div>
                )}

                {/* ── Component tab ─────────────────────────────────────────── */}
                {activeTab === "component" && (
                  <div className="space-y-1.5">
                    {/* Header hint */}
                    <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Bấm để đến block trên preview →
                    </p>

                    {/* Existing blocks (navigate to preview) */}
                    {blocks.length > 0 && (
                      <div className="mb-3 space-y-1.5">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-blue-500">
                          Blocks trong hồ sơ ({blocks.length})
                        </p>
                        {blocks.map((block) => {
                          const blockInfo = getBlockInfo(
                            normalizeBlockType(block.type),
                          );
                          const BlockIcon = blockInfo?.icon;
                          const empty = isBlockDataEmpty(block.data);
                          return (
                            <button
                              key={block.id}
                              type="button"
                              onClick={() => handleScrollToBlock(block)}
                              className={cn(
                                "w-full rounded-xl border px-3 py-2.5 text-left transition-all flex items-center gap-2.5",
                                openEditorBlockId === block.id
                                  ? "border-blue-400 bg-blue-50"
                                  : "border-slate-200 hover:border-blue-300 hover:bg-blue-50",
                              )}
                            >
                              <div
                                className={cn(
                                  "rounded-lg p-1.5 shrink-0",
                                  empty
                                    ? "bg-slate-100 text-slate-400"
                                    : "bg-blue-100 text-blue-600",
                                )}
                              >
                                {BlockIcon ? (
                                  <BlockIcon size={14} />
                                ) : (
                                  <Layers size={14} />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-800 truncate">
                                  {blockInfo?.label ||
                                    BLOCK_LABELS[
                                      normalizeBlockType(block.type)
                                    ] ||
                                    block.type}
                                </p>
                                <p className="text-[10px] text-slate-400 truncate">
                                  {block.variant}
                                </p>
                              </div>
                              <span
                                className={cn(
                                  "shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                                  empty
                                    ? "bg-slate-100 text-slate-500"
                                    : "bg-emerald-100 text-emerald-700",
                                )}
                              >
                                {empty ? "Trống" : "Đã có"}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Divider */}
                    {blocks.length > 0 && (
                      <div className="border-t border-slate-200 my-3" />
                    )}

                    {/* Add new blocks */}
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Thêm block mới
                    </p>

                    {getOrderedBlockCatalog().map((blockItem) => {
                      const isAllowed =
                        isEditMode ||
                        !activeTemplateId ||
                        allowedBlockTypes.has(blockItem.type);
                      const BlockIcon = blockItem.icon;

                      return (
                        <div key={blockItem.type}>
                          <button
                            type="button"
                            onClick={() => {
                              if (!isAllowed) return;
                              if (blockItem.type === "OTHERINFO") {
                                addBlockFromCatalog("OTHERINFO", "OTHERONE");
                              } else {
                                setSelectedBlockTypeForVariant(blockItem.type);
                                setShowVariantSelector(true);
                              }
                            }}
                            disabled={!isAllowed}
                            className={cn(
                              "w-full rounded-xl border px-3 py-2.5 text-left transition-colors flex items-start gap-3",
                              isAllowed
                                ? "border-slate-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer"
                                : "border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed",
                            )}
                          >
                            <div className="mt-0.5 rounded-lg bg-slate-100 p-1.5 text-slate-600">
                              <BlockIcon size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-slate-800">
                                {blockItem.label}
                              </p>
                              <p className="mt-0.5 text-xs text-slate-500">
                                {blockItem.description}
                              </p>
                            </div>
                          </button>

                          {/* OTHERINFO sub-variants after REFERENCE */}
                          {blockItem.type === "REFERENCE" && (
                            <>
                              {[
                                {
                                  variant: "OTHERONE",
                                  icon: Lightbulb,
                                  color: "indigo",
                                  label: "Sở thích cá nhân",
                                  desc: "Tag các hoạt động yêu thích",
                                },
                                {
                                  variant: "OTHERTWO",
                                  icon: Briefcase,
                                  color: "blue",
                                  label: "Mục tiêu nghề nghiệp",
                                  desc: "Mục tiêu dài hạn mô tả chi tiết",
                                },
                                {
                                  variant: "OTHERTHREE",
                                  icon: Target,
                                  color: "purple",
                                  label: "Tầm nhìn và động lực",
                                  desc: "Tầm nhìn dài hạn và động lực",
                                },
                                {
                                  variant: "OTHERFIVE",
                                  icon: Lightbulb,
                                  color: "purple",
                                  label: "Lĩnh vực nghiên cứu",
                                  desc: "Các lĩnh vực chuyên môn",
                                },
                              ].map(
                                ({
                                  variant,
                                  icon: Icon,
                                  color,
                                  label,
                                  desc,
                                }) => {
                                  const otherAllowed =
                                    isEditMode ||
                                    !activeTemplateId ||
                                    allowedBlockTypes.has("OTHERINFO");
                                  return (
                                    <button
                                      key={variant}
                                      type="button"
                                      onClick={() =>
                                        otherAllowed &&
                                        addBlockFromCatalog(
                                          "OTHERINFO",
                                          variant,
                                        )
                                      }
                                      disabled={!otherAllowed}
                                      className={cn(
                                        "w-full rounded-xl border px-3 py-2.5 text-left transition-colors flex items-start gap-3",
                                        otherAllowed
                                          ? "border-slate-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer"
                                          : "border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed",
                                      )}
                                    >
                                      <div
                                        className={`mt-0.5 rounded-lg bg-${color}-100 p-1.5 text-${color}-600`}
                                      >
                                        <Icon size={16} />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-slate-800">
                                          {label}
                                        </p>
                                        <p className="mt-0.5 text-xs text-slate-500">
                                          {desc}
                                        </p>
                                      </div>
                                    </button>
                                  );
                                },
                              )}
                            </>
                          )}

                          {blockItem.type === "RESEARCH" && (
                            <>
                              {[
                                {
                                  variant: "OTHERSIX",
                                  icon: Users,
                                  color: "cyan",
                                  label: "Kỹ năng mềm",
                                  desc: "Kỹ năng giao tiếp, lãnh đạo...",
                                },
                                {
                                  variant: "OTHERSEVEN",
                                  icon: FileText,
                                  color: "cyan",
                                  label: "Tài liệu bổ sung",
                                  desc: "Link, tài liệu tham khảo...",
                                },
                              ].map(
                                ({
                                  variant,
                                  icon: Icon,
                                  color,
                                  label,
                                  desc,
                                }) => {
                                  const otherAllowed =
                                    isEditMode ||
                                    !activeTemplateId ||
                                    allowedBlockTypes.has("OTHERINFO");
                                  return (
                                    <button
                                      key={variant}
                                      type="button"
                                      onClick={() =>
                                        otherAllowed &&
                                        addBlockFromCatalog(
                                          "OTHERINFO",
                                          variant,
                                        )
                                      }
                                      disabled={!otherAllowed}
                                      className={cn(
                                        "w-full rounded-xl border px-3 py-2.5 text-left transition-colors flex items-start gap-3",
                                        otherAllowed
                                          ? "border-slate-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer"
                                          : "border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed",
                                      )}
                                    >
                                      <div
                                        className={`mt-0.5 rounded-lg bg-${color}-100 p-1.5 text-${color}-600`}
                                      >
                                        <Icon size={16} />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-slate-800">
                                          {label}
                                        </p>
                                        <p className="mt-0.5 text-xs text-slate-500">
                                          {desc}
                                        </p>
                                      </div>
                                    </button>
                                  );
                                },
                              )}
                            </>
                          )}

                          {blockItem.type === "TYPICALCASE" &&
                            (() => {
                              const otherAllowed =
                                isEditMode ||
                                !activeTemplateId ||
                                allowedBlockTypes.has("OTHERINFO");
                              return (
                                <button
                                  type="button"
                                  onClick={() =>
                                    otherAllowed &&
                                    addBlockFromCatalog(
                                      "OTHERINFO",
                                      "OTHEREIGHT",
                                    )
                                  }
                                  disabled={!otherAllowed}
                                  className={cn(
                                    "w-full rounded-xl border px-3 py-2.5 text-left transition-colors flex items-start gap-3",
                                    otherAllowed
                                      ? "border-slate-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer"
                                      : "border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed",
                                  )}
                                >
                                  <div className="mt-0.5 rounded-lg bg-orange-100 p-1.5 text-orange-600">
                                    <ScrollText size={16} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-slate-800">
                                      Giấy phép hành nghề
                                    </p>
                                    <p className="mt-0.5 text-xs text-slate-500">
                                      Số hiệu, nơi cấp, ngày cấp...
                                    </p>
                                  </div>
                                </button>
                              );
                            })()}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </aside>

            {/* ── Center preview (full width, inline editing) ──────────────── */}
            <main className="rounded-2xl border border-slate-200 bg-white">
              {/* Minimal hint bar */}
              {blocks.length > 0 && (
                <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-2">
                  <Pencil size={11} className="text-slate-400" />
                  <p className="text-[11px] text-slate-400">
                    Rê chuột và bấm vào phần muốn chỉnh sửa
                  </p>
                </div>
              )}

              <div className="p-4">
                {blocks.length === 0 ? (
                  <div className="flex min-h-[70vh] items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 text-center">
                    <div className="max-w-sm px-6">
                      {!hasStartedEditing ? (
                        <>
                          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100">
                            <Layers size={22} className="text-blue-500" />
                          </div>
                          <h2 className="text-lg font-bold text-slate-700">
                            Bắt đầu tạo hồ sơ
                          </h2>
                          <p className="mt-2 text-sm text-slate-500">
                            Chọn một template ở tab{" "}
                            <span className="font-semibold text-slate-700">
                              "Thiết kế mẫu"
                            </span>{" "}
                            hoặc thêm thành phần từ tab{" "}
                            <span className="font-semibold text-slate-700">
                              "Thành phần"
                            </span>
                          </p>
                        </>
                      ) : (
                        <>
                          <h2 className="text-lg font-bold text-slate-700">
                            Portfolio đang trống
                          </h2>
                          <p className="mt-2 text-sm text-slate-500">
                            Thêm block từ tab "Thành phần" ở bên trái để bắt
                            đầu.
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="mx-auto max-w-2xl space-y-1">
                    {blocks.map((block) => {
                      const isEmpty = isBlockDataEmpty(block.data);
                      const isOpen = openEditorBlockId === block.id;
                      const editor = renderBlockEditor(block);

                      return (
                        <InlineEditWrapper
                          key={block.id}
                          blockId={block.id}
                          blockType={block.type}
                          isEmpty={isEmpty}
                          isOpen={isOpen}
                          onToggle={() =>
                            setOpenEditorBlockId((prev) =>
                              prev === block.id ? null : block.id,
                            )
                          }
                          onClear={() => clearBlockData(block.id)}
                          editor={editor}
                        >
                          {isEmpty ? (
                            /* Empty block placeholder */
                            <div className="flex min-h-[72px] items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/60 px-4 py-4 text-center">
                              <div>
                                <p className="text-xs font-semibold text-slate-400">
                                  {BLOCK_LABELS[
                                    normalizeBlockType(block.type)
                                  ] || block.type}
                                </p>
                                <p className="mt-0.5 text-[11px] text-slate-300">
                                  Chưa có nội dung
                                </p>
                              </div>
                            </div>
                          ) : (
                            <PortfolioRenderer blocks={[block]} />
                          )}
                        </InlineEditWrapper>
                      );
                    })}
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>

      {showVariantSelector && blockInfoForVariantSelector && (
        <VariantSelector
          blockInfo={blockInfoForVariantSelector}
          onSelectVariant={handleVariantSelect}
          onClose={() => {
            setShowVariantSelector(false);
            setSelectedBlockTypeForVariant(null);
          }}
        />
      )}
    </>
  );
}
