// ── Affiliate System Constants ────────────────────────────────────────────────
// Single source of truth for all affiliate configuration.
// Change values here and they propagate across the entire system.

// ── Commission ────────────────────────────────────────────────────────────────

/** Default commission rate (percentage) for new affiliates. Admin can override per-affiliate. */
export const DEFAULT_COMMISSION_RATE = 20;

/** Minimum payout balance in kobo before admin can process a payout. ₦10,000 = 1,000,000 kobo */
export const PAYOUT_THRESHOLD_KOBO = 1_000_000;

/** Human-readable payout threshold for display in UI */
export const PAYOUT_THRESHOLD_DISPLAY = "₦10,000";

// ── Referral Code Format ──────────────────────────────────────────────────────

/** Prefix for all referral codes (per-agent, not per-course) */
export const REFERRAL_CODE_PREFIX = "BSH";

/** Length of the random suffix after the prefix */
export const REFERRAL_CODE_RANDOM_LENGTH = 6;

// ── Access Code Format ────────────────────────────────────────────────────────

/** Prefix for all access codes */
export const ACCESS_CODE_PREFIX = "BSH";

/** Length of the random suffix in access codes */
export const ACCESS_CODE_RANDOM_LENGTH = 6;

// ── Roles ─────────────────────────────────────────────────────────────────────

export const USER_ROLES = ["student", "admin", "agent", "pending_agent"] as const;
export type UserRole = (typeof USER_ROLES)[number];

// ── Affiliate Status ──────────────────────────────────────────────────────────

export const AFFILIATE_STATUSES = ["pending", "approved", "rejected", "suspended"] as const;
export type AffiliateStatus = (typeof AFFILIATE_STATUSES)[number];

// ── Commission Status ─────────────────────────────────────────────────────────

export const COMMISSION_STATUSES = ["pending", "credited", "paid"] as const;
export type CommissionStatus = (typeof COMMISSION_STATUSES)[number];

// ── Commission Type ───────────────────────────────────────────────────────────

export const COMMISSION_TYPES = ["referral", "proxy"] as const;
export type CommissionType = (typeof COMMISSION_TYPES)[number];

// ── Access Code Status ────────────────────────────────────────────────────────

export const ACCESS_CODE_STATUSES = ["unused", "redeemed", "expired"] as const;
export type AccessCodeStatus = (typeof ACCESS_CODE_STATUSES)[number];

// ── Code Generation Helpers ───────────────────────────────────────────────────

/**
 * Generate a referral code for an agent.
 * Format: BSH-XXXXXX (e.g. BSH-K3P1M7)
 */
export function generateReferralCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no I/O/0/1 for readability
  let random = "";
  for (let i = 0; i < REFERRAL_CODE_RANDOM_LENGTH; i++) {
    random += chars[Math.floor(Math.random() * chars.length)];
  }
  return `${REFERRAL_CODE_PREFIX}-${random}`;
}

/**
 * Generate an access code for a student.
 * Format: BSH-{COURSE_PREFIX}-XXXXXX (e.g. BSH-MATH-K3P1M7)
 * courseSubject is used to derive the prefix (first 4 chars, uppercased).
 */
export function generateAccessCode(courseSubject: string): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const coursePrefix = courseSubject
    .replace(/[^a-zA-Z]/g, "")
    .substring(0, 4)
    .toUpperCase();
  let random = "";
  for (let i = 0; i < ACCESS_CODE_RANDOM_LENGTH; i++) {
    random += chars[Math.floor(Math.random() * chars.length)];
  }
  return `${ACCESS_CODE_PREFIX}-${coursePrefix}-${random}`;
}
