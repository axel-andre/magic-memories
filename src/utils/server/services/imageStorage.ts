"server-only";
import { env } from "cloudflare:workers";
import { FileUploadError } from "~/utils/errors";
import { logError, logInfo } from "~/utils/logger";

class ImageStorage {
  constructor(private readonly bucket: R2Bucket) {}

  async store(
    file: Uint8Array,
    fileName: string,
    httpMetadata: R2HTTPMetadata,
    customMetadata: Record<string, string>
  ) {
    const maxRetries = 3;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        logInfo("Attempting to store image", {
          fileName,
          attempt,
          fileSize: file.length,
          contentType: httpMetadata.contentType,
        });

        const result = await this.bucket.put(fileName, file, {
          httpMetadata,
          customMetadata,
        });

        logInfo("Successfully stored image", {
          fileName,
          attempt,
          key: result.key,
        });

        return result;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        logError(lastError, {
          fileName,
          attempt,
          maxRetries,
          fileSize: file.length,
          contentType: httpMetadata.contentType,
        });

        if (attempt === maxRetries) {
          break;
        }

        const delay = Math.pow(2, attempt - 1) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw new FileUploadError(
      `Failed to store image after ${maxRetries} attempts: ${
        lastError?.message || "Unknown error"
      }`
    );
  }
}

export const imageStorage = new ImageStorage(env.IMAGE_BUCKET);
