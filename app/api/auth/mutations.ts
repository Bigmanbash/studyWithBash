// ── Auth mutations ────────────────────────────────────────────────────────────
// All write operations (login, signup, logout) live here.
// Components call these functions — they never import signIn/signUp directly.
// This separation means swapping the auth provider only requires changes here.

import { signIn, signUp, signOut } from "@/lib/auth-client";
import type { AuthResult, LoginPayload, SignupPayload, AuthUser } from "./interface";
import { DEFAULT_COMMISSION_RATE } from "@/lib/affiliate-constants";

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
  } catch (err: any) {
    console.error("loginWithEmail error:", err);
    return { ok: false, error: err?.message || "Something went wrong. Please try again." };
  }
}

/**
 * Create a new student account.
 * Optionally validates a referral code and links the student to the referring agent.
 * Better Auth handles the session automatically after signup.
 */
export async function registerStudent(
  payload: SignupPayload
): Promise<AuthResult<AuthUser>> {
  try {
    // If referral code provided, validate it server-side via API
    let referredBy: string | undefined;
    if (payload.referralCode?.trim()) {
      const validateRes = await fetch("/api/affiliates/validate-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: payload.referralCode.trim().toUpperCase() }),
      });
      if (validateRes.ok) {
        const data = await validateRes.json();
        referredBy = data.affiliateUserId;
      }
      // If code is invalid, we silently ignore — don't block registration
    }

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
      console.error("signUp.email error:", result.error);
      return { ok: false, error: result.error.message ?? "Sign up failed" };
    }

    // If referral code was valid, update user with referredBy server-side
    if (referredBy && result.data.user.id) {
      await fetch("/api/affiliates/link-referral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: result.data.user.id,
          referredBy,
          referralCode: payload.referralCode!.trim().toUpperCase(),
        }),
      });
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
  } catch (err: any) {
    console.error("registerStudent error:", err);
    return { ok: false, error: err?.message || "Something went wrong. Please try again." };
  }
}

/**
 * Register as a teacher/agent. Creates user with role "pending_agent"
 * and an affiliate profile with status "pending".
 * Admin must approve before the agent can start earning.
 */
export async function registerAsAgent(
  payload: SignupPayload
): Promise<AuthResult<AuthUser>> {
  try {
    const result = await signUp.email({
      name: `${payload.firstName} ${payload.lastName}`,
      email: payload.email,
      password: payload.password,
      // @ts-expect-error Better Auth client types don't automatically pick up server-side additionalFields
      whatsappNumber: payload.whatsappNumber,
      howDidYouFindUs: payload.howDidYouFindUs,
      schoolName: payload.schoolName,
      estimatedStudents: payload.estimatedStudents,
    });

    if (result.error) {
      console.error("registerAsAgent signUp error:", result.error);
      return { ok: false, error: result.error.message ?? "Sign up failed" };
    }

    // Create the affiliate profile and set role to pending_agent server-side
    await fetch("/api/affiliates/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: result.data.user.id,
        schoolName: payload.schoolName,
        estimatedStudents: payload.estimatedStudents,
      }),
    });

    return {
      ok: true,
      data: {
        id: result.data.user.id,
        name: result.data.user.name,
        email: result.data.user.email,
        role: "pending_agent",
      },
    };
  } catch (err: any) {
    console.error("registerAsAgent error:", err);
    return { ok: false, error: err?.message || "Something went wrong. Please try again." };
  }
}

/**
 * Sign out the current user and clear the server session.
 */
export async function logout(): Promise<AuthResult> {
  try {
    await signOut();
    return { ok: true, data: undefined };
  } catch (err: any) {
    console.error("logout error:", err);
    return { ok: false, error: "Failed to sign out." };
  }
}
