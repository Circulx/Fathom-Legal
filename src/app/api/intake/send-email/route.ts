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
        <style>
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
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .header {
            background: linear-gradient(135deg, #A5292A 0%, #8a2123 100%);
            color: white;
            padding: 30px;
            border-radius: 8px;
            text-align: center;
            margin-bottom: 30px;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
          }
          .header p {
            margin: 8px 0 0 0;
            font-size: 14px;
            opacity: 0.9;
          }
          .section {
            margin-bottom: 30px;
            padding-bottom: 30px;
            border-bottom: 1px solid #eee;
          }
          .section:last-child {
            border-bottom: none;
            padding-bottom: 0;
          }
          .section-title {
            font-size: 16px;
            font-weight: 600;
            color: #A5292A;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .details {
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 6px;
            border-left: 4px solid #A5292A;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #eee;
          }
          .detail-row:last-child {
            border-bottom: none;
          }
          .detail-label {
            font-weight: 600;
            color: #666;
            width: 40%;
          }
          .detail-value {
            color: #333;
            font-weight: 500;
            width: 60%;
            text-align: right;
          }
          .meeting-link {
            display: inline-block;
            background-color: #A5292A;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin-top: 15px;
            transition: background-color 0.3s;
          }
          .meeting-link:hover {
            background-color: #8a2123;
          }
          .footer {
            background-color: #f5f5f5;
            padding: 20px;
            border-radius: 6px;
            font-size: 13px;
            color: #666;
            text-align: center;
            margin-top: 30px;
          }
          .footer p {
            margin: 5px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✓ Your Consultation is Booked</h1>
            <p>Confirmation Email from Fathom Legal</p>
          </div>

          <p>Dear ${firstName},</p>
          
          <p>Thank you for booking a consultation with Fathom Legal. Your appointment has been confirmed. Here are the details:</p>

          <div class="section">
            <div class="section-title">Booking Details</div>
            <div class="details">
              <div class="detail-row">
                <span class="detail-label">Client Name:</span>
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
                <span class="detail-label">Matter:</span>
                <span class="detail-value">${matter}</span>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Meeting Information</div>
            <p>Your consultation will be conducted via Google Meet. Click the link below to join the meeting:</p>
            ${googleMeetLink ? `<a href="${googleMeetLink}" class="meeting-link">Join Meeting on Google Meet</a>` : ''}
            ${googleMeetLink ? `<p style="word-break: break-all; color: #999; font-size: 12px; margin-top: 10px;">Link: ${googleMeetLink}</p>` : ''}
          </div>

          <div class="section">
            <div class="section-title">Before Your Consultation</div>
            <ul style="padding-left: 20px; color: #555;">
              <li>Ensure you have a stable internet connection</li>
              <li>Join 5 minutes early for technical checks</li>
              <li>Have any relevant documents ready to discuss</li>
              <li>Choose a quiet location for the meeting</li>
            </ul>
          </div>

          <div class="section">
            <div class="section-title">Need to Reschedule?</div>
            <p>If you need to reschedule your consultation, please reply to this email or contact us at least 24 hours in advance. We'll be happy to help you find a new time slot.</p>
          </div>

          <div class="footer">
            <p><strong>Fathom Legal - Advocates & Corporate Consultants</strong></p>
            <p>Your consultation is confirmed. Session ID: ${sessionId}</p>
            <p>© 2024 Fathom Legal. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
    `

    // Send email
    await transporter.sendMail({
      from: gmailUser,
      to: email,
      subject: `Consultation Confirmed - ${formattedDate} at ${selectedTime} IST | Fathom Legal`,
      html: emailHTML,
      replyTo: gmailUser
    })

    return NextResponse.json({
      success: true,
      message: 'Confirmation email sent successfully'
    })
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}
