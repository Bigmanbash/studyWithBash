import { NextResponse } from "next/server";
import { db } from "@/lib/neon";
import { payments, user, courses, affiliates } from "@/lib/neon/schema";
import { eq, desc } from "drizzle-orm";
import { requireServerSession } from "@/app/api/auth/queries";

export async function GET(request: Request) {
  try {
    const sessionUser = await requireServerSession();
    if (sessionUser.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const allPayments = await db
      .select({
        id: payments.id,
        amount: payments.amount,
        status: payments.status,
        submittedAt: payments.submittedAt,
        method: payments.method,
        reference: payments.reference,
        tier: payments.tier,
        proofUrl: payments.proofPath,
        student: {
          name: user.name,
          email: user.email,
        },
        course: {
          subject: courses.subject,
          level: courses.level,
        },
        affiliate: {
          id: affiliates.id,
          code: affiliates.referralCode,
        },
      })
      .from(payments)
      .leftJoin(user, eq(payments.userId, user.id))
      .leftJoin(courses, eq(payments.courseId, courses.id))
      .leftJoin(affiliates, eq(payments.affiliateId, affiliates.id))
      .orderBy(desc(payments.submittedAt));

    return NextResponse.json(allPayments);
  } catch (error: any) {
    console.error("Error fetching admin payments:", error);
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const sessionUser = await requireServerSession();
    if (sessionUser.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (status !== "approved" && status !== "rejected") {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    await db.update(payments).set({ status }).where(eq(payments.id, id));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error updating payment status:", error);
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
