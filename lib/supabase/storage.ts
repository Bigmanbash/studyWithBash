import { createClient } from "@supabase/supabase-js";

// ── Environment validation ────────────────────────────────────────────────────

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL) throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
if (!SUPABASE_ANON_KEY) throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not set");

/**
 * Public anon client — safe to use on the client-side for storage uploads
 * that do not require bypassing Row Level Security.
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── Storage helpers ───────────────────────────────────────────────────────────
// All file operations are funnelled through these helpers to keep storage
// logic in one place. Never import supabase.storage directly in components.

const BUCKET = "course-materials";

const storage = () => supabase.storage.from(BUCKET);

// ── Type definitions ──────────────────────────────────────────────────────────

export type StoragePath = string & { readonly __brand: "StoragePath" };

export const toStoragePath = (path: string): StoragePath =>
  path as StoragePath;

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Upload a file to the course-materials bucket.
 * @param path  e.g. "courses/cover-123.jpg" or "courses/pdf-123.pdf"
 * @param file  The File/Blob to upload
 * @returns     The storage path (not a URL — generate signed URLs separately)
 */
export const uploadFile = async (path: string, file: File): Promise<StoragePath> => {
  const { error } = await storage().upload(path, file, { upsert: true });
  if (error) throw new Error(`Storage upload failed: ${error.message}`);
  return toStoragePath(path);
};

/**
 * Generate a short-lived signed URL for a private file in the bucket.
 * Call this from a Server Action or API Route ONLY after verifying
 * that the user has paid for the course.
 * @param path       The stored file path (as saved in DB)
 * @param expiresIn  Seconds until the URL expires (default: 60s)
 */
export const getSignedUrl = async (
  path: string,
  expiresIn = 60
): Promise<string> => {
  const { data, error } = await storage().createSignedUrl(path, expiresIn);

  if (error || !data?.signedUrl)
    throw new Error(`Failed to generate signed URL: ${error?.message}`);

  return data.signedUrl;
};

/**
 * Generate signed URLs for multiple files in one round-trip.
 * Prefer this over calling getSignedUrl in a loop.
 * @param paths      Array of stored file paths
 * @param expiresIn  Seconds until the URLs expire (default: 60s)
 * @returns          Map of path → signedUrl
 */
export const getSignedUrls = async (
  paths: string[],
  expiresIn = 60
): Promise<Record<string, string>> => {
  const { data, error } = await storage().createSignedUrls(paths, expiresIn);

  if (error || !data)
    throw new Error(`Failed to generate signed URLs: ${error?.message}`);

  return Object.fromEntries(
    data
      .filter((item) => item.signedUrl)
      .map((item) => [item.path, item.signedUrl])
  );
};

/**
 * Delete a file from storage.
 * Used when a course is deleted or its assets are replaced.
 */
export const deleteFile = async (path: string): Promise<void> => {
  const { error } = await storage().remove([path]);
  if (error) throw new Error(`Storage delete failed: ${error.message}`);
};

/**
 * Delete multiple files in one round-trip.
 * Prefer this over calling deleteFile in a loop.
 */
export const deleteFiles = async (paths: string[]): Promise<void> => {
  const { error } = await storage().remove(paths);
  if (error) throw new Error(`Storage bulk delete failed: ${error.message}`);
};