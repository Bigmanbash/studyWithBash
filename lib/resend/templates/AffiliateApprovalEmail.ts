import { EmailLayout } from "./EmailLayout";

export function getAffiliateApprovalEmailHtml({
  affiliateName,
  referralCode,
  referralLink,
  commissionRatePercent = 10,
  dashboardUrl,
}: {
  affiliateName: string;
  referralCode: string;
  referralLink: string;
  commissionRatePercent?: number;
  dashboardUrl: string;
}) {
  const content = `
    <span class="badge" style="background-color: #E8F8EE; color: #17A546;">Application Approved 🤝</span>
    <h1>Welcome to the Bash Affiliate Partner Program!</h1>
    <p>Hi <strong>${affiliateName}</strong>,</p>
    <p>Great news! Your application to become a Bash Academy Affiliate Partner has been approved. You can now start earning <strong>${commissionRatePercent}% commission</strong> on every course enrollment you refer.</p>
    
    <div class="info-card">
      <p style="margin: 0 0 12px 0; font-size: 13px; color: #64748B; font-weight: 600; text-transform: uppercase;">Your Unique Referral Code</p>
      <div style="background-color: #FFFFFF; border: 1px dashed #17A546; padding: 12px; border-radius: 8px; text-align: center; margin-bottom: 16px;">
        <span style="font-size: 20px; font-weight: 800; color: #17A546; letter-spacing: 2px; font-family: monospace;">${referralCode}</span>
      </div>
      
      <p style="margin: 0 0 6px 0; font-size: 12px; color: #64748B;">Your Direct Share Link:</p>
      <div style="background-color: #FFFFFF; border: 1px solid #E2E8F0; padding: 8px 12px; border-radius: 6px; font-size: 13px; color: #0A1B39; word-break: break-all;">
        ${referralLink}
      </div>
    </div>

    <div style="text-align: center; margin: 32px 0 20px 0;">
      <a href="${dashboardUrl}" class="btn-primary">Access Affiliate Dashboard &rarr;</a>
    </div>

    <h3 style="font-size: 15px; color: #0A1B39; margin: 24px 0 12px 0;">Quick Tips to Start Earning:</h3>
    <ul style="padding-left: 20px; margin: 0; font-size: 14px; color: #475569; line-height: 1.6;">
      <li style="margin-bottom: 8px;">Share your code or link with SS1-SS3 and JAMB candidates in WhatsApp/Telegram study groups.</li>
      <li style="margin-bottom: 8px;">Use the <strong>Proxy Purchase</strong> feature in your dashboard to buy batches of access codes at a discount for offline distribution.</li>
      <li style="margin-bottom: 0;">Track your real-time clicks, conversions, and payout balances in your partner dashboard.</li>
    </ul>
  `;

  return EmailLayout({
    title: "Affiliate Application Approved - Bash Academy",
    previewText: `Congratulations! Your affiliate account is approved. Your referral code is ${referralCode}.`,
    content,
  });
}
