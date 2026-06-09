import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  pgEnum,
  uuid,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// ── Better Auth required tables ───────────────────────────────────────────────
// These four tables are the minimum required by Better Auth's Drizzle adapter.

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  // App-specific fields
  role: text("role", { enum: ["student", "admin"] }).notNull().default("student"),
  whatsappNumber: text("whatsapp_number"),
  howDidYouFindUs: text("how_did_you_find_us"),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ── Application enums ─────────────────────────────────────────────────────────

/**
 * A course is either:
 *  - "school" → requires level + term + subject (e.g. SSS1 / First Term / Mathematics)
 *  - "exam"   → level/term are null; subject holds the package name (JAMB, WAEC, etc.)
 */
export const courseCategoryEnum = pgEnum("course_category", ["school", "exam"]);

/** Only used when category = "school" */
export const courseLevelEnum = pgEnum("course_level", ["SSS1", "SSS2", "SSS3"]);

/** Only used when category = "school" */
export const courseTermEnum = pgEnum("course_term", ["first", "second", "third"]);

export const courseStatusEnum = pgEnum("course_status", ["active", "draft"]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "approved",
  "rejected",
]);

// ── Courses ───────────────────────────────────────────────────────────────────

/**
 * coverImagePath and pdfPath are Supabase Storage keys — NOT full URLs.
 * Generate signed / public URLs at request time in the API layer.
 *
 * slug is a URL-safe identifier (e.g. "sss1-first-term-mathematics" or "jamb-2025").
 * Keep it stable — it appears in share links.
 */
export const courses = pgTable(
  "courses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    category: courseCategoryEnum("category").notNull().default("school"),
    // school-curriculum fields (null when category = "exam")
    level: courseLevelEnum("level"),
    term: courseTermEnum("term"),
    // "Mathematics" for school courses, or "JAMB" | "WAEC" | "NECO" for exam packages
    subject: text("subject").notNull(),
    description: text("description"),
    price: integer("price").notNull(), // store in kobo (lowest denomination)
    originalPrice: integer("original_price"),
    coverImagePath: text("cover_image_path"), // Supabase Storage key
    pdfPath: text("pdf_path"),               // Supabase Storage key
    status: courseStatusEnum("status").notNull().default("draft"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => ({
    slugIdx: uniqueIndex("courses_slug_idx").on(t.slug),
  })
);

// ── Payments ──────────────────────────────────────────────────────────────────

export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  courseId: uuid("course_id")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  amount: integer("amount").notNull(),         // kobo
  status: paymentStatusEnum("status").notNull().default("pending"),
  method: text("method"),                      // "bank_transfer" | "card" | "ussd"
  reference: text("reference").unique(),        // bank/payment reference
  proofPath: text("proof_path"),               // Supabase Storage key for receipt image
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
});

// ── Type exports ──────────────────────────────────────────────────────────────
export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
export type Course = typeof courses.$inferSelect;
export type NewCourse = typeof courses.$inferInsert;
export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
