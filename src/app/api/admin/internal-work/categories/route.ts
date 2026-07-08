import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import InternalWorkCategory from '@/models/InternalWorkCategory'
import { formatInternalWorkCategory } from '@/lib/internal-work-format'
import {
  pickCategoryStyle,
  seedDefaultCategoriesIfEmpty,
  slugifyCategoryLabel,
} from '@/lib/internal-work-categories'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user?.role !== 'admin' && session.user?.role !== 'super-admin')) {
    return null
  }
  return session
}

export async function GET(request: NextRequest) {
  try {
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    await seedDefaultCategoriesIfEmpty()

    const { searchParams } = new URL(request.url)
    const section = searchParams.get('section')
    const query =
      section === 'client' || section === 'admin' ? { section } : {}

    const categories = await InternalWorkCategory.find(query)
      .sort({ label: 1 })
      .lean<
        {
          _id: unknown
          section: 'client' | 'admin'
          slug: string
          label: string
          className: string
        }[]
      >()

    return NextResponse.json({
      categories: categories.map((doc) => formatInternalWorkCategory(doc)),
    })
  } catch (error) {
    console.error('Get internal work categories error:', error)
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
    const section = body.section === 'admin' ? 'admin' : 'client'
    const label = typeof body.label === 'string' ? body.label.trim() : ''

    if (!label) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 })
    }

    await connectDB()
    await seedDefaultCategoriesIfEmpty()

    const slug = slugifyCategoryLabel(label)
    const existing = await InternalWorkCategory.findOne({ section, slug })
    if (existing) {
      return NextResponse.json({ error: 'Category already exists' }, { status: 409 })
    }

    const count = await InternalWorkCategory.countDocuments({ section })
    const category = await InternalWorkCategory.create({
      section,
      slug,
      label,
      className: pickCategoryStyle(count),
    })

    return NextResponse.json({
      category: formatInternalWorkCategory(category),
    })
  } catch (error) {
    console.error('Create internal work category error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
