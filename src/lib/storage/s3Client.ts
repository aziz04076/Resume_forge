import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "@/lib/env";

export function isStorageConfigured(): boolean {
  return Boolean(
    env.STORAGE_BUCKET_NAME &&
      env.STORAGE_ACCESS_KEY_ID &&
      env.STORAGE_SECRET_ACCESS_KEY
  );
}

export function getS3Client(): S3Client | null {
  if (!isStorageConfigured()) {
    return null;
  }

  return new S3Client({
    region: "auto",
    endpoint: env.STORAGE_ENDPOINT || undefined,
    credentials: {
      accessKeyId: env.STORAGE_ACCESS_KEY_ID,
      secretAccessKey: env.STORAGE_SECRET_ACCESS_KEY,
    },
  });
}

/**
 * Uploads a file buffer to S3 or Cloudflare R2 bucket.
 */
export async function uploadToStorage(
  buffer: Buffer,
  key: string,
  contentType = "application/pdf"
): Promise<{ success: boolean; url?: string; error?: string }> {
  const client = getS3Client();
  if (!client || !env.STORAGE_BUCKET_NAME) {
    return {
      success: false,
      error: "Cloud storage is not configured. Please set STORAGE_* variables in .env.",
    };
  }

  try {
    await client.send(
      new PutObjectCommand({
        Bucket: env.STORAGE_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      })
    );

    const publicUrl = env.STORAGE_PUBLIC_URL
      ? `${env.STORAGE_PUBLIC_URL.replace(/\/$/, "")}/${key}`
      : undefined;

    return {
      success: true,
      url: publicUrl,
    };
  } catch (error) {
    console.error("Storage upload failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
}

/**
 * Generates a pre-signed download URL with expiration.
 */
export async function getStorageSignedUrl(key: string, expiresIn = 3600): Promise<string | null> {
  const client = getS3Client();
  if (!client || !env.STORAGE_BUCKET_NAME) {
    return null;
  }

  try {
    const command = new GetObjectCommand({
      Bucket: env.STORAGE_BUCKET_NAME,
      Key: key,
    });
    return await getSignedUrl(client, command, { expiresIn });
  } catch (error) {
    console.error("Failed to generate signed URL:", error);
    return null;
  }
}
