import { Resend } from "resend";

const getResendClient = () => {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
};

export const getSenderEmail = () => {
  const envSender = process.env.RESEND_SENDER_EMAIL?.trim();

  // If env var is missing or not a valid email address (e.g. just "Bash")
  if (!envSender || !envSender.includes("@")) {
    return "Bash Academy <support@studywithbash.online>";
  }

  return envSender.includes("<") ? envSender : `Bash Academy <${envSender}>`;
};

/**
 * Send email helper.
 * - In staging / development (NODE_ENV !== 'production'): Simulates email sending to protect free tier quota.
 * - In production: Sends actual email via Resend API.
 */
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const isProduction = process.env.NODE_ENV === "production";
  const forceSend = process.env.ENABLE_EMAIL_IN_STAGING === "true";

  // In staging / non-prod environments, simulate email sending unless explicitly overridden
  if (!isProduction && !forceSend) {
    console.log(`\n📨 [EMAIL SIMULATED — STAGING MODE]`);
    console.log(`   To:       ${to}`);
    console.log(`   Subject:  ${subject}`);
    console.log(`   From:     ${getSenderEmail()}`);
    console.log(`   Note:     Actual email not sent because NODE_ENV is "${process.env.NODE_ENV || 'staging'}".`);
    console.log(`   Preview:  ${html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().substring(0, 140)}...\n`);
    return { success: true, simulated: true };
  }

  const client = getResendClient();

  if (!client) {
    console.warn(`\n⚠️ [RESEND WARNING] RESEND_API_KEY is not set. Email to ${to} skipped.\n`);
    return { success: true, simulated: true };
  }

  try {
    const from = getSenderEmail();
    const { data, error } = await client.emails.send({
      from,
      to,
      subject,
      html,
    });

    if (error) {
      console.error("[Resend Error]:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("[Resend Exception]:", error);
    return { success: false, error: error.message || error };
  }
}
