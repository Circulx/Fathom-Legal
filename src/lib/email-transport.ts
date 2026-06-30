import nodemailer from 'nodemailer'

export function getZohoTransporter() {
  const zohoEmail = process.env.ZOHO_EMAIL?.trim()
  const zohoPassword = process.env.ZOHO_PASSWORD?.trim()
  const zohoSmtpHost = process.env.ZOHO_SMTP_HOST?.trim() || 'smtp.zoho.com'
  const zohoSmtpPort = parseInt(process.env.ZOHO_SMTP_PORT?.trim() || '465', 10)

  if (!zohoEmail || !zohoPassword) {
    return null
  }

  return {
    transporter: nodemailer.createTransport({
      host: zohoSmtpHost,
      port: zohoSmtpPort,
      secure: true,
      auth: { user: zohoEmail, pass: zohoPassword },
    }),
    fromEmail: zohoEmail,
  }
}
