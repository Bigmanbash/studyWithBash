ALTER TYPE "public"."payment_status" ADD VALUE 'failed';--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "reference" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "paystack_access_code" text;