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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    await connectDB()
    const logo = await ClientLogo.findById(id)
    if (!logo || !logo.isActive) {
      return NextResponse.json({ error: 'Logo not found' }, { status: 404 })
    }

    if (typeof body.name === 'string') {
      const name = body.name.trim()
      if (!name) {
        return NextResponse.json({ error: 'Client name is required' }, { status: 400 })
      }
      logo.name = name
    }
    if (typeof body.websiteUrl === 'string') {
      logo.websiteUrl = body.websiteUrl.trim()
    }
    if (body.displayOrder !== undefined) {
      const order = parseInt(String(body.displayOrder), 10)
      if (Number.isFinite(order)) logo.displayOrder = order
    }

    await logo.save()

    return NextResponse.json({
      logo: {
        id: String(logo._id),
        name: logo.name,
        imageUrl: logo.imageUrl,
        websiteUrl: logo.websiteUrl || '',
        displayOrder: logo.displayOrder,
      },
    })
  } catch (error) {
    console.error('Update client logo error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    await connectDB()
    const logo = await ClientLogo.findByIdAndUpdate(id, { isActive: false })
    if (!logo) {
      return NextResponse.json({ error: 'Logo not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Logo deleted successfully' })
  } catch (error) {
    console.error('Delete client logo error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
