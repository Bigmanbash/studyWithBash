// ── Affiliates API Route ──────────────────────────────────────────────────────
// GET  /api/affiliates         — list all affiliates (admin) or get own profile (agent)
// PATCH /api/affiliates        — approve/reject/suspend/set rate (admin)

import { NextRequest, NextResponse } from "next/server";
import { requireServerSession, requireAdminSession } from "@/app/api/auth/queries";
import { listAffiliates, getAffiliateByUserId, getAdminAffiliateStats, getAffiliateStats, getAffiliateCommissions } from "./queries";
import { approveAffiliate, rejectAffiliate, suspendAffiliate, reactivateAffiliate, setCommissionRate, updateAffiliateProfile, markCommissionsPaid } from "./mutations";
import type { AffiliateStatus } from "@/lib/affiliate-constants";

export async function GET(request: NextRequest) {
  try {
    const user = await requireServerSession();
    const { searchParams } = new URL(request.url);

    // Admin: list all affiliates
    if (user.role === "admin") {
      const isStatsOnly = searchParams.get("statsOnly") === "true";
      if (isStatsOnly) {
        const stats = await getAdminAffiliateStats();
        return NextResponse.json({ stats });
      }

      const page = parseInt(searchParams.get("page") || "1");
      const limit = parseInt(searchParams.get("limit") || "10");
      const search = searchParams.get("search") || undefined;
      const status = (searchParams.get("status") || undefined) as AffiliateStatus | undefined;

      const [affiliatesList, stats] = await Promise.all([
        listAffiliates({ page, limit, search, status }),
        getAdminAffiliateStats(),
      ]);

      return NextResponse.json({ ...affiliatesList, stats });
    }

    // Agent: get own profile and stats
    if (user.role === "agent" || user.role === "pending_agent") {
      const profile = await getAffiliateByUserId(user.id);
      if (!profile) {
        return NextResponse.json({ error: "Affiliate profile not found" }, { status: 404 });
      }

      const stats = await getAffiliateStats(profile.id);
      const commissionsList = await getAffiliateCommissions(
        profile.id,
        parseInt(searchParams.get("page") || "1"),
        parseInt(searchParams.get("limit") || "20")
      );

      return NextResponse.json({ profile, stats, commissions: commissionsList });
    }

    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[Affiliates GET Error]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const admin = await requireAdminSession();
    const body = await request.json();
    const { action, affiliateId, commissionRate, schoolName, estimatedStudents, commissionIds } = body;

    if (!affiliateId && action !== "mark_paid") {
      return NextResponse.json({ error: "affiliateId is required" }, { status: 400 });
    }

    switch (action) {
      case "approve": {
        const affiliate = await approveAffiliate(affiliateId);
        return NextResponse.json({ affiliate, message: "Affiliate approved" });
      }
      case "reject": {
        const affiliate = await rejectAffiliate(affiliateId);
        return NextResponse.json({ affiliate, message: "Affiliate rejected" });
      }
      case "suspend": {
        const affiliate = await suspendAffiliate(affiliateId);
        return NextResponse.json({ affiliate, message: "Affiliate suspended" });
      }
      case "reactivate": {
        const affiliate = await reactivateAffiliate(affiliateId);
        return NextResponse.json({ affiliate, message: "Affiliate reactivated" });
      }
      case "set_rate": {
        if (commissionRate === undefined || commissionRate < 0 || commissionRate > 100) {
          return NextResponse.json({ error: "Valid commission rate (0-100) required" }, { status: 400 });
        }
        const affiliate = await setCommissionRate(affiliateId, commissionRate);
        return NextResponse.json({ affiliate, message: "Commission rate updated" });
      }
      case "update_details": {
        const affiliate = await updateAffiliateProfile(affiliateId, {
          commissionRate: commissionRate !== undefined ? Number(commissionRate) : undefined,
          schoolName,
          estimatedStudents: estimatedStudents !== undefined ? Number(estimatedStudents) : undefined,
        });
        return NextResponse.json({ affiliate, message: "Affiliate details updated" });
      }
      case "mark_paid": {
        if (!commissionIds || !Array.isArray(commissionIds) || commissionIds.length === 0) {
          return NextResponse.json({ error: "commissionIds array required" }, { status: 400 });
        }
        const updated = await markCommissionsPaid(commissionIds);
        return NextResponse.json({ updated, message: `${updated?.length ?? 0} commissions marked as paid` });
      }
      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("[Affiliates PATCH Error]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
