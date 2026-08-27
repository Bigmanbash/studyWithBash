export function EmailLayout({
  title,
  content,
  previewText,
}: {
  title: string;
  content: string;
  previewText?: string;
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.studywithbash.online";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${title}</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td, a { font-family: Arial, sans-serif !important; }
  </style>
  <![endif]-->
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #F8FAFC;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #0A1B39;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    table {
      border-collapse: collapse;
    }
    img {
      border: 0;
      line-height: 100%;
      outline: none;
      text-decoration: none;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #F8FAFC;
      padding: 40px 16px;
    }
    .container {
      max-width: 580px;
      margin: 0 auto;
      background-color: #FFFFFF;
      border-radius: 16px;
      border: 1px solid #E2E8F0;
      overflow: hidden;
      box-shadow: 0 4px 20px -2px rgba(10, 27, 57, 0.05);
    }
    .top-bar {
      height: 4px;
      background: linear-gradient(90deg, #17A546 0%, #3B82F6 100%);
    }
    .header {
      padding: 28px 36px 20px 36px;
      border-bottom: 1px solid #F1F5F9;
      background-color: #FFFFFF;
    }
    .logo-text {
      font-size: 22px;
      font-weight: 800;
      color: #0A1B39;
      letter-spacing: -0.5px;
      text-decoration: none;
    }
    .logo-accent {
      color: #17A546;
    }
    .content {
      padding: 36px;
      background-color: #FFFFFF;
    }
    h1 {
      font-size: 22px;
      font-weight: 700;
      color: #0A1B39;
      line-height: 1.3;
      margin: 0 0 16px 0;
      letter-spacing: -0.3px;
    }
    p {
      font-size: 15px;
      line-height: 1.6;
      color: #475569;
      margin: 0 0 18px 0;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      font-size: 12px;
      font-weight: 600;
      border-radius: 9999px;
      background-color: #E8F8EE;
      color: #17A546;
      margin-bottom: 16px;
    }
    .btn-primary {
      display: inline-block;
      padding: 13px 28px;
      background-color: #17A546;
      color: #FFFFFF !important;
      font-size: 14px;
      font-weight: 600;
      text-decoration: none;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 2px 8px rgba(23, 165, 70, 0.25);
    }
    .info-card {
      background-color: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 12px;
      padding: 20px;
      margin: 24px 0;
    }
    .footer {
      padding: 24px 36px;
      background-color: #F8FAFC;
      border-top: 1px solid #F1F5F9;
      text-align: center;
      font-size: 12px;
      color: #64748B;
      line-height: 1.5;
    }
    .footer a {
      color: #17A546;
      text-decoration: none;
    }
    @media only screen and (max-width: 600px) {
      .wrapper { padding: 16px 8px; }
      .header { padding: 20px 24px; }
      .content { padding: 24px; }
      .footer { padding: 20px 24px; }
    }
  </style>
</head>
<body>
  ${previewText ? `<div style="display:none;font-size:1px;color:#333333;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${previewText}</div>` : ''}

  <div class="wrapper">
    <div class="container">
      <div class="top-bar"></div>
      
      <div class="header">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td>
              <a href="${appUrl}" class="logo-text">
                Bash<span class="logo-accent">Academy</span>
              </a>
            </td>
            <td align="right">
              <span style="font-size: 11px; font-weight: 600; color: #64748B; text-transform: uppercase; letter-spacing: 0.5px;">SS1–SS3 &bull; JAMB</span>
            </td>
          </tr>
        </table>
      </div>

      <div class="content">
        ${content}
      </div>

      <div class="footer">
        <p style="margin-bottom: 8px;">&copy; ${new Date().getFullYear()} Bash Academy. All rights reserved.</p>
        <p style="margin-bottom: 0;">Need help? Contact us at <a href="mailto:support@studywithbash.online">support@studywithbash.online</a></p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}
