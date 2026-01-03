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

export async function PUT(request: NextRequest) {
  try {
    await connectDB()
    
    const formData = await request.formData()
    const id = formData.get('id') as string
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const image = formData.get('image') as File | null

    if (!id) {
      return NextResponse.json({ error: 'Gallery item ID is required' }, { status: 400 })
    }

    if (!title) {
      return NextResponse.json({ error: 'Photo description is required' }, { status: 400 })
    }

    const galleryItem = await GalleryItem.findById(id)
    
    if (!galleryItem) {
      return NextResponse.json({ error: 'Gallery item not found' }, { status: 404 })
    }

    // Update title and description
    galleryItem.title = title
    galleryItem.description = description || ''

    // Handle image update if provided
    if (image && image.size > 0) {
      // Validate image type
      const allowedTypes = [
        'image/jpeg',
        'image/jpg', 
        'image/png',
        'image/gif',
        'image/webp'
      ]

      if (!allowedTypes.includes(image.type)) {
        return NextResponse.json({ 
          error: 'Invalid image type. Only JPEG, PNG, GIF, and WebP images are allowed.' 
        }, { status: 400 })
      }

      // Validate image size (5MB limit for database storage)
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (image.size > maxSize) {
        return NextResponse.json({ 
          error: 'Image size too large. Maximum size is 5MB for database storage.' 
        }, { status: 400 })
      }

      // Convert image to Base64
      const bytes = await image.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const base64Data = buffer.toString('base64')
      const dataUrl = `data:${image.type};base64,${base64Data}`

      // Handle both array (new) and string (legacy) imageData
      if (Array.isArray(galleryItem.imageData)) {
        // Add new image to existing array
        galleryItem.imageData.push(dataUrl)
      } else {
        // Convert legacy string to array
        galleryItem.imageData = [galleryItem.imageData, dataUrl]
      }
      galleryItem.imageType = image.type
    }

    await galleryItem.save()

    return NextResponse.json({ 
      message: 'Gallery item updated successfully',
      galleryItem: {
        id: galleryItem._id,
        title: galleryItem.title,
        description: galleryItem.description,
        imageData: galleryItem.imageData,
        imageType: galleryItem.imageType
      }
    })

  } catch (error) {
    console.error('Update gallery item error:', error)
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
