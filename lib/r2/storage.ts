import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl as s3GetSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2 } from "./client";

// ── Configuration ─────────────────────────────────────────────────────────────

/**
 * Default bucket name — mirrors the Supabase "course-materials" bucket.
 * Override via R2_BUCKET env var if needed.
 */
const BUCKET = process.env.R2_BUCKET_NAME || "course-materials";

// ── Environment prefix ────────────────────────────────────────────────────────

/**
 * Automatically prefix all keys with `prod/` or `staging/` based on NODE_ENV.
 * This ensures staging objects get cleaned up by the 30-day lifecycle rule
 * while production objects persist indefinitely.
 */
const ENV_PREFIX =
  process.env.NODE_ENV === "production" ? "prod/" : "staging/";

/**
 * Prepend the environment prefix to a storage path.
 * e.g. "courses/cover-123.jpg" → "prod/courses/cover-123.jpg"
 */
export const withPrefix = (path: string): string => `${ENV_PREFIX}${path}`;

// ── Type definitions ──────────────────────────────────────────────────────────
// Matches the branded type from the existing Supabase storage module exactly.

export type StoragePath = string & { readonly __brand: "StoragePath" };

export const toStoragePath = (path: string): StoragePath =>
  path as StoragePath;

// ── Helpers ───────────────────────────────────────────────────────────────────
// Drop-in replacements for every function exported by lib/supabase/storage.ts.
// Same function names, same signatures, same return types.

/**
 * Upload a file to the R2 bucket.
 * @param path  e.g. "courses/cover-123.jpg" or "courses/pdf-123.pdf"
 *              (env prefix is added automatically)
 * @param file  The File/Blob to upload
 * @returns     The storage path WITH prefix (save this to DB)
 */
export const uploadFile = async (path: string, file: File | Blob): Promise<StoragePath> => {
  const prefixedPath = withPrefix(path);

  // Read the file into a buffer for the S3 PutObject call
  const arrayBuffer = await file.arrayBuffer();
  const body = new Uint8Array(arrayBuffer);

  await r2.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: prefixedPath,
      Body: body,
      ContentType: file.type || "application/octet-stream",
    })
  );

  return toStoragePath(prefixedPath);
};

/**
 * Generate a short-lived presigned URL for a private file in the bucket.
 * Call this from a Server Action or API Route ONLY after verifying
 * that the user has paid for the course.
 * @param path       The stored file path (as saved in DB)
 * @param expiresIn  Seconds until the URL expires (default: 300s)
 */
export const getSignedUrl = async (
  path: string,
  expiresIn = 300
): Promise<string> => {
  const url = await s3GetSignedUrl(
    r2,
    new GetObjectCommand({
      Bucket: BUCKET,
      Key: path,
    }),
    { expiresIn }
  );

  return url;
};

/**
 * Generate presigned URLs for multiple files.
 * Prefer this over calling getSignedUrl in a loop — runs in parallel.
 * @param paths      Array of stored file paths
 * @param expiresIn  Seconds until the URLs expire (default: 60s)
 * @returns          Map of path → signedUrl
 */
export const getSignedUrls = async (
  paths: string[],
  expiresIn = 60
): Promise<Record<string, string>> => {
  const entries = await Promise.all(
    paths.map(async (path) => {
      const url = await getSignedUrl(path, expiresIn);
      return [path, url] as const;
    })
  );

  return Object.fromEntries(entries);
};

/**
 * Delete a file from storage.
 * Used when a course is deleted or its assets are replaced.
 */
export const deleteFile = async (path: string): Promise<void> => {
  await r2.send(
    new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: path,
    })
  );
};

/**
 * Delete multiple files in one round-trip.
 * R2 supports batch delete via DeleteObjects (up to 1000 keys per call).
 */
export const deleteFiles = async (paths: string[]): Promise<void> => {
  if (paths.length === 0) return;

  await r2.send(
    new DeleteObjectsCommand({
      Bucket: BUCKET,
      Delete: {
        Objects: paths.map((path) => ({ Key: path })),
        Quiet: true,
      },
    })
  );
};
