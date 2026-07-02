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

    // Check if the selected date is today.
    // Compare date strings directly (built from local date parts) instead of
    // relying on `new Date(date)`, which parses "YYYY-MM-DD" as UTC midnight
    // while `new Date()` reflects local server time — those two bases can
    // silently disagree and make `isToday` false when it shouldn't be,
    // which in turn disables the 1-hour-ahead slot restriction below.
    const now = new Date()
    const todayStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`

    const isToday = date === todayStr

    // Generate all available time slots (9 AM to 5 PM in 20-min increments)
    const timeSlots: Array<{ time: string; available: boolean; reason?: string }> = []
    
    for (let hour = 9; hour < 17; hour++) {
      for (let min = 0; min < 60; min += 20) {
        const timeStr = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`
        const isBooked = bookedSlots.some(slot => slot.time === timeStr)
        
        let isAvailable = true
        let reason = ''
        
        if (isBooked) {
          // Slot is already booked
          isAvailable = false
          reason = 'booked'
        } else if (isToday) {
          // For today, check if slot is at least 1 hour ahead of current time
          const slotMinutesFromMidnight = hour * 60 + min
          const now = new Date()
          const currentMinutesFromMidnight = (now.getHours() * 60) + now.getMinutes()
          const oneHourAhead = currentMinutesFromMidnight + 60
          
          if (slotMinutesFromMidnight < oneHourAhead) {
            isAvailable = false
            reason = 'past'
          }
        }
        
        timeSlots.push({
          time: timeStr,
          available: isAvailable,
          reason: reason
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
