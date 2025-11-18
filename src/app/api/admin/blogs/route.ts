import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Blog from '@/models/Blog'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Build query - for admin, show only non-deleted blogs
    let query: any = { isDeleted: { $ne: true } }

    if (category && category !== 'all') {
      query.category = category
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ]
    }

    // Get blogs with pagination - newest first
    const skip = (page - 1) * limit
    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Blog.countDocuments(query)

    return NextResponse.json({
      blogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Get blogs error:', error)
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
    const category = formData.get('category') as string
    const content = formData.get('content') as string
    const externalUrl = formData.get('externalUrl') as string
    const image = formData.get('image') as File | null
    const removeImage = formData.get('removeImage') === 'true'

    if (!id) {
      return NextResponse.json({ error: 'Blog ID is required' }, { status: 400 })
    }

    if (!title || !description || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate that either content or externalUrl is provided
    if (!content && !externalUrl) {
      return NextResponse.json({ 
        error: 'Either content or external URL must be provided' 
      }, { status: 400 })
    }

    const blog = await Blog.findById(id)
    
    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
    }

    // Handle image upload if provided
    let imageUrl = blog.imageUrl || ''
    
    if (removeImage) {
      imageUrl = ''
    } else if (image && image.size > 0) {
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

      const { writeFile, mkdir } = await import('fs/promises')
      const { join } = await import('path')

      // Create uploads directory if it doesn't exist
      const uploadsDir = join(process.cwd(), 'public', 'uploads', 'blogs')
      await mkdir(uploadsDir, { recursive: true })

      // Generate unique filename
      const timestamp = Date.now()
      const fileExtension = image.name.split('.').pop()
      const fileName = `blog-${timestamp}.${fileExtension}`
      const filePath = join(uploadsDir, fileName)

      // Save image
      const bytes = await image.arrayBuffer()
      const buffer = Buffer.from(bytes)
      await writeFile(filePath, buffer)

      imageUrl = `/uploads/blogs/${fileName}`
    }

    // Store old title for comparison
    const oldTitle = blog.title

    // Update blog
    blog.title = title
    blog.description = description
    blog.category = category as 'WEBINAR' | 'INTERVIEW' | 'FEATURE' | 'ARTICLE' | 'NEWS'
    blog.content = content || undefined
    blog.externalUrl = externalUrl || undefined
    blog.imageUrl = imageUrl || undefined

    // Regenerate slug if title changed and blog has content
    if (title !== oldTitle && blog.content && !blog.externalUrl) {
      const { generateUniqueSlug } = await import('@/lib/slug')
      const existingBlogs = await Blog.find({ slug: { $exists: true }, _id: { $ne: id } }, 'slug')
      const existingSlugs = existingBlogs.map(b => b.slug).filter(Boolean) as string[]
      blog.slug = await generateUniqueSlug(title, existingSlugs)
    }

    await blog.save()

    return NextResponse.json({ 
      success: true,
      message: 'Blog updated successfully',
      blog: {
        id: blog._id,
        title: blog.title,
        category: blog.category,
        slug: blog.slug,
        hasContent: !!blog.content,
        hasExternalUrl: !!blog.externalUrl
      }
    })

  } catch (error) {
    console.error('Update blog error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Blog ID is required' }, { status: 400 })
    }

    const blog = await Blog.findByIdAndUpdate(id, { 
      isDeleted: true,
      isActive: false 
    })
    
    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Blog deleted successfully' })

  } catch (error) {
    console.error('Delete blog error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

