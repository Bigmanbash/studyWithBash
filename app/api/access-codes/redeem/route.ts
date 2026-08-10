// ── POST /api/access-codes/redeem ───────────────────────────────────────────
// Redeems an access code for the currently authenticated student.

import { NextResponse } from "next/server";
import { requireServerSession } from "@/app/api/auth/queries";
import { redeemAccessCode } from "../mutations";

export async function POST(request: Request) {
  try {
    const user = await requireServerSession();
    
    // Only students can redeem access codes
    if (user.role !== "student") {
      return NextResponse.json({ error: "Only students can redeem access codes" }, { status: 403 });
    }

    const body = await request.json();
    const { code } = body;

    if (!code || typeof code !== "string" || code.trim().length < 3) {
      return NextResponse.json({ error: "Invalid access code format" }, { status: 400 });
    }

    const payment = await redeemAccessCode(code.trim().toUpperCase(), user.id);

    return NextResponse.json({ 
      ok: true, 
      message: "Access code redeemed successfully!",
      courseId: payment.courseId
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Check for specific application errors thrown by our mutation
    if (error.message === "Invalid or already redeemed access code" || error.message === "This access code has expired") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error("[Redeem Access Code Error]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
