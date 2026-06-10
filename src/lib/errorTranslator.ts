/**
 * Error Translator - Convert technical error messages to user-friendly messages
 * Especially for Entity Framework Core and other backend errors
 */

export interface TranslatedError {
  userMessage: string;
  technicalMessage: string;
  errorType: 'validation' | 'conflict' | 'notfound' | 'server' | 'network' | 'unknown';
  shouldRetry: boolean;
}

const ERROR_PATTERNS = [
  {
    pattern: /cannot be tracked.*same key value/i,
    userMessage: 'Bài đăng đang được cập nhật bởi người khác. Vui lòng làm mới trang và thử lại.',
    errorType: 'conflict' as const,
    shouldRetry: true,
  },
  {
    pattern: /instance.*already being tracked/i,
    userMessage: 'Dữ liệu bài đăng không đồng bộ. Vui lòng làm mới trang và thử lại.',
    errorType: 'conflict' as const,
    shouldRetry: true,
  },
  {
    pattern: /dbupdate exception.*duplicate key/i,
    userMessage: 'Bài đăng này đã tồn tại. Vui lòng kiểm tra lại dữ liệu.',
    errorType: 'validation' as const,
    shouldRetry: false,
  },
  {
    pattern: /not found|does not exist|no entity/i,
    userMessage: 'Bài đăng không tồn tại hoặc đã bị xóa.',
    errorType: 'notfound' as const,
    shouldRetry: false,
  },
  {
    pattern: /access denied|unauthorized|forbidden/i,
    userMessage: 'Bạn không có quyền cập nhật bài đăng này.',
    errorType: 'validation' as const,
    shouldRetry: false,
  },
  {
    pattern: /timeout|timed out/i,
    userMessage: 'Yêu cầu timed out. Vui lòng kiểm tra kết nối và thử lại.',
    errorType: 'network' as const,
    shouldRetry: true,
  },
  {
    pattern: /network|cannot connect|cors/i,
    userMessage: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối internet.',
    errorType: 'network' as const,
    shouldRetry: true,
  },
];

/**
 * Translate error message to user-friendly format
 * @param error - Error object or message string
 * @returns TranslatedError with user-friendly message
 */
export function translateError(error: unknown): TranslatedError {
  const technicalMessage = extractErrorMessage(error);

  // Check against known error patterns
  for (const pattern of ERROR_PATTERNS) {
    if (pattern.pattern.test(technicalMessage)) {
      return {
        userMessage: pattern.userMessage,
        technicalMessage,
        errorType: pattern.errorType,
        shouldRetry: pattern.shouldRetry,
      };
    }
  }

  // Default: Generic server error
  if (technicalMessage.toLowerCase().includes('server') || technicalMessage.length > 100) {
    return {
      userMessage: 'Có lỗi xảy ra khi cập nhật bài đăng. Vui lòng thử lại.',
      technicalMessage,
      errorType: 'server',
      shouldRetry: true,
    };
  }

  // Return the technical message as-is if it's short and seems intentional
  return {
    userMessage: technicalMessage,
    technicalMessage,
    errorType: 'unknown',
    shouldRetry: false,
  };
}

/**
 * Extract error message from various error types
 */
function extractErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  if (error && typeof error === 'object') {
    const obj = error as Record<string, unknown>;
    
    // Try common error properties
    if (typeof obj.message === 'string') return obj.message;
    if (typeof obj.error === 'string') return obj.error;
    if (typeof obj.detail === 'string') return obj.detail;
    if (typeof obj.title === 'string') return obj.title;
  }

  return 'Có lỗi không xác định xảy ra.';
}

/**
 * Check if error is likely transient and can be retried
 */
export function isRetriableError(error: unknown): boolean {
  const translated = translateError(error);
  return translated.shouldRetry;
}

/**
 * Format error for display with retry suggestion
 */
export function formatErrorForDisplay(error: unknown): string {
  const translated = translateError(error);
  let message = translated.userMessage;

  if (translated.shouldRetry) {
    message += ' (Thử lại sau vài giây hoặc làm mới trang.)';
  }

  return message;
}
