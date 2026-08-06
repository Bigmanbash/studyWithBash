import { EmailLayout } from "./EmailLayout";

export function getWelcomeEmailHtml(name: string) {
  const content = `
    <h1>Welcome to Bash Academy, ${name}!</h1>
    <p>We are absolutely thrilled to have you join our community. Your journey to mastering your skills starts right here, right now.</p>
    <p>At Bash Academy, we pride ourselves on delivering premium, world-class educational experiences designed to push you to the next level.</p>
    
    <div style="text-align: center;">
      <a href="https://bashacademy.com/dashboard" class="btn">Go to Dashboard</a>
    </div>
    
    <p>If you have any questions or need help getting started, just reply to this email. Our support team is always here for you.</p>
    <p>To your success,<br><strong>The Bash Academy Team</strong></p>
  `;

  return EmailLayout({
    title: "Welcome to Bash Academy!",
    previewText: "Your journey to success starts today.",
    content,
  });
}
