// ── Affiliate mutations ───────────────────────────────────────────────────────
// Server-side write operations for managing affiliates, commissions, and payouts.

import { db } from "@/lib/neon";
import { affiliates, commissions, user } from "@/lib/neon/schema";
import { eq, and, inArray } from "drizzle-orm";
import { generateReferralCode, DEFAULT_COMMISSION_RATE } from "@/lib/affiliate-constants";

/**
 * Create an affiliate application. Called after a teacher signs up.
 * Sets user role to "pending_agent" and creates an affiliate row with status "pending".
 */
export async function createAffiliateApplication(
  userId: string,
  schoolName?: string,
  estimatedStudents?: number
) {
  // Set user role to pending_agent
  await db
    .update(user)
    .set({ role: "pending_agent", schoolName, estimatedStudents, updatedAt: new Date() })
    .where(eq(user.id, userId));

  // Create affiliate profile
  const [affiliate] = await db
    .insert(affiliates)
    .values({
      userId,
      commissionRate: DEFAULT_COMMISSION_RATE,
      status: "pending",
      schoolName,
      estimatedStudents,
    })
    .returning();

  return affiliate;
}

/**
 * Admin: approve an affiliate application.
 * Generates a unique referral code and upgrades user role to "agent".
 */
export async function approveAffiliate(affiliateId: string) {
  // Generate a unique referral code with retry
  let referralCode = generateReferralCode();
  let attempts = 0;
  while (attempts < 10) {
    const existing = await db
      .select({ id: affiliates.id })
      .from(affiliates)
      .where(eq(affiliates.referralCode, referralCode))
      .limit(1);

    if (existing.length === 0) break;
    referralCode = generateReferralCode();
    attempts++;
  }

  const [affiliate] = await db
    .update(affiliates)
    .set({
      status: "approved",
      referralCode,
      approvedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(affiliates.id, affiliateId))
    .returning();

  if (affiliate) {
    // Upgrade user role to "agent"
    await db
      .update(user)
      .set({ role: "agent", updatedAt: new Date() })
      .where(eq(user.id, affiliate.userId));

    // TODO: Send approval notification email to agent via Resend
    // Include their referral code and a link to the agent dashboard
  }

  return affiliate;
}

/**
 * Admin: reject an affiliate application.
 */
export async function rejectAffiliate(affiliateId: string) {
  const [affiliate] = await db
    .update(affiliates)
    .set({ status: "rejected", updatedAt: new Date() })
    .where(eq(affiliates.id, affiliateId))
    .returning();

  if (affiliate) {
    // Revert user role back to student
    await db
      .update(user)
      .set({ role: "student", updatedAt: new Date() })
      .where(eq(user.id, affiliate.userId));

    // TODO: Send rejection notification email to agent via Resend
  }

  return affiliate;
}

/**
 * Admin: suspend an active affiliate.
 */
export async function suspendAffiliate(affiliateId: string) {
  const [affiliate] = await db
    .update(affiliates)
    .set({ status: "suspended", updatedAt: new Date() })
    .where(eq(affiliates.id, affiliateId))
    .returning();

  return affiliate;
}

/**
 * Admin: reactivate a suspended affiliate.
 */
export async function reactivateAffiliate(affiliateId: string) {
  const [affiliate] = await db
    .update(affiliates)
    .set({ status: "approved", updatedAt: new Date() })
    .where(eq(affiliates.id, affiliateId))
    .returning();

  return affiliate;
}

/**
 * Admin: set commission rate for a specific affiliate.
 */
export async function setCommissionRate(affiliateId: string, rate: number) {
  if (rate < 0 || rate > 100) {
    throw new Error("Commission rate must be between 0 and 100");
  }

  const [affiliate] = await db
    .update(affiliates)
    .set({ commissionRate: rate, updatedAt: new Date() })
    .where(eq(affiliates.id, affiliateId))
    .returning();

  return affiliate;
}

/**
 * Admin: update affiliate credentials/details (commission rate, school name, estimated students).
 */
export async function updateAffiliateProfile(
  affiliateId: string,
  data: {
    commissionRate?: number;
    schoolName?: string;
    estimatedStudents?: number;
  }
) {
  const updatePayload: Record<string, any> = { updatedAt: new Date() };

  if (data.commissionRate !== undefined) {
    if (data.commissionRate < 0 || data.commissionRate > 100) {
      throw new Error("Commission rate must be between 0 and 100");
    }
    updatePayload.commissionRate = data.commissionRate;
  }

  if (data.schoolName !== undefined) {
    updatePayload.schoolName = data.schoolName;
  }

  if (data.estimatedStudents !== undefined) {
    updatePayload.estimatedStudents = data.estimatedStudents;
  }

  const [affiliate] = await db
    .update(affiliates)
    .set(updatePayload)
    .where(eq(affiliates.id, affiliateId))
    .returning();

  return affiliate;
}

/**
 * Credit a commission to an affiliate.
 * Used by the webhook/verify after a successful payment.
 * Unique constraint on paymentId prevents double-crediting.
 */
export async function creditCommission(params: {
  affiliateId: string;
  paymentId: string;
  studentId: string;
  courseId: string;
  type: "referral" | "proxy";
  saleAmount: number;
  commissionRate: number;
}) {
  const commissionAmount = Math.floor(
    (params.saleAmount * params.commissionRate) / 100
  );

  try {
    const [commission] = await db
      .insert(commissions)
      .values({
        affiliateId: params.affiliateId,
        paymentId: params.paymentId,
        studentId: params.studentId,
        courseId: params.courseId,
        type: params.type,
        saleAmount: params.saleAmount,
        commissionAmount,
        status: "credited",
      })
      .returning();

    // Update affiliate running totals
    if (commission) {
      await db.execute(
        `UPDATE affiliates SET 
          total_earned = total_earned + ${commissionAmount},
          pending_payout = pending_payout + ${commissionAmount},
          updated_at = NOW()
        WHERE id = '${params.affiliateId}'`
      );
    }

    return commission;
  } catch (error: any) {
    // Unique constraint violation — commission already exists for this payment
    if (error.code === "23505") {
      console.log(`[Commission] Already exists for payment ${params.paymentId}`);
      return null;
    }
    throw error;
  }
}

/**
 * Admin: mark commissions as paid (after manual bank transfer).
 */
export async function markCommissionsPaid(commissionIds: string[]) {
  if (commissionIds.length === 0) return;

  const updated = await db
    .update(commissions)
    .set({ status: "paid", paidAt: new Date() })
    .where(
      and(
        inArray(commissions.id, commissionIds),
        eq(commissions.status, "credited")
      )
    )
    .returning();

  // Reduce pending payout for each affected affiliate
  for (const c of updated) {
    await db.execute(
      `UPDATE affiliates SET 
        pending_payout = GREATEST(pending_payout - ${c.commissionAmount}, 0),
        updated_at = NOW()
      WHERE id = '${c.affiliateId}'`
    );
  }

  return updated;
}

/**
 * Link a referral code to a newly registered student.
 * Called after signup when a valid referral code was entered.
 */
export async function linkReferral(
  userId: string,
  referredBy: string,
  referralCode: string
) {
  await db
    .update(user)
    .set({
      referredBy,
      referralCodeUsed: referralCode,
      updatedAt: new Date(),
    })
    .where(eq(user.id, userId));
}
