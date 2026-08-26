import { S3Client } from "@aws-sdk/client-s3";

// ── Environment validation ────────────────────────────────────────────────────

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;

if (!R2_ACCOUNT_ID) throw new Error("R2_ACCOUNT_ID is not set");
if (!R2_ACCESS_KEY_ID) throw new Error("R2_ACCESS_KEY_ID is not set");
if (!R2_SECRET_ACCESS_KEY) throw new Error("R2_SECRET_ACCESS_KEY is not set");

// ── Singleton S3Client for Cloudflare R2 ──────────────────────────────────────

/**
 * Cloudflare R2 uses the S3-compatible API.
 * Endpoint format: https://<ACCOUNT_ID>.r2.cloudflarestorage.com
 *
 * This client is re-used across all requests in the same process
 * (serverless function / edge runtime).
 */
export const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});
