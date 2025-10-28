import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import GalleryBlog from '@/models/GalleryBlog'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB()
    
    const { slug } = params

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
    }

    // Find gallery blog by slug
    const galleryBlog = await GalleryBlog.findOne({ 
      slug: slug,
      isActive: true,
      isDeleted: { $ne: true }, // Exclude deleted blogs
      isDraft: { $ne: true } // Exclude drafts
    })

    if (!galleryBlog) {
      return NextResponse.json({ error: 'Gallery blog not found' }, { status: 404 })
    }

    // Only return gallery blogs with content (not external links)
    if (!galleryBlog.content) {
      return NextResponse.json({ error: 'Gallery blog not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      blog: {
        id: galleryBlog._id,
        title: galleryBlog.title,
        description: galleryBlog.description,
        category: galleryBlog.category,
        content: galleryBlog.content,
        imageUrl: galleryBlog.imageUrl,
        slug: galleryBlog.slug,
        publishedAt: galleryBlog.publishedAt,
        createdAt: galleryBlog.createdAt,
        updatedAt: galleryBlog.updatedAt
      }
    })

  } catch (error) {
    console.error('Fetch gallery blog error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}




