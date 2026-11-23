import React from 'react'
import { Navbar } from '@/components/Navbar'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import BlogGrid from '@/components/ThoughtLeadership/BlogGrid'
import connectDB from '@/lib/mongodb'
import Blog from '@/models/Blog'

// Use ISR (Incremental Static Regeneration) with 60 second revalidation
// This provides caching for performance while keeping data relatively fresh
// On-demand revalidation is triggered when blogs are uploaded
export const revalidate = 60

interface Blog {
  _id: string
  title: string
  description: string
  category: 'WEBINAR' | 'INTERVIEW' | 'FEATURE' | 'ARTICLE' | 'NEWS'
  content?: string
  externalUrl?: string
  imageUrl?: string
  logoUrl?: string
  slug?: string
  createdAt: string
}

async function getBlogs(page: number = 1) {
  try {
    await connectDB()
    
    const limit = 6
    const skip = (page - 1) * limit
    
    const query: any = { 
      isActive: true, 
      isDeleted: { $ne: true },
      isDraft: { $ne: true } // Exclude draft blogs
    }
    
    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
    
    const total = await Blog.countDocuments(query)
    
    return {
      blogs: blogs.map((blog: any) => ({
        _id: blog._id.toString(),
        title: blog.title,
        description: blog.description,
        category: blog.category,
        content: blog.content,
        externalUrl: blog.externalUrl,
        imageUrl: blog.imageUrl,
        logoUrl: blog.logoUrl,
        slug: blog.slug,
        createdAt: blog.createdAt?.toISOString() || new Date().toISOString()
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  } catch (error) {
    console.error('Error fetching thought leadership blogs:', error)
    return {
      blogs: [],
      pagination: { page: 1, pages: 1, total: 0 }
    }
  }
}

export default async function ThoughtLeadership() {
  const blogData = await getBlogs(1)

  return (
    <div className="min-h-screen bg-white">
      <Navbar page="thoughtleadership" />

      {/* Hero Section */}
      <section className="pt-28 pb-20 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('/contactusbg.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
        
        <div className="absolute inset-0 bg-black/60"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold text-white mb-6">
              <span style={{ color: '#A5292A' }}>Thought Leadership</span>
            </h1>
            
            <div className="flex justify-center">
              <Breadcrumb 
                items={[
                  { label: "Home", href: "/" },
                  { label: "Thought Leadership" }
                ]} 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-8 lg:px-16 xl:px-24">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Latest <span style={{ color: '#A5292A' }}>Articles </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Stay updated with our latest insights, interviews, and features across various legal publications and platforms.
            </p>
          </div>

          <BlogGrid
            initialBlogs={blogData.blogs}
            initialPage={blogData.pagination.page}
            initialTotalPages={blogData.pagination.pages}
            initialTotal={blogData.pagination.total}
          />
        </div>
      </section>

      <Footer />
    </div>
  )
}
