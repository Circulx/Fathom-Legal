import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import connectDB from '@/lib/mongodb'
import GalleryBlog from '@/models/GalleryBlog'

export async function POST(request: NextRequest) {
  try {
    console.log('Gallery blog creation started')
    await connectDB()
    console.log('Database connected successfully')

    const formData = await request.formData()
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string
    const content = formData.get('content') as string
    const externalUrl = formData.get('externalUrl') as string
    const image = formData.get('image') as File | null

    console.log('Form data received:', { title, description, category, content, externalUrl, hasImage: !!image })

    if (!title || !description || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate that either content or externalUrl is provided
    if (!content && !externalUrl) {
      return NextResponse.json({ 
        error: 'Either content or external URL must be provided' 
      }, { status: 400 })
    }

    // Validate external URL format if provided
    if (externalUrl && externalUrl.trim()) {
      try {
        new URL(externalUrl)
      } catch {
        return NextResponse.json({ 
          error: 'External URL must be a valid URL' 
        }, { status: 400 })
      }
    }

    let imageUrl = ''

    // Handle image upload if provided
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

      // Validate image size (5MB limit)
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (image.size > maxSize) {
        return NextResponse.json({ 
          error: 'Image size too large. Maximum size is 5MB.' 
        }, { status: 400 })
      }

      // Create uploads directory if it doesn't exist
      const uploadsDir = join(process.cwd(), 'public', 'uploads', 'gallery-blogs')
      await mkdir(uploadsDir, { recursive: true })

      // Generate unique filename
      const timestamp = Date.now()
      const fileExtension = image.name.split('.').pop()
      const fileName = `gallery-blog-${timestamp}.${fileExtension}`
      const filePath = join(uploadsDir, fileName)

      // Save image
      const bytes = await image.arrayBuffer()
      const buffer = Buffer.from(bytes)
      await writeFile(filePath, buffer)

      imageUrl = `/uploads/gallery-blogs/${fileName}`
    }

    console.log('Creating gallery blog with data:', {
      title,
      description: description || '',
      category: category || 'ARTICLE',
      content: content || '',
      externalUrl: externalUrl || '',
      imageUrl
    })

    const galleryBlog = new GalleryBlog({
      title,
      description,
      category,
      content: content || undefined,
      externalUrl: externalUrl || undefined,
      imageUrl: imageUrl || undefined,
      slug: `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${Date.now()}`,
      isDraft: false,
      publishedAt: new Date(),
      isActive: true,
      isDeleted: false
    })

    console.log('Gallery blog object created, saving...')
    await galleryBlog.save()
    console.log('Gallery blog saved successfully')

    return NextResponse.json({ 
      success: true,
      message: 'Gallery blog created successfully',
      galleryBlog: {
        id: galleryBlog._id,
        title: galleryBlog.title,
        category: galleryBlog.category,
        slug: galleryBlog.slug,
        hasContent: !!galleryBlog.content,
        hasExternalUrl: !!galleryBlog.externalUrl
      }
    })

  } catch (error) {
    console.error('Gallery blog creation error:', error)
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('Either content or external URL must be provided')) {
        return NextResponse.json({ 
          error: 'Either content or external URL must be provided' 
        }, { status: 400 })
      }
      
      if (error.message.includes('External URL must be a valid URL')) {
        return NextResponse.json({ 
          error: 'External URL must be a valid URL' 
        }, { status: 400 })
      }
      
      if (error.message.includes('duplicate key')) {
        return NextResponse.json({ 
          error: 'A blog with this title already exists' 
        }, { status: 400 })
      }
    }
    
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
