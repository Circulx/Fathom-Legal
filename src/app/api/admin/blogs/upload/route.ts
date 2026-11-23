import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import Blog from '@/models/Blog'
import { generateUniqueSlug } from '@/lib/slug'
import { put } from '@vercel/blob'
import { revalidatePath } from 'next/cache'

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
      const existingSlugs = existingBlogs.map(blog => blog.slug).filter((slug): slug is string => Boolean(slug))
      
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

      try {
        const timestamp = Date.now()
        const imageFileName = `blogs/${timestamp}-${image.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
        const imageBytes = await image.arrayBuffer()
        const blob = await put(imageFileName, imageBytes, {
          access: 'public',
          contentType: image.type,
        })
        imageUrl = blob.url
        console.log(`✅ Blog image uploaded to Vercel Blob: ${imageUrl}`)
      } catch (blobError) {
        console.error('❌ Vercel Blob upload failed:', blobError)
        return NextResponse.json({ 
          error: 'Failed to upload image to Vercel Blob. Please try again.',
          details: blobError instanceof Error ? blobError.message : 'Unknown error'
        }, { status: 500 })
      }
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

    // Revalidate the thought leadership page to show the new blog immediately
    try {
      revalidatePath('/thoughtleadership')
      revalidatePath('/api/thought-leadership-blogs')
      console.log('✅ Revalidated thought leadership page')
    } catch (revalidateError) {
      // Log but don't fail the request if revalidation fails
      console.warn('⚠️ Revalidation warning:', revalidateError)
    }

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
