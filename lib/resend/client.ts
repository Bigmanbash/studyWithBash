import { Resend } from "resend";

const resendClient = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export const SENDER_EMAIL = process.env.RESEND_SENDER_EMAIL || "noreply@bashacademy.com";

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!resendClient) {
    console.warn(`⚠️ RESEND_API_KEY is not set. Simulating email to ${to}`);
    console.warn(`Subject: ${subject}`);
    console.warn(`HTML: ${html.substring(0, 100)}...`);
    return { success: true, simulated: true };
  }

  try {
    const { data, error } = await resendClient.emails.send({
      from: `Bash Academy <${SENDER_EMAIL}>`,
      to,
      subject,
      html,
    });

    if (error) {
      console.error("Resend API Error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}
