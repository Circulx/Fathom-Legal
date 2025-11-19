'use client'

import React, { useState, useEffect } from 'react'
import { Navbar } from '@/components/Navbar'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import { Image as ImageIcon, X, ExternalLink, Clock, User } from 'lucide-react'

interface GalleryItem {
  _id: string
  title: string
  description: string
  imageData: string
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


export default function Gallery() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [galleryBlogs, setGalleryBlogs] = useState<GalleryBlog[]>([])
  const [loading, setLoading] = useState(true)
  const [blogLoading, setBlogLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [blogCurrentPage, setBlogCurrentPage] = useState(1)
  const [blogTotalPages, setBlogTotalPages] = useState(1)
  const [blogTotal, setBlogTotal] = useState(0)

  // Fetch gallery items with pagination
  const fetchGalleryItems = async (page: number = 1) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/gallery?page=${page}&limit=8`)
      if (response.ok) {
        const data = await response.json()
        setGalleryItems(data.galleryItems || [])
        setTotalPages(data.pagination?.pages || 1)
        setTotalItems(data.pagination?.total || 0)
        setCurrentPage(page)
      }
    } catch (error) {
      console.error('Error fetching gallery items:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch gallery blogs with pagination
  const fetchGalleryBlogs = async (page: number = 1) => {
    try {
      setBlogLoading(true)
      const response = await fetch(`/api/gallery-blogs?page=${page}&limit=6`)
      if (response.ok) {
        const data = await response.json()
        setGalleryBlogs(data.blogs || [])
        setBlogTotalPages(data.pagination?.pages || 1)
        setBlogTotal(data.pagination?.total || 0)
        setBlogCurrentPage(page)
      }
    } catch (error) {
      console.error('Error fetching gallery blogs:', error)
    } finally {
      setBlogLoading(false)
    }
  }

  // Handle blog page change
  const handleBlogPageChange = (page: number) => {
    if (page >= 1 && page <= blogTotalPages) {
      fetchGalleryBlogs(page)
    }
  }

  // Generate page numbers for blog pagination
  const getBlogPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    
    if (blogTotalPages <= maxVisiblePages) {
      for (let i = 1; i <= blogTotalPages; i++) {
        pages.push(i)
      }
    } else {
      const start = Math.max(1, blogCurrentPage - 2)
      const end = Math.min(blogTotalPages, start + maxVisiblePages - 1)
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
    }
    
    return pages
  }

  useEffect(() => {
    fetchGalleryItems(1)
    fetchGalleryBlogs(1)
  }, [])

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchGalleryItems(page)
    }
  }

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      const start = Math.max(1, currentPage - 2)
      const end = Math.min(totalPages, start + maxVisiblePages - 1)
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
    }
    
    return pages
  }


  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar page="gallery" />

      {/* Hero Section */}
      <section className="pt-28 pb-20 relative overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('/contactusbg.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/70"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold text-white mb-6">
              Our <span style={{ color: '#A5292A' }}>Gallery</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-8">
              Explore our collection of moments, achievements, and behind-the-scenes glimpses of Fathom Legal.
            </p>
            
            {/* Breadcrumb */}
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
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#A5292A' }}></div>
            </div>
          ) : galleryItems.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#A5292A' }}>
                <ImageIcon className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl md:text-xl font-semibold text-gray-900 mb-2">
                No gallery images yet
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Gallery images will appear here once uploaded by our team.
              </p>
            </div>
          ) : (
            <>
              {/* Gallery Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {galleryItems.map((item) => (
                  <div 
                    key={item._id} 
                    className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer"
                    onClick={() => setSelectedImage(item)}
                  >
                    {/* Image */}
                    <div className="aspect-w-16 aspect-h-12 relative overflow-hidden">
                      <img
                        src={item.imageData}
                        alt={item.title}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="bg-white/90 rounded-full p-3">
                            <ImageIcon className="h-6 w-6 text-gray-700" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-base sm:text-lg md:text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                        {item.title}
                      </h3>
                      
                      <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-4 line-clamp-3">
                        {item.description}
                      </p>

                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <nav className="flex items-center space-x-2">
                    {/* Previous Button */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>

                    {/* Page Numbers */}
                    {getPageNumbers().map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 text-sm font-medium rounded-lg ${
                          currentPage === page
                            ? 'bg-red-600 text-white'
                            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    {/* Next Button */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}

              {/* Page Info */}
              {totalItems > 0 && (
                <div className="mt-4 text-center text-sm text-gray-600">
                  Showing page {currentPage} of {totalPages} ({totalItems} total photos)
                </div>
              )}
            </>
          )}
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

          {blogLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#A5292A' }}></div>
            </div>
          ) : galleryBlogs.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#A5292A' }}>
                <ExternalLink className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl md:text-xl font-semibold text-gray-900 mb-2">
                No articles yet
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Articles and features will appear here once published.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {galleryBlogs.map((blog: GalleryBlog) => (
                  <div 
                    key={blog._id}
                    className="bg-white shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 group cursor-pointer"
                    onClick={() => {
                      if (blog.externalUrl) {
                        window.open(blog.externalUrl, '_blank')
                      } else if (blog.slug) {
                        window.location.href = `/gallery-blog/${blog.slug}`
                      }
                    }}
                  >
                    <div className="flex flex-col">
                      {/* Image Section */}
                      <div className="w-full">
                        {blog.imageUrl ? (
                          <img
                            src={blog.imageUrl}
                            alt={blog.title}
                            className="w-full h-36 md:h-40 object-cover"
                          />
                        ) : blog.logoUrl ? (
                          <div className="w-full h-36 md:h-40 bg-white flex items-center justify-center p-3">
                            <img
                              src={blog.logoUrl}
                              alt={blog.title}
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                        ) : (
                          <div className="w-full h-36 md:h-40 bg-gray-100 flex items-center justify-center">
                            <span className="text-gray-400 text-sm">No Image</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Content Section */}
                      <div className="w-full p-4">
                        <h3 className="text-sm sm:text-base md:text-base font-bold text-gray-900 mb-2 line-clamp-2">
                          {blog.title}
                        </h3>
                        
                        <p className="text-xs sm:text-xs text-blue-600 mb-2">
                          POSTED ON {new Date(blog.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          }).toUpperCase()}
                        </p>
                        
                        <p className="text-gray-700 text-sm sm:text-sm leading-relaxed mb-3 line-clamp-2">
                          {blog.description}
                        </p>
                        
                        <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 bg-white text-gray-700 text-xs sm:text-sm font-medium hover:bg-gray-50 transition-colors">
                          CONTINUE READING →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {blogTotalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <nav className="flex items-center space-x-2">
                    {/* Previous Button */}
                    <button
                      onClick={() => handleBlogPageChange(blogCurrentPage - 1)}
                      disabled={blogCurrentPage === 1}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>

                    {/* Page Numbers */}
                    {getBlogPageNumbers().map((page) => (
                      <button
                        key={page}
                        onClick={() => handleBlogPageChange(page)}
                        className={`px-3 py-2 text-sm font-medium ${
                          blogCurrentPage === page
                            ? 'bg-red-600 text-white'
                            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    {/* Next Button */}
                    <button
                      onClick={() => handleBlogPageChange(blogCurrentPage + 1)}
                      disabled={blogCurrentPage === blogTotalPages}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}

              {/* Page Info */}
              {blogTotal > 0 && (
                <div className="mt-4 text-center text-sm sm:text-base text-gray-600">
                  Showing page {blogCurrentPage} of {blogTotalPages} ({blogTotal} total articles)
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            {/* Close button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white rounded-full p-2 transition-colors"
            >
              <X className="h-6 w-6 text-gray-700" />
            </button>
            
            {/* Image */}
            <div className="bg-white rounded-xl overflow-hidden shadow-2xl">
              <img
                src={selectedImage.imageData}
                alt={selectedImage.title}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              
              {/* Image info */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {selectedImage.title}
                </h3>
                {selectedImage.description && (
                  <p className="text-gray-600">
                    {selectedImage.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}