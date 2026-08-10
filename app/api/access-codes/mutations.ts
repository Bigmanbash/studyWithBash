// ── Access Codes mutations ────────────────────────────────────────────────────
// Server-side write operations for access codes.

import { db } from "@/lib/neon";
import { accessCodes, payments } from "@/lib/neon/schema";
import { eq, and } from "drizzle-orm";
import { generateAccessCode } from "@/lib/affiliate-constants";

/**
 * Generate Access Codes for a proxy payment.
 * Called automatically when an agent's proxy payment is verified.
 */
export async function generateProxyAccessCodes(params: {
  affiliateId: string;
  courseId: string;
  courseSubject: string;
  tier: string;
  paymentId: string;
  quantity: number;
}) {
  const codesToInsert = [];
  
  for (let i = 0; i < params.quantity; i++) {
    let code = generateAccessCode(params.courseSubject);
    let attempts = 0;
    
    // Ensure uniqueness
    while (attempts < 10) {
      const existing = await db
        .select({ id: accessCodes.id })
        .from(accessCodes)
        .where(eq(accessCodes.code, code))
        .limit(1);

      if (existing.length === 0) break;
      code = generateAccessCode(params.courseSubject);
      attempts++;
    }

    codesToInsert.push({
      code,
      affiliateId: params.affiliateId,
      courseId: params.courseId,
      tier: params.tier,
      paymentId: params.paymentId,
      status: "unused" as const,
    });
  }

  const inserted = await db.insert(accessCodes).values(codesToInsert).returning();
  return inserted;
}

/**
 * Redeem an access code for a student.
 * Marks the code as redeemed and creates a 'payment' record with amount 0 
 * and status 'approved' so the student gains access via the normal course auth guards.
 */
export async function redeemAccessCode(
  code: string,
  userId: string
) {
  // 1. Get the code (without transaction lock, we just check existence and state)
  const rows = await db
    .select()
    .from(accessCodes)
    .where(and(eq(accessCodes.code, code.toUpperCase()), eq(accessCodes.status, "unused")))
    .limit(1);

  const accessCode = rows[0];
  
  if (!accessCode) {
    throw new Error("Invalid or already redeemed access code");
  }

  if (accessCode.expiresAt && accessCode.expiresAt < new Date()) {
    await db
      .update(accessCodes)
      .set({ status: "expired" })
      .where(eq(accessCodes.id, accessCode.id));
    throw new Error("This access code has expired");
  }

  // 2. Mark code as redeemed (Atomic update with unused check prevents race conditions)
  const updatedCode = await db
    .update(accessCodes)
    .set({
      status: "redeemed",
      redeemedBy: userId,
      redeemedAt: new Date(),
    })
    .where(and(eq(accessCodes.id, accessCode.id), eq(accessCodes.status, "unused")))
    .returning();

  if (updatedCode.length === 0) {
    throw new Error("Invalid or already redeemed access code");
  }

  // 3. Create a zero-amount "payment" record to grant course access
  const [payment] = await db
    .insert(payments)
    .values({
      userId,
      courseId: accessCode.courseId,
      amount: 0,
      tier: accessCode.tier,
      status: "approved",
      method: "access_code",
      reference: `REDEEM-${code.toUpperCase()}-${Date.now()}`,
    })
    .returning();

  return payment;
}

/**
 * Admin: Expire an access code manually.
 */
export async function expireAccessCode(accessCodeId: string) {
  const [updated] = await db
    .update(accessCodes)
    .set({
      status: "expired",
      expiresAt: new Date(),
    })
    .where(
      and(
        eq(accessCodes.id, accessCodeId),
        eq(accessCodes.status, "unused")
      )
    )
    .returning();

  return updated;
}
