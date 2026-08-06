import { NextResponse } from "next/server";
import { db } from "@/lib/neon";
import { courses, payments } from "@/lib/neon/schema";
import { eq, desc, and, notInArray, inArray } from "drizzle-orm";
import { requireServerSession } from "@/app/api/auth/queries";
import { isHigherTier, TierKey } from "@/lib/tiers";

export async function GET(request: Request) {
  try {
    const user = await requireServerSession();

    if (user.role === "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const offset = (page - 1) * limit;

    // Fetch all approved payments for this student
    const approvedPayments = await db
      .select({
        courseId: payments.courseId,
        tier: payments.tier,
        submittedAt: payments.submittedAt,
      })
      .from(payments)
      .where(and(eq(payments.userId, user.id), eq(payments.status, "approved")))
      .orderBy(desc(payments.submittedAt));

    // Map courseId -> effective highest tier
    const tierMap = new Map<string, TierKey>();
    for (const p of approvedPayments) {
      const existing = tierMap.get(p.courseId);
      const paymentTier = (p.tier as TierKey) || "basic";
      if (!existing || isHigherTier(paymentTier, existing)) {
        tierMap.set(p.courseId, paymentTier);
      }
    }

    const purchasedIds = Array.from(tierMap.keys());
    let purchasedCourses: any[] = [];

    if (purchasedIds.length > 0) {
      const courseRecords = await db
        .select()
        .from(courses)
        .where(inArray(courses.id, purchasedIds));

      purchasedCourses = courseRecords.map((c) => ({
        ...c,
        purchasedTier: tierMap.get(c.id) || "basic",
      }));
    }

    // Fetch available courses (paginated, excluding already purchased)
    const availableData = await db
      .select()
      .from(courses)
      .where(
        purchasedIds.length > 0
          ? and(eq(courses.status, "active"), notInArray(courses.id, purchasedIds))
          : eq(courses.status, "active")
      )
      .orderBy(desc(courses.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      purchased: purchasedCourses,
      available: availableData,
      page,
      limit,
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
