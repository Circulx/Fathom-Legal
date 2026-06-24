import { connectDB } from '@/lib/mongodb'
import { syncLeadFromIntake } from '@/lib/intake-to-lead'
import IntakeSubmission from '@/models/IntakeSubmission'
import BookedSlot from '@/models/BookedSlot'
import { NextRequest, NextResponse } from 'next/server'

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
    
    const submission = await IntakeSubmission.findOneAndUpdate(
      { sessionId },
      {
        currentStep: 3,
        selectedDate,
        selectedTime,
        confirmedEmail,
        googleMeetLink: googleMeetLink || 'https://meet.google.com/wkd-evwz-dxw',
        completedAt: new Date(),
      },
      { new: true }
    )
    
    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      )
    }

    // Convert 24-hour format time to HH:MM format if needed
    let timeForSlot = selectedTime
    if (selectedTime.includes('AM') || selectedTime.includes('PM')) {
      // Convert "9:00 AM" format to "09:00"
      const [timePart, period] = selectedTime.split(' ')
      let [hours, minutes] = timePart.split(':').map(Number)
      
      if (period === 'PM' && hours !== 12) hours += 12
      if (period === 'AM' && hours === 12) hours = 0
      
      timeForSlot = `${hours.toString().padStart(2, '0')}:${(minutes || 0).toString().padStart(2, '0')}`
    }

    // Save booked slot to database
    try {
      await BookedSlot.create({
        date: selectedDate,
        time: timeForSlot,
        email: confirmedEmail,
        firstName: submission.firstName,
        lastName: submission.lastName,
        sessionId,
        googleMeetLink: googleMeetLink || 'https://meet.google.com/wkd-evwz-dxw',
        services: submission.selectedServices,
      })
      console.log('[v0] Booked slot created:', { date: selectedDate, time: timeForSlot })
    } catch (slotError) {
      console.error('[v0] Error creating booked slot:', slotError)
      // Don't fail the request if slot creation fails
    }

    try {
      await syncLeadFromIntake(submission)
    } catch (leadError) {
      console.error('CRM lead sync error:', leadError)
    }
    
    return NextResponse.json({
      success: true,
      data: submission,
      message: 'Step 3 data saved successfully',
    })
  } catch (error) {
    console.error('Step 3 save error:', error)
    return NextResponse.json(
      { error: 'Failed to save step 3 data' },
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
      { error: 'Failed to fetch step 3 data' },
      { status: 500 }
    )
  }
}
