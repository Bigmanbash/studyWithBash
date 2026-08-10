CREATE TYPE "public"."access_code_status" AS ENUM('unused', 'redeemed', 'expired');--> statement-breakpoint
CREATE TYPE "public"."affiliate_status" AS ENUM('pending', 'approved', 'rejected', 'suspended');--> statement-breakpoint
CREATE TYPE "public"."commission_status" AS ENUM('pending', 'credited', 'paid');--> statement-breakpoint
CREATE TYPE "public"."commission_type" AS ENUM('referral', 'proxy');--> statement-breakpoint
CREATE TABLE "access_codes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"affiliate_id" uuid NOT NULL,
	"course_id" uuid NOT NULL,
	"tier" text DEFAULT 'basic' NOT NULL,
	"payment_id" uuid NOT NULL,
	"status" "access_code_status" DEFAULT 'unused' NOT NULL,
	"redeemed_by" text,
	"redeemed_at" timestamp,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "affiliates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"referral_code" text,
	"commission_rate" integer DEFAULT 20 NOT NULL,
	"total_earned" integer DEFAULT 0 NOT NULL,
	"pending_payout" integer DEFAULT 0 NOT NULL,
	"status" "affiliate_status" DEFAULT 'pending' NOT NULL,
	"school_name" text,
	"estimated_students" integer,
	"approved_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "commissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"affiliate_id" uuid NOT NULL,
	"payment_id" uuid NOT NULL,
	"student_id" text NOT NULL,
	"course_id" uuid NOT NULL,
	"type" "commission_type" NOT NULL,
	"sale_amount" integer NOT NULL,
	"commission_amount" integer NOT NULL,
	"status" "commission_status" DEFAULT 'pending' NOT NULL,
	"paid_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "affiliate_id" uuid;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "referral_code" text;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "is_proxy" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "proxy_quantity" integer;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "referred_by" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "referral_code_used" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "school_name" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "estimated_students" integer;--> statement-breakpoint
ALTER TABLE "access_codes" ADD CONSTRAINT "access_codes_affiliate_id_affiliates_id_fk" FOREIGN KEY ("affiliate_id") REFERENCES "public"."affiliates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "access_codes" ADD CONSTRAINT "access_codes_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "access_codes" ADD CONSTRAINT "access_codes_payment_id_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "access_codes" ADD CONSTRAINT "access_codes_redeemed_by_user_id_fk" FOREIGN KEY ("redeemed_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "affiliates" ADD CONSTRAINT "affiliates_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commissions" ADD CONSTRAINT "commissions_affiliate_id_affiliates_id_fk" FOREIGN KEY ("affiliate_id") REFERENCES "public"."affiliates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commissions" ADD CONSTRAINT "commissions_payment_id_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commissions" ADD CONSTRAINT "commissions_student_id_user_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commissions" ADD CONSTRAINT "commissions_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "access_codes_code_idx" ON "access_codes" USING btree ("code");--> statement-breakpoint
CREATE UNIQUE INDEX "affiliates_user_id_idx" ON "affiliates" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "affiliates_referral_code_idx" ON "affiliates" USING btree ("referral_code");--> statement-breakpoint
CREATE UNIQUE INDEX "commissions_payment_id_idx" ON "commissions" USING btree ("payment_id");