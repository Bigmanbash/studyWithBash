// ── POST /api/affiliates/validate-code ────────────────────────────────────────
// Validates a referral code during student registration.
// Returns the affiliate's userId if valid.

import { NextResponse } from "next/server";
import { getAffiliateByCode } from "../queries";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code } = body as { code?: string };

    if (!code || code.trim().length < 3) {
      return NextResponse.json({ error: "Invalid referral code" }, { status: 400 });
    }

    const affiliate = await getAffiliateByCode(code.trim().toUpperCase());

    if (!affiliate) {
      return NextResponse.json({ error: "Referral code not found" }, { status: 404 });
    }

    return NextResponse.json({
      affiliateUserId: affiliate.affiliateUserId,
      agentName: affiliate.agentName,
    });
  } catch (error) {
    console.error("[Validate Code Error]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
