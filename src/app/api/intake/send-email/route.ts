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

    const zohoEmail = process.env.ZOHO_EMAIL?.trim()
    const zohoPassword = process.env.ZOHO_PASSWORD?.trim()
    const zohoSmtpHost = process.env.ZOHO_SMTP_HOST?.trim() || 'smtp.zoho.com'
    const zohoSmtpPort = parseInt(process.env.ZOHO_SMTP_PORT?.trim() || '465')

    if (!zohoEmail || !zohoPassword) {
      console.error('[v0] Zoho credentials not configured', {
        hasEmail: !!process.env.ZOHO_EMAIL,
        hasPassword: !!process.env.ZOHO_PASSWORD
      })
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      )
    }

    console.log('[v0] Zoho email auth initializing for user:', zohoEmail)
    console.log('[v0] Zoho SMTP config:', { host: zohoSmtpHost, port: zohoSmtpPort, secure: true })

    // Create transporter using Zoho Mail service
    const transporter = nodemailer.createTransport({
      host: zohoSmtpHost,
      port: zohoSmtpPort,
      secure: true,
      auth: {
        user: zohoEmail,
        pass: zohoPassword
      },
      logger: true,
      debug: true
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
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            overflow: hidden;
          }
          .header {
            padding: 30px;
            border-bottom: 2px solid #A5292A;
            background-color: #fafafa;
          }
          .header h1 {
            font-size: 24px;
            font-weight: 600;
            margin: 0 0 8px 0;
            color: #222;
          }
          .header p {
            font-size: 14px;
            margin: 0;
            color: #666;
          }
          .content {
            padding: 30px;
          }
          .greeting {
            font-size: 15px;
            margin-bottom: 20px;
            line-height: 1.6;
            color: #333;
          }
          .greeting p {
            margin: 0 0 12px 0;
          }
          .details-section {
            margin: 25px 0;
            line-height: 1.8;
          }
          .details-section-title {
            font-size: 14px;
            font-weight: 600;
            color: #222;
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .detail-item {
            font-size: 14px;
            margin-bottom: 8px;
            color: #555;
          }
          .detail-label {
            font-weight: 600;
            color: #222;
            display: inline;
          }
          .detail-value {
            color: #555;
            display: inline;
          }
          .meet-link-section {
            margin: 28px 0;
            padding: 20px;
            background-color: #f9f9f9;
            border-left: 3px solid #A5292A;
          }
          .meet-link-label {
            font-weight: 600;
            font-size: 14px;
            color: #222;
            margin-bottom: 12px;
            display: block;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .meet-link {
            color: #A5292A;
            text-decoration: none;
            font-weight: 500;
            word-break: break-all;
            display: inline-block;
            padding: 3px 0;
            border-bottom: 1px solid #A5292A;
          }
          .meet-link:hover {
            opacity: 0.8;
          }
          .checklist-section {
            margin: 25px 0;
            line-height: 1.8;
          }
          .checklist-title {
            font-size: 14px;
            font-weight: 600;
            color: #222;
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .checklist-item {
            font-size: 14px;
            margin-bottom: 8px;
            color: #555;
            padding-left: 20px;
            position: relative;
          }
          .checklist-item:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #22c55e;
            font-weight: 600;
          }
          .footer-note {
            margin: 28px 0 0 0;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 13px;
            color: #666;
            line-height: 1.6;
          }
          .footer {
            background-color: #fafafa;
            padding: 30px;
            border-top: 1px solid #eee;
            text-align: center;
            font-size: 12px;
            color: #666;
            line-height: 1.6;
          }
          .footer-company {
            font-weight: 600;
            color: #222;
            display: block;
            margin-bottom: 8px;
          }
          .divider {
            height: 1px;
            background-color: #eee;
            margin: 0;
          }
          a {
            color: #A5292A;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Consulting Meet Scheduled</h1>
            <p>Your appointment with Fathom Legal has been confirmed</p>
          </div>

          <div class="content">
            <div class="greeting">
              <p>Hi ${firstName},</p>
              <p>Thank you for booking a consultation with us. Your 20-minute meeting has been scheduled and confirmed. Below are your appointment details.</p>
            </div>

            <div class="details-section">
              <div class="details-section-title">Appointment Details</div>
              <div class="detail-item"><span class="detail-label">Name:</span> <span class="detail-value">${firstName} ${lastName}</span></div>
              <div class="detail-item"><span class="detail-label">Date:</span> <span class="detail-value">${formattedDate}</span></div>
              <div class="detail-item"><span class="detail-label">Time:</span> <span class="detail-value">${selectedTime} IST</span></div>
              <div class="detail-item"><span class="detail-label">Duration:</span> <span class="detail-value">20 minutes</span></div>
              <div class="detail-item"><span class="detail-label">Meeting:</span> <span class="detail-value">Google Meet (Online)</span></div>
              <div class="detail-item"><span class="detail-label">Service:</span> <span class="detail-value">${matter}</span></div>
            </div>

            <div class="meet-link-section">
              <span class="meet-link-label">Join Your Meeting</span>
              <p style="margin: 0; font-size: 14px; color: #555;">
                <a href="${googleMeetLink}" target="_blank" class="meet-link">${googleMeetLink}</a>
              </p>
            </div>

            <div class="checklist-section">
              <div class="checklist-title">Before Your Meeting</div>
              <div class="checklist-item">Stable internet connection with working microphone & camera</div>
              <div class="checklist-item">Join 5 minutes early for technical checks</div>
              <div class="checklist-item">Have documents ready to discuss</div>
              <div class="checklist-item">Choose a quiet location for the call</div>
            </div>

            <div class="footer-note">
              <p><strong>Need to reschedule or cancel?</strong> Reply to this email at least 24 hours before your appointment and we'll be happy to help you reschedule or process your cancellation.</p>
              <p style="margin-bottom: 0; font-size: 13px; color: #888;">Session ID: ${sessionId}</p>
            </div>
          </div>

          <div class="divider"></div>

          <div class="footer">
            <span class="footer-company">Fathom Legal - Advocates & Corporate Consultants</span>
            <p>We're committed to protecting your privacy and confidentiality</p>
            <p style="font-size: 11px; color: #999; margin: 8px 0 0 0;">© 2024 Fathom Legal. All rights reserved.<br/>This is an automated email. Please do not reply with sensitive information.</p>
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
      console.log('[v0] From address:', zohoEmail)
      const result = await transporter.sendMail({
        from: zohoEmail,
        to: email,
        subject: `Your consulting meet is scheduled - ${formattedDate} at ${selectedTime} IST`,
        html: emailHTML,
        replyTo: zohoEmail
      })
      console.log('[v0] Email sent successfully via Zoho:', result.messageId)
      emailSent = true
    } catch (emailErr) {
      emailError = emailErr instanceof Error ? emailErr.message : 'Unknown email error'
      console.error('[v0] Zoho email sending failed:', {
        error: emailError,
        code: emailErr instanceof Error && 'code' in emailErr ? (emailErr as any).code : 'N/A',
        response: emailErr instanceof Error && 'response' in emailErr ? (emailErr as any).response : 'N/A',
        statusCode: emailErr instanceof Error && 'statusCode' in emailErr ? (emailErr as any).statusCode : 'N/A',
        smtpServer: zohoSmtpHost,
        smtpPort: zohoSmtpPort
      })
      // Continue - email failure should not block confirmation
    }

    console.log('[v0] Email operation complete:', { emailSent, hasError: !!emailError })

    // Send admin notification email
    let adminEmailSent = false
    let adminEmailError = null

    try {
      const adminEmailHTML = `
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
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              background-color: #f8f8f8;
              color: #333;
              line-height: 1.6;
            }
            .wrapper {
              background-color: #f8f8f8;
              padding: 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
            }
            .email-header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              padding: 40px 40px 30px;
              border-bottom: 1px solid #e8e8e8;
            }
            .logo-section {
              flex: 0 0 auto;
            }
            .logo {
              font-size: 18px;
              font-weight: 700;
              color: #A5292A;
              letter-spacing: 1px;
            }
            .header-info {
              flex: 1;
              text-align: right;
            }
            .header-label {
              font-size: 11px;
              color: #999;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin-bottom: 4px;
            }
            .header-date {
              font-size: 11px;
              color: #999;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .content {
              padding: 40px;
            }
            .badge {
              display: inline-block;
              background-color: #fff3f3;
              color: #A5292A;
              font-size: 11px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 1px;
              padding: 6px 12px;
              margin-bottom: 20px;
            }
            .headline {
              font-size: 28px;
              font-weight: 300;
              line-height: 1.4;
              margin-bottom: 8px;
              color: #222;
            }
            .highlight {
              color: #A5292A;
              font-style: italic;
              font-weight: 500;
            }
            .subheading {
              font-size: 14px;
              color: #666;
              margin-bottom: 30px;
              line-height: 1.5;
            }
            .section {
              margin-bottom: 35px;
            }
            .section-title {
              font-size: 11px;
              color: #999;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin-bottom: 18px;
              font-weight: 600;
            }
            .field {
              margin-bottom: 16px;
              display: flex;
              align-items: flex-start;
            }
            .field-label {
              font-size: 11px;
              color: #999;
              text-transform: uppercase;
              letter-spacing: 1px;
              width: 100px;
              flex-shrink: 0;
              margin-right: 20px;
              font-weight: 600;
            }
            .field-value {
              font-size: 14px;
              color: #333;
              font-weight: 500;
            }
            .field-value a {
              color: #A5292A;
              text-decoration: none;
              border-bottom: 1px solid #A5292A;
            }
            .field-value a:hover {
              opacity: 0.8;
            }
            .cta-section {
              margin: 40px 0;
              padding-top: 30px;
              border-top: 1px solid #e8e8e8;
              display: flex;
              align-items: center;
              justify-content: space-between;
            }
            .cta-text {
              flex: 1;
            }
            .cta-text-label {
              font-size: 14px;
              font-weight: 600;
              color: #222;
              margin-bottom: 2px;
            }
            .cta-text-desc {
              font-size: 13px;
              color: #666;
            }
            .cta-button {
              flex: 0 0 auto;
              margin-left: 20px;
            }
            .button {
              display: inline-block;
              background-color: #A5292A;
              color: #ffffff;
              padding: 12px 24px;
              text-decoration: none;
              font-weight: 600;
              font-size: 13px;
              text-transform: uppercase;
              letter-spacing: 1px;
              border: none;
              cursor: pointer;
              transition: opacity 0.3s;
            }
            .button:hover {
              opacity: 0.9;
            }
            .divider {
              height: 1px;
              background-color: #e8e8e8;
              margin: 30px 0;
            }
            .footer-content {
              padding: 0 40px 30px;
            }
            .footer-text {
              font-size: 12px;
              color: #999;
              margin-bottom: 8px;
              line-height: 1.5;
            }
            .email-footer {
              background-color: #fafafa;
              padding: 20px 40px;
              border-top: 1px solid #e8e8e8;
              text-align: center;
            }
            .footer-brand {
              font-size: 11px;
              color: #999;
              margin-bottom: 4px;
            }
            .footer-copy {
              font-size: 10px;
              color: #bbb;
            }
            .footer-brand strong {
              color: #333;
              font-weight: 600;
            }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="container">
              <!-- Header with Logo and Date -->
              <div class="email-header">
                <div class="logo-section">
                  <div class="logo">FATHOM LEGAL</div>
                </div>
                <div class="header-info">
                  <div class="header-label">Booking Confirmation</div>
                  <div class="header-date">${formattedDate}</div>
                </div>
              </div>

              <!-- Main Content -->
              <div class="content">
                <!-- Badge -->
                <div class="badge">NEW CONSULTATION BOOKED</div>

                <!-- Headline -->
                <div class="headline">
                  A client has scheduled a <span class="highlight">meeting.</span>
                </div>

                <!-- Subheading -->
                <div class="subheading">
                  <p>Please review the details below and prepare for the session.<br>The client's contact and meeting information are confirmed.</p>
                </div>

                <!-- Client Section -->
                <div class="section">
                  <div class="section-title">Client</div>
                  <div class="field">
                    <div class="field-label">Name</div>
                    <div class="field-value">${firstName} ${lastName}</div>
                  </div>
                  <div class="field">
                    <div class="field-label">Email</div>
                    <div class="field-value"><a href="mailto:${email}">${email}</a></div>
                  </div>
                  <div class="field">
                    <div class="field-label">Matter</div>
                    <div class="field-value">${matter}</div>
                  </div>
                </div>

                <!-- Meeting Section -->
                <div class="section">
                  <div class="section-title">Meeting</div>
                  <div class="field">
                    <div class="field-label">Date</div>
                    <div class="field-value">${formattedDate}</div>
                  </div>
                  <div class="field">
                    <div class="field-label">Time</div>
                    <div class="field-value">${selectedTime} IST</div>
                  </div>
                  <div class="field">
                    <div class="field-label">Duration</div>
                    <div class="field-value">20 minutes</div>
                  </div>
                  <div class="field">
                    <div class="field-label">Advocate</div>
                    <div class="field-value">Ishita</div>
                  </div>
                </div>

                <!-- CTA Section with Google Meet Link -->
                <div class="cta-section">
                  <div class="cta-text">
                    <div class="cta-text-label">Join the Video Call</div>
                    <div class="cta-text-desc">Your meeting link is ready and waiting.</div>
                  </div>
                  <div class="cta-button">
                    <a href="${googleMeetLink}" target="_blank" class="button">JOIN MEETING →</a>
                  </div>
                </div>

                <div class="divider"></div>

                <!-- Session Info -->
                <div class="footer-content">
                  <div class="footer-text">
                    <strong>Session ID:</strong> <code style="font-family: monospace; color: #666;">${sessionId}</code>
                  </div>
                  <div class="footer-text" style="margin-top: 12px;">
                    <strong>Automated notification:</strong> <a href="mailto:client.accounts@fathomlegal.com" style="color: #999; text-decoration: none;">client.accounts@fathomlegal.com</a>
                  </div>
                </div>
              </div>

              <!-- Footer -->
              <div class="email-footer">
                <div class="footer-brand">© 2026 <strong>Fathom Legal</strong>. All rights reserved.</div>
                <div class="footer-copy">Corporate Consultants</div>
              </div>
            </div>
          </div>
        </body>
      </html>
      `

      const adminEmail = 'Ishita@fathomlegal.com'
      console.log('[v0] Sending admin notification to:', adminEmail)

      const adminResult = await transporter.sendMail({
        from: zohoEmail,
        to: adminEmail,
        subject: `New Consultation Booking - ${firstName} ${lastName} - ${formattedDate} at ${selectedTime} IST`,
        html: adminEmailHTML,
        replyTo: zohoEmail
      })

      console.log('[v0] Admin email sent successfully:', adminResult.messageId)
      adminEmailSent = true
    } catch (adminErr) {
      adminEmailError = adminErr instanceof Error ? adminErr.message : 'Unknown admin email error'
      console.error('[v0] Admin email sending failed:', {
        error: adminEmailError,
        code: adminErr instanceof Error && 'code' in adminErr ? (adminErr as any).code : 'N/A'
      })
      // Continue - admin email failure should not block customer confirmation
    }

    console.log('[v0] Both email operations complete:', { customerEmailSent: emailSent, adminEmailSent })

    // Always return success even if email fails, as the booking is confirmed in DB
    return NextResponse.json({
      success: true,
      emailSent: emailSent,
      adminEmailSent: adminEmailSent,
      emailError: emailError || null,
      adminEmailError: adminEmailError || null,
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
