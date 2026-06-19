// ── Paystack Transaction Verify ───────────────────────────────────────────────
// POST /api/paystack/verify
// Body: { reference: string }
//
// Called by the frontend immediately after the Paystack popup closes successfully.
// 1. Looks up the pending payment in our DB
// 2. Calls Paystack's /transaction/verify/:reference
// 3. Validates: status === "success" AND amount matches our DB amount
// 4. Marks payment as "approved" only if both checks pass

import { NextResponse } from "next/server";
import { db } from "@/lib/neon";
import { payments } from "@/lib/neon/schema";
import { eq } from "drizzle-orm";
import { requireServerSession } from "@/app/api/auth/queries";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;

export async function POST(request: Request) {
  try {
    // 1. Authenticate
    const user = await requireServerSession();

    // 2. Parse body
    const body = await request.json();
    const { reference } = body as { reference?: string };

    if (!reference) {
      return NextResponse.json(
        { error: "reference is required" },
        { status: 400 }
      );
    }

    // 3. Look up the payment in our DB
    const [payment] = await db
      .select()
      .from(payments)
      .where(eq(payments.reference, reference))
      .limit(1);

    if (!payment) {
      return NextResponse.json(
        { error: "Payment record not found" },
        { status: 404 }
      );
    }

    // Ensure the payment belongs to this user
    if (payment.userId !== user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // If already approved, return success immediately (idempotent)
    if (payment.status === "approved") {
      return NextResponse.json({ status: "approved", message: "Payment already confirmed" });
    }

    // 4. Call Paystack verify endpoint
    const verifyRes = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const verifyData = await verifyRes.json();

    // 5. Validate Paystack response
    if (!verifyData.status || verifyData.data?.status !== "success") {
      // Transaction was not successful
      await db
        .update(payments)
        .set({ status: "failed", reviewedAt: new Date() })
        .where(eq(payments.reference, reference));

      return NextResponse.json(
        { status: "failed", error: "Transaction was not successful" },
        { status: 400 }
      );
    }

    // 6. CRITICAL SECURITY CHECK: verify amount matches
    const paystackAmount = verifyData.data.amount; // in kobo
    if (paystackAmount !== payment.amount) {
      console.error(
        `[Paystack Verify] Amount mismatch! Expected: ${payment.amount}, Got: ${paystackAmount}, Ref: ${reference}`
      );

      await db
        .update(payments)
        .set({ status: "failed", reviewedAt: new Date() })
        .where(eq(payments.reference, reference));

      return NextResponse.json(
        { status: "failed", error: "Amount mismatch — possible tampering detected" },
        { status: 400 }
      );
    }

    // 7. Mark as approved
    await db
      .update(payments)
      .set({
        status: "approved",
        method: verifyData.data.channel || "card", // "card", "bank", "ussd", etc.
        reviewedAt: new Date(),
      })
      .where(eq(payments.reference, reference));

    return NextResponse.json({
      status: "approved",
      message: "Payment verified successfully",
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[Paystack Verify Error]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
