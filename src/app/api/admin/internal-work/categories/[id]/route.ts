import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import InternalWorkCategory from '@/models/InternalWorkCategory'
import InternalWorkTask from '@/models/InternalWorkTask'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user?.role !== 'admin' && session.user?.role !== 'super-admin')) {
    return null
  }
  return session
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

    const category = await InternalWorkCategory.findById(id)
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    const inUse = await InternalWorkTask.countDocuments({
      section: category.section,
      category: category.slug,
    })
    if (inUse > 0) {
      return NextResponse.json(
        { error: 'Category is in use by existing tasks and cannot be removed' },
        { status: 409 }
      )
    }

    await InternalWorkCategory.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete internal work category error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
