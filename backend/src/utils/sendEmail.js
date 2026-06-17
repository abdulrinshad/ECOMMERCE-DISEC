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

/**
 * Send a Password Reset OTP email using nodemailer
 * @param {string} email 
 * @param {string} fullName 
 * @param {string} otp 
 */
export const sendResetPasswordOTPEmail = async (email, fullName, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587', 10),
      secure: process.env.EMAIL_PORT === '465',
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
        <title>Reset Your Archive Password</title>
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
          .security-notice {
            font-size: 13px;
            color: #5C5C5C;
            background-color: #E8E4DC;
            padding: 15px;
            border-left: 3px solid #1A3C2E;
            margin-bottom: 25px;
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
            <div class="salutation">Dear ${fullName},</div>
            <div class="security-notice">
              <strong>SECURITY NOTIFICATION:</strong> A request was received to reset the password associated with this email identity for the AVANT-GARDE Archive.
            </div>
            <div class="instructions">To authorize this request, please enter the security verification PIN below:</div>
            <div class="otp-box">
              <div class="otp-code">${otp}</div>
            </div>
            <div class="expiry">This verification pin expires in 10 minutes.</div>
          </div>
          <div class="footer">
            If you did not initiate this request, you can safely ignore this security notification.
          </div>
        </div>
      </body>
      </html>
    `

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"AVANT-GARDE" <noreply@avantgarde.com>',
      to: email,
      subject: 'AVANT-GARDE SECURITY VERIFICATION',
      html: htmlContent
    })
  } catch (error) {
    console.error('Nodemailer send reset OTP email failure:', error)
  }
}

/**
 * Send an Order Confirmation email containing items, pricing, and shipping address details.
 * @param {string} email
 * @param {string} firstName
 * @param {Object} order
 */
export const sendOrderConfirmationEmail = async (email, firstName, order) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587', 10),
      secure: process.env.EMAIL_PORT === '465',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })

    const itemsHtml = order.items
      .map(
        (item) => `
        <tr style="border-bottom: 1px solid #D8D3CA;">
          <td style="padding: 12px 0; font-size: 14px;">
            <strong>${item.name}</strong><br>
            <span style="font-size: 12px; color: #5C5C5C;">Size: ${item.size} | Color: ${item.color}</span>
          </td>
          <td style="padding: 12px 0; text-align: center; font-size: 14px;">${item.quantity}</td>
          <td style="padding: 12px 0; text-align: right; font-size: 14px;">$${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
      `
      )
      .join('')

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
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
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 8px;
          }
          .intro {
            font-size: 14px;
            color: #5C5C5C;
            margin-bottom: 24px;
          }
          .order-meta {
            margin-bottom: 24px;
            font-size: 13px;
            background-color: #E8E4DC;
            padding: 15px;
            border-left: 3px solid #1A3C2E;
          }
          .table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 24px;
          }
          .table th {
            border-bottom: 2px solid #1A3C2E;
            padding-bottom: 8px;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #1A3C2E;
          }
          .summary-row td {
            padding: 6px 0;
            font-size: 14px;
          }
          .summary-total {
            border-top: 2px solid #1A3C2E;
            font-weight: bold;
            font-size: 16px;
          }
          .address-box {
            font-size: 13px;
            background-color: #E8E4DC;
            padding: 15px;
            margin-bottom: 24px;
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
            <div class="salutation">Thank you for your acquisition, ${firstName}.</div>
            <div class="intro">Your checkout protocol has completed successfully. We are preparing your archive items for delivery.</div>
            
            <div class="order-meta">
              <strong>Order Number:</strong> ${order.orderNumber}<br>
              <strong>Status:</strong> Processing<br>
              <strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}
            </div>

            <table class="table">
              <thead>
                <tr>
                  <th style="text-align: left;">Item</th>
                  <th style="text-align: center; width: 60px;">Qty</th>
                  <th style="text-align: right; width: 100px;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
                <tr class="summary-row">
                  <td colspan="2" style="text-align: right; padding-top: 15px;">Subtotal:</td>
                  <td style="text-align: right; padding-top: 15px;">$${order.amounts.subtotal.toFixed(2)}</td>
                </tr>
                ${
                  order.amounts.discount > 0
                    ? `
                <tr class="summary-row">
                  <td colspan="2" style="text-align: right; color: #C8102E;">Discount:</td>
                  <td style="text-align: right; color: #C8102E;">-$${order.amounts.discount.toFixed(2)}</td>
                </tr>`
                    : ''
                }
                <tr class="summary-row">
                  <td colspan="2" style="text-align: right;">Shipping:</td>
                  <td style="text-align: right;">$${order.amounts.shippingFee.toFixed(2)}</td>
                </tr>
                <tr class="summary-row">
                  <td colspan="2" style="text-align: right;">VAT (20%):</td>
                  <td style="text-align: right;">$${order.amounts.tax.toFixed(2)}</td>
                </tr>
                <tr class="summary-row summary-total">
                  <td colspan="2" style="text-align: right; padding: 12px 0;">Total Amount:</td>
                  <td style="text-align: right; padding: 12px 0;">$${order.amounts.total.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>

            <div class="address-box">
              <strong>SHIPPING ADDRESS:</strong><br>
              ${order.shippingAddress.line1}<br>
              ${order.shippingAddress.line2 ? `${order.shippingAddress.line2}<br>` : ''}
              ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}<br>
              ${order.shippingAddress.country}
            </div>
          </div>
          <div class="footer">
            If you have any questions regarding your protocol status, reply to this email.<br>
            &copy; ${new Date().getFullYear()} AVANT-GARDE. All rights reserved.
          </div>
        </div>
      </body>
      </html>
    `

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"AVANT-GARDE" <noreply@avantgarde.com>',
      to: email,
      subject: `AVANT-GARDE — Order Confirmation ${order.orderNumber}`,
      html: htmlContent
    })
  } catch (error) {
    console.error('Nodemailer send order confirmation email failure:', error)
  }
}

