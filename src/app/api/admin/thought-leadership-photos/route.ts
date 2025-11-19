import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import ThoughtLeadershipPhoto from '@/models/ThoughtLeadershipPhoto'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')

    // Build query - only active photos
    let query: any = { isActive: true }

    if (category && category !== 'all') {
      query.category = category
    }

    // Get photos with pagination, ordered by displayOrder then by createdAt
    const skip = (page - 1) * limit
    const photos = await ThoughtLeadershipPhoto.find(query)
      .sort({ displayOrder: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await ThoughtLeadershipPhoto.countDocuments(query)

    return NextResponse.json({
      photos,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Get thought leadership photos error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Photo ID is required' }, { status: 400 })
    }

    const photo = await ThoughtLeadershipPhoto.findByIdAndUpdate(id, { isActive: false })
    
    if (!photo) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Photo deleted successfully' })

  } catch (error) {
    console.error('Delete thought leadership photo error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}























