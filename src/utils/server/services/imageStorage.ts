"server-only";
import { env } from "cloudflare:workers";

class ImageStorage {
  constructor(private readonly bucket: R2Bucket) {}
  async store(
    file: Uint8Array,
    fileName: string,
    httpMetadata: R2HTTPMetadata,
    customMetadata: Record<string, string>
  ) {
    try {
      return await this.bucket.put(fileName, file, {
        httpMetadata,
        customMetadata,
      });
    } catch (error) {
      console.error("Error storing image", error);
      throw error;
    }
  }
}

export const imageStorage = new ImageStorage(env.IMAGE_BUCKET);
