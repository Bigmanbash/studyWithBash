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
import { relations } from "drizzle-orm";

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
  "failed",
]);

// ── Courses ───────────────────────────────────────────────────────────────────

/**
 * coverImagePath and pdfPath are Supabase Storage keys — NOT full URLs.
 * Generate signed / public URLs at request time in the API layer.
 *
 * slug is a URL-safe identifier (e.g. "sss1-first-term-mathematics" or "jamb-2025").
 * Keep it stable — it appears in share links.
 *
 * pdfPath is DEPRECATED — materials now live under subtopics.
 * Kept for backward compatibility with existing courses.
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
    pdfPath: text("pdf_path"),               // DEPRECATED — kept for backward compat
    status: courseStatusEnum("status").notNull().default("draft"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => ({
    slugIdx: uniqueIndex("courses_slug_idx").on(t.slug),
  })
);

// ── Topics ────────────────────────────────────────────────────────────────────

/**
 * A topic is a major section within a course (e.g. "Motion", "Force").
 * Topics contain subtopics which in turn contain materials.
 */
export const topics = pgTable("topics", {
  id: uuid("id").primaryKey().defaultRandom(),
  courseId: uuid("course_id")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  slug: text("slug").notNull(),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ── Subtopics ─────────────────────────────────────────────────────────────────

/**
 * A subtopic is a section within a topic (e.g. "Introduction to Motion").
 * Subtopics contain the actual materials (files).
 */
export const subtopics = pgTable("subtopics", {
  id: uuid("id").primaryKey().defaultRandom(),
  topicId: uuid("topic_id")
    .notNull()
    .references(() => topics.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  slug: text("slug").notNull(),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ── Subtopic Materials ────────────────────────────────────────────────────────

/**
 * A material is a file attached to a subtopic (PDF, image, doc, etc).
 * filePath is a Supabase Storage key — generate signed URLs at request time.
 */
export const subtopicMaterials = pgTable("subtopic_materials", {
  id: uuid("id").primaryKey().defaultRandom(),
  subtopicId: uuid("subtopic_id")
    .notNull()
    .references(() => subtopics.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  filePath: text("file_path").notNull(),  // Supabase Storage key
  fileType: text("file_type"),            // MIME type or extension hint
  fileSize: integer("file_size"),         // bytes
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

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
  reference: text("reference").notNull().unique(), // Paystack transaction reference
  paystackAccessCode: text("paystack_access_code"), // Paystack access_code for popup resumption / debugging
  proofPath: text("proof_path"),               // Supabase Storage key for receipt image
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
});

// ── Relations ─────────────────────────────────────────────────────────────────

export const coursesRelations = relations(courses, ({ many }) => ({
  topics: many(topics),
  payments: many(payments),
}));

export const topicsRelations = relations(topics, ({ one, many }) => ({
  course: one(courses, { fields: [topics.courseId], references: [courses.id] }),
  subtopics: many(subtopics),
}));

export const subtopicsRelations = relations(subtopics, ({ one, many }) => ({
  topic: one(topics, { fields: [subtopics.topicId], references: [topics.id] }),
  materials: many(subtopicMaterials),
}));

export const subtopicMaterialsRelations = relations(subtopicMaterials, ({ one }) => ({
  subtopic: one(subtopics, { fields: [subtopicMaterials.subtopicId], references: [subtopics.id] }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  user: one(user, { fields: [payments.userId], references: [user.id] }),
  course: one(courses, { fields: [payments.courseId], references: [courses.id] }),
}));

// ── Type exports ──────────────────────────────────────────────────────────────
export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
export type Course = typeof courses.$inferSelect;
export type NewCourse = typeof courses.$inferInsert;
export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
export type Topic = typeof topics.$inferSelect;
export type NewTopic = typeof topics.$inferInsert;
export type Subtopic = typeof subtopics.$inferSelect;
export type NewSubtopic = typeof subtopics.$inferInsert;
export type SubtopicMaterial = typeof subtopicMaterials.$inferSelect;
export type NewSubtopicMaterial = typeof subtopicMaterials.$inferInsert;
