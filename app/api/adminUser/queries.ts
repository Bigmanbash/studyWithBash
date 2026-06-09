import { db } from "@/lib/neon";
import { count } from "drizzle-orm";
import { user } from "@/lib/neon/schema";
import { eq } from "drizzle-orm";

/**
 * Check if there is at least one admin in the database.
 * Used for the /admin/install flow to prevent public registration
 * if an admin already exists.
 */
export async function getAdminCount(): Promise<number> {
  const result = await db.select({ count: count() }).from(user).where(eq(user.role, "admin"));
  return result[0].count;
}
