import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import connectDB from '@/lib/mongodb'
import ThoughtLeadershipPhoto from '@/models/ThoughtLeadershipPhoto'

export async function POST(request: NextRequest) {
  try {
    console.log('Thought leadership photo upload started')
    await connectDB()
    console.log('Database connected successfully')

    const formData = await request.formData()
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string
    const displayOrder = parseInt(formData.get('displayOrder') as string) || 0
    const image = formData.get('image') as File | null

    console.log('Form data received:', { title, description, category, displayOrder, hasImage: !!image })

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    if (!image || image.size === 0) {
      return NextResponse.json({ error: 'Image is required' }, { status: 400 })
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

    // Validate image size (5MB limit)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (image.size > maxSize) {
      return NextResponse.json({ 
        error: 'Image size too large. Maximum size is 5MB.' 
      }, { status: 400 })
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'thought-leadership-photos')
    await mkdir(uploadsDir, { recursive: true })

    // Generate unique filename
    const timestamp = Date.now()
    const fileExtension = image.name.split('.').pop()
    const fileName = `thought-leadership-photo-${timestamp}.${fileExtension}`
    const filePath = join(uploadsDir, fileName)

    // Save image
    const bytes = await image.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    const imageUrl = `/uploads/thought-leadership-photos/${fileName}`

    console.log('Creating thought leadership photo with data:', {
      title,
      description: description || '',
      category: category || 'General',
      displayOrder,
      imageUrl
    })

    const photo = new ThoughtLeadershipPhoto({
      title,
      description: description || undefined,
      category: category || 'General',
      imageUrl,
      displayOrder,
      isActive: true
    })

    console.log('Thought leadership photo object created, saving...')
    await photo.save()
    console.log('Thought leadership photo saved successfully')

    return NextResponse.json({ 
      success: true,
      message: 'Thought leadership photo uploaded successfully',
      photo: {
        id: photo._id,
        title: photo.title,
        category: photo.category,
        imageUrl: photo.imageUrl,
        displayOrder: photo.displayOrder
      }
    })

  } catch (error) {
    console.error('Thought leadership photo upload error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}



















