// ── Paystack Transaction Initialize ───────────────────────────────────────────
// POST /api/paystack/initialize
// Body: { courseId: string, tier?: "basic" | "standard" | "premium" }
//
// 1. Authenticates the user via session
// 2. Fetches the course from DB and determines requested tier price
// 3. Calculates price difference if upgrading from an existing tier
// 4. Generates a unique reference
// 5. Inserts a "pending" payment row with the calculated amount and tier
// 6. Calls Paystack's /transaction/initialize with the server-side price
// 7. Returns { access_code, reference } to the frontend for popup

import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/neon";
import { courses, payments } from "@/lib/neon/schema";
import { eq, and } from "drizzle-orm";
import { requireServerSession } from "@/app/api/auth/queries";
import { getAffiliateByUserId } from "@/app/api/affiliates/queries";
import { TierKey, getTierPrice, getEffectiveTier, TIER_ORDER } from "@/lib/tiers";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;

export async function POST(request: Request) {
  try {
    // 1. Authenticate
    const user = await requireServerSession();

    // 2. Parse and validate body
    const body = await request.json();
    const { courseId, tier = "basic", quantity = 1 } = body as { 
      courseId?: string; 
      tier?: TierKey;
      quantity?: number;
    };

    if (!courseId) {
      return NextResponse.json(
        { error: "courseId is required" },
        { status: 400 }
      );
    }

    if (!(tier in TIER_ORDER)) {
      return NextResponse.json(
        { error: "Invalid tier selected" },
        { status: 400 }
      );
    }

    // 3. Fetch the course — price comes from the DB, never from the client
    const [course] = await db
      .select()
      .from(courses)
      .where(eq(courses.id, courseId))
      .limit(1);

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    if (course.status !== "active") {
      return NextResponse.json(
        { error: "Course is not available for purchase" },
        { status: 400 }
      );
    }

    // Verify requested tier is enabled on this course
    if (tier === "standard" && (!course.standardPrice || course.standardPrice <= 0)) {
      return NextResponse.json(
        { error: "Standard tier is not available for this course" },
        { status: 400 }
      );
    }

    if (tier === "premium" && (!course.premiumPrice || course.premiumPrice <= 0)) {
      return NextResponse.json(
        { error: "Premium tier is not available for this course" },
        { status: 400 }
      );
    }

    // 4. Check user's current access tier for this course
    const approvedPayments = await db
      .select({ tier: payments.tier })
      .from(payments)
      .where(
        and(
          eq(payments.userId, user.id),
          eq(payments.courseId, courseId),
          eq(payments.status, "approved")
        )
      );

    const currentTier = getEffectiveTier(approvedPayments.map((p) => p.tier));

    if (currentTier && (currentTier === tier || TIER_ORDER[currentTier] >= TIER_ORDER[tier])) {
      return NextResponse.json(
        { error: `You already have access to the ${currentTier} tier or higher` },
        { status: 409 }
      );
    }

    // 5. Calculate charge amount
    const targetPrice = getTierPrice(course, tier);
    let chargeAmount = 0;
    
    // Determine proxy vs personal purchase
    const isProxy = user.role === "agent";

    if (isProxy) {
      if (quantity < 1) {
        return NextResponse.json({ error: "Quantity must be at least 1" }, { status: 400 });
      }
      chargeAmount = targetPrice * quantity;
    } else {
      // Personal purchase logic (upgrade pricing)
      const currentPrice = currentTier ? getTierPrice(course, currentTier) : 0;
      chargeAmount = targetPrice - currentPrice;
      
      if (chargeAmount <= 0) {
        return NextResponse.json(
          { error: "Invalid price calculation for upgrade" },
          { status: 400 }
        );
      }
    }

    // Fetch affiliate data if applicable
    let affiliateId: string | undefined = undefined;
    if (isProxy) {
      const profile = await getAffiliateByUserId(user.id);
      if (!profile || profile.status !== "approved") {
        return NextResponse.json({ error: "Only approved agents can make proxy purchases" }, { status: 403 });
      }
      affiliateId = profile.id;
    }

    // 6. Generate a unique reference
    const reference = `ba_${Date.now()}_${crypto.randomBytes(6).toString("hex")}`;

    // 7. Insert a pending payment record with tier
    await db.insert(payments).values({
      userId: user.id,
      courseId: course.id,
      amount: chargeAmount,
      tier,
      status: "pending",
      reference,
      isProxy,
      proxyQuantity: isProxy ? quantity : null,
      affiliateId,
      referralCode: !isProxy && user.referralCodeUsed ? user.referralCodeUsed : null,
    });

    // 8. Initialize transaction with Paystack
    const paystackRes = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          amount: chargeAmount, // in kobo
          reference,
          metadata: {
            course_id: course.id,
            course_title: course.title,
            course_subject: course.subject,
            user_id: user.id,
            tier,
            is_upgrade: !isProxy && !!currentTier,
            is_proxy: isProxy,
            proxy_quantity: isProxy ? quantity : undefined,
            affiliate_id: affiliateId,
            referral_code: !isProxy ? user.referralCodeUsed : undefined,
          },
        }),
      }
    );

    const paystackData = await paystackRes.json();

    if (!paystackData.status) {
      // Paystack rejected the initialization — mark payment as failed
      await db
        .update(payments)
        .set({ status: "failed" })
        .where(eq(payments.reference, reference));

      return NextResponse.json(
        { error: paystackData.message || "Failed to initialize payment" },
        { status: 502 }
      );
    }

    // 9. Store the access_code for debugging/resumption
    await db
      .update(payments)
      .set({ paystackAccessCode: paystackData.data.access_code })
      .where(eq(payments.reference, reference));

    // 10. Return access_code and reference
    return NextResponse.json({
      access_code: paystackData.data.access_code,
      reference,
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[Paystack Initialize Error]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
