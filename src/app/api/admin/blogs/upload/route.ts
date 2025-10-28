import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Blog from '@/models/Blog'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { generateUniqueSlug } from '@/lib/slug'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const formData = await request.formData()
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string
    const content = formData.get('content') as string
    const externalUrl = formData.get('externalUrl') as string
    const image = formData.get('image') as File

    if (!title || !description || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate that either content or externalUrl is provided
    if (!content && !externalUrl) {
      return NextResponse.json({ 
        error: 'Either content or external URL must be provided' 
      }, { status: 400 })
    }

    let imageUrl = ''
    let slug = ''

    // Generate slug for content blogs (not external links)
    if (content && !externalUrl) {
      // Get existing slugs to ensure uniqueness
      const existingBlogs = await Blog.find({ slug: { $exists: true } }, 'slug')
      const existingSlugs = existingBlogs.map(blog => blog.slug).filter(Boolean)
      
      slug = await generateUniqueSlug(title, existingSlugs)
    }

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

    // Create blog record
    const blog = new Blog({
      title,
      description,
      category,
      content: content || undefined,
      externalUrl: externalUrl || undefined,
      imageUrl: imageUrl || undefined,
      slug: slug || undefined,
      isDraft: false,
      publishedAt: new Date(),
      isActive: true
    })

    await blog.save()

    return NextResponse.json({ 
      success: true,
      message: 'Blog created successfully',
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
    console.error('Create blog error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
