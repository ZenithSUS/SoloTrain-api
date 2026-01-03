import config from "../config.js";
import * as brevo from "@getbrevo/brevo";
import colors from "../utils/log-colors.js";

// Initialize Brevo API
const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY || ""
);

async function sendPasswordRecoveryEmail(
  email: string,
  token: string,
  clientUrl: string
) {
  // Generate the recovery link
  const recoveryLink = `${config.backendUrl}/api/auth/recover?token=${token}&email=${email}&continue=${clientUrl}`;

  // HTML email template with your custom colors
  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Recovery</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0A0A0A; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0A0A0A; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1A1A1A; border: 1px solid #2A2A2A; border-radius: 12px; overflow: hidden;">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #5A31D4 0%, #3AA6F5 100%); padding: 40px 30px; text-align: center;">
                  <h1 style="margin: 0; color: #E0E0E0; font-size: 28px; font-weight: 600;">Password Recovery</h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <p style="margin: 0 0 20px 0; color: #E0E0E0; font-size: 16px; line-height: 1.6;">
                    We received a request to reset your password. Click the button below to create a new password.
                  </p>
                  
                  <p style="margin: 0 0 30px 0; color: #9A9A9A; font-size: 14px; line-height: 1.6;">
                    If you didn't request this, you can safely ignore this email.
                  </p>
                  
                  <!-- Button -->
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="padding: 20px 0;">
                        <a href="${recoveryLink}" style="display: inline-block; background: linear-gradient(135deg, #5A31D4 0%, #3AA6F5 100%); color: #E0E0E0; text-decoration: none; padding: 16px 48px; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(90, 49, 212, 0.3);">
                          Reset Password
                        </a>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Alternative Link -->
                  <p style="margin: 30px 0 0 0; color: #9A9A9A; font-size: 13px; line-height: 1.6;">
                    Or copy and paste this link into your browser:
                  </p>
                  <p style="margin: 10px 0 0 0; padding: 12px; background-color: #0A0A0A; border: 1px solid #2A2A2A; border-radius: 6px; word-break: break-all;">
                    <a href="${recoveryLink}" style="color: #3AA6F5; text-decoration: none; font-size: 13px;">${recoveryLink}</a>
                  </p>
                  
                  <!-- Expiry Notice -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 30px; background-color: rgba(90, 49, 212, 0.1); border-left: 4px solid #5A31D4; border-radius: 4px;">
                    <tr>
                      <td style="padding: 16px;">
                        <p style="margin: 0; color: #E0E0E0; font-size: 14px; line-height: 1.6;">
                          ⏱️ This link will expire in <strong style="color: #3AA6F5;">1 hour</strong> for security reasons.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #0A0A0A; padding: 30px; text-align: center; border-top: 1px solid #2A2A2A;">
                  <p style="margin: 0 0 10px 0; color: #9A9A9A; font-size: 13px;">
                    This is an automated message, please do not reply.
                  </p>
                  <p style="margin: 0; color: #9A9A9A; font-size: 13px;">
                    © ${new Date().getFullYear()} SoloTrain. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  // Plain text version
  const textTemplate = `
Password Recovery

We received a request to reset your password.

Click this link to create a new password:
${recoveryLink}

This link will expire in 1 hour for security reasons.

If you didn't request this, you can safely ignore this email.

---
This is an automated message, please do not reply.
© ${new Date().getFullYear()} SoloTrain. All rights reserved.
  `;

  const sendSmtpEmail = new brevo.SendSmtpEmail();
  sendSmtpEmail.sender = {
    email: "solotrain.app@gmail.com",
    name: "SoloTrain",
  };
  sendSmtpEmail.to = [{ email: email }];
  sendSmtpEmail.subject = "Reset Your SoloTrain Password";
  sendSmtpEmail.htmlContent = htmlTemplate;
  sendSmtpEmail.textContent = textTemplate;
  sendSmtpEmail.replyTo = { email: config.email as string };

  sendSmtpEmail.headers = {
    "X-Mailer": "SoloTrain",
    "X-Priority": "1",
  };

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log(
      `${colors.green}Recovery email sent to ${email}${colors.reset}`
    );
    return { success: true, data };
  } catch (error: any) {
    console.error("Error sending recovery email:", error);
    return {
      success: false,
      error: error?.message || "Unknown error",
    };
  }
}

export default sendPasswordRecoveryEmail;
