import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import GalleryBlog from '@/models/GalleryBlog'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')

    // Build query - only active and non-deleted gallery blogs
    let query: any = { isActive: true, isDeleted: { $ne: true } }

    if (category && category !== 'all') {
      query.category = category
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }

    // Get gallery blogs with pagination
    const skip = (page - 1) * limit
    const blogs = await GalleryBlog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await GalleryBlog.countDocuments(query)

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
    console.error('Get gallery blogs error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Gallery blog ID is required' }, { status: 400 })
    }

    const galleryBlog = await GalleryBlog.findByIdAndUpdate(
      id,
      { 
        $set: { isDeleted: true, isActive: false }
      },
      { new: true } // ensures the updated document is returned
    )
    
    
    if (!galleryBlog) {
      return NextResponse.json({ error: 'Gallery blog not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Gallery blog deleted successfully' })

  } catch (error) {
    console.error('Delete gallery blog error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

