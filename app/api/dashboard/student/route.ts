import { NextResponse } from "next/server";
import { db } from "@/lib/neon";
import { courses, payments } from "@/lib/neon/schema";
import { eq, desc, and } from "drizzle-orm";
import { requireServerSession } from "@/app/api/auth/queries";

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

    // Fetch recently purchased
    // We only care about approved payments, or maybe all depending on logic.
    // Let's get approved payments
    const purchasedData = await db
      .select({
        course: courses,
      })
      .from(payments)
      .innerJoin(courses, eq(payments.courseId, courses.id))
      .where(and(eq(payments.userId, user.id), eq(payments.status, "approved")))
      .orderBy(desc(payments.submittedAt))
      .limit(4);

    let purchasedCourses = purchasedData.map((p) => p.course);

    // Fetch available courses (paginated, just fetch latest active courses)
    const availableData = await db
      .select()
      .from(courses)
      .where(eq(courses.status, "active"))
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
