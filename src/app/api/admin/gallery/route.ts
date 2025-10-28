import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import GalleryItem from '@/models/GalleryItem'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Build query - for admin, show all items (active and inactive)
    let query: any = {}

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }

    // Get gallery items with pagination - newest first
    const skip = (page - 1) * limit
    const galleryItems = await GalleryItem.find(query)
      .sort({ _id: -1 }) // Newest first
      .skip(skip)
      .limit(limit)

    const total = await GalleryItem.countDocuments(query)

    return NextResponse.json({
      galleryItems,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Get gallery items error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Gallery item ID is required' }, { status: 400 })
    }

    const galleryItem = await GalleryItem.findByIdAndUpdate(id, { isActive: false })
    
    if (!galleryItem) {
      return NextResponse.json({ error: 'Gallery item not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Gallery item deleted successfully' })

  } catch (error) {
    console.error('Delete gallery item error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
