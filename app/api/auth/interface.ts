// ── Auth domain types ─────────────────────────────────────────────────────────
// Single source of truth for all auth-related types used across components,
// mutations, and API routes. Derive from Better Auth where possible so changes
// to the schema automatically propagate here.

import type { UserRole } from "@/lib/affiliate-constants";

export type { UserRole } from "@/lib/affiliate-constants";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  whatsappNumber?: string | null;
  image?: string | null;
  referredBy?: string | null;
  referralCodeUsed?: string | null;
  schoolName?: string | null;
  estimatedStudents?: number | null;
}

// ── Form payload types ────────────────────────────────────────────────────────

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupPayload {
  firstName: string;
  lastName: string;
  email: string;
  whatsappNumber: string;
  howDidYouFindUs: string;
  password: string;
  // Agent-specific fields (only when isAgent = true)
  isAgent?: boolean;
  schoolName?: string;
  estimatedStudents?: number;
  // Student-specific fields
  referralCode?: string; // code entered at registration
}

// ── Mutation result types ─────────────────────────────────────────────────────

export type AuthResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string };
