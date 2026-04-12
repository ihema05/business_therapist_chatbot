import { invokeLLM } from "./_core/llm";

interface EmailPayload {
  to: string;
  subject: string;
  htmlContent: string;
}

/**
 * Send an email using the built-in email service
 */
export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  try {
    // Use the Manus built-in email service via the notification API
    // For now, we'll use a simple approach with the notification system
    const response = await fetch(
      `${process.env.BUILT_IN_FORGE_API_URL}/email/send`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.BUILT_IN_FORGE_API_KEY}`,
        },
        body: JSON.stringify({
          to: payload.to,
          subject: payload.subject,
          html: payload.htmlContent,
        }),
      }
    );

    if (!response.ok) {
      console.error("[Email] Failed to send email:", response.statusText);
      return false;
    }

    console.log("[Email] Successfully sent email to", payload.to);
    return true;
  } catch (error) {
    console.error("[Email] Error sending email:", error);
    return false;
  }
}

/**
 * Generate HTML email template for session summary
 */
export function generateSessionSummaryEmail(
  userName: string,
  sessionTitle: string,
  summary: string,
  actionItems: string[]
): string {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
            border-bottom: 3px solid #ec4899;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            margin: 0;
            color: #ec4899;
            font-size: 28px;
            font-weight: bold;
        }
        .header p {
            margin: 5px 0 0 0;
            color: #666;
            font-size: 14px;
        }
        .greeting {
            font-size: 16px;
            margin-bottom: 30px;
            color: #333;
        }
        .section {
            margin-bottom: 30px;
        }
        .section-title {
            font-size: 18px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #e5e7eb;
        }
        .summary-box {
            background-color: #f9fafb;
            border-left: 4px solid #ec4899;
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 4px;
        }
        .action-items {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .action-items li {
            padding: 12px;
            margin-bottom: 10px;
            background-color: #f3f4f6;
            border-radius: 4px;
            border-left: 3px solid #3b82f6;
            padding-left: 15px;
        }
        .action-items li::before {
            content: "✓ ";
            color: #3b82f6;
            font-weight: bold;
            margin-right: 8px;
        }
        .cta-section {
            margin-top: 30px;
            padding-top: 30px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
        }
        .cta-button {
            display: inline-block;
            background-color: #ec4899;
            color: white;
            padding: 12px 30px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: bold;
            font-size: 16px;
            transition: background-color 0.3s;
        }
        .cta-button:hover {
            background-color: #be185d;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 12px;
            color: #999;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Business Therapist</h1>
            <p>Your Session Summary</p>
        </div>

        <div class="greeting">
            <p>Hi ${userName},</p>
            <p>Thank you for your session today. Below is a summary of our conversation and the key action items to help you move forward with confidence.</p>
        </div>

        <div class="section">
            <div class="section-title">Session: ${sessionTitle}</div>
            <div class="summary-box">
                <p>${summary}</p>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Action Items</div>
            <ul class="action-items">
                ${actionItems.map((item) => `<li>${item}</li>`).join("")}
            </ul>
        </div>

        <div class="cta-section">
            <p>Ready to continue your journey?</p>
            <a href="${process.env.VITE_FRONTEND_FORGE_API_URL || "https://business-therapist.manus.space"}/chat" class="cta-button">
                Start Another Session
            </a>
        </div>

        <div class="footer">
            <p>&copy; 2026 Business Therapist. All sessions are confidential and secure.</p>
            <p>This email was sent to ${userName} as part of your therapy session follow-up.</p>
        </div>
    </div>
</body>
</html>
  `;
}
