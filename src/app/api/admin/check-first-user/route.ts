import { NextResponse } from 'next/server'
import { isFirstUser } from '@/lib/adminUtils'

export async function GET() {
  try {
    const isFirst = await isFirstUser()
    return NextResponse.json({ isFirstUser: isFirst })
  } catch (error) {
    console.error('Error checking first user:', error)
    return NextResponse.json({ error: 'Failed to check first user' }, { status: 500 })
  }
}


