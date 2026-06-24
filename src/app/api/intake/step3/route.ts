import { connectDB } from '@/lib/mongodb'
import IntakeSubmission from '@/models/IntakeSubmission'
import BookedSlot from '@/models/BookedSlot'
import { NextRequest, NextResponse } from 'next/server'

const DEFAULT_MEET_LINK = 'https://meet.google.com/wkd-evwz-dxw'

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const {
      sessionId,
      selectedDate,
      selectedTime,
      confirmedEmail,
      googleMeetLink,
    } = await request.json()

    if (!sessionId || !selectedDate || !selectedTime || !confirmedEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(confirmedEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const submission = await IntakeSubmission.findOne({ sessionId })
    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found. Please start from step 1.' },
        { status: 404 }
      )
    }

    if (!submission.firstName || !submission.lastName) {
      return NextResponse.json(
        { error: 'Complete your contact details before scheduling' },
        { status: 400 }
      )
    }

    const conflicting = await BookedSlot.findOne({
      date: selectedDate,
      time: selectedTime,
      sessionId: { $ne: sessionId },
    })
    if (conflicting) {
      return NextResponse.json(
        { error: 'This time slot is no longer available. Please choose another.' },
        { status: 409 }
      )
    }

    const meetLink = googleMeetLink?.trim() || DEFAULT_MEET_LINK
    const normalizedEmail = confirmedEmail.trim().toLowerCase()

    await BookedSlot.findOneAndUpdate(
      { sessionId },
      {
        date: selectedDate,
        time: selectedTime,
        email: normalizedEmail,
        firstName: submission.firstName,
        lastName: submission.lastName,
        sessionId,
        googleMeetLink: meetLink,
        services: submission.selectedServices ?? [],
      },
      { upsert: true, new: true }
    )

    const updated = await IntakeSubmission.findOneAndUpdate(
      { sessionId },
      {
        currentStep: 3,
        selectedDate,
        selectedTime,
        confirmedEmail: normalizedEmail,
        googleMeetLink: meetLink,
        email: normalizedEmail,
      },
      { new: true }
    )

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Scheduling saved successfully',
    })
  } catch (error) {
    console.error('Step 3 save error:', error)
    return NextResponse.json(
      { error: 'Failed to save scheduling' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const sessionId = request.nextUrl.searchParams.get('sessionId')
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing sessionId' },
        { status: 400 }
      )
    }

    const submission = await IntakeSubmission.findOne({ sessionId })

    return NextResponse.json({
      success: true,
      data: submission,
    })
  } catch (error) {
    console.error('Step 3 fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch scheduling data' },
      { status: 500 }
    )
  }
}
