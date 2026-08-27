import { EmailLayout } from "./EmailLayout";

export function getProxyAccessCodesEmailHtml({
  agentName,
  courseSubject,
  tier,
  quantity,
  codes,
  dashboardUrl,
}: {
  agentName: string;
  courseSubject: string;
  tier: string;
  quantity: number;
  codes: string[];
  dashboardUrl: string;
}) {
  const codesListHtml = codes
    .map(
      (code, idx) => `
      <tr style="border-bottom: 1px solid #F1F5F9;">
        <td style="padding: 10px 12px; font-size: 13px; color: #64748B;">#${idx + 1}</td>
        <td style="padding: 10px 12px; font-family: monospace; font-size: 14px; font-weight: 700; color: #0A1B39; letter-spacing: 0.5px;">${code}</td>
        <td align="right" style="padding: 10px 12px; font-size: 12px; color: #17A546; font-weight: 600;">Active</td>
      </tr>
    `
    )
    .join("");

  const content = `
    <span class="badge" style="background-color: #EDE9FE; color: #6D28D9;">Agent Order Delivered 🚀</span>
    <h1>Your ${quantity} Student Access Codes</h1>
    <p>Hi <strong>${agentName}</strong>,</p>
    <p>Your proxy batch purchase for <strong>${courseSubject.toUpperCase()} (${tier.toUpperCase()} Tier)</strong> has been processed successfully. Below are the access codes ready to be distributed to your students.</p>
    
    <div class="info-card" style="padding: 0; overflow: hidden;">
      <div style="background-color: #F1F5F9; padding: 12px 16px; border-bottom: 1px solid #E2E8F0;">
        <table width="100%">
          <tr>
            <td><strong style="font-size: 13px; color: #0A1B39;">Batch Summary</strong></td>
            <td align="right"><span style="font-size: 12px; color: #64748B;">Total: ${quantity} Codes</span></td>
          </tr>
        </table>
      </div>
      <div style="max-height: 280px; overflow-y: auto; padding: 8px 12px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          ${codesListHtml}
        </table>
      </div>
    </div>

    <div style="background-color: #F8FAFC; border-left: 4px solid #3B82F6; padding: 12px 16px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; font-size: 13px; color: #334155;">
        <strong>How students redeem:</strong> Students go to <a href="https://www.studywithbash.online/redeem" style="color: #3B82F6; font-weight: 600;">studywithbash.online/redeem</a>, sign in, and enter their code to activate their course instantly.
      </p>
    </div>

    <div style="text-align: center; margin: 28px 0 16px 0;">
      <a href="${dashboardUrl}" class="btn-primary">View in Agent Dashboard &rarr;</a>
    </div>
  `;

  return EmailLayout({
    title: `Your ${quantity} Access Codes: ${courseSubject.toUpperCase()} - Bash Academy`,
    previewText: `Your proxy purchase of ${quantity} access codes for ${courseSubject.toUpperCase()} (${tier}) is ready.`,
    content,
  });
}
