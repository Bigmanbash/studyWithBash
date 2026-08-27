// ── Auth mutations ────────────────────────────────────────────────────────────
// All write operations (login, signup, logout) live here.
// Components call these functions — they never import signIn/signUp directly.
// This separation means swapping the auth provider only requires changes here.

import { signIn, signUp, signOut } from "@/lib/auth-client";
import type { AuthResult, LoginPayload, SignupPayload, AuthUser } from "./interface";
import { DEFAULT_COMMISSION_RATE } from "@/lib/affiliate-constants";

/**
 * Maps raw auth errors into user-friendly, specific messages.
 */
function formatAuthError(
  error: { message?: string; status?: number; code?: string } | null | undefined,
  fallback = "Authentication failed"
): string {
  if (!error) return fallback;

  const rawMessage = (error.message || "").toLowerCase();
  const code = (error.code || "").toUpperCase();

  // User does not exist
  if (
    code === "USER_NOT_FOUND" ||
    rawMessage.includes("User not found") ||
    rawMessage.includes("no user found") ||
    rawMessage.includes("account not found") ||
    rawMessage.includes("does not exist") ||
    rawMessage.includes("doesn't exist")
  ) {
    return "No account found with this email address. Please check your email or sign up.";
  }

  // Incorrect password
  if (
    code === "INVALID_PASSWORD" ||
    rawMessage.includes("invalid password") ||
    rawMessage.includes("incorrect password") ||
    rawMessage.includes("wrong password")
  ) {
    return "Incorrect password. Please try again or click 'Forgot password?' to reset it.";
  }

  // Invalid email or password general combination
  if (
    code === "INVALID_EMAIL_OR_PASSWORD" ||
    rawMessage.includes("invalid email or password") ||
    rawMessage.includes("invalid credentials")
  ) {
    return "Invalid email or password. Please check your details, sign up if new, or click 'Forgot password?'.";
  }

  // Account already exists on signup
  if (
    code === "USER_ALREADY_EXISTS" ||
    rawMessage.includes("already exists") ||
    rawMessage.includes("email already in use") ||
    rawMessage.includes("duplicate key")
  ) {
    return "An account with this email address already exists. Please sign in instead.";
  }

  // Email verification required
  if (
    code === "EMAIL_NOT_VERIFIED" ||
    rawMessage.includes("email not verified") ||
    rawMessage.includes("verify your email")
  ) {
    return "Please verify your email address before signing in. Check your inbox for the link.";
  }

  // Rate limiting / Too many attempts
  if (
    code === "TOO_MANY_REQUESTS" ||
    error.status === 429 ||
    rawMessage.includes("too many") ||
    rawMessage.includes("rate limit")
  ) {
    return "Too many failed attempts. Please wait a few minutes before trying again.";
  }

  return error.message || fallback;
}

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
      return { ok: false, error: formatAuthError(result.error, "Invalid email or password. Please check your credentials or sign up.") };
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
    if (process.env.NODE_ENV === "development") {
      console.error("loginWithEmail error:", err);
    }
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
      if (process.env.NODE_ENV === "development") {
        console.error("signUp.email error:", result.error);
      }
      return { ok: false, error: formatAuthError(result.error, "Sign up failed. Please check your details.") };
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
    if (process.env.NODE_ENV === "development") {
      console.error("registerStudent error:", err);
    }
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
      if (process.env.NODE_ENV === "development") {
        console.error("registerAsAgent signUp error:", result.error);
      }
      return { ok: false, error: formatAuthError(result.error, "Agent registration failed. Please check your details.") };
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
    if (process.env.NODE_ENV === "development") {
      console.error("registerAsAgent error:", err);
    }
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
