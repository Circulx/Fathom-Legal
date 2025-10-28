import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { createAdminBySuperAdmin } from '@/lib/adminUtils'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'super-admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { email, password, name, permissions } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const admin = await createAdminBySuperAdmin(
      email,
      password,
      name,
      permissions || ['manage_content', 'view_analytics'],
      session.user.id
    )

    return NextResponse.json({ 
      message: 'Admin created successfully',
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        permissions: admin.permissions
      }
    })
  } catch (error: any) {
    console.error('Error creating admin:', error)
    return NextResponse.json({ error: error.message || 'Failed to create admin' }, { status: 500 })
  }
}


