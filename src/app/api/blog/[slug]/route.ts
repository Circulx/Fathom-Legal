import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Blog from '@/models/Blog'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB()
    
    const { slug } = await params

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
    }

    // Find blog by slug
    const blog = await Blog.findOne({ 
      slug: slug,
      isActive: true,
      isDeleted: { $ne: true }, // Exclude deleted blogs
      isDraft: { $ne: true } // Exclude drafts
    })

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
    }

    // Only return blogs with content (not external links)
    if (!blog.content) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      blog: {
        id: blog._id,
        title: blog.title,
        description: blog.description,
        category: blog.category,
        content: blog.content,
        imageUrl: blog.imageUrl,
        slug: blog.slug,
        publishedAt: blog.publishedAt,
        createdAt: blog.createdAt,
        updatedAt: blog.updatedAt
      }
    })

  } catch (error) {
    console.error('Fetch blog error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

