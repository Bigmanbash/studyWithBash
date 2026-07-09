import { EmailLayout } from "./EmailLayout";

export function getCourseEnrollmentEmailHtml(name: string, courseName: string, courseUrl: string) {
  const content = `
    <h1>You're Enrolled! 🎉</h1>
    <p>Hi ${name},</p>
    <p>Congratulations on enrolling in <strong>${courseName}</strong>! We've successfully processed your enrollment and you now have full access to the course materials.</p>
    
    <div style="background-color: #F8FAFC; padding: 24px; border-radius: 12px; margin: 24px 0; border: 1px solid #E2E8F0;">
      <h3 style="margin-top: 0; margin-bottom: 8px; color: #0A1B39; font-size: 18px;">${courseName}</h3>
      <p style="margin-bottom: 0; color: #64748B; font-size: 14px;">Status: Active &bull; Access: Lifetime</p>
    </div>
    
    <div style="text-align: center;">
      <a href="${courseUrl}" class="btn">Start Learning Now</a>
    </div>
    
    <p>Dive right in and start progressing through the modules. We can't wait to see what you achieve!</p>
    <p>Happy learning,<br><strong>The Bash Academy Team</strong></p>
  `;

  return EmailLayout({
    title: `Welcome to ${courseName} - Bash Academy`,
    previewText: `You are officially enrolled in ${courseName}.`,
    content,
  });
}
