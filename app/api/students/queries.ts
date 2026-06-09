import { db } from "@/lib/neon";
import { user, payments, courses } from "@/lib/neon/schema";
import { eq, ilike, and, or, count } from "drizzle-orm";
import type { StudentListQuery, PaginatedStudents, StudentWithPurchases, Student } from "./interface";

export async function listStudents(query: StudentListQuery = {}): Promise<PaginatedStudents> {
  const { page = 1, limit = 10, search } = query;
  const offset = (page - 1) * limit;

  const conditions = [eq(user.role, "student")];

  if (search) {
    const searchFilter = or(
      ilike(user.name, `%${search}%`),
      ilike(user.email, `%${search}%`),
      ilike(user.whatsappNumber, `%${search}%`)
    );
    if (searchFilter) conditions.push(searchFilter);
  }

  const whereClause = and(...conditions);

  const [data, totalCount] = await Promise.all([
    db.select().from(user).where(whereClause).limit(limit).offset(offset),
    db.select({ count: count() }).from(user).where(whereClause),
  ]);

  return {
    data,
    total: totalCount[0]?.count ?? 0,
    page,
    limit,
  };
}

export async function getStudent(id: string): Promise<StudentWithPurchases | null> {
  const studentResult = await db.select().from(user).where(and(eq(user.id, id), eq(user.role, "student"))).limit(1);
  if (!studentResult[0]) return null;

  const purchasesData = await db
    .select({
      payment: payments,
      course: courses,
    })
    .from(payments)
    .innerJoin(courses, eq(payments.courseId, courses.id))
    .where(eq(payments.userId, id));

  const purchases = purchasesData.map((p) => ({
    ...p.payment,
    course: p.course,
  }));

  return {
    ...studentResult[0],
    purchases,
  };
}
