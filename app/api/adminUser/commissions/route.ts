import { NextResponse } from "next/server";
import { db } from "@/lib/neon";
import { commissions, payments, user, courses, affiliates } from "@/lib/neon/schema";
import { eq, desc } from "drizzle-orm";
import { requireServerSession } from "@/app/api/auth/queries";
import { alias } from "drizzle-orm/pg-core";

export async function GET(request: Request) {
  try {
    const sessionUser = await requireServerSession();
    if (sessionUser.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const studentUser = alias(user, "studentUser");
    const affiliateUser = alias(user, "affiliateUser");

    const rows = await db
      .select({
        id: commissions.id,
        amount: commissions.commissionAmount,
        type: commissions.type,
        status: commissions.status,
        createdAt: commissions.createdAt,
        affiliateId: affiliates.id,
        affiliateCode: affiliates.referralCode,
        affiliateName: affiliateUser.name,
        affiliateEmail: affiliateUser.email,
        studentName: studentUser.name,
        studentEmail: studentUser.email,
        courseSubject: courses.subject,
        courseLevel: courses.level,
        paymentId: payments.id,
        paymentAmount: payments.amount,
        paymentRef: payments.reference,
      })
      .from(commissions)
      .leftJoin(affiliates, eq(commissions.affiliateId, affiliates.id))
      .leftJoin(affiliateUser, eq(affiliates.userId, affiliateUser.id))
      .leftJoin(studentUser, eq(commissions.studentId, studentUser.id))
      .leftJoin(courses, eq(commissions.courseId, courses.id))
      .leftJoin(payments, eq(commissions.paymentId, payments.id))
      .orderBy(desc(commissions.createdAt));

    const allCommissions = rows.map((row) => ({
      id: row.id,
      amount: row.amount,
      type: row.type,
      status: row.status,
      createdAt: row.createdAt,
      affiliate: row.affiliateId ? {
        id: row.affiliateId,
        code: row.affiliateCode,
        user: {
          name: row.affiliateName,
          email: row.affiliateEmail,
        },
      } : null,
      student: {
        name: row.studentName,
        email: row.studentEmail,
      },
      course: {
        subject: row.courseSubject,
        level: row.courseLevel,
      },
      payment: row.paymentId ? {
        id: row.paymentId,
        amount: row.paymentAmount,
        reference: row.paymentRef,
      } : null,
    }));

    return NextResponse.json(allCommissions);
  } catch (error: any) {
    console.error("Error fetching admin commissions:", error);
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
