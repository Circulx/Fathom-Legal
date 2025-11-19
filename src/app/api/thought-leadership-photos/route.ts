import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import ThoughtLeadershipPhoto from '@/models/ThoughtLeadershipPhoto'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '8')

    // Build query - only active photos
    let query: any = { isActive: true }

    if (category && category !== 'all') {
      query.category = category
    }

    // Get photos with pagination, ordered by displayOrder then by createdAt
    const photos = await ThoughtLeadershipPhoto.find(query)
      .sort({ displayOrder: 1, createdAt: -1 })
      .limit(limit)

    return NextResponse.json({
      photos,
      total: photos.length
    })

  } catch (error) {
    console.error('Get thought leadership photos error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}























