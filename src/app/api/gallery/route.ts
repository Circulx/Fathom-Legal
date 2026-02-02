import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import GalleryItem from '@/models/GalleryItem'


export const dynamic = 'force-dynamic'

export const revalidate = 1800

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')

    // Build query
    let query: any = { isActive: true }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }

    // Get gallery items with pagination
    const skip = (page - 1) * limit
    const galleryItems = await GalleryItem.find(query)
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .lean() // Use lean() to get plain JavaScript objects

    const total = await GalleryItem.countDocuments(query)

    // Ensure imageData is always an array
    const normalizedGalleryItems = galleryItems.map((item: any) => {
      let imageData = item.imageData
      if (!Array.isArray(imageData)) {
        imageData = typeof imageData === 'string' ? [imageData] : []
      }
      return {
        ...item,
        imageData: imageData
      }
    })

    return NextResponse.json({
      galleryItems: normalizedGalleryItems,
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
