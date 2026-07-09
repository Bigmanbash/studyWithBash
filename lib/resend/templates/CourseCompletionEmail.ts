import { EmailLayout } from "./EmailLayout";

export function getCourseCompletionEmailHtml(name: string, courseName: string, certificateUrl?: string) {
  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <span style="font-size: 48px;">🏆</span>
    </div>
    <h1>Amazing Work, ${name}!</h1>
    <p>We are incredibly proud to congratulate you on completing <strong>${courseName}</strong>!</p>
    <p>Finishing a course requires dedication, focus, and hard work. You've proven that you have what it takes to master new skills and push your boundaries.</p>
    
    ${certificateUrl ? `
    <div style="text-align: center; margin: 32px 0;">
      <a href="${certificateUrl}" class="btn">View Your Certificate</a>
    </div>
    ` : `
    <div style="text-align: center; margin: 32px 0;">
      <a href="https://bashacademy.com/dashboard" class="btn">Go to Dashboard</a>
    </div>
    `}
    
    <p>Don't stop here. The best way to solidify your new knowledge is to put it into practice, or dive right into your next learning journey.</p>
    <p>Keep building,<br><strong>The Bash Academy Team</strong></p>
  `;

  return EmailLayout({
    title: `Congratulations on completing ${courseName}! 🏆`,
    previewText: `You did it! You've successfully completed ${courseName}.`,
    content,
  });
}
