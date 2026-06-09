import { signUp } from "@/lib/auth-client";
import { getAdminCount } from "./queries";
import type { AdminInstallPayload } from "./interface";
import type { AuthResult, AuthUser } from "@/app/api/auth";

/**
 * Creates the first admin user for the system.
 * This should ONLY succeed if getAdminCount() === 0.
 */
export async function installAdmin(payload: AdminInstallPayload): Promise<AuthResult<AuthUser>> {
  try {
    // We cannot reliably call DB from the client here if it's a client mutation
    // So this will call an API route that does the server-side check.
    // We'll use the API route /api/adminUser/install to handle this securely.
    throw new Error("Use the API route directly to install an admin to guarantee server-side checks.");
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}
