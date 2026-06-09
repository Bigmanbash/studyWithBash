import { createAuthClient } from "better-auth/react";

/**
 * Client-side Better Auth instance.
 * Use this in React components for sign-in, sign-up, sign-out, and
 * reading the current session — all without hitting Next.js API routes directly.
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
} = authClient;
