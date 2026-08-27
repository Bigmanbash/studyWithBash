import { EmailLayout } from "./EmailLayout";

export function getEmailVerificationHtml(verifyUrl: string) {
  const content = `
    <span class="badge">Verify Your Account</span>
    <h1>Welcome to Bash Academy!</h1>
    <p>Thank you for joining Bash Academy. Please confirm your email address to complete your registration and secure your student account.</p>
    
    <div style="text-align: center; margin: 32px 0;">
      <a href="${verifyUrl}" class="btn-primary">Verify Email Address</a>
    </div>

    <div class="info-card">
      <p style="margin: 0; font-size: 13px; color: #64748B;">
        This verification link will expire in <strong>24 hours</strong>. If you did not create an account on Bash Academy, you can safely disregard this email.
      </p>
    </div>

    <p style="margin-top: 24px; font-size: 13px; color: #94A3B8; word-break: break-all;">
      If the button above does not work, copy and paste this link into your browser:<br>
      <a href="${verifyUrl}" style="color: #17A546; text-decoration: underline;">${verifyUrl}</a>
    </p>
  `;

  return EmailLayout({
    title: "Verify Your Email - Bash Academy",
    previewText: "Confirm your email address to activate your Bash Academy account.",
    content,
  });
}
