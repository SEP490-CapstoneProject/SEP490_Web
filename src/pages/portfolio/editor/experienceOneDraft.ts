export type ExperienceOneDraft = {
  jobName: string;
  address: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
};

const toRecord = (value: unknown): Record<string, unknown> => {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return { ...(value as Record<string, unknown>) };
  }
  return {};
};

const toRecordArray = (value: unknown): Record<string, unknown>[] => {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.map((item) => toRecord(item));
};

const toText = (value: unknown): string => {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return "";
};

const getExperienceSource = (value: unknown): Record<string, unknown> => {
  if (Array.isArray(value)) {
    const firstItem = toRecordArray(value)[0];
    return firstItem ?? {};
  }
  return toRecord(value);
};

const CURRENT_LABEL = "Hiện tại";

/**
 * Tách chuỗi "time" cũ (vd "2021 - 2023" hoặc "2021 - Hiện tại")
 * thành startTime/endTime/isCurrent để hỗ trợ data cũ.
 */
const splitLegacyTime = (timeValue: string): {
  startTime: string;
  endTime: string;
  isCurrent: boolean;
} => {
  const normalized = timeValue.trim();
  if (!normalized) {
    return { startTime: "", endTime: "", isCurrent: false };
  }

  const parts = normalized.split(/\s*[-–—]\s*/).filter((item) => item.length > 0);

  if (parts.length >= 2) {
    const end = parts.slice(1).join(" - ");
    const isCurrent = end.toLowerCase() === CURRENT_LABEL.toLowerCase();
    return { startTime: parts[0], endTime: isCurrent ? "" : end, isCurrent };
  }

  return { startTime: normalized, endTime: "", isCurrent: false };
};

export const createExperienceOneDraft = (value: unknown): ExperienceOneDraft => {
  const source = getExperienceSource(value);

  // Data mới: đã có sẵn startTime/endTime/isCurrent
  if ("startTime" in source || "isCurrent" in source) {
    return {
      jobName: toText(source.jobName),
      address: toText(source.address),
      startDate: toText(source.startDate),
      endDate: toText(source.endDate),
      isCurrent: Boolean(source.isCurrent),
      description: toText(source.description),
    };
  }

  // Data cũ: chỉ có "time" dạng chuỗi -> tách ra
  const legacy = splitLegacyTime(toText(source.time));

  return {
    jobName: toText(source.jobName),
    address: toText(source.address),
    startDate: legacy.startTime,
    endDate: legacy.endTime,
    isCurrent: legacy.isCurrent,
    description: toText(source.description),
  };
};

/**
 * Ghép startDate/endDate/isCurrent thành chuỗi "time" để lưu xuống json
 * (giữ tương thích với PortfolioRenderer đang đọc field "time").
 */
export const composeExperienceOneTime = (draft: ExperienceOneDraft): string => {
  if (draft.isCurrent) {
    return draft.startDate ? `${draft.startDate} - ${CURRENT_LABEL}` : CURRENT_LABEL;
  }
  if (draft.endDate) {
    return draft.startDate ? `${draft.startDate} - ${draft.endDate}` : draft.endDate;
  }
  return draft.startDate;
};