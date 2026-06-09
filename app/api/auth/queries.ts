// ── Auth read helpers ─────────────────────────────────────────────────────────
// Server-side session reading. Use in Server Components, middleware,
// and API Route Handlers where the Better Auth React hooks are unavailable.

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import type { AuthUser } from "./interface";

/**
 * Get the current session from the request headers.
 * Returns null if there is no active session.
 * Use in Server Components and Route Handlers.
 */
export async function getServerSession(): Promise<AuthUser | null> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) return null;

    return {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      role: (session.user as { role?: string }).role as AuthUser["role"] ?? "student",
      image: session.user.image,
    };
  } catch {
    return null;
  }
}

/**
 * Assert the user is authenticated. Throws if the session is missing.
 * Use in API Route Handlers that require authentication.
 */
export async function requireServerSession(): Promise<AuthUser> {
  const user = await getServerSession();
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}

/**
 * Assert the user is an admin. Throws if the session is missing or
 * the user does not have the admin role.
 */
export async function requireAdminSession(): Promise<AuthUser> {
  const user = await requireServerSession();
  if (user.role !== "admin") throw new Error("FORBIDDEN");
  return user;
}
