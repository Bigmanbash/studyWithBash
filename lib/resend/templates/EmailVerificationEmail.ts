import { EmailLayout } from "./EmailLayout";

export function getEmailVerificationHtml(url: string) {
  const content = `
    <h1>Verify Your Email Address</h1>
    <p>Welcome to Bash Academy! Before you can fully access your account, we just need to quickly verify that this is your email address.</p>
    
    <div style="text-align: center;">
      <a href="${url}" class="btn">Verify Email Address</a>
    </div>
    
    <p>If you didn't create an account with Bash Academy, you can safely ignore this email.</p>
    <p style="margin-top: 32px; font-size: 14px; color: #6B7280;">
      If the button above doesn't work, copy and paste the following link into your browser:<br>
      <a href="${url}" style="color: #17A546; word-break: break-all;">${url}</a>
    </p>
  `;

  return EmailLayout({
    title: "Verify your email - Bash Academy",
    previewText: "Please verify your email address to get started.",
    content,
  });
}
