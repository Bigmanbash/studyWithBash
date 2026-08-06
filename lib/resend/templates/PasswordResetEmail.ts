import { EmailLayout } from "./EmailLayout";

export function getPasswordResetEmailHtml(resetUrl: string) {
  const content = `
    <h1>Reset Your Password</h1>
    <p>We received a request to reset the password for your Bash Academy account. If you didn't make this request, you can safely ignore this email.</p>
    <p>To choose a new password, click the button below:</p>
    
    <div style="text-align: center;">
      <a href="${resetUrl}" class="btn">Reset Password</a>
    </div>
    
    <p>For security, this link will expire in 24 hours.</p>
    <p style="margin-top: 32px; font-size: 14px; color: #6B7280;">
      If the button above doesn't work, copy and paste the following link into your browser:<br>
      <a href="${resetUrl}" style="color: #17A546; word-break: break-all;">${resetUrl}</a>
    </p>
  `;

  return EmailLayout({
    title: "Reset Your Password - Bash Academy",
    previewText: "Action required: Reset your Bash Academy password",
    content,
  });
}
