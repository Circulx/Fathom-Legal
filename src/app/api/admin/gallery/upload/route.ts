import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import GalleryItem from '@/models/GalleryItem'
import { put } from '@vercel/blob'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'admin' && session.user?.role !== 'super-admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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
    const imageUrls: string[] = []
    let imageType = ''

    // Upload all images to Vercel Blob
    for (let i = 0; i < images.length; i++) {
      const image = images[i]
      
      if (!allowedTypes.includes(image.type)) {
        return NextResponse.json({ 
          error: 'Invalid image type. Only JPEG, PNG, GIF, and WebP images are allowed.' 
        }, { status: 400 })
      }

      if (image.size > maxSize) {
        return NextResponse.json({ 
          error: 'Image size too large. Maximum size is 5MB.' 
        }, { status: 400 })
      }

      try {
        const timestamp = Date.now()
        const imageFileName = `gallery/${timestamp}-${i}-${image.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
        const imageBytes = await image.arrayBuffer()
        const blob = await put(imageFileName, imageBytes, {
          access: 'public',
          contentType: image.type,
        })
        imageUrls.push(blob.url)
        
        // Use the first image's type
        if (!imageType) {
          imageType = image.type
        }
      } catch (blobError) {
        console.error(`❌ Failed to upload image ${i + 1}:`, blobError)
        return NextResponse.json({ 
          error: `Failed to upload image ${i + 1} to Vercel Blob. Please try again.`,
          details: blobError instanceof Error ? blobError.message : 'Unknown error'
        }, { status: 500 })
      }
    }

    // Validate that we have at least one image
    if (imageUrls.length === 0) {
      return NextResponse.json({ error: 'No valid images to upload' }, { status: 400 })
    }

    // Create gallery item record with multiple images
    // Store URLs in imageData field for backward compatibility (frontend expects imageData)
    // In the future, we can migrate to a separate imageUrls field
    const galleryItemData: any = {
      title: title.trim(),
      description: description?.trim() || '',
      imageData: imageUrls, // Store Vercel Blob URLs instead of base64
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
