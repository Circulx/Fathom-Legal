import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import Admin from '@/models/Admin'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    
    const totalAdmins = await Admin.countDocuments({ isActive: true })
    const currentAdmin = await Admin.findById(session.user.id)
    
    return NextResponse.json({
      totalAdmins,
      lastLogin: currentAdmin?.lastLogin ? new Date(currentAdmin.lastLogin).toLocaleString() : 'Never',
      systemStatus: 'Online'
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}