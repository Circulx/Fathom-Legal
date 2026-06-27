import nodemailer from 'nodemailer'
import { formatTimeDisplay } from '@/lib/time-format'

export interface ConsultationEmailParams {
  email: string
  firstName: string
  lastName: string
  selectedDate: string
  selectedTime: string
  googleMeetLink: string
  matter?: string
  sessionId?: string
}

export interface RescheduleEmailParams extends ConsultationEmailParams {
  previousDate?: string
  previousTime?: string
}

export type EmailSendResult = { emailSent: boolean; emailError: string | null }

function getZohoTransporter() {
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

function formatEmailDate(isoDate: string): string {
  const dateObj = new Date(`${isoDate}T12:00:00`)
  return dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function displayTimeForEmail(time: string): string {
  const formatted = formatTimeDisplay(time)
  return formatted === '—' ? time : formatted
}

function buildConfirmationEmailHtml(params: ConsultationEmailParams): string {
  const formattedDate = formatEmailDate(params.selectedDate)
  const displayTime = displayTimeForEmail(params.selectedTime)
  const matter = params.matter?.trim() || 'Legal consultation'

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; overflow: hidden; }
          .header { padding: 30px; border-bottom: 2px solid #A5292A; background-color: #fafafa; }
          .header h1 { font-size: 24px; font-weight: 600; margin: 0 0 8px 0; color: #222; }
          .header p { font-size: 14px; margin: 0; color: #666; }
          .content { padding: 30px; }
          .details-section { margin: 25px 0; line-height: 1.8; }
          .details-section-title { font-size: 14px; font-weight: 600; color: #222; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
          .detail-item { font-size: 14px; margin-bottom: 8px; color: #555; }
          .detail-label { font-weight: 600; color: #222; }
          .meet-link-section { margin: 28px 0; padding: 20px; background-color: #f9f9f9; border-left: 3px solid #A5292A; }
          .meet-link-label { font-weight: 600; font-size: 14px; color: #222; margin-bottom: 12px; display: block; text-transform: uppercase; letter-spacing: 0.5px; }
          .meet-link { color: #A5292A; text-decoration: none; font-weight: 500; word-break: break-all; border-bottom: 1px solid #A5292A; }
          .checklist-section { margin: 25px 0; line-height: 1.8; }
          .checklist-title { font-size: 14px; font-weight: 600; color: #222; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
          .checklist-item { font-size: 14px; margin-bottom: 8px; color: #555; padding-left: 20px; position: relative; }
          .checklist-item:before { content: "✓"; position: absolute; left: 0; color: #22c55e; font-weight: 600; }
          .footer-note { margin: 28px 0 0 0; padding-top: 20px; border-top: 1px solid #eee; font-size: 13px; color: #666; line-height: 1.6; }
          .footer { background-color: #fafafa; padding: 30px; border-top: 1px solid #eee; text-align: center; font-size: 12px; color: #666; line-height: 1.6; }
          .footer-company { font-weight: 600; color: #222; display: block; margin-bottom: 8px; }
          .divider { height: 1px; background-color: #eee; margin: 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Consulting Meet Scheduled</h1>
            <p>Your appointment with Fathom Legal has been confirmed</p>
          </div>
          <div class="content">
            <p>Hi ${params.firstName},</p>
            <p style="margin-top: 12px;">Thank you for booking a consultation with us. Your 20-minute meeting has been scheduled and confirmed. Below are your appointment details.</p>
            <div class="details-section">
              <div class="details-section-title">Appointment Details</div>
              <div class="detail-item"><span class="detail-label">Name:</span> ${params.firstName} ${params.lastName}</div>
              <div class="detail-item"><span class="detail-label">Date:</span> ${formattedDate}</div>
              <div class="detail-item"><span class="detail-label">Time:</span> ${displayTime} IST</div>
              <div class="detail-item"><span class="detail-label">Duration:</span> 20 minutes</div>
              <div class="detail-item"><span class="detail-label">Meeting:</span> Google Meet (Online)</div>
              <div class="detail-item"><span class="detail-label">Service:</span> ${matter}</div>
            </div>
            <div class="meet-link-section">
              <span class="meet-link-label">Join Your Meeting</span>
              <p style="margin: 0; font-size: 14px; color: #555;">
                <a href="${params.googleMeetLink}" target="_blank" class="meet-link">${params.googleMeetLink}</a>
              </p>
            </div>
            <div class="checklist-section">
              <div class="checklist-title">Before Your Meeting</div>
              <div class="checklist-item">Stable internet connection with working microphone &amp; camera</div>
              <div class="checklist-item">Join 5 minutes early for technical checks</div>
              <div class="checklist-item">Have documents ready to discuss</div>
              <div class="checklist-item">Choose a quiet location for the call</div>
            </div>
            <div class="footer-note">
              <p><strong>Need to reschedule or cancel?</strong> Reply to this email at least 24 hours before your appointment and we'll be happy to help.</p>
              ${params.sessionId ? `<p style="margin-bottom: 0; font-size: 13px; color: #888;">Session ID: ${params.sessionId}</p>` : ''}
            </div>
          </div>
          <div class="divider"></div>
          <div class="footer">
            <span class="footer-company">Fathom Legal - Advocates &amp; Corporate Consultants</span>
            <p>We're committed to protecting your privacy and confidentiality</p>
            <p style="font-size: 11px; color: #999; margin: 8px 0 0 0;">© ${new Date().getFullYear()} Fathom Legal. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `
}

function buildRescheduleEmailHtml(params: RescheduleEmailParams): string {
  const formattedDate = formatEmailDate(params.selectedDate)
  const displayTime = displayTimeForEmail(params.selectedTime)
  const matter = params.matter?.trim() || 'Legal consultation'
  const previousSlot =
    params.previousDate && params.previousTime
      ? `<p style="margin-top: 12px; color: #666; font-size: 14px;">Your previous appointment was <strong>${params.previousDate}</strong> at <strong>${displayTimeForEmail(params.previousTime)} IST</strong>.</p>`
      : ''

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f5f5f5; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden; }
          .header { background: linear-gradient(135deg, #A5292A 0%, #8a2123 100%); color: white; padding: 40px 30px; text-align: center; }
          .header h1 { font-size: 28px; font-weight: 700; margin-bottom: 10px; }
          .content { padding: 30px; }
          .details-box { background-color: #f9f9f9; border-left: 4px solid #A5292A; padding: 20px; border-radius: 4px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #efefef; font-size: 14px; }
          .detail-row:last-child { border-bottom: none; }
          .meeting-section { background: linear-gradient(135deg, #A5292A 0%, #8a2123 100%); color: white; padding: 25px; border-radius: 8px; text-align: center; margin: 25px 0; }
          .meeting-link { display: inline-block; background-color: #ffffff; color: #A5292A; padding: 14px 36px; text-decoration: none; border-radius: 6px; font-weight: 700; font-size: 16px; margin-bottom: 12px; }
          .meeting-url { background-color: rgba(255,255,255,0.15); padding: 12px; border-radius: 6px; word-break: break-all; font-size: 13px; font-family: monospace; }
          .footer { background-color: #f9f9f9; padding: 25px; text-align: center; border-top: 1px solid #eee; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Consultation Rescheduled</h1>
            <p>Your new appointment time with Fathom Legal</p>
          </div>
          <div class="content">
            <p>Dear ${params.firstName},</p>
            <p style="margin-top: 12px;">Your consultation with Fathom Legal has been <strong>rescheduled</strong>. Please note your updated appointment details below.</p>
            ${previousSlot}
            <div class="details-box">
              <div class="detail-row"><span><strong>Name</strong></span><span>${params.firstName} ${params.lastName}</span></div>
              <div class="detail-row"><span><strong>New date</strong></span><span>${formattedDate}</span></div>
              <div class="detail-row"><span><strong>New time</strong></span><span>${displayTime} IST</span></div>
              <div class="detail-row"><span><strong>Duration</strong></span><span>20 minutes</span></div>
              <div class="detail-row"><span><strong>Services</strong></span><span>${matter}</span></div>
            </div>
            <div class="meeting-section">
              <h3 style="margin-bottom: 16px;">Your Google Meet link</h3>
              <a href="${params.googleMeetLink}" class="meeting-link">Join Meeting</a>
              <div class="meeting-url">${params.googleMeetLink}</div>
            </div>
            <p style="font-size: 13px; color: #666;">If you have any questions or need to make further changes, please reply to this email at least 24 hours before your appointment.</p>
            ${params.sessionId ? `<p style="font-size: 12px; color: #999; margin-top: 20px;">Session ID: ${params.sessionId}</p>` : ''}
          </div>
          <div class="footer">
            <strong>Fathom Legal - Advocates & Corporate Consultants</strong>
            <p>© ${new Date().getFullYear()} Fathom Legal. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `
}

async function sendZohoHtmlEmail(options: {
  to: string
  subject: string
  html: string
}): Promise<EmailSendResult> {
  const zoho = getZohoTransporter()
  if (!zoho) {
    console.error('Zoho email credentials not configured')
    return { emailSent: false, emailError: 'Email service not configured' }
  }

  try {
    await zoho.transporter.sendMail({
      from: zoho.fromEmail,
      to: options.to,
      subject: options.subject,
      html: options.html,
      replyTo: zoho.fromEmail,
    })
    return { emailSent: true, emailError: null }
  } catch (error) {
    const emailError = error instanceof Error ? error.message : 'Unknown email error'
    console.error('Zoho email send failed:', emailError)
    return { emailSent: false, emailError }
  }
}

export async function sendConsultationConfirmationEmail(
  params: ConsultationEmailParams
): Promise<EmailSendResult> {
  const formattedDate = formatEmailDate(params.selectedDate)
  const displayTime = displayTimeForEmail(params.selectedTime)
  const html = buildConfirmationEmailHtml(params)

  return sendZohoHtmlEmail({
    to: params.email,
    subject: `Your consulting meet is scheduled - ${formattedDate} at ${displayTime} IST | Fathom Legal`,
    html,
  })
}

export async function sendRescheduleNotificationEmail(
  params: RescheduleEmailParams
): Promise<EmailSendResult> {
  const formattedDate = formatEmailDate(params.selectedDate)
  const displayTime = displayTimeForEmail(params.selectedTime)
  const html = buildRescheduleEmailHtml(params)

  return sendZohoHtmlEmail({
    to: params.email,
    subject: `Consultation Rescheduled - ${formattedDate} at ${displayTime} IST | Fathom Legal`,
    html,
  })
}
