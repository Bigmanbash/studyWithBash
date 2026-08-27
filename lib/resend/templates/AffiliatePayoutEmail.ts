import { EmailLayout } from "./EmailLayout";

export function getAffiliatePayoutEmailHtml({
  affiliateName,
  amountFormatted,
  bankName,
  accountNumberMasked,
  reference,
  dashboardUrl,
}: {
  affiliateName: string;
  amountFormatted: string;
  bankName?: string;
  accountNumberMasked?: string;
  reference?: string;
  dashboardUrl: string;
}) {
  const content = `
    <span class="badge" style="background-color: #E8F8EE; color: #17A546;">Payout Sent 💸</span>
    <h1>Your Commission Payout is on the Way!</h1>
    <p>Hi <strong>${affiliateName}</strong>,</p>
    <p>We're pleased to let you know that your affiliate commission payout has been processed and sent to your bank account.</p>
    
    <div class="info-card">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding-bottom: 12px;">
            <span style="font-size: 12px; color: #64748B; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Payout Amount</span><br>
            <strong style="font-size: 20px; color: #17A546;">${amountFormatted}</strong>
          </td>
          ${
            reference
              ? `
          <td align="right" style="padding-bottom: 12px;">
            <span style="font-size: 12px; color: #64748B; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Reference</span><br>
            <span style="font-size: 12px; font-family: monospace; color: #0A1B39;">${reference}</span>
          </td>
          `
              : ""
          }
        </tr>
        ${
          bankName || accountNumberMasked
            ? `
        <tr style="border-top: 1px solid #E2E8F0;">
          <td style="padding-top: 12px;" colspan="2">
            <span style="font-size: 12px; color: #64748B;">Destination Account</span><br>
            <strong style="font-size: 14px; color: #0A1B39;">${bankName || "Bank Account"} &bull; ${accountNumberMasked || ""}</strong>
          </td>
        </tr>
        `
            : ""
        }
      </table>
    </div>

    <div style="text-align: center; margin: 32px 0 20px 0;">
      <a href="${dashboardUrl}" class="btn-primary">View Payout History &rarr;</a>
    </div>

    <p style="font-size: 13px; color: #64748B; text-align: center; margin-bottom: 0;">
      Bank settlements usually reflect within 1-2 hours depending on your bank network.
    </p>
  `;

  return EmailLayout({
    title: `Payout Processed: ${amountFormatted} - Bash Academy`,
    previewText: `Your affiliate payout of ${amountFormatted} has been sent to your account.`,
    content,
  });
}
