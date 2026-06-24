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

    const gmailUser = process.env.GMAIL_USER
    const gmailPassword = process.env.GMAIL_APP_PASSWORD

    if (!gmailUser || !gmailPassword) {
      console.error('Gmail credentials not configured')
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      )
    }

    // Create transporter using Gmail
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
            padding: 40px;
          }
          .greeting {
            font-size: 16px;
            margin-bottom: 20px;
            line-height: 1.8;
          }
          .section {
            margin-bottom: 35px;
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
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            color: white;
            padding: 30px;
            border-radius: 6px;
            text-align: center;
            margin-bottom: 30px;
          }
          .meeting-section h3 {
            font-size: 18px;
            margin-bottom: 20px;
            font-weight: 700;
          }
          .meeting-link {
            display: inline-block;
            background-color: white;
            color: #2563eb;
            padding: 14px 40px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 700;
            margin-bottom: 15px;
            transition: all 0.3s;
            font-size: 16px;
          }
          .meeting-link:hover {
            background-color: #f0f0f0;
          }
          .meeting-url {
            background-color: rgba(255,255,255,0.1);
            padding: 12px;
            border-radius: 4px;
            word-break: break-all;
            font-size: 12px;
            font-family: 'Courier New', monospace;
            opacity: 0.9;
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
              <h3>📹 Join Your Google Meet</h3>
              <a href="${googleMeetLink}" class="meeting-link">Click to Join Meeting</a>
              <div class="meeting-url">${googleMeetLink}</div>
            </div>

            <div class="section">
              <div class="section-title">✓ Before Your Consultation</div>
              <div class="checklist">
                <h4>Please ensure:</h4>
                <ul>
                  <li>You have a stable internet connection</li>
                  <li>Your microphone and camera are working properly</li>
                  <li>You join 5 minutes early for technical checks</li>
                  <li>You have any relevant documents ready to discuss</li>
                  <li>You choose a quiet location for the meeting</li>
                  <li>You save this email with the Google Meet link</li>
                </ul>
              </div>
            </div>

            <div class="section">
              <div class="reschedule-section">
                <h4>Need to Reschedule?</h4>
                <p>If you need to reschedule your consultation, please reply to this email or contact us at least 24 hours in advance. We'll be happy to help you find a new time slot.</p>
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

    // Send email with error handling
    let emailSent = false
    let emailError = null
    
    try {
      await transporter.sendMail({
        from: gmailUser,
        to: email,
        subject: `Consultation Confirmed - ${formattedDate} at ${selectedTime} IST | Fathom Legal`,
        html: emailHTML,
        replyTo: gmailUser
      })
      emailSent = true
    } catch (emailErr) {
      emailError = emailErr instanceof Error ? emailErr.message : 'Unknown email error'
      console.error('Email sending failed:', emailError)
      // Continue - email failure should not block confirmation
    }

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
    console.error('Error in email route:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
