// ── Auth domain types ─────────────────────────────────────────────────────────
// Single source of truth for all auth-related types used across components,
// mutations, and API routes. Derive from Better Auth where possible so changes
// to the schema automatically propagate here.

export type UserRole = "student" | "admin";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  whatsappNumber?: string | null;
  image?: string | null;
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
}

// ── Mutation result types ─────────────────────────────────────────────────────

export type AuthResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string };
