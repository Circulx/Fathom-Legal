import { connectDB } from '@/lib/mongodb'
import IntakeSubmission from '@/models/IntakeSubmission'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const {
      sessionId,
      firstName,
      lastName,
      email,
      phone,
      company,
      heardAbout,
      matterDescription,
    } = await request.json()
    
    if (!sessionId || !firstName || !lastName || !email || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Email format validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format. Please enter a valid email address.' },
        { status: 400 }
      )
    }

    // Phone number validation (10-15 digits, optional +, spaces, dashes, parentheses)
    const phoneRegex = /^\+?[\d\s\-().]{7,15}$/
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { error: 'Invalid phone number format. Please enter a valid phone number (e.g. +1 800-555-0199).' },
        { status: 400 }
      )
    }
    
    const submission = await IntakeSubmission.findOneAndUpdate(
      { sessionId },
      {
        currentStep: 2,
        firstName,
        lastName,
        email,
        phone,
        company,
        heardAbout,
        matterDescription,
      },
      { new: true }
    )
    
    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: submission,
      message: 'Step 2 data saved successfully',
    })
  } catch (error) {
    console.error('Step 2 save error:', error)
    return NextResponse.json(
      { error: 'Failed to save step 2 data' },
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
    console.error('Step 2 fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch step 2 data' },
      { status: 500 }
    )
  }
}
