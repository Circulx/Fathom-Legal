import { NextRequest, NextResponse } from 'next/server'
import { sendConsultationConfirmationEmail } from '@/lib/consultation-email'

export async function POST(request: NextRequest) {
  try {
    const {
      email,
      firstName,
      lastName,
      selectedDate,
      selectedTime,
      matter,
      googleMeetLink,
      sessionId,
    } = await request.json()

    if (!email || !firstName || !selectedDate || !selectedTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { emailSent, emailError } = await sendConsultationConfirmationEmail({
      email,
      firstName,
      lastName,
      selectedDate,
      selectedTime,
      googleMeetLink: googleMeetLink || 'https://meet.google.com/wkd-evwz-dxw',
      matter,
      sessionId,
    })

    return NextResponse.json(
      {
        success: true,
        emailSent,
        emailError,
        message: emailSent
          ? 'Confirmation email sent successfully'
          : 'Booking confirmed but email failed to send. Check your spam folder or request resend.',
      },
      { status: 200 }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Intake send-email error:', errorMessage)
    return NextResponse.json(
      {
        error: 'Failed to process request',
        details: errorMessage,
      },
      { status: 500 }
    )
  }
}
