export function EmailLayout({
  title,
  content,
  previewText,
}: {
  title: string;
  content: string;
  previewText?: string;
}) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #F7F9FC;
      color: #0A1B39;
      -webkit-font-smoothing: antialiased;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 24px rgba(10, 27, 57, 0.04);
      margin-top: 40px;
      margin-bottom: 40px;
      border: 1px solid #E5E7EB;
    }
    .header {
      padding: 32px 40px;
      text-align: center;
      background-color: #ffffff;
      border-bottom: 1px solid #F3F4F6;
    }
    .logo {
      font-size: 24px;
      font-weight: 800;
      color: #0A1B39;
      letter-spacing: -0.5px;
      text-decoration: none;
    }
    .logo span {
      color: #17A546;
    }
    .content {
      padding: 40px;
    }
    .footer {
      padding: 24px 40px;
      text-align: center;
      background-color: #F9FAFB;
      border-top: 1px solid #F3F4F6;
      font-size: 13px;
      color: #6B7280;
    }
    .btn {
      display: inline-block;
      padding: 14px 28px;
      background-color: #17A546;
      color: #ffffff !important;
      text-decoration: none;
      font-weight: 600;
      border-radius: 12px;
      margin-top: 24px;
      margin-bottom: 24px;
      text-align: center;
    }
    h1 {
      font-size: 24px;
      font-weight: 700;
      color: #0A1B39;
      margin-top: 0;
      margin-bottom: 16px;
    }
    p {
      font-size: 16px;
      line-height: 1.6;
      color: #374151;
      margin-top: 0;
      margin-bottom: 20px;
    }
  </style>
</head>
<body>
  ${previewText ? `<div style="display: none; max-height: 0px; overflow: hidden;">${previewText}</div>` : ''}
  
  <div style="padding: 20px;">
    <div class="container">
      <div class="header">
        <a href="https://bashacademy.com" class="logo">Bash<span>Academy</span></a>
      </div>
      
      <div class="content">
        ${content}
      </div>
      
      <div class="footer">
        <p style="margin-bottom: 8px;">&copy; ${new Date().getFullYear()} Bash Academy. All rights reserved.</p>
        <p style="margin-bottom: 0; font-size: 12px;">This is an automated message, please do not reply to this email.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}
