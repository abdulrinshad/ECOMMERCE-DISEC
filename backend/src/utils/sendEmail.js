import nodemailer from 'nodemailer'

/**
 * Send an OTP verification code email using nodemailer
 * @param {string} email 
 * @param {string} fullName 
 * @param {string} otp 
 */
export const sendOTPEmail = async (email, fullName, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587', 10),
      secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Archive Access</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background-color: #F2EFE9;
            margin: 0;
            padding: 0;
            color: #0A0A0A;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #F2EFE9;
            border: 1px solid #D8D3CA;
          }
          .header {
            background-color: #1A3C2E;
            padding: 24px;
            text-align: center;
          }
          .header h1 {
            color: #F2EFE9;
            margin: 0;
            font-family: "Syne", "Georgia", "Times New Roman", serif;
            font-size: 28px;
            font-weight: 800;
            letter-spacing: 2px;
            text-transform: uppercase;
          }
          .content {
            padding: 40px 30px;
            line-height: 1.6;
          }
          .salutation {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 16px;
          }
          .instructions {
            font-size: 14px;
            color: #5C5C5C;
            margin-bottom: 24px;
          }
          .otp-box {
            border: 2px solid #1A3C2E;
            padding: 20px;
            text-align: center;
            margin: 30px auto;
            max-width: 280px;
            background-color: #E8E4DC;
          }
          .otp-code {
            font-size: 36px;
            font-weight: bold;
            letter-spacing: 8px;
            color: #1A3C2E;
            font-family: monospace;
          }
          .expiry {
            font-size: 12px;
            color: #C8102E;
            font-weight: 600;
            text-align: center;
            margin-top: 10px;
          }
          .footer {
            padding: 20px 30px;
            border-top: 1px solid #D8D3CA;
            font-size: 11px;
            color: #7C766C;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>AVANT-GARDE</h1>
          </div>
          <div class="content">
            <div class="salutation">Hi ${fullName},</div>
            <div class="instructions">To finalize your account setup and gain archive access, please verify your email address. Your verification code is:</div>
            <div class="otp-box">
              <div class="otp-code">${otp}</div>
            </div>
            <div class="expiry">This code expires in 10 minutes.</div>
          </div>
          <div class="footer">
            If you didn't request this email, you can safely ignore it.
          </div>
        </div>
      </body>
      </html>
    `

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"AVANT-GARDE" <noreply@avantgarde.com>',
      to: email,
      subject: 'AVANT-GARDE — Verify Your Archive Access',
      html: htmlContent
    })
  } catch (error) {
    // Log failure but do not crash/block the registration flow
    console.error('Nodemailer send email failure:', error)
  }
}
