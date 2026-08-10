// ── POST /api/affiliates/link-referral ────────────────────────────────────────
// Links a newly registered student to their referring agent.
// Called after signup when a valid referral code was provided.

import { NextResponse } from "next/server";
import { linkReferral } from "../mutations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, referredBy, referralCode } = body as {
      userId?: string;
      referredBy?: string;
      referralCode?: string;
    };

    if (!userId || !referredBy || !referralCode) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await linkReferral(userId, referredBy, referralCode);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[Link Referral Error]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
