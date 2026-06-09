// ── Auth mutations ────────────────────────────────────────────────────────────
// All write operations (login, signup, logout) live here.
// Components call these functions — they never import signIn/signUp directly.
// This separation means swapping the auth provider only requires changes here.

import { signIn, signUp, signOut } from "@/lib/auth-client";
import type { AuthResult, LoginPayload, SignupPayload, AuthUser } from "./interface";

/**
 * Sign in with email and password.
 * Returns the authenticated user on success, or an error string on failure.
 */
export async function loginWithEmail(
  payload: LoginPayload
): Promise<AuthResult<AuthUser>> {
  try {
    const result = await signIn.email({
      email: payload.email,
      password: payload.password,
    });

    if (result.error) {
      return { ok: false, error: result.error.message ?? "Login failed" };
    }

    return {
      ok: true,
      data: {
        id: result.data.user.id,
        name: result.data.user.name,
        email: result.data.user.email,
        role: (result.data.user as { role?: string }).role as AuthUser["role"] ?? "student",
        image: result.data.user.image,
      },
    };
  } catch {
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}

/**
 * Create a new student account.
 * Better Auth handles the session automatically after signup.
 */
export async function registerStudent(
  payload: SignupPayload
): Promise<AuthResult<AuthUser>> {
  try {
    const result = await signUp.email({
      name: `${payload.firstName} ${payload.lastName}`,
      email: payload.email,
      password: payload.password,
      // Custom fields declared in lib/auth.ts under user.additionalFields
      // @ts-expect-error Better Auth client types don't automatically pick up server-side additionalFields
      whatsappNumber: payload.whatsappNumber,
      howDidYouFindUs: payload.howDidYouFindUs,
    });

    if (result.error) {
      return { ok: false, error: result.error.message ?? "Sign up failed" };
    }

    return {
      ok: true,
      data: {
        id: result.data.user.id,
        name: result.data.user.name,
        email: result.data.user.email,
        role: "student",
      },
    };
  } catch {
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}

/**
 * Sign out the current user and clear the server session.
 */
export async function logout(): Promise<AuthResult> {
  try {
    await signOut();
    return { ok: true, data: undefined };
  } catch {
    return { ok: false, error: "Failed to sign out." };
  }
}
