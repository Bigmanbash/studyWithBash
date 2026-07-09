import { EmailLayout } from "./EmailLayout";

export function getAdminNotificationEmailHtml(title: string, message: string, actionUrl?: string, actionText?: string) {
  const content = `
    <div style="background-color: #FEF3C7; padding: 12px 24px; border-radius: 8px; margin-bottom: 24px; display: inline-block;">
      <span style="color: #92400E; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Admin Alert</span>
    </div>
    
    <h1>${title}</h1>
    
    <div style="font-size: 15px; color: #374151; line-height: 1.6; background-color: #F8FAFC; padding: 20px; border-radius: 12px; border-left: 4px solid #17A546; margin: 24px 0;">
      ${message.replace(/\n/g, '<br/>')}
    </div>
    
    ${actionUrl ? `
    <div style="text-align: left; margin: 32px 0;">
      <a href="${actionUrl}" class="btn" style="background-color: #0A1B39;">${actionText || "View Details in Dashboard"}</a>
    </div>
    ` : ''}
    
    <p style="font-size: 13px; color: #6B7280;">This is an internal notification from the Bash Academy system.</p>
  `;

  return EmailLayout({
    title: `Admin Alert: ${title}`,
    previewText: `System notification: ${title}`,
    content,
  });
}
