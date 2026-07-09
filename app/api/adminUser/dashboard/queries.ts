import { db } from "@/lib/neon";
import { user, courses, payments } from "@/lib/neon/schema";
import { eq, sum, count, sql } from "drizzle-orm";

export interface DashboardStats {
  totalStudents: number;
  activeCourses: number;
  totalRevenueKobo: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [studentsResult] = await db
    .select({ count: count(user.id) })
    .from(user)
    .where(eq(user.role, "student"));

  const [coursesResult] = await db
    .select({ count: count(courses.id) })
    .from(courses)
    .where(eq(courses.status, "active"));

  const [revenueResult] = await db
    .select({ total: sum(payments.amount) })
    .from(payments)
    .where(eq(payments.status, "approved"));

  return {
    totalStudents: studentsResult?.count || 0,
    activeCourses: coursesResult?.count || 0,
    totalRevenueKobo: Number(revenueResult?.total) || 0,
  };
}

export interface EnrollmentData {
  subject: string;
  enrolled: number;
}

export async function getEnrollmentOverview(): Promise<EnrollmentData[]> {
  const result = await db
    .select({
      subject: courses.subject,
      enrolled: count(payments.id),
    })
    .from(payments)
    .innerJoin(courses, eq(payments.courseId, courses.id))
    .where(eq(payments.status, "approved"))
    .groupBy(courses.subject)
    .orderBy(sql`count(${payments.id}) DESC`)
    .limit(5);

  return result.map((r) => ({
    subject: r.subject,
    enrolled: Number(r.enrolled),
  }));
}

export interface RevenueData {
  month: string;
  revenue: number;
  students: number;
}

export async function getRevenueOverview(): Promise<RevenueData[]> {
  const result = await db
    .select({
      month: sql<string>`to_char(DATE_TRUNC('month', ${payments.submittedAt}), 'Mon')`,
      sortKey: sql<string>`DATE_TRUNC('month', ${payments.submittedAt})`,
      revenue: sum(payments.amount),
      students: count(payments.id),
    })
    .from(payments)
    .where(eq(payments.status, "approved"))
    .groupBy(sql`DATE_TRUNC('month', ${payments.submittedAt})`)
    .orderBy(sql`DATE_TRUNC('month', ${payments.submittedAt}) DESC`)
    .limit(12);

  return result
    .map((r) => ({
      month: r.month,
      revenue: Number(r.revenue),
      students: Number(r.students),
    }))
    .reverse();
}

export interface RecentPaymentData {
  student: string;
  initials: string;
  course: string;
  amount: string;
  status: "pending" | "approved" | "rejected";
  time: string;
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
}

export async function getRecentPayments(): Promise<RecentPaymentData[]> {
  const result = await db
    .select({
      studentName: user.name,
      courseSubject: courses.subject,
      courseLevel: courses.level,
      amount: payments.amount,
      status: payments.status,
      submittedAt: payments.submittedAt,
    })
    .from(payments)
    .innerJoin(user, eq(payments.userId, user.id))
    .innerJoin(courses, eq(payments.courseId, courses.id))
    .orderBy(sql`${payments.submittedAt} DESC`)
    .limit(5);

  return result.map((r) => {
    const name = r.studentName || "Unknown User";
    const initials = name
      .split(/\s+/)
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

    return {
      student: name,
      initials,
      course: `${r.courseSubject} (${r.courseLevel || "N/A"})`,
      amount: `₦${(r.amount / 100).toLocaleString()}`,
      status: r.status as "pending" | "approved" | "rejected",
      time: timeAgo(r.submittedAt),
    };
  });
}
