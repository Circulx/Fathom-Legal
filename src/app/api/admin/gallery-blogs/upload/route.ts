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
    const title = (formData.get('title') as string)?.trim()
    const description = (formData.get('description') as string)?.trim()
    const category = (formData.get('category') as string)?.trim()
    const content = (formData.get('content') as string)?.trim() || undefined
    const externalUrl = (formData.get('externalUrl') as string)?.trim() || undefined
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
    if (externalUrl) {
      try {
        new URL(externalUrl)
      } catch {
        return NextResponse.json({ 
          error: 'External URL must be a valid URL' 
        }, { status: 400 })
      }
    }

    let imageUrl: string | undefined = undefined

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

      try {
        const bytes = await image.arrayBuffer()
        const buffer = Buffer.from(bytes)
        
        // Check if we're on Vercel (serverless environment)
        const isVercel = process.env.VERCEL === '1'
        
        // Always use base64 for production compatibility
        // This ensures images work on both local and production
        // NOTE: For better performance with large images, consider using cloud storage (S3, Cloudinary, etc.)
        const base64 = buffer.toString('base64')
        imageUrl = `data:${image.type};base64,${base64}`
        
        // Also save to filesystem for local development (optional, for easier file management)
        if (!isVercel) {
          // Optional: Also save to filesystem for local development
          try {
            const uploadsDir = join(process.cwd(), 'public', 'uploads', 'gallery-blogs')
            await mkdir(uploadsDir, { recursive: true })
            const timestamp = Date.now()
            const fileExtension = image.name.split('.').pop() || 'jpg'
            const fileName = `gallery-blog-${timestamp}.${fileExtension}`
            const filePath = join(uploadsDir, fileName)
            await writeFile(filePath, buffer)
            // Note: We still use base64 URL above for consistency
          } catch (fsError) {
            // Ignore filesystem errors, base64 URL is already set
            console.warn('Could not save to filesystem, using base64 only:', fsError)
          }
        }
      } catch (fileError) {
        console.error('File upload error:', fileError)
        return NextResponse.json({ 
          error: 'Failed to upload image. Please try again.',
          details: fileError instanceof Error ? fileError.message : 'Unknown file error'
        }, { status: 500 })
      }
    }

    console.log('Creating gallery blog with data:', {
      title,
      description,
      category,
      hasContent: !!content,
      hasExternalUrl: !!externalUrl,
      hasImage: !!imageUrl
    })

    // Generate slug
    const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${Date.now()}`

    const galleryBlog = new GalleryBlog({
      title,
      description,
      category,
      content,
      externalUrl,
      imageUrl,
      slug,
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
