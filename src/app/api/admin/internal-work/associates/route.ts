import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import InternalWorkAssociate from '@/models/InternalWorkAssociate'
import { formatInternalWorkAssociate } from '@/lib/internal-work-format'
import { isValidEmail } from '@/lib/assignee-emails'

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
    const associates = await InternalWorkAssociate.find()
      .sort({ name: 1 })
      .lean<{ _id: unknown; name: string; role: string; email?: string | null }[]>()
    return NextResponse.json({
      associates: associates.map((doc) => formatInternalWorkAssociate(doc)),
    })
  } catch (error) {
    console.error('Get internal work associates error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    const role =
      typeof body.role === 'string' && body.role.trim() ? body.role.trim() : 'Associate'
    const emailRaw = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }
    if (emailRaw && !isValidEmail(emailRaw)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    await connectDB()

    const associate = await InternalWorkAssociate.create({
      name,
      role,
      email: emailRaw,
    })

    return NextResponse.json({
      associate: formatInternalWorkAssociate(associate),
    })
  } catch (error) {
    console.error('Create internal work associate error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
