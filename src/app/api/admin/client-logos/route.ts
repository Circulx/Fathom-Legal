import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import ClientLogo from '@/models/ClientLogo'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user?.role !== 'admin' && session.user?.role !== 'super-admin')) {
    return null
  }
  return session
}

export async function GET() {
  try {
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const logos = await ClientLogo.find({ isActive: true })
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean()

    return NextResponse.json({
      logos: logos.map((logo) => ({
        id: String(logo._id),
        name: logo.name,
        imageUrl: logo.imageUrl,
        websiteUrl: logo.websiteUrl || '',
        displayOrder: logo.displayOrder ?? 0,
        createdAt: logo.createdAt,
      })),
    })
  } catch (error) {
    console.error('Admin get client logos error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const id = new URL(request.url).searchParams.get('id')?.trim()
    if (!id) {
      return NextResponse.json({ error: 'Logo ID is required' }, { status: 400 })
    }

    await connectDB()
    const logo = await ClientLogo.findByIdAndUpdate(id, { isActive: false })
    if (!logo) {
      return NextResponse.json({ error: 'Logo not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Logo deleted successfully' })
  } catch (error) {
    console.error('Admin delete client logo error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
