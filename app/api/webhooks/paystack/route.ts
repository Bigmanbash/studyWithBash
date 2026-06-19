// ── Paystack Webhook Handler ──────────────────────────────────────────────────
// POST /api/webhooks/paystack
//
// Paystack sends a POST to this URL on every charge event.
// This is the MOST RELIABLE payment confirmation because it fires
// even if the user closes the browser before the frontend verify runs.
//
// Security:
// 1. Reads the raw body and hashes it with HMAC SHA512 using PAYSTACK_SECRET_KEY
// 2. Compares the hash against the x-paystack-signature header
// 3. Only processes events with a valid signature
// 4. Verifies the amount matches the DB record before approving

import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/neon";
import { payments } from "@/lib/neon/schema";
import { eq } from "drizzle-orm";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;

export async function POST(request: Request) {
  try {
    // 1. Read raw body for signature verification
    const rawBody = await request.text();
    const signature = request.headers.get("x-paystack-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing signature" },
        { status: 401 }
      );
    }

    // 2. Verify HMAC SHA512 signature
    const hash = crypto
      .createHmac("sha512", PAYSTACK_SECRET_KEY)
      .update(rawBody)
      .digest("hex");

    if (hash !== signature) {
      console.error("[Paystack Webhook] Invalid signature");
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    // 3. Parse the verified body
    const event = JSON.parse(rawBody);

    // 4. Only handle charge.success events
    if (event.event !== "charge.success") {
      // Acknowledge but don't process other events
      return NextResponse.json({ received: true });
    }

    const { reference, amount, channel } = event.data;

    if (!reference) {
      console.error("[Paystack Webhook] Missing reference in event data");
      return NextResponse.json({ received: true });
    }

    // 5. Look up the payment
    const [payment] = await db
      .select()
      .from(payments)
      .where(eq(payments.reference, reference))
      .limit(1);

    if (!payment) {
      console.error(`[Paystack Webhook] No payment found for reference: ${reference}`);
      return NextResponse.json({ received: true });
    }

    // Already approved — idempotent, just acknowledge
    if (payment.status === "approved") {
      return NextResponse.json({ received: true });
    }

    // 6. CRITICAL: Verify amount matches
    if (amount !== payment.amount) {
      console.error(
        `[Paystack Webhook] Amount mismatch! Expected: ${payment.amount}, Got: ${amount}, Ref: ${reference}`
      );
      await db
        .update(payments)
        .set({ status: "failed", reviewedAt: new Date() })
        .where(eq(payments.reference, reference));

      return NextResponse.json({ received: true });
    }

    // 7. Approve the payment
    await db
      .update(payments)
      .set({
        status: "approved",
        method: channel || "card",
        reviewedAt: new Date(),
      })
      .where(eq(payments.reference, reference));

    console.log(`[Paystack Webhook] Payment approved: ${reference}`);

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[Paystack Webhook Error]", error);
    // Always return 200 to Paystack so they don't retry endlessly
    return NextResponse.json({ received: true });
  }
}
