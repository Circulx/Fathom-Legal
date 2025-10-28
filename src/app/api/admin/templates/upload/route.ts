import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Template from '@/models/Template'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const formData = await request.formData()
    const image = formData.get('image') as File
    const description = formData.get('description') as string
    const price = formData.get('price') as string
    const category = formData.get('category') as string
    const uploadedBy = formData.get('uploadedBy') as string

    if (!image) {
      return NextResponse.json({ error: 'No image uploaded' }, { status: 400 })
    }

    if (!description || !price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
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
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'templates')
    await mkdir(uploadsDir, { recursive: true })

    // Generate unique filename
    const timestamp = Date.now()
    const fileExtension = image.name.split('.').pop()
    const fileName = `${timestamp}-${image.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const filePath = join(uploadsDir, fileName)

    // Save image
    const bytes = await image.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Create template record
    const template = new Template({
      title: description, // Use description as title
      description,
      category: category || 'Legal Documents', // Use provided category or default
      fileUrl: `/uploads/templates/${fileName}`,
      fileName: image.name,
      fileSize: image.size,
      fileType: image.type,
      imageUrl: `/uploads/templates/${fileName}`,
      price: parseFloat(price),
      uploadedBy,
      tags: []
    })

    await template.save()

    return NextResponse.json({ 
      message: 'Template uploaded successfully',
      template: {
        id: template._id,
        title: template.title,
        description: template.description,
        category: template.category,
        fileUrl: template.fileUrl,
        fileName: template.fileName,
        fileSize: template.fileSize,
        fileType: template.fileType,
        imageUrl: template.imageUrl,
        price: template.price,
        tags: template.tags,
        createdAt: template.createdAt
      }
    })

  } catch (error) {
    console.error('Template upload error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

