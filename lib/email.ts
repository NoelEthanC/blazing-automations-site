import nodemailer from "nodemailer"

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number.parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

interface EmailOptions {
  to: string
  subject: string
  html: string
  from?: string
}

export async function sendEmail({ to, subject, html, from }: EmailOptions) {
  try {
    await transporter.sendMail({
      from: from || process.env.FROM_EMAIL || "noreply@blazingautomations.com",
      to,
      subject,
      html,
    })
  } catch (error) {
    console.error("Failed to send email:", error)
    throw error
  }
}

export function generateDownloadEmailTemplate(resourceTitle: string, downloadUrl: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Your Download is Ready</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #3f79ff;">Blazing Automations</h1>
        </div>
        
        <h2>Your download is ready!</h2>
        
        <p>Thank you for downloading <strong>${resourceTitle}</strong>.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${downloadUrl}" 
             style="background: #3f79ff; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
            Download Now
          </a>
        </div>
        
        <p><strong>Note:</strong> This download link will expire in 24 hours for security reasons.</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        
        <p>Need help? Reply to this email or visit our website.</p>
        
        <p>Best regards,<br>
        The Blazing Automations Team</p>
      </div>
    </body>
    </html>
  `
}
