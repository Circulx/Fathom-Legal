import { connectDB } from '@/lib/mongodb'
import IntakeSubmission from '@/models/IntakeSubmission'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const { sessionId, selectedServices, customNeeds } = await request.json()
    
    if (!sessionId || !selectedServices || selectedServices.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    const submission = await IntakeSubmission.findOneAndUpdate(
      { sessionId },
      {
        sessionId,
        currentStep: 1,
        selectedServices,
        customNeeds,
      },
      { upsert: true, new: true }
    )
    
    return NextResponse.json({
      success: true,
      data: submission,
      message: 'Step 1 data saved successfully',
    })
  } catch (error) {
    console.error('Step 1 save error:', error)
    return NextResponse.json(
      { error: 'Failed to save step 1 data' },
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
    console.error('Step 1 fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch step 1 data' },
      { status: 500 }
    )
  }
}
