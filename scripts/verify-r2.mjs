// /**
//  * R2 Connection Verification Script
//  * 
//  * Usage:
//  *   node scripts/verify-r2.mjs
//  * 
//  * Tests:
//  *   1. Bucket accessibility (HeadBucket)
//  *   2. Upload to staging/ prefix (PutObject)
//  *   3. Presigned URL generation (GetObject)
//  *   4. Env prefix validation
//  */

// import { readFileSync } from "node:fs";
// import { resolve } from "node:path";

// // ── Load .env.local manually ──────────────────────────────────────────────────
// try {
//   const envPath = resolve(process.cwd(), ".env.local");
//   const envContent = readFileSync(envPath, "utf-8");
//   for (const line of envContent.split("\n")) {
//     const trimmed = line.trim();
//     if (!trimmed || trimmed.startsWith("#")) continue;
//     const eqIndex = trimmed.indexOf("=");
//     if (eqIndex === -1) continue;
//     const key = trimmed.slice(0, eqIndex).trim();
//     const value = trimmed.slice(eqIndex + 1).trim().replace(/^["']|["']$/g, "");
//     if (!process.env[key]) process.env[key] = value;
//   }
// } catch {
//   console.error("❌ Could not read .env.local — run this from the project root.");
//   process.exit(1);
// }

// import {
//   S3Client,
//   ListObjectsV2Command,
//   PutObjectCommand,
//   GetObjectCommand,
//   DeleteObjectCommand,
// } from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// // ── Env validation ────────────────────────────────────────────────────────────

// const required = ["R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET_NAME"];
// const missing = required.filter((key) => !process.env[key]);

// if (missing.length > 0) {
//   console.error("❌ Missing env vars:", missing.join(", "));
//   console.error("   Make sure .env.local has all R2 variables set.");
//   process.exit(1);
// }

// const accessKey = process.env.R2_ACCESS_KEY_ID;
// const secretKey = process.env.R2_SECRET_ACCESS_KEY;
// const accountId = process.env.R2_ACCOUNT_ID;
// const bucket = process.env.R2_BUCKET_NAME;

// console.log("🔧 Environment:");
// console.log(`   NODE_ENV:    ${process.env.NODE_ENV || "undefined (defaults to staging/)"}`);
// console.log(`   BUCKET:      ${bucket}`);
// console.log(`   ACCOUNT_ID:  ${accountId.substring(0, 8)}...`);
// console.log(`   PREFIX:      ${process.env.NODE_ENV === "production" ? "prod/" : "staging/"}`);
// console.log();
// console.log("🔑 Credential check (lengths & edges — NOT showing full values):");
// console.log(`   ACCESS_KEY:  len=${accessKey.length}, starts="${accessKey.substring(0, 4)}", ends="${accessKey.slice(-4)}"`);
// console.log(`   SECRET_KEY:  len=${secretKey.length}, starts="${secretKey.substring(0, 4)}", ends="${secretKey.slice(-4)}"`);
// console.log(`   ACCOUNT_ID:  len=${accountId.length}`);
// console.log();

// // ── R2 Client ─────────────────────────────────────────────────────────────────

// const r2 = new S3Client({
//   region: "auto",
//   endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
//   credentials: {
//     accessKeyId: accessKey,
//     secretAccessKey: secretKey,
//   },
// });

// const BUCKET = bucket;

// // ── Test 1: Bucket Access (ListObjects — more reliable than HeadBucket on R2)

// try {
//   const res = await r2.send(new ListObjectsV2Command({ Bucket: BUCKET, MaxKeys: 1 }));
//   console.log("✅ Test 1 — Bucket accessible:", BUCKET, `(${res.KeyCount ?? 0} existing keys sampled)`);
// } catch (e) {
//   console.error("❌ Test 1 — Bucket access failed:", e.name, "-", e.message);
//   if (e.$metadata) console.error("   HTTP status:", e.$metadata.httpStatusCode);
//   console.error("   Check: bucket name, API token permissions, account ID.");
//   process.exit(1);
// }

// // ── Test 2: Upload (staging/ prefix) ──────────────────────────────────────────

// const testKey = "staging/_connection_test.txt";
// const testBody = `R2 connection test — ${new Date().toISOString()}`;

// try {
//   await r2.send(
//     new PutObjectCommand({
//       Bucket: BUCKET,
//       Key: testKey,
//       Body: testBody,
//       ContentType: "text/plain",
//     })
//   );
//   console.log("✅ Test 2 — Upload works (staging/ prefix — will auto-delete in 30 days)");
// } catch (e) {
//   console.error("❌ Test 2 — Upload failed:", e.message);
//   console.error("   Check: API token has write permission on the bucket.");
//   process.exit(1);
// }

// // ── Test 3: Presigned URL ─────────────────────────────────────────────────────

// try {
//   const url = await getSignedUrl(
//     r2,
//     new GetObjectCommand({
//       Bucket: BUCKET,
//       Key: testKey,
//     }),
//     { expiresIn: 300 }
//   );
//   console.log("✅ Test 3 — Presigned URL generated:");
//   console.log(`   ${url.substring(0, 100)}...`);
//   console.log();
//   console.log("📋 To verify CORS, open this URL in your browser:");
//   console.log(`   ${url}`);
//   console.log("   If it loads without CORS errors → your CORS policy is correct.");
// } catch (e) {
//   console.error("❌ Test 3 — Presigned URL generation failed:", e.message);
//   process.exit(1);
// }

// // ── Test 4: Cleanup (delete test file) ────────────────────────────────────────

// try {
//   await r2.send(
//     new DeleteObjectCommand({
//       Bucket: BUCKET,
//       Key: testKey,
//     })
//   );
//   console.log("✅ Test 4 — Delete works (cleaned up test file)");
// } catch (e) {
//   console.error("⚠️  Test 4 — Delete failed (non-critical):", e.message);
// }

// // ── Summary ───────────────────────────────────────────────────────────────────

// console.log();
// console.log("━".repeat(50));
// console.log("🎉 All R2 tests passed! Bucket is ready.");
// console.log("━".repeat(50));
// console.log();
// console.log("Next steps:");
// console.log("  1. Swap imports in 7 files: @/lib/supabase/storage → @/lib/r2");
// console.log("  2. Set R2 env vars in Vercel dashboard for production");
// console.log("  3. Deploy and test upload flow from admin panel");
