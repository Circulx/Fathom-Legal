import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import InternalWorkAssociate from '@/models/InternalWorkAssociate'
import InternalWorkTask from '@/models/InternalWorkTask'
import { formatInternalWorkAssociate } from '@/lib/internal-work-format'
import { isValidEmail } from '@/lib/assignee-emails'

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

    const associate = await InternalWorkAssociate.findById(id)
    if (!associate) {
      return NextResponse.json({ error: 'Associate not found' }, { status: 404 })
    }

    if (typeof body.name === 'string' && body.name.trim()) {
      associate.name = body.name.trim()
    }
    if (typeof body.role === 'string' && body.role.trim()) {
      associate.role = body.role.trim()
    }
    if (body.email !== undefined) {
      const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
      if (email && !isValidEmail(email)) {
        return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
      }
      associate.email = email
    }

    await associate.save()

    return NextResponse.json({
      associate: formatInternalWorkAssociate(associate),
    })
  } catch (error) {
    console.error('Update internal work associate error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    await connectDB()

    const deleted = await InternalWorkAssociate.findByIdAndDelete(id)
    if (!deleted) {
      return NextResponse.json({ error: 'Associate not found' }, { status: 404 })
    }

    await InternalWorkTask.updateMany({ assignee: id }, { assignee: '' })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete internal work associate error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
