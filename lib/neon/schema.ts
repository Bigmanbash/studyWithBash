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
  role: text("role", { enum: ["student", "admin", "agent", "pending_agent"] }).notNull().default("student"),
  whatsappNumber: text("whatsapp_number"),
  howDidYouFindUs: text("how_did_you_find_us"),
  // Affiliate-related fields on user
  referredBy: text("referred_by"),       // userId of the agent who referred this student
  referralCodeUsed: text("referral_code_used"), // the code entered at registration
  schoolName: text("school_name"),       // for pending_agent / agent applications
  estimatedStudents: integer("estimated_students"), // approximate student count
  isSuspended: boolean("is_suspended").notNull().default(false), // admin student toggle
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

// ── Affiliate enums ───────────────────────────────────────────────────────────

export const affiliateStatusEnum = pgEnum("affiliate_status", [
  "pending",
  "approved",
  "rejected",
  "suspended",
]);

export const commissionTypeEnum = pgEnum("commission_type", [
  "referral",
  "proxy",
]);

export const commissionStatusEnum = pgEnum("commission_status", [
  "pending",
  "credited",
  "paid",
]);

export const accessCodeStatusEnum = pgEnum("access_code_status", [
  "unused",
  "redeemed",
  "expired",
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
    standardPrice: integer("standard_price"), // kobo (null = standard tier disabled)
    premiumPrice: integer("premium_price"),   // kobo (null = premium tier disabled)
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

// ── Topic Videos ──────────────────────────────────────────────────────────────

/**
 * A topic video is a video lecture attached to a topic (e.g. YouTube private link).
 * Multiple videos per topic supported. Accessible by Standard and Premium tier users.
 */
export const topicVideos = pgTable("topic_videos", {
  id: uuid("id").primaryKey().defaultRandom(),
  topicId: uuid("topic_id")
    .notNull()
    .references(() => topics.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  videoUrl: text("video_url").notNull(),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
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
  tier: text("tier").notNull().default("basic"), // "basic" | "standard" | "premium"
  status: paymentStatusEnum("status").notNull().default("pending"),
  method: text("method"),                      // "bank_transfer" | "card" | "ussd"
  reference: text("reference").notNull().unique(), // Paystack transaction reference
  paystackAccessCode: text("paystack_access_code"), // Paystack access_code for popup resumption / debugging
  proofPath: text("proof_path"),               // Supabase Storage key for receipt image
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
  // Affiliate-related columns
  affiliateId: uuid("affiliate_id"),           // set for proxy purchases
  referralCode: text("referral_code"),         // the referral code active at time of purchase (traced via user.referredBy)
  isProxy: boolean("is_proxy").notNull().default(false), // true when agent pays on behalf
  proxyQuantity: integer("proxy_quantity"),     // number of students in a proxy batch
});

// ── Affiliates ────────────────────────────────────────────────────────────────

/**
 * One affiliate profile per agent user. Created when a user applies as a teacher/agent.
 * Status transitions: pending → approved | rejected. Approved can be → suspended.
 */
export const affiliates = pgTable(
  "affiliates",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    referralCode: text("referral_code"),                  // generated on approval
    commissionRate: integer("commission_rate").notNull().default(20), // percentage 0-100
    totalEarned: integer("total_earned").notNull().default(0),       // kobo, running total
    pendingPayout: integer("pending_payout").notNull().default(0),   // kobo, unpaid balance
    status: affiliateStatusEnum("status").notNull().default("pending"),
    schoolName: text("school_name"),
    estimatedStudents: integer("estimated_students"),
    approvedAt: timestamp("approved_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => ({
    userIdx: uniqueIndex("affiliates_user_id_idx").on(t.userId),
    referralCodeIdx: uniqueIndex("affiliates_referral_code_idx").on(t.referralCode),
  })
);

// ── Commissions ───────────────────────────────────────────────────────────────

/**
 * Tracks every commission earned by an affiliate.
 * paymentId has a unique index — the same payment can NEVER generate two commissions.
 */
export const commissions = pgTable(
  "commissions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    affiliateId: uuid("affiliate_id")
      .notNull()
      .references(() => affiliates.id, { onDelete: "cascade" }),
    paymentId: uuid("payment_id")
      .notNull()
      .references(() => payments.id, { onDelete: "cascade" }),
    studentId: text("student_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    courseId: uuid("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    type: commissionTypeEnum("type").notNull(),               // "referral" | "proxy"
    saleAmount: integer("sale_amount").notNull(),              // kobo — what was paid
    commissionAmount: integer("commission_amount").notNull(),  // kobo — what affiliate earns
    status: commissionStatusEnum("status").notNull().default("pending"),
    paidAt: timestamp("paid_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    paymentIdx: uniqueIndex("commissions_payment_id_idx").on(t.paymentId),
  })
);

// ── Access Codes ──────────────────────────────────────────────────────────────

/**
 * One-time access codes generated from proxy purchases.
 * Each code grants one student access to one course at a specific tier.
 * Code uniqueness enforced at the database level.
 */
export const accessCodes = pgTable(
  "access_codes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    code: text("code").notNull(),                           // e.g. "BSH-MATH-K3P1M7"
    affiliateId: uuid("affiliate_id")
      .notNull()
      .references(() => affiliates.id, { onDelete: "cascade" }),
    courseId: uuid("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    tier: text("tier").notNull().default("basic"),          // "basic" | "standard" | "premium"
    paymentId: uuid("payment_id")
      .notNull()
      .references(() => payments.id, { onDelete: "cascade" }),
    status: accessCodeStatusEnum("status").notNull().default("unused"),
    redeemedBy: text("redeemed_by")
      .references(() => user.id, { onDelete: "set null" }),
    redeemedAt: timestamp("redeemed_at"),
    expiresAt: timestamp("expires_at"),                     // null = no expiry (admin sets when needed)
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    codeIdx: uniqueIndex("access_codes_code_idx").on(t.code),
  })
);

// ── Relations ─────────────────────────────────────────────────────────────────

export const userRelations = relations(user, ({ many, one }) => ({
  payments: many(payments),
  affiliate: one(affiliates, { fields: [user.id], references: [affiliates.userId] }),
  referrer: one(user, { fields: [user.referredBy], references: [user.id], relationName: "referral" }),
  referrals: many(user, { relationName: "referral" }),
}));

export const coursesRelations = relations(courses, ({ many }) => ({
  topics: many(topics),
  payments: many(payments),
  commissions: many(commissions),
  accessCodes: many(accessCodes),
}));

export const topicsRelations = relations(topics, ({ one, many }) => ({
  course: one(courses, { fields: [topics.courseId], references: [courses.id] }),
  subtopics: many(subtopics),
  videos: many(topicVideos),
}));

export const topicVideosRelations = relations(topicVideos, ({ one }) => ({
  topic: one(topics, { fields: [topicVideos.topicId], references: [topics.id] }),
}));

export const subtopicsRelations = relations(subtopics, ({ one, many }) => ({
  topic: one(topics, { fields: [subtopics.topicId], references: [topics.id] }),
  materials: many(subtopicMaterials),
}));

export const subtopicMaterialsRelations = relations(subtopicMaterials, ({ one }) => ({
  subtopic: one(subtopics, { fields: [subtopicMaterials.subtopicId], references: [subtopics.id] }),
}));

export const paymentsRelations = relations(payments, ({ one, many }) => ({
  user: one(user, { fields: [payments.userId], references: [user.id] }),
  course: one(courses, { fields: [payments.courseId], references: [courses.id] }),
  affiliate: one(affiliates, { fields: [payments.affiliateId], references: [affiliates.id] }),
  commission: one(commissions),
  accessCodes: many(accessCodes),
}));

export const affiliatesRelations = relations(affiliates, ({ one, many }) => ({
  user: one(user, { fields: [affiliates.userId], references: [user.id] }),
  commissions: many(commissions),
  accessCodes: many(accessCodes),
}));

export const commissionsRelations = relations(commissions, ({ one }) => ({
  affiliate: one(affiliates, { fields: [commissions.affiliateId], references: [affiliates.id] }),
  payment: one(payments, { fields: [commissions.paymentId], references: [payments.id] }),
  student: one(user, { fields: [commissions.studentId], references: [user.id] }),
  course: one(courses, { fields: [commissions.courseId], references: [courses.id] }),
}));

export const accessCodesRelations = relations(accessCodes, ({ one }) => ({
  affiliate: one(affiliates, { fields: [accessCodes.affiliateId], references: [affiliates.id] }),
  course: one(courses, { fields: [accessCodes.courseId], references: [courses.id] }),
  payment: one(payments, { fields: [accessCodes.paymentId], references: [payments.id] }),
  redeemedByUser: one(user, { fields: [accessCodes.redeemedBy], references: [user.id] }),
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
export type TopicVideo = typeof topicVideos.$inferSelect;
export type NewTopicVideo = typeof topicVideos.$inferInsert;
export type Subtopic = typeof subtopics.$inferSelect;
export type NewSubtopic = typeof subtopics.$inferInsert;
export type SubtopicMaterial = typeof subtopicMaterials.$inferSelect;
export type NewSubtopicMaterial = typeof subtopicMaterials.$inferInsert;
export type Affiliate = typeof affiliates.$inferSelect;
export type NewAffiliate = typeof affiliates.$inferInsert;
export type Commission = typeof commissions.$inferSelect;
export type NewCommission = typeof commissions.$inferInsert;
export type AccessCode = typeof accessCodes.$inferSelect;
export type NewAccessCode = typeof accessCodes.$inferInsert;
