import { NextRequest, NextResponse } from 'next/server'
import { createFirstAdmin } from '@/lib/adminUtils'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const admin = await createFirstAdmin(email, password, name || 'Super Admin')

    return NextResponse.json({ 
      success: true,
      message: 'Admin created successfully',
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    })
  } catch (error: any) {
    console.error('Error creating first admin:', error)
    return NextResponse.json({ error: error.message || 'Failed to create admin' }, { status: 500 })
  }
}


