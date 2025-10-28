import { NextRequest, NextResponse } from 'next/server'
import { seedAdmin } from '@/lib/seedAdmin'

export async function POST(request: NextRequest) {
  try {
    await seedAdmin()
    return NextResponse.json({ message: 'Admin user seeded successfully' })
  } catch (error) {
    console.error('Error seeding admin:', error)
    return NextResponse.json({ error: 'Failed to seed admin' }, { status: 500 })
  }
}