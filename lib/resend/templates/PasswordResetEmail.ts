import { EmailLayout } from "./EmailLayout";

export function getPasswordResetEmailHtml(resetUrl: string) {
  const content = `
    <span class="badge" style="background-color: #FEF3C7; color: #D97706;">Account Security</span>
    <h1>Reset Your Password</h1>
    <p>We received a request to reset the password for your Bash Academy account. If you did not make this request, you can safely ignore this email.</p>
    
    <div style="text-align: center; margin: 32px 0;">
      <a href="${resetUrl}" class="btn-primary" style="background-color: #0A1B39;">Reset Password</a>
    </div>

    <div class="info-card">
      <p style="margin: 0; font-size: 13px; color: #64748B;">
        <strong style="color: #0A1B39;">Security Notice:</strong> This link will expire in <strong>24 hours</strong>. For your protection, never forward or share this email with anyone.
      </p>
    </div>

    <p style="margin-top: 24px; font-size: 13px; color: #94A3B8; word-break: break-all;">
      Button not working? Copy and paste this link into your browser:<br>
      <a href="${resetUrl}" style="color: #17A546; text-decoration: underline;">${resetUrl}</a>
    </p>
  `;

  return EmailLayout({
    title: "Reset Your Password - Bash Academy",
    previewText: "Action required: Reset your Bash Academy password",
    content,
  });
}
