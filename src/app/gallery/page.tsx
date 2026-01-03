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
  imageData: string | string[] // Can be string (legacy) or array (new)
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set())
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
        // Log to debug imageData structure
        if (data.galleryItems && data.galleryItems.length > 0) {
          console.log('Fetched gallery items:', data.galleryItems.map((item: GalleryItem) => ({
            id: item._id,
            title: item.title,
            imageDataIsArray: Array.isArray(item.imageData),
            imageDataLength: Array.isArray(item.imageData) ? item.imageData.length : 1,
            imageDataType: typeof item.imageData
          })))
        }
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

  // Preload images when selectedImage changes
  useEffect(() => {
    if (selectedImage) {
      const images = Array.isArray(selectedImage.imageData) ? selectedImage.imageData : [selectedImage.imageData]
      const newLoadedImages = new Set<number>()
      
      // Preload all images
      images.forEach((img, index) => {
        const imgElement = new Image()
        imgElement.src = img
        imgElement.onload = () => {
          newLoadedImages.add(index)
          setLoadedImages(new Set(newLoadedImages))
        }
        imgElement.onerror = () => {
          console.error('Failed to preload image at index', index)
        }
      })
      
      // Reset loaded images when modal closes
      return () => {
        setLoadedImages(new Set())
      }
    } else {
      setLoadedImages(new Set())
    }
  }, [selectedImage])

  // Preload images when selectedImage changes
  useEffect(() => {
    if (selectedImage) {
      const images = Array.isArray(selectedImage.imageData) ? selectedImage.imageData : [selectedImage.imageData]
      const newLoadedImages = new Set<number>()
      
      // Preload all images
      images.forEach((img, index) => {
        const imgElement = new Image()
        imgElement.src = img
        imgElement.onload = () => {
          newLoadedImages.add(index)
          setLoadedImages(new Set(newLoadedImages))
        }
        imgElement.onerror = () => {
          console.error('Failed to preload image at index', index)
        }
      })
      
      // Reset loaded images when modal closes
      return () => {
        setLoadedImages(new Set())
      }
    } else {
      setLoadedImages(new Set())
    }
  }, [selectedImage])


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
                {galleryItems.map((item) => {
                  // Handle both string (legacy) and array (new) imageData
                  const images = Array.isArray(item.imageData) ? item.imageData : [item.imageData]
                  const firstImage = images[0]
                  const imageCount = images.length
                  
                  return (
                    <div 
                      key={item._id} 
                      className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer"
                      onClick={() => {
                      setSelectedImage(item)
                      setCurrentImageIndex(0)
                    }}
                    >
                      {/* Image */}
                      <div className="aspect-w-16 aspect-h-12 relative overflow-hidden">
                        <img
                          src={firstImage}
                          alt={item.title}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {imageCount > 1 && (
                          <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
                            {imageCount} photos
                          </div>
                        )}
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
                  )
                })}
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

      {/* Image Modal with Slider and Vertical Scroll */}
      {selectedImage && (() => {
        const images = Array.isArray(selectedImage.imageData) ? selectedImage.imageData : [selectedImage.imageData]
        const hasMultipleImages = images.length > 1
        
        // Debug logging
        console.log('Selected image data:', {
          imageData: selectedImage.imageData,
          isArray: Array.isArray(selectedImage.imageData),
          imagesLength: images.length,
          images: images
        })
        
        return (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="relative max-w-4xl max-h-[90vh] w-full flex flex-col">
              {/* Close button */}
              <button
                onClick={() => {
                  setSelectedImage(null)
                  setCurrentImageIndex(0)
                }}
                className="absolute top-4 right-4 z-20 bg-white/90 hover:bg-white rounded-full p-2 transition-colors"
              >
                <X className="h-6 w-6 text-gray-700" />
              </button>
              
              {/* Scrollable Container */}
              <div className="bg-white rounded-xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col overflow-y-auto">
                {/* Image Slider */}
                <div className="relative overflow-hidden flex-shrink-0 w-full" style={{ position: 'relative' }}>
                  <div 
                    className="flex transition-transform duration-300 ease-in-out"
                    style={{ 
                      transform: `translateX(-${currentImageIndex * (100 / images.length)}%)`,
                      width: `${images.length * 100}%`,
                      display: 'flex'
                    }}
                  >
                    {images.map((img, index) => {
                      const imageWidthPercent = 100 / images.length
                      return (
                        <div
                          key={index}
                          className="flex-shrink-0 flex items-center justify-center bg-white"
                          style={{ 
                            width: `${imageWidthPercent}%`,
                            flex: `0 0 ${imageWidthPercent}%`,
                            minHeight: '500px',
                            padding: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxSizing: 'border-box',
                            position: 'relative'
                          }}
                        >
                          <img
                            src={img}
                            alt={`${selectedImage.title} - Image ${index + 1}`}
                            className="max-w-full max-h-[70vh] object-contain"
                            style={{ 
                              display: 'block',
                              width: 'auto',
                              height: 'auto',
                              maxWidth: 'calc(100% - 3rem)',
                              maxHeight: '70vh',
                              opacity: loadedImages.has(index) ? 1 : 0.8,
                              transition: 'opacity 0.3s ease-in-out'
                            }}
                            loading={index <= currentImageIndex + 1 ? "eager" : "lazy"}
                            onError={(e) => {
                              console.error('Image load error for index', index)
                              const target = e.target as HTMLImageElement
                              target.style.opacity = '0.3'
                            }}
                            onLoad={(e) => {
                              console.log('Image loaded at index', index, 'Total:', images.length, 'Current index:', currentImageIndex)
                              setLoadedImages(prev => new Set(prev).add(index))
                              const target = e.target as HTMLImageElement
                              target.style.opacity = '1'
                            }}
                          />
                        </div>
                      )
                    })}
                  </div>
                  
                  {/* Navigation arrows */}
                  {hasMultipleImages && (
                    <>
                      <button
                        onClick={() => setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-3 transition-colors"
                        aria-label="Previous image"
                      >
                        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setCurrentImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-3 transition-colors"
                        aria-label="Next image"
                      >
                        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      
                      {/* Image counter */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm z-10">
                        {currentImageIndex + 1} / {images.length}
                      </div>
                      
                      {/* Dots indicator */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 transform translate-y-12 flex justify-center gap-2 z-10">
                        {images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all ${
                              index === currentImageIndex 
                                ? 'bg-[#A5292A] w-8' 
                                : 'bg-white/70 hover:bg-white'
                            }`}
                            aria-label={`Go to image ${index + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
                
                {/* Image info - scrollable content */}
                <div className="p-6 border-t border-gray-200 flex-shrink-0">
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
        )
      })()}
    </div>
  )
}