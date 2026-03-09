import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import GalleryBlog from '@/models/GalleryBlog'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { put } from '@vercel/blob'
import { revalidatePath } from 'next/cache'
import { generateUniqueSlug } from '@/lib/slug'


export const dynamic = 'force-dynamic'

export const revalidate = 1800

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')

    // Build query - only active and non-deleted gallery blogs
    let query: any = { isActive: true, isDeleted: { $ne: true } }

    if (category && category !== 'all') {
      query.category = category
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }

    // Get gallery blogs with pagination
    const skip = (page - 1) * limit
    const blogs = await GalleryBlog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await GalleryBlog.countDocuments(query)

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
    console.error('Get gallery blogs error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user?.role !== 'admin' && session.user?.role !== 'super-admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const formData = await request.formData()
    const id = (formData.get('id') as string)?.trim()
    const title = (formData.get('title') as string)?.trim()
    const description = (formData.get('description') as string)?.trim()
    const category = (formData.get('category') as string)?.trim()
    const content = (formData.get('content') as string)?.trim() || ''
    const externalUrl = (formData.get('externalUrl') as string)?.trim() || ''
    const removeImage = formData.get('removeImage') === 'true'
    const image = formData.get('image') as File | null

    if (!id) {
      return NextResponse.json({ error: 'Gallery blog ID is required' }, { status: 400 })
    }

    if (!title || !description || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!content && !externalUrl) {
      return NextResponse.json({
        error: 'Either content or external URL must be provided'
      }, { status: 400 })
    }

    if (externalUrl) {
      try {
        new URL(externalUrl)
      } catch {
        return NextResponse.json({
          error: 'External URL must be a valid URL'
        }, { status: 400 })
      }
    }

    const galleryBlog = await GalleryBlog.findById(id)
    if (!galleryBlog) {
      return NextResponse.json({ error: 'Gallery blog not found' }, { status: 404 })
    }

    let imageUrl = galleryBlog.imageUrl || ''
    if (removeImage) {
      imageUrl = ''
    } else if (image && image.size > 0) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
      if (!allowedTypes.includes(image.type)) {
        return NextResponse.json({
          error: 'Invalid image type. Only JPEG, PNG, GIF, and WebP images are allowed.'
        }, { status: 400 })
      }

      const maxSize = 5 * 1024 * 1024
      if (image.size > maxSize) {
        return NextResponse.json({
          error: 'Image size too large. Maximum size is 5MB.'
        }, { status: 400 })
      }

      const timestamp = Date.now()
      const imageFileName = `gallery-blogs/${timestamp}-${image.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
      const imageBytes = await image.arrayBuffer()
      const blob = await put(imageFileName, imageBytes, {
        access: 'public',
        contentType: image.type,
      })
      imageUrl = blob.url
    }

    const oldTitle = galleryBlog.title
    const shouldRegenerateSlug =
      title !== oldTitle &&
      !!content &&
      !externalUrl

    galleryBlog.title = title
    galleryBlog.description = description
    galleryBlog.category = category
    galleryBlog.content = content || undefined
    galleryBlog.externalUrl = externalUrl || undefined
    galleryBlog.imageUrl = imageUrl || undefined
    galleryBlog.isDraft = false
    if (!galleryBlog.publishedAt) {
      galleryBlog.publishedAt = new Date()
    }

    if (shouldRegenerateSlug) {
      const existingBlogs = await GalleryBlog.find(
        { slug: { $exists: true }, _id: { $ne: id } },
        'slug'
      )
      const existingSlugs = existingBlogs.map((b) => b.slug).filter(Boolean) as string[]
      galleryBlog.slug = await generateUniqueSlug(title, existingSlugs)
    }

    await galleryBlog.save()

    try {
      revalidatePath('/gallery')
      revalidatePath('/api/gallery-blogs')
    } catch (revalidateError) {
      console.warn('Gallery blog revalidation warning:', revalidateError)
    }

    return NextResponse.json({
      success: true,
      message: 'Gallery blog updated successfully',
      galleryBlog: {
        id: galleryBlog._id,
        title: galleryBlog.title,
        category: galleryBlog.category,
        slug: galleryBlog.slug,
      }
    })
  } catch (error) {
    console.error('Update gallery blog error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Gallery blog ID is required' }, { status: 400 })
    }

    const galleryBlog = await GalleryBlog.findByIdAndUpdate(
      id,
      { 
        $set: { isDeleted: true, isActive: false }
      },
      { new: true } // ensures the updated document is returned
    )
    
    
    if (!galleryBlog) {
      return NextResponse.json({ error: 'Gallery blog not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Gallery blog deleted successfully' })

  } catch (error) {
    console.error('Delete gallery blog error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
