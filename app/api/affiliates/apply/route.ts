// ── POST /api/affiliates/apply ────────────────────────────────────────────────
// Creates an affiliate application for a newly registered teacher/agent.
// Called after signup when isAgent = true.

import { NextResponse } from "next/server";
import { createAffiliateApplication } from "../mutations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, schoolName, estimatedStudents } = body as {
      userId?: string;
      schoolName?: string;
      estimatedStudents?: number;
    };

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const affiliate = await createAffiliateApplication(
      userId,
      schoolName?.trim(),
      estimatedStudents
    );

    return NextResponse.json({ affiliate, ok: true });
  } catch (error) {
    console.error("[Affiliate Apply Error]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
