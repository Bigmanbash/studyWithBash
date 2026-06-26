import { NextResponse } from "next/server";
import { db } from "@/lib/neon/client";
import { session, verification } from "@/lib/neon/schema";
import { lt } from "drizzle-orm";

export async function GET(request: Request) {
  // Optional: Secure the cron job so only Vercel can trigger it
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const now = new Date();

    // 1. Delete expired sessions
    const deletedSessions = await db
      .delete(session)
      .where(lt(session.expiresAt, now))
      .returning({ id: session.id });

    // 2. Delete expired verification tokens
    const deletedVerifications = await db
      .delete(verification)
      .where(lt(verification.expiresAt, now))
      .returning({ id: verification.id });

    return NextResponse.json({
      success: true,
      deletedSessions: deletedSessions.length,
      deletedVerifications: deletedVerifications.length,
      message: "Database cleanup successful",
    });
  } catch (error: any) {
    console.error("Cron Error: Failed to cleanup database:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
