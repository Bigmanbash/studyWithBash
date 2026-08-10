// ── Affiliate domain types ────────────────────────────────────────────────────

import type { AffiliateStatus, CommissionStatus, CommissionType, AccessCodeStatus } from "@/lib/affiliate-constants";

export interface AffiliateProfile {
  id: string;
  userId: string;
  referralCode: string | null;
  commissionRate: number;
  totalEarned: number;
  pendingPayout: number;
  status: AffiliateStatus;
  schoolName: string | null;
  estimatedStudents: number | null;
  approvedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  // Joined fields
  user?: {
    id: string;
    name: string;
    email: string;
    whatsappNumber: string | null;
    image: string | null;
  };
}

export interface CommissionRecord {
  id: string;
  affiliateId: string;
  paymentId: string;
  studentId: string;
  courseId: string;
  type: CommissionType;
  saleAmount: number;
  commissionAmount: number;
  status: CommissionStatus;
  paidAt: Date | null;
  createdAt: Date;
  // Joined fields
  student?: { id: string; name: string; email: string };
  course?: { id: string; title: string; subject: string };
}

export interface AccessCodeRecord {
  id: string;
  code: string;
  affiliateId: string;
  courseId: string;
  tier: string;
  paymentId: string;
  status: AccessCodeStatus;
  redeemedBy: string | null;
  redeemedAt: Date | null;
  expiresAt: Date | null;
  createdAt: Date;
  // Joined fields
  course?: { id: string; title: string; subject: string };
  redeemedByUser?: { id: string; name: string; email: string };
  affiliate?: { id: string; referralCode: string | null; user?: { name: string } };
}

export interface AffiliateStats {
  totalEarned: number;
  pendingPayout: number;
  studentsReferred: number;
  coursesSold: number;
  totalCommissions: number;
  referralCount: number;
  proxyCount: number;
}

export interface AffiliateListQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: AffiliateStatus;
}

export interface PaginatedAffiliates {
  data: AffiliateProfile[];
  total: number;
  page: number;
  limit: number;
}

export interface PaginatedCommissions {
  data: CommissionRecord[];
  total: number;
  page: number;
  limit: number;
}
