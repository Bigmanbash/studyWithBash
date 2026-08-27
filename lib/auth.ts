import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/neon/client";
import * as schema from "@/lib/neon/schema";
import { sendEmail } from "@/lib/resend/client";
import { getPasswordResetEmailHtml } from "@/lib/resend/templates/PasswordResetEmail";
import { getEmailVerificationHtml } from "@/lib/resend/templates/EmailVerificationEmail";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // TODO: Enable after Resend is configured with a verified domain
    sendResetPassword: async ({ user, url, token }) => {
      // TODO: Configure Resend API key and verified sender domain before enabling
      // Send the email using our Resend wrapper
      await sendEmail({
        to: user.email,
        subject: "Reset your Bash Academy password",
        html: getPasswordResetEmailHtml(url),
      });

      // Only log full URL to console in local development mode
      if (process.env.NODE_ENV === "development") {
        console.log(`\n\n=== PASSWORD RESET LINK FOR ${user.email} ===`);
        console.log(`${url}`);
        console.log(`=================================================\n\n`);
      }
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url, token }) => {
      // Send the verification email using our Resend wrapper
      await sendEmail({
        to: user.email,
        subject: "Verify your email - Bash Academy",
        html: getEmailVerificationHtml(url),
      });

      // Only log full URL to console in local development mode
      if (process.env.NODE_ENV === "development") {
        console.log(`\n\n=== EMAIL VERIFICATION LINK FOR ${user.email} ===`);
        console.log(`${url}`);
        console.log(`=================================================\n\n`);
      }
    },
  },

  user: {
    // Extend the user model with our custom fields
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "student",
        input: false, // Not editable by the client directly
      },
      whatsappNumber: {
        type: "string",
        required: false,
        input: true,
      },
      howDidYouFindUs: {
        type: "string",
        required: false,
        input: true,
      },
      referredBy: {
        type: "string",
        required: false,
        input: false, // Set server-side only
      },
      referralCodeUsed: {
        type: "string",
        required: false,
        input: false, // Set server-side only
      },
      schoolName: {
        type: "string",
        required: false,
        input: true,
      },
      estimatedStudents: {
        type: "number",
        required: false,
        input: true,
      },
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24,     // Refresh session cookie daily
  },

  trustedOrigins: [
    "http://localhost:3000",
    "https://studywithbash.online",
    "https://www.studywithbash.online",
    "https://study-with-bash-academy.vercel.app",
    "https://www.study-with-bash-academy.vercel.app",
    ...(process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL] : []),
    ...(process.env.NEXT_PUBLIC_APP_URL ? [process.env.NEXT_PUBLIC_APP_URL] : []),
  ],
});

export type Auth = typeof auth;
