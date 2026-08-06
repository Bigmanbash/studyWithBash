import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/neon/client";
import * as schema from "@/lib/neon/schema";
import { sendEmail } from "@/lib/resend/client";
import { getPasswordResetEmailHtml } from "@/lib/resend/templates/PasswordResetEmail";
import { getEmailVerificationHtml } from "@/lib/resend/templates/EmailVerificationEmail";

export const auth = betterAuth({
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
    requireEmailVerification: false, // Enable after email provider is configured
    sendResetPassword: async ({ user, url, token }) => {
      // Send the email using our Resend wrapper
      await sendEmail({
        to: user.email,
        subject: "Reset your Bash Academy password",
        html: getPasswordResetEmailHtml(url),
      });
      
      // Keep logging it to console for local dev convenience
      console.log(`\n\n=== PASSWORD RESET LINK FOR ${user.email} ===`);
      console.log(`${url}`);
      console.log(`=================================================\n\n`);
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
      
      // Keep logging it to console for local dev convenience
      console.log(`\n\n=== EMAIL VERIFICATION LINK FOR ${user.email} ===`);
      console.log(`${url}`);
      console.log(`=================================================\n\n`);
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
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24,     // Refresh session cookie daily
  },

  trustedOrigins: [
    process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  ],
});

export type Auth = typeof auth;
