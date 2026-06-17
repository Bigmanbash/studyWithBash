import { NextResponse } from "next/server";
import { getServerSession } from "@/app/api/auth/queries";
import { getCourse } from "@/app/api/courses/queries";
import { db } from "@/lib/neon";
import { payments } from "@/lib/neon/schema";
import { and, eq } from "drizzle-orm";

export const GET = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const course = await getCourse(id);
    
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Check if the user has purchased the course
    const purchaseRecords = await db
      .select()
      .from(payments)
      .where(
        and(
          eq(payments.userId, session.id),
          eq(payments.courseId, id),
          eq(payments.status, "approved")
        )
      )
      .limit(1);

    const isPurchased = purchaseRecords.length > 0;

    return NextResponse.json({
      course,
      isPurchased,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
