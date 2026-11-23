import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Blog from '@/models/Blog'


// Use ISR with 60 second revalidation for API route
export const revalidate = 60

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')

    // Build query - only active, non-deleted, and non-draft thought leadership blogs
    let query: any = { 
      isActive: true, 
      isDeleted: { $ne: true },
      isDraft: { $ne: true } // Exclude draft blogs
    }

    if (category && category !== 'all') {
      query.category = category
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }

    // Get thought leadership blogs with pagination
    const skip = (page - 1) * limit
    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Blog.countDocuments(query)

    return NextResponse.json({
      blogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Get thought leadership blogs error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}



























