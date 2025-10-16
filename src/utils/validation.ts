export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
] as const;

export type AllowedImageType = (typeof ALLOWED_IMAGE_TYPES)[number];

export function validateFileSize(
  size: number,
  maxSize: number = MAX_FILE_SIZE
): boolean {
  return size <= maxSize;
}

export function validateFileType(
  mimeType: string,
  allowedTypes: readonly string[] = ALLOWED_IMAGE_TYPES
): boolean {
  return allowedTypes.includes(mimeType);
}

export function validateImageFile(file: { size: number; type: string }): {
  isValid: boolean;
  error?: string;
} {
  if (!validateFileSize(file.size)) {
    return {
      isValid: false,
      error: `File size must be less than ${Math.round(MAX_FILE_SIZE / 1024 / 1024)}MB`,
    };
  }

  if (!validateFileType(file.type)) {
    return {
      isValid: false,
      error: `File type must be one of: ${ALLOWED_IMAGE_TYPES.join(", ")}`,
    };
  }

  return { isValid: true };
}

export function validateDecodedFileSize(
  decodedSize: number,
  reportedSize: number
): { isValid: boolean; error?: string } {
  if (Math.abs(decodedSize - reportedSize) > 100) {
    return {
      isValid: false,
      error: "File size mismatch between reported and actual size",
    };
  }

  return { isValid: true };
}
