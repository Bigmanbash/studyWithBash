import { apiFetch } from "@/app/api/auth/httpClient";
import type { AdminInstallPayload } from "./interface";
import type { AuthResult, AuthUser } from "@/app/api/auth";

export const installFirstAdmin = async (payload: AdminInstallPayload): Promise<AuthResult<AuthUser>> => {
  try {
    const data = await apiFetch<{ user: AuthUser }>("/api/adminUser/install", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return { ok: true, data: data.user };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
};
