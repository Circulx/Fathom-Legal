import React from 'react'
import { Navbar } from '@/components/Navbar'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import GalleryGrid from '@/components/Gallery/GalleryGrid'
import GalleryBlogs from '@/components/Gallery/GalleryBlogs'
import connectDB from '@/lib/mongodb'
import GalleryItem from '@/models/GalleryItem'
import GalleryBlog from '@/models/GalleryBlog'

interface GalleryItem {
  _id: string
  title: string
  description: string
  imageData: string | string[]
  imageType: string
}

interface GalleryBlog {
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

async function getGalleryItems(page: number = 1) {
  try {
    await connectDB()
    
    const limit = 8
    const skip = (page - 1) * limit
    
    const query: any = { isActive: true }
    
    const galleryItems = await GalleryItem.find(query)
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
    
    const total = await GalleryItem.countDocuments(query)
    
    // Ensure imageData is always an array and convert to plain objects
    const normalizedGalleryItems = galleryItems.map((item: any) => {
      let imageData = item.imageData
      if (!Array.isArray(imageData)) {
        imageData = typeof imageData === 'string' ? [imageData] : []
      }
      // Ensure imageData strings are properly serialized
      const serializedImageData = imageData.map((img: any) => {
        if (typeof img === 'string') {
          return img
        }
        // If it's an object, try to get the string value
        return String(img)
      }).filter((img: string) => img && img.length > 0)
      
      return {
        _id: item._id.toString(),
        title: item.title,
        description: item.description,
        imageData: serializedImageData,
        imageType: item.imageType,
        isActive: item.isActive
      }
    })
    
    return {
      items: normalizedGalleryItems,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  } catch (error) {
    console.error('Error fetching gallery items:', error)
    return {
      items: [],
      pagination: { page: 1, pages: 1, total: 0 }
    }
  }
}

async function getGalleryBlogs(page: number = 1) {
  try {
    await connectDB()
    
    const limit = 6
    const skip = (page - 1) * limit
    
    const query: any = { isActive: true, isDeleted: { $ne: true } }
    
    const blogs = await GalleryBlog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
    
    const total = await GalleryBlog.countDocuments(query)
    
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
    console.error('Error fetching gallery blogs:', error)
    return {
      blogs: [],
      pagination: { page: 1, pages: 1, total: 0 }
    }
  }
}

export default async function Gallery() {
  // Fetch data in parallel
  const [galleryData, blogData] = await Promise.all([
    getGalleryItems(1),
    getGalleryBlogs(1)
  ])

  return (
    <div className="min-h-screen bg-white">
      <Navbar page="gallery" />

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
        
        <div className="absolute inset-0 bg-black/70"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold text-white mb-6">
              Our <span style={{ color: '#A5292A' }}>Gallery</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-8">
              Explore our collection of moments, achievements, and behind-the-scenes glimpses of Fathom Legal.
            </p>
            
            <div className="flex justify-center">
              <Breadcrumb 
                items={[
                  { label: "Home", href: "/" },
                  { label: "Gallery" }
                ]} 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="container mx-auto px-8 lg:px-16 xl:px-24">
          <GalleryGrid
            initialItems={galleryData.items}
            initialPage={galleryData.pagination.page}
            initialTotalPages={galleryData.pagination.pages}
            initialTotalItems={galleryData.pagination.total}
          />
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-8 lg:px-16 xl:px-24">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-gray-900 mb-4">
              Latest <span style={{ color: '#A5292A' }}>Articles </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Stay updated with our latest insights, interviews, and features across various legal publications and platforms.
            </p>
          </div>

          <GalleryBlogs
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
