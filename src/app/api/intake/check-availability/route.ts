import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import BookedSlot from '@/models/BookedSlot'

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const { date } = await request.json()

    if (!date) {
      return NextResponse.json(
        { error: 'Date is required' },
        { status: 400 }
      )
    }

    // Get all booked slots for the given date
    const bookedSlots = await BookedSlot.find({ date }).select('time')

    // Generate all available time slots (9 AM to 5 PM in 20-min increments)
    const timeSlots: Array<{ time: string; available: boolean }> = []
    
    for (let hour = 9; hour < 17; hour++) {
      for (let min = 0; min < 60; min += 20) {
        const timeStr = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`
        const isBooked = bookedSlots.some(slot => slot.time === timeStr)
        timeSlots.push({
          time: timeStr,
          available: !isBooked
        })
      }
    }

    return NextResponse.json({
      success: true,
      date,
      slots: timeSlots
    })
  } catch (error) {
    console.error('Availability check error:', error)
    return NextResponse.json(
      { error: 'Failed to check availability' },
      { status: 500 }
    )
  }
}
