import { EmailLayout } from "./EmailLayout";

export function getCourseEnrollmentEmailHtml({
  studentName,
  courseName,
  tier = "Basic",
  amountFormatted,
  reference,
  courseUrl,
}: {
  studentName: string;
  courseName: string;
  tier?: string;
  amountFormatted?: string;
  reference?: string;
  courseUrl: string;
}) {
  const content = `
    <span class="badge">Payment Confirmed 🎉</span>
    <h1>You're Enrolled in ${courseName}!</h1>
    <p>Hi <strong>${studentName}</strong>,</p>
    <p>Your payment was successful and your course access has been activated. You can now access all learning modules, downloadable study notes, and tiered practice questions.</p>
    
    <div class="info-card">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding-bottom: 12px;">
            <span style="font-size: 12px; color: #64748B; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Course</span><br>
            <strong style="font-size: 16px; color: #0A1B39;">${courseName}</strong>
          </td>
          <td align="right" style="padding-bottom: 12px;">
            <span style="font-size: 12px; color: #64748B; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Tier</span><br>
            <strong style="font-size: 14px; color: #17A546; text-transform: capitalize;">${tier} Access</strong>
          </td>
        </tr>
        ${
          amountFormatted || reference
            ? `
        <tr style="border-top: 1px solid #E2E8F0;">
          <td style="padding-top: 12px;">
            <span style="font-size: 12px; color: #64748B;">Amount Paid</span><br>
            <strong style="font-size: 14px; color: #0A1B39;">${amountFormatted || "Confirmed"}</strong>
          </td>
          <td align="right" style="padding-top: 12px;">
            <span style="font-size: 12px; color: #64748B;">Reference</span><br>
            <span style="font-size: 12px; font-family: monospace; color: #64748B;">${reference || "N/A"}</span>
          </td>
        </tr>
        `
            : ""
        }
      </table>
    </div>

    <div style="text-align: center; margin: 32px 0 24px 0;">
      <a href="${courseUrl}" class="btn-primary">Start Studying Now &rarr;</a>
    </div>

    <p style="font-size: 13px; color: #64748B; text-align: center; margin-bottom: 0;">
      Bookmark your student dashboard to easily resume where you left off.
    </p>
  `;

  return EmailLayout({
    title: `Payment Confirmed: ${courseName} - Bash Academy`,
    previewText: `Your enrollment in ${courseName} (${tier} Tier) is active. Start studying now!`,
    content,
  });
}
