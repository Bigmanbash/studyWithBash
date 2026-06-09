// ── Auth API barrel ───────────────────────────────────────────────────────────
// Import auth utilities from this single path throughout the app.
// e.g. import { loginWithEmail, getServerSession } from "@/app/api/auth"

export type { AuthUser, AuthResult, LoginPayload, SignupPayload, UserRole } from "./interface";
export { loginWithEmail, registerStudent, logout } from "./mutations";
