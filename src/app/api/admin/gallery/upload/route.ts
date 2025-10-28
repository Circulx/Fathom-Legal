import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import GalleryItem from '@/models/GalleryItem'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const formData = await request.formData()
    const image = formData.get('image') as File
    const title = formData.get('title') as string
    const description = formData.get('description') as string

    if (!image) {
      return NextResponse.json({ error: 'No image uploaded' }, { status: 400 })
    }

    if (!title) {
      return NextResponse.json({ error: 'Photo description is required' }, { status: 400 })
    }

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

    // Create gallery item record
    const galleryItem = new GalleryItem({
      title,
      description,
      imageData: dataUrl,
      imageType: image.type,
      isActive: true
    })

    await galleryItem.save()

    return NextResponse.json({ 
      message: 'Gallery item uploaded successfully',
      galleryItem: {
        id: galleryItem._id,
        title: galleryItem.title,
        description: galleryItem.description,
        imageData: galleryItem.imageData,
        imageType: galleryItem.imageType
      }
    })

  } catch (error) {
    console.error('Gallery upload error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
