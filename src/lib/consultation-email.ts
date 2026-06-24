import nodemailer from 'nodemailer'
import { formatTimeDisplay } from '@/lib/time-format'

export interface RescheduleEmailParams {
  email: string
  firstName: string
  lastName: string
  selectedDate: string
  selectedTime: string
  googleMeetLink: string
  matter?: string
  sessionId?: string
  previousDate?: string
  previousTime?: string
}

function getGmailTransporter() {
  const gmailUser = process.env.GMAIL_USER?.trim()
  const gmailPassword = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, '')

  if (!gmailUser || !gmailPassword) {
    return null
  }

  return {
    transporter: nodemailer.createTransport({
      service: 'gmail',
      auth: { user: gmailUser, pass: gmailPassword },
    }),
    gmailUser,
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

function buildRescheduleEmailHtml(params: RescheduleEmailParams): string {
  const formattedDate = formatEmailDate(params.selectedDate)
  const displayTime = formatTimeDisplay(params.selectedTime)
  const matter = params.matter?.trim() || 'Legal consultation'
  const previousSlot =
    params.previousDate && params.previousTime
      ? `<p style="margin-top: 12px; color: #666; font-size: 14px;">Your previous appointment was <strong>${params.previousDate}</strong> at <strong>${formatTimeDisplay(params.previousTime)} IST</strong>.</p>`
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

export async function sendRescheduleNotificationEmail(
  params: RescheduleEmailParams
): Promise<{ emailSent: boolean; emailError: string | null }> {
  const gmail = getGmailTransporter()
  if (!gmail) {
    console.error('Reschedule email: Gmail credentials not configured')
    return { emailSent: false, emailError: 'Email service not configured' }
  }

  const formattedDate = formatEmailDate(params.selectedDate)
  const displayTime = formatTimeDisplay(params.selectedTime)
  const html = buildRescheduleEmailHtml(params)

  try {
    await gmail.transporter.sendMail({
      from: gmail.gmailUser,
      to: params.email,
      subject: `Consultation Rescheduled - ${formattedDate} at ${displayTime} IST | Fathom Legal`,
      html,
      replyTo: gmail.gmailUser,
    })
    return { emailSent: true, emailError: null }
  } catch (error) {
    const emailError = error instanceof Error ? error.message : 'Unknown email error'
    console.error('Reschedule email failed:', emailError)
    return { emailSent: false, emailError }
  }
}
