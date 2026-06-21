import { connectDB } from '@/lib/mongodb'
import { syncLeadFromIntake } from '@/lib/intake-to-lead'
import IntakeSubmission from '@/models/IntakeSubmission'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const { sessionId } = await request.json()
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing sessionId' },
        { status: 400 }
      )
    }
    
    const submission = await IntakeSubmission.findOneAndUpdate(
      { sessionId },
      {
        currentStep: 4,
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

    try {
      await syncLeadFromIntake(submission)
    } catch (leadError) {
      console.error('CRM lead sync error:', leadError)
    }
    
    return NextResponse.json({
      success: true,
      data: submission,
      message: 'Intake process completed successfully',
    })
  } catch (error) {
    console.error('Step 4 completion error:', error)
    return NextResponse.json(
      { error: 'Failed to complete intake process' },
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
    console.error('Step 4 fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch submission data' },
      { status: 500 }
    )
  }
}
