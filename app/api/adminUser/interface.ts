// ── Admin User types ─────────────────────────────────────────────────────────

export interface AdminInstallPayload {
  name: string;
  email: string;
  password: string;
}

export interface AdminStats {
  adminCount: number;
}
