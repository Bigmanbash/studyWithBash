// ── Access Codes API Route ──────────────────────────────────────────────────
// GET  /api/access-codes         — list all codes (admin) or own codes (agent)
// PATCH /api/access-codes        — manual expiry (admin)

import { NextRequest, NextResponse } from "next/server";
import { requireServerSession } from "@/app/api/auth/queries";
import { listAccessCodes, getAdminAccessCodeStats } from "./queries";
import { expireAccessCode } from "./mutations";
import { getAffiliateByUserId } from "../affiliates/queries";
import type { AccessCodeStatus } from "@/lib/affiliate-constants";

export async function GET(request: NextRequest) {
  try {
    const user = await requireServerSession();
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || undefined;
    const status = (searchParams.get("status") || undefined) as AccessCodeStatus | undefined;

    let affiliateId: string | undefined = undefined;

    // Admin can view all codes. Agents can only view their own codes.
    if (user.role === "agent") {
      const profile = await getAffiliateByUserId(user.id);
      if (!profile) {
        return NextResponse.json({ error: "Affiliate profile not found" }, { status: 404 });
      }
      affiliateId = profile.id;
    } else if (user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [codes, stats] = await Promise.all([
      listAccessCodes({ page, limit, search, status, affiliateId }),
      getAdminAccessCodeStats(affiliateId),
    ]);

    return NextResponse.json({ ...codes, stats });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[Access Codes GET Error]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireServerSession();
    
    // Only admin can manually expire codes for now
    if (user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { action, accessCodeId } = body;

    if (!accessCodeId) {
      return NextResponse.json({ error: "accessCodeId is required" }, { status: 400 });
    }

    if (action === "expire") {
      const updated = await expireAccessCode(accessCodeId);
      if (!updated) {
        return NextResponse.json({ error: "Code not found or already redeemed/expired" }, { status: 404 });
      }
      return NextResponse.json({ accessCode: updated, message: "Code expired successfully" });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[Access Codes PATCH Error]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
