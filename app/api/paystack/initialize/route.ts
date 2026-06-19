// ── Paystack Transaction Initialize ───────────────────────────────────────────
// POST /api/paystack/initialize
// Body: { courseId: string }
//
// 1. Authenticates the user via session
// 2. Fetches the course from DB and reads the canonical price (kobo)
// 3. Generates a unique reference
// 4. Inserts a "pending" payment row
// 5. Calls Paystack's /transaction/initialize with the server-side price
// 6. Returns { access_code, reference } to the frontend for popup

import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/neon";
import { courses, payments } from "@/lib/neon/schema";
import { eq, and } from "drizzle-orm";
import { requireServerSession } from "@/app/api/auth/queries";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;

export async function POST(request: Request) {
  try {
    // 1. Authenticate
    const user = await requireServerSession();

    // 2. Parse and validate body
    const body = await request.json();
    const { courseId } = body as { courseId?: string };

    if (!courseId) {
      return NextResponse.json(
        { error: "courseId is required" },
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

    // 4. Check if the user already owns this course (approved payment exists)
    const [existingPurchase] = await db
      .select({ id: payments.id })
      .from(payments)
      .where(
        and(
          eq(payments.userId, user.id),
          eq(payments.courseId, courseId),
          eq(payments.status, "approved")
        )
      )
      .limit(1);

    if (existingPurchase) {
      return NextResponse.json(
        { error: "You already own this course" },
        { status: 409 }
      );
    }

    // 5. Generate a unique reference
    const reference = `ba_${Date.now()}_${crypto.randomBytes(6).toString("hex")}`;

    // 6. Insert a pending payment record
    await db.insert(payments).values({
      userId: user.id,
      courseId: course.id,
      amount: course.price,
      status: "pending",
      reference,
    });

    // 7. Initialize transaction with Paystack
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
          amount: course.price, // already in kobo
          reference,
          metadata: {
            course_id: course.id,
            course_title: course.title,
            user_id: user.id,
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

    // 8. Store the access_code for debugging/resumption
    await db
      .update(payments)
      .set({ paystackAccessCode: paystackData.data.access_code })
      .where(eq(payments.reference, reference));

    // 9. Return only what the frontend needs
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
