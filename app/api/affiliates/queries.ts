// ── Affiliate queries ─────────────────────────────────────────────────────────
// Server-side read operations for affiliates, commissions, and access codes.

import { db } from "@/lib/neon";
import { affiliates, commissions, accessCodes, user, courses, payments } from "@/lib/neon/schema";
import { eq, ilike, and, or, count, sum, sql } from "drizzle-orm";
import type { AffiliateListQuery, PaginatedAffiliates, AffiliateStats, AffiliateProfile } from "./interface";

/**
 * List affiliates with pagination, search, and status filter (admin use).
 */
export async function listAffiliates(query: AffiliateListQuery = {}): Promise<PaginatedAffiliates> {
  const { page = 1, limit = 10, search, status } = query;
  const offset = (page - 1) * limit;

  const conditions = [];

  if (status) {
    conditions.push(eq(affiliates.status, status));
  }

  // Build the where clause
  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [rows, totalCount] = await Promise.all([
    db
      .select({
        affiliate: affiliates,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          whatsappNumber: user.whatsappNumber,
          image: user.image,
        },
      })
      .from(affiliates)
      .innerJoin(user, eq(affiliates.userId, user.id))
      .where(
        search
          ? and(
              whereClause,
              or(
                ilike(user.name, `%${search}%`),
                ilike(user.email, `%${search}%`),
                ilike(affiliates.schoolName, `%${search}%`),
                ilike(affiliates.referralCode, `%${search}%`)
              )
            )
          : whereClause
      )
      .limit(limit)
      .offset(offset)
      .orderBy(affiliates.createdAt),
    db
      .select({ count: count() })
      .from(affiliates)
      .innerJoin(user, eq(affiliates.userId, user.id))
      .where(
        search
          ? and(
              whereClause,
              or(
                ilike(user.name, `%${search}%`),
                ilike(user.email, `%${search}%`),
                ilike(affiliates.schoolName, `%${search}%`),
                ilike(affiliates.referralCode, `%${search}%`)
              )
            )
          : whereClause
      ),
  ]);

  const data: AffiliateProfile[] = rows.map((r) => ({
    ...r.affiliate,
    user: r.user,
  }));

  return {
    data,
    total: totalCount[0]?.count ?? 0,
    page,
    limit,
  };
}

/**
 * Get affiliate profile by user ID.
 */
export async function getAffiliateByUserId(userId: string): Promise<AffiliateProfile | null> {
  const rows = await db
    .select({
      affiliate: affiliates,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        whatsappNumber: user.whatsappNumber,
        image: user.image,
      },
    })
    .from(affiliates)
    .innerJoin(user, eq(affiliates.userId, user.id))
    .where(eq(affiliates.userId, userId))
    .limit(1);

  if (!rows[0]) return null;

  return {
    ...rows[0].affiliate,
    user: rows[0].user,
  };
}

/**
 * Get affiliate by referral code. Used for validating referral codes at registration.
 */
export async function getAffiliateByCode(code: string) {
  const rows = await db
    .select({
      affiliate: affiliates,
      user: {
        id: user.id,
        name: user.name,
      },
    })
    .from(affiliates)
    .innerJoin(user, eq(affiliates.userId, user.id))
    .where(
      and(
        eq(affiliates.referralCode, code.toUpperCase()),
        eq(affiliates.status, "approved")
      )
    )
    .limit(1);

  if (!rows[0]) return null;

  return {
    affiliateId: rows[0].affiliate.id,
    affiliateUserId: rows[0].affiliate.userId,
    referralCode: rows[0].affiliate.referralCode,
    commissionRate: rows[0].affiliate.commissionRate,
    agentName: rows[0].user.name,
  };
}

/**
 * Get aggregate stats for an affiliate.
 */
export async function getAffiliateStats(affiliateId: string): Promise<AffiliateStats> {
  const [affiliate] = await db
    .select()
    .from(affiliates)
    .where(eq(affiliates.id, affiliateId))
    .limit(1);

  if (!affiliate) {
    return {
      totalEarned: 0,
      pendingPayout: 0,
      studentsReferred: 0,
      coursesSold: 0,
      totalCommissions: 0,
      referralCount: 0,
      proxyCount: 0,
    };
  }

  // Count unique students from commissions
  const [studentsCount] = await db
    .select({ count: sql<number>`COUNT(DISTINCT ${commissions.studentId})` })
    .from(commissions)
    .where(eq(commissions.affiliateId, affiliateId));

  // Count unique courses from commissions
  const [coursesCount] = await db
    .select({ count: sql<number>`COUNT(DISTINCT ${commissions.courseId})` })
    .from(commissions)
    .where(eq(commissions.affiliateId, affiliateId));

  // Count by type
  const [referralCount] = await db
    .select({ count: count() })
    .from(commissions)
    .where(and(eq(commissions.affiliateId, affiliateId), eq(commissions.type, "referral")));

  const [proxyCount] = await db
    .select({ count: count() })
    .from(commissions)
    .where(and(eq(commissions.affiliateId, affiliateId), eq(commissions.type, "proxy")));

  const [totalCommissions] = await db
    .select({ count: count() })
    .from(commissions)
    .where(eq(commissions.affiliateId, affiliateId));

  return {
    totalEarned: affiliate.totalEarned,
    pendingPayout: affiliate.pendingPayout,
    studentsReferred: studentsCount?.count ?? 0,
    coursesSold: coursesCount?.count ?? 0,
    totalCommissions: totalCommissions?.count ?? 0,
    referralCount: referralCount?.count ?? 0,
    proxyCount: proxyCount?.count ?? 0,
  };
}

/**
 * List commissions for an affiliate (with pagination).
 */
export async function getAffiliateCommissions(
  affiliateId: string,
  page = 1,
  limit = 20
) {
  const offset = (page - 1) * limit;

  const [rows, totalCount] = await Promise.all([
    db
      .select({
        commission: commissions,
        student: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        course: {
          id: courses.id,
          title: courses.title,
          subject: courses.subject,
        },
      })
      .from(commissions)
      .innerJoin(user, eq(commissions.studentId, user.id))
      .innerJoin(courses, eq(commissions.courseId, courses.id))
      .where(eq(commissions.affiliateId, affiliateId))
      .limit(limit)
      .offset(offset)
      .orderBy(commissions.createdAt),
    db
      .select({ count: count() })
      .from(commissions)
      .where(eq(commissions.affiliateId, affiliateId)),
  ]);

  return {
    data: rows.map((r) => ({
      ...r.commission,
      student: r.student,
      course: r.course,
    })),
    total: totalCount[0]?.count ?? 0,
    page,
    limit,
  };
}

/**
 * Admin: get system-wide affiliate statistics.
 */
export async function getAdminAffiliateStats() {
  const [totalAffiliates] = await db.select({ count: count() }).from(affiliates);
  const [pendingApps] = await db.select({ count: count() }).from(affiliates).where(eq(affiliates.status, "pending"));
  const [approvedAffiliates] = await db.select({ count: count() }).from(affiliates).where(eq(affiliates.status, "approved"));
  const [suspendedAffiliates] = await db.select({ count: count() }).from(affiliates).where(eq(affiliates.status, "suspended"));

  const [totalCommissionsPaid] = await db
    .select({ total: sql<number>`COALESCE(SUM(${commissions.commissionAmount}), 0)` })
    .from(commissions)
    .where(eq(commissions.status, "paid"));

  const [totalCommissionsCredited] = await db
    .select({ total: sql<number>`COALESCE(SUM(${commissions.commissionAmount}), 0)` })
    .from(commissions)
    .where(eq(commissions.status, "credited"));

  return {
    totalAffiliates: totalAffiliates?.count ?? 0,
    pendingApplications: pendingApps?.count ?? 0,
    approvedAffiliates: approvedAffiliates?.count ?? 0,
    suspendedAffiliates: suspendedAffiliates?.count ?? 0,
    totalCommissionsPaid: totalCommissionsPaid?.total ?? 0,
    totalCommissionsCredited: totalCommissionsCredited?.total ?? 0,
  };
}
