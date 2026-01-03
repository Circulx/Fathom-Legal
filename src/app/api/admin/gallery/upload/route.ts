import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import GalleryItem from '@/models/GalleryItem'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const formData = await request.formData()
    const title = formData.get('title') as string
    const description = formData.get('description') as string

    if (!title) {
      return NextResponse.json({ error: 'Photo description is required' }, { status: 400 })
    }

    // Get all images from formData
    const images: File[] = []
    
    // Get all 'image' entries (FormData allows multiple values with same key)
    const imageEntries = formData.getAll('image')
    for (const entry of imageEntries) {
      if (entry instanceof File) {
        images.push(entry)
      }
    }

    if (images.length === 0) {
      return NextResponse.json({ error: 'At least one image is required' }, { status: 400 })
    }

    // Validate image types and sizes
    const allowedTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/webp'
    ]

    const maxSize = 5 * 1024 * 1024 // 5MB
    const imageDataUrls: string[] = []
    let imageType = ''

    for (const image of images) {
      if (!allowedTypes.includes(image.type)) {
        return NextResponse.json({ 
          error: 'Invalid image type. Only JPEG, PNG, GIF, and WebP images are allowed.' 
        }, { status: 400 })
      }

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
      imageDataUrls.push(dataUrl)
      
      // Use the first image's type
      if (!imageType) {
        imageType = image.type
      }
    }

    // Validate that we have at least one image
    if (imageDataUrls.length === 0) {
      return NextResponse.json({ error: 'No valid images to upload' }, { status: 400 })
    }

    // Ensure imageDataUrls is a proper array
    if (!Array.isArray(imageDataUrls) || imageDataUrls.length === 0) {
      return NextResponse.json({ error: 'No valid images to upload' }, { status: 400 })
    }

    // Create gallery item record with multiple images
    const galleryItemData: any = {
      title: title.trim(),
      description: description?.trim() || '',
      imageData: imageDataUrls, // Ensure this is an array
      imageType: imageType,
      isActive: true
    }

    console.log('Creating gallery item with:', {
      title: galleryItemData.title,
      description: galleryItemData.description,
      imageCount: galleryItemData.imageData.length,
      imageType: galleryItemData.imageType,
      imageDataIsArray: Array.isArray(galleryItemData.imageData)
    })

    // Ensure imageData is definitely an array
    if (!Array.isArray(galleryItemData.imageData)) {
      galleryItemData.imageData = [galleryItemData.imageData]
    }

    const galleryItem = new GalleryItem(galleryItemData)

    // Validate before saving
    const validationError = galleryItem.validateSync()
    if (validationError) {
      console.error('Validation error:', validationError)
      return NextResponse.json({ 
        error: 'Validation failed',
        details: validationError.message 
      }, { status: 400 })
    }

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
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    console.error('Error details:', {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined
    })
    return NextResponse.json({ 
      error: errorMessage || 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : String(error)) : undefined
    }, { status: 500 })
  }
}
