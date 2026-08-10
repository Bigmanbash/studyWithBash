// ── Access Codes queries ───────────────────────────────────────────────────────
// Server-side read operations for access codes.

import { db } from "@/lib/neon";
import { accessCodes, courses, affiliates, user } from "@/lib/neon/schema";
import { eq, ilike, and, or, count, desc } from "drizzle-orm";
import type { AccessCodeStatus } from "@/lib/affiliate-constants";
import type { AccessCodeRecord } from "../affiliates/interface";

export interface AccessCodeListQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: AccessCodeStatus;
  affiliateId?: string;
}

export interface PaginatedAccessCodes {
  data: AccessCodeRecord[];
  total: number;
  page: number;
  limit: number;
}

/**
 * List access codes with pagination, search, and optional affiliate filter.
 */
export async function listAccessCodes(query: AccessCodeListQuery = {}): Promise<PaginatedAccessCodes> {
  const { page = 1, limit = 10, search, status, affiliateId } = query;
  const offset = (page - 1) * limit;

  const conditions = [];

  if (status) {
    conditions.push(eq(accessCodes.status, status));
  }
  if (affiliateId) {
    conditions.push(eq(accessCodes.affiliateId, affiliateId));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  // The search condition covers the code itself, course subject, or redeemed user name
  const searchCondition = search
    ? or(
        ilike(accessCodes.code, `%${search}%`),
        ilike(courses.subject, `%${search}%`),
        ilike(user.name, `%${search}%`)
      )
    : undefined;

  const finalWhere = and(whereClause, searchCondition);

  // Left join user because redeemedBy can be null
  const [rows, totalCount] = await Promise.all([
    db
      .select({
        accessCode: accessCodes,
        course: {
          id: courses.id,
          title: courses.title,
          subject: courses.subject,
        },
        affiliate: {
          id: affiliates.id,
          referralCode: affiliates.referralCode,
        },
        redeemedByUser: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      })
      .from(accessCodes)
      .innerJoin(courses, eq(accessCodes.courseId, courses.id))
      .innerJoin(affiliates, eq(accessCodes.affiliateId, affiliates.id))
      .leftJoin(user, eq(accessCodes.redeemedBy, user.id))
      .where(finalWhere)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(accessCodes.createdAt)),
    db
      .select({ count: count() })
      .from(accessCodes)
      .innerJoin(courses, eq(accessCodes.courseId, courses.id))
      .innerJoin(affiliates, eq(accessCodes.affiliateId, affiliates.id))
      .leftJoin(user, eq(accessCodes.redeemedBy, user.id))
      .where(finalWhere),
  ]);

  return {
    data: rows.map((r) => ({
      ...r.accessCode,
      course: r.course,
      affiliate: r.affiliate,
      redeemedByUser: r.redeemedByUser || undefined,
    })),
    total: totalCount[0]?.count ?? 0,
    page,
    limit,
  };
}

/**
 * Get aggregate stats for access codes.
 */
export async function getAdminAccessCodeStats(affiliateId?: string) {
  const baseCondition = affiliateId ? eq(accessCodes.affiliateId, affiliateId) : undefined;

  const [total] = await db.select({ count: count() }).from(accessCodes).where(baseCondition);
  const [unused] = await db
    .select({ count: count() })
    .from(accessCodes)
    .where(baseCondition ? and(baseCondition, eq(accessCodes.status, "unused")) : eq(accessCodes.status, "unused"));
  const [redeemed] = await db
    .select({ count: count() })
    .from(accessCodes)
    .where(baseCondition ? and(baseCondition, eq(accessCodes.status, "redeemed")) : eq(accessCodes.status, "redeemed"));
  const [expired] = await db
    .select({ count: count() })
    .from(accessCodes)
    .where(baseCondition ? and(baseCondition, eq(accessCodes.status, "expired")) : eq(accessCodes.status, "expired"));

  return {
    totalCodes: total?.count ?? 0,
    unusedCodes: unused?.count ?? 0,
    redeemedCodes: redeemed?.count ?? 0,
    expiredCodes: expired?.count ?? 0,
  };
}

/**
 * Get details for a specific access code string.
 */
export async function getAccessCodeByCode(code: string) {
  const rows = await db
    .select({
      accessCode: accessCodes,
      course: {
        id: courses.id,
        title: courses.title,
        subject: courses.subject,
      },
      affiliateUser: {
        name: user.name,
      }
    })
    .from(accessCodes)
    .innerJoin(courses, eq(accessCodes.courseId, courses.id))
    .innerJoin(affiliates, eq(accessCodes.affiliateId, affiliates.id))
    .innerJoin(user, eq(affiliates.userId, user.id))
    .where(eq(accessCodes.code, code.toUpperCase()))
    .limit(1);

  if (!rows[0]) return null;

  return {
    ...rows[0].accessCode,
    course: rows[0].course,
    affiliateAgentName: rows[0].affiliateUser.name,
  };
}
