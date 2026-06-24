import { NextRequest, NextResponse } from 'next/server'

import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const { email, firstName, lastName, selectedDate, selectedTime, matter, googleMeetLink, sessionId } = await request.json()

    if (!email || !firstName || !selectedDate || !selectedTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const gmailUser = process.env.GMAIL_USER?.trim()
    // Remove all spaces from app password (it comes as "vtck vzpb mdxv bgzr")
    const gmailPassword = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, '')

    if (!gmailUser || !gmailPassword) {
      console.error('[v0] Gmail credentials not configured', {
        hasUser: !!process.env.GMAIL_USER,
        hasPassword: !!process.env.GMAIL_APP_PASSWORD,
        userValue: gmailUser,
        passwordLength: gmailPassword?.length || 0
      })
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      )
    }

    console.log('[v0] Gmail auth initializing for user:', gmailUser)

    // Create transporter using Gmail service
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPassword
      }
    })

    // Format date
    const dateObj = new Date(selectedDate)
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    // Create professional email HTML
    const emailHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #A5292A 0%, #8a2123 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
          }
          .header h1 {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 10px;
          }
          .header p {
            font-size: 14px;
            opacity: 0.95;
          }
          .content {
            padding: 30px;
          }
          .greeting {
            font-size: 15px;
            margin-bottom: 18px;
            line-height: 1.6;
          }
          .section {
            margin-bottom: 25px;
          }
          .section:last-child {
            margin-bottom: 0;
          }
          .section-title {
            font-size: 14px;
            font-weight: 700;
            color: #A5292A;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 20px;
          }
          .details-box {
            background-color: #f9f9f9;
            border-left: 4px solid #A5292A;
            padding: 20px;
            border-radius: 4px;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid #efefef;
            font-size: 14px;
          }
          .detail-row:last-child {
            border-bottom: none;
            padding-bottom: 0;
          }
          .detail-label {
            font-weight: 600;
            color: #666;
            flex: 1;
          }
          .detail-value {
            color: #333;
            font-weight: 600;
            flex: 1;
            text-align: right;
          }
          .meeting-section {
            background: linear-gradient(135deg, #A5292A 0%, #8a2123 100%);
            color: white;
            padding: 25px;
            border-radius: 8px;
            text-align: center;
            margin-bottom: 25px;
            border: 2px solid #A5292A;
          }
          .meeting-section h3 {
            font-size: 16px;
            margin-bottom: 18px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .meeting-link {
            display: inline-block;
            background-color: #ffffff;
            color: #A5292A;
            padding: 16px 45px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 700;
            margin: 0 auto 15px;
            transition: all 0.3s;
            font-size: 18px;
            border: 3px solid #ffffff;
            box-shadow: 0 4px 12px rgba(165, 41, 42, 0.3);
          }
          .meeting-link:hover {
            background-color: #f0f0f0;
            transform: translateY(-2px);
          }
          .meeting-url {
            background-color: rgba(255,255,255,0.15);
            padding: 14px 12px;
            border-radius: 6px;
            word-break: break-all;
            font-size: 13px;
            font-family: 'Courier New', monospace;
            opacity: 0.95;
            border: 1px solid rgba(255,255,255,0.2);
            color: #ffffff;
          }
          .checklist {
            background-color: #f0fdf4;
            border: 1px solid #86efac;
            border-left: 4px solid #22c55e;
            padding: 20px;
            border-radius: 4px;
            margin-bottom: 30px;
          }
          .checklist h4 {
            color: #166534;
            font-size: 14px;
            font-weight: 700;
            margin-bottom: 12px;
          }
          .checklist ul {
            list-style: none;
            padding: 0;
          }
          .checklist li {
            color: #166534;
            font-size: 13px;
            margin-bottom: 8px;
            padding-left: 24px;
            position: relative;
          }
          .checklist li:before {
            content: "✓";
            position: absolute;
            left: 0;
            font-weight: 700;
          }
          .reschedule-section {
            background-color: #fef3c7;
            border: 1px solid #fcd34d;
            border-left: 4px solid #f59e0b;
            padding: 20px;
            border-radius: 4px;
          }
          .reschedule-section h4 {
            color: #92400e;
            font-weight: 700;
            margin-bottom: 10px;
            font-size: 14px;
          }
          .reschedule-section p {
            color: #92400e;
            font-size: 13px;
            line-height: 1.6;
          }
          .footer {
            background-color: #f9f9f9;
            padding: 25px;
            text-align: center;
            border-top: 1px solid #eee;
            font-size: 12px;
            color: #666;
          }
          .footer strong {
            display: block;
            margin-bottom: 8px;
            color: #333;
          }
          .footer p {
            margin: 4px 0;
          }
          .divider {
            height: 1px;
            background-color: #eee;
            margin: 30px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✓ Consultation Confirmed</h1>
            <p>Your booking with Fathom Legal is secure</p>
          </div>

          <div class="content">
            <div class="greeting">
              <p>Dear ${firstName},</p>
              <p style="margin-top: 12px;">Thank you for booking a consultation with Fathom Legal. Your appointment has been confirmed and a Google Meet link has been generated for your meeting.</p>
            </div>

            <div class="section">
              <div class="section-title">📋 Consultation Details</div>
              <div class="details-box">
                <div class="detail-row">
                  <span class="detail-label">Name:</span>
                  <span class="detail-value">${firstName} ${lastName}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Date:</span>
                  <span class="detail-value">${formattedDate}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Time:</span>
                  <span class="detail-value">${selectedTime} IST</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Duration:</span>
                  <span class="detail-value">20 minutes</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Meeting Type:</span>
                  <span class="detail-value">Google Meet (Online)</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Services:</span>
                  <span class="detail-value" style="text-align: right;">${matter}</span>
                </div>
              </div>
            </div>

            <div class="meeting-section">
              <h3>📹 Your Google Meet Link</h3>
              <a href="${googleMeetLink}" target="_blank" style="display: inline-block; background-color: #ffffff; color: #A5292A; padding: 16px 45px; text-decoration: none; border-radius: 6px; font-weight: 700; font-size: 18px; margin-bottom: 15px; box-shadow: 0 4px 12px rgba(165, 41, 42, 0.3); border: 3px solid #ffffff;" class="meeting-link">→ Join Meeting Now</a>
              <div class="meeting-url">${googleMeetLink}</div>
            </div>

            <div class="section">
              <div class="section-title">✓ Before Your Meeting</div>
              <div class="checklist">
                <ul style="padding-left: 0; list-style: none;">
                  <li>✓ Stable internet connection with working microphone & camera</li>
                  <li>✓ Join 5 minutes early for technical checks</li>
                  <li>✓ Have documents ready to discuss</li>
                  <li>✓ Choose a quiet location for the call</li>
                </ul>
              </div>
            </div>

            <div class="section">
              <div class="reschedule-section">
                <h4>Reschedule or Cancel</h4>
                <p>Reply to this email at least 24 hours in advance to reschedule or cancel. We&apos;ll be happy to help.</p>
              </div>
            </div>

            <div class="divider"></div>

            <div class="section" style="text-align: center; font-size: 12px; color: #999;">
              <p><strong>Session ID:</strong> ${sessionId}</p>
              <p style="margin-top: 8px;">This is an automated email. Please do not reply with sensitive information.</p>
            </div>
          </div>

          <div class="footer">
            <strong>Fathom Legal - Advocates & Corporate Consultants</strong>
            <p>📧 We're committed to protecting your privacy and confidentiality</p>
            <p>© 2024 Fathom Legal. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
    `

    // Send email with detailed error handling
    let emailSent = false
    let emailError = null
    
    try {
      console.log('[v0] Sending email to:', email)
      const result = await transporter.sendMail({
        from: gmailUser,
        to: email,
        subject: `Consultation Confirmed - ${formattedDate} at ${selectedTime} IST | Fathom Legal`,
        html: emailHTML,
        replyTo: gmailUser
      })
      console.log('[v0] Email sent successfully:', result.messageId)
      emailSent = true
    } catch (emailErr) {
      emailError = emailErr instanceof Error ? emailErr.message : 'Unknown email error'
      console.error('[v0] Email sending failed:', {
        error: emailError,
        code: emailErr instanceof Error && 'code' in emailErr ? (emailErr as any).code : 'N/A',
        response: emailErr instanceof Error && 'response' in emailErr ? (emailErr as any).response : 'N/A'
      })
      // Continue - email failure should not block confirmation
    }

    console.log('[v0] Email operation complete:', { emailSent, hasError: !!emailError })

    // Always return success even if email fails, as the booking is confirmed in DB
    return NextResponse.json({
      success: true,
      emailSent: emailSent,
      emailError: emailError || null,
      message: emailSent 
        ? 'Confirmation email sent successfully' 
        : 'Booking confirmed but email failed to send. Check your spam folder or request resend.'
    }, {
      status: 200
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('[v0] Critical error in email route:', {
      error: errorMessage,
      stack: error instanceof Error ? error.stack : 'N/A'
    })
    return NextResponse.json(
      { 
        error: 'Failed to process request',
        details: errorMessage
      },
      { status: 500 }
    )
  }
}
