export type EducationOneDraft = {
  schoolName: string;
  startTime: string;      // ví dụ: "2021-09"
  endTime: string;        // ví dụ: "2025-06" hoặc rỗng nếu đang học
  isCurrent?: boolean;    // true nếu đang học
  department: string;
  certificate: string;
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

const toBoolean = (value: unknown): boolean => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    return value.toLowerCase() === "true" || value === "1" || value === "yes";
  }
  return false;
};

const getEducationSource = (value: unknown): Record<string, unknown> => {
  if (Array.isArray(value)) {
    const firstItem = toRecordArray(value)[0];
    return firstItem ?? {};
  }
  return toRecord(value);
};

export const createEducationOneDraft = (value: unknown): EducationOneDraft => {
  const source = getEducationSource(value);

  // Hỗ trợ dữ liệu cũ (có trường `time`)
  const oldTime = toText(source.time);

  return {
    schoolName: toText(source.schoolName ?? source.school),
    startTime: toText(source.startTime) || (oldTime ? oldTime.split(" - ")[0] : ""),
    endTime: toText(source.endTime) || (oldTime ? oldTime.split(" - ")[1] : ""),
    isCurrent: toBoolean(source.isCurrent ?? source.current ?? false),
    department: toText(source.department ?? source.major),
    certificate: toText(source.certificate),
    description: toText(source.description),
  };
};