// /**
//  * Resend Email Verification Script
//  *
//  * Usage:
//  *   node scripts/verify-resend.mjs [recipient_email]
//  *
//  * Example:
//  *   node scripts/verify-resend.mjs yourname@gmail.com
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

// import { Resend } from "resend";

// const apiKey = process.env.RESEND_API_KEY;
// let rawSender = process.env.RESEND_SENDER_EMAIL?.trim() || "support@studywithbash.online";
// if (!rawSender.includes("@")) {
//   rawSender = "support@studywithbash.online";
// }
// const fromHeader = rawSender.includes("<") ? rawSender : `Bash Academy <${rawSender}>`;

// const recipient = process.argv[2] || "delivered@resend.dev";

// console.log("🔧 Resend Configuration Check:");
// console.log(`   NODE_ENV:     ${process.env.NODE_ENV || "staging"}`);
// console.log(`   API Key:      ${apiKey ? `${apiKey.substring(0, 8)}... (Length: ${apiKey.length})` : "❌ NOT SET"}`);
// console.log(`   Sender From:  ${fromHeader}`);
// console.log(`   Recipient:    ${recipient}`);
// console.log();

// if (!apiKey) {
//   console.error("❌ RESEND_API_KEY is missing in .env.local.");
//   process.exit(1);
// }

// const resend = new Resend(apiKey);

// console.log("📨 Sending test email...");

// try {
//   const html = `
//     <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #E2E8F0; border-radius: 12px;">
//       <h2 style="color: #0A1B39; margin-top: 0;">Bash<span style="color: #17A546;">Academy</span></h2>
//       <p style="color: #475569; font-size: 16px;">This is a live integration test from your Bash Academy development environment.</p>
//       <div style="background: #E8F8EE; color: #17A546; padding: 12px 16px; border-radius: 8px; font-weight: 600; margin: 20px 0;">
//         ✅ Resend API is connected and delivering emails correctly!
//       </div>
//       <p style="font-size: 13px; color: #94A3B8;">Timestamp: ${new Date().toISOString()}</p>
//     </div>
//   `;

//   const { data, error } = await resend.emails.send({
//     from: fromHeader,
//     to: recipient,
//     subject: "Bash Academy - Resend Integration Test",
//     html,
//   });

//   if (error) {
//     console.error("❌ Email failed to send:");
//     console.error(error);
//     if (error.statusCode === 403 || error.message?.includes("domain")) {
//       console.log("\n💡 Tip: If your domain isn't verified in Resend yet:");
//       console.log("   1. Verify your domain in Resend Dashboard -> Domains");
//       console.log("   2. OR for testing, set RESEND_SENDER_EMAIL=\"onboarding@resend.dev\" and send to your registered Resend account email.");
//     }
//     process.exit(1);
//   }

//   console.log("✅ Email sent successfully!");
//   console.log("   Email ID:", data?.id);
//   console.log(`   Check inbox at: ${recipient}`);
// } catch (err) {
//   console.error("❌ Exception during send:", err);
//   process.exit(1);
// }
