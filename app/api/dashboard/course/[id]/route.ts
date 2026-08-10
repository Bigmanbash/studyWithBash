import { NextResponse } from "next/server";
import { getServerSession } from "@/app/api/auth/queries";
import { getCourse } from "@/app/api/courses/queries";
import { db } from "@/lib/neon";
import { payments } from "@/lib/neon/schema";
import { and, eq } from "drizzle-orm";
import { getEffectiveTier } from "@/lib/tiers";

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

    // Fetch approved payment records to determine purchase status & effective tier
    const purchaseRecords = await db
      .select({ tier: payments.tier })
      .from(payments)
      .where(
        and(
          eq(payments.userId, session.id),
          eq(payments.courseId, id),
          eq(payments.status, "approved")
        )
      );

    const isPurchased = purchaseRecords.length > 0;
    const purchasedTier = getEffectiveTier(purchaseRecords.map((p) => p.tier));

    // Secure the PDF path if not purchased
    if (!isPurchased && course.pdfPath) {
      course.pdfPath = `/api/dashboard/course/${course.id}/preview`;
    }

    return NextResponse.json({
      course,
      isPurchased,
      purchasedTier,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
