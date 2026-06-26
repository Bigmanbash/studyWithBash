import { db } from "../lib/neon/client";
import { session, verification } from "../lib/neon/schema";
import { lt } from "drizzle-orm";

async function cleanup() {
  console.log("🧹 Starting database cleanup...");

  try {
    const now = new Date();

    // 1. Delete expired sessions
    const deletedSessions = await db
      .delete(session)
      .where(lt(session.expiresAt, now))
      .returning({ id: session.id });
    console.log(`✅ Cleared ${deletedSessions.length} expired sessions.`);

    // 2. Delete expired verification tokens (OTPs, email verifications, etc)
    const deletedVerifications = await db
      .delete(verification)
      .where(lt(verification.expiresAt, now))
      .returning({ id: verification.id });
    console.log(`✅ Cleared ${deletedVerifications.length} expired verification tokens.`);

    console.log("🎉 Cleanup completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during cleanup:", error);
    process.exit(1);
  }
}

cleanup();
