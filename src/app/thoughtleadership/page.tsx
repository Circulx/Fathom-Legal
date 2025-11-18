'use client'

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";

import {
  BookOpen,
  Users,
  Scale,
  ExternalLink,
} from "lucide-react";

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

interface ThoughtLeadershipPhoto {
  _id: string
  title: string
  description?: string
  imageUrl: string
  category?: string
  createdAt: string
}

export default function ThoughtLeadership() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [blogLoading, setBlogLoading] = useState(true)
  const [photos, setPhotos] = useState<ThoughtLeadershipPhoto[]>([])
  const [photoLoading, setPhotoLoading] = useState(true)
  const [blogCurrentPage, setBlogCurrentPage] = useState(1)
  const [blogTotalPages, setBlogTotalPages] = useState(1)
  const [blogTotal, setBlogTotal] = useState(0)

  // Fetch thought leadership blogs with pagination
  const fetchBlogs = async (page: number = 1) => {
    try {
      setBlogLoading(true)
      const response = await fetch(`/api/thought-leadership-blogs?page=${page}&limit=6`)
      if (response.ok) {
        const data = await response.json()
        setBlogs(data.blogs || [])
        setBlogTotalPages(data.pagination?.pages || 1)
        setBlogTotal(data.pagination?.total || 0)
        setBlogCurrentPage(page)
      }
    } catch (error) {
      console.error('Error fetching thought leadership blogs:', error)
    } finally {
      setBlogLoading(false)
    }
  }

  // Handle blog page change
  const handleBlogPageChange = (page: number) => {
    if (page >= 1 && page <= blogTotalPages) {
      fetchBlogs(page)
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

  // Fetch thought leadership photos
  const fetchPhotos = async () => {
    try {
      setPhotoLoading(true)
      const response = await fetch('/api/thought-leadership-photos?limit=8')
      if (response.ok) {
        const data = await response.json()
        setPhotos(data.photos || [])
      }
    } catch (error) {
      console.error('Error fetching thought leadership photos:', error)
    } finally {
      setPhotoLoading(false)
    }
  }

  useEffect(() => {
    fetchBlogs(1)
    fetchPhotos()
  }, [])

  const stats = [
    {
      number: "50+",
      label: "Articles Published",
      description: "Expert insights and guides",
    },
    {
      number: "10K+",
      label: "Readers Monthly",
      description: "Legal professionals and businesses",
    },
    {
      number: "25+",
      label: "Topics Covered",
      description: "Across various legal domains",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Navbar page="thoughtleadership" />

       {/* Hero Section */}
       <section className="py-20 relative overflow-hidden">
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
        <div className="absolute inset-0 bg-black/60"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
             <span style={{ color: '#A5292A' }}>Thought Leadership</span>
            </h1>
            
            
            {/* Breadcrumb */}
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

      {/* Photo Gallery Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-8 lg:px-16 xl:px-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured <span style={{ color: '#A5292A' }}>Photos</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Explore our collection of featured photos showcasing our team, events, and achievements.
            </p>
          </div>

          {photoLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#A5292A' }}></div>
            </div>
          ) : photos.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#A5292A' }}>
                <ExternalLink className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No photos yet
              </h3>
              <p className="text-gray-600">
                Thought leadership photos will appear here once uploaded.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {photos.map((photo) => (
                <div 
                  key={photo._id}
                  className="group relative overflow-hidden rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-end">
                    <div className="p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="font-semibold text-sm mb-1 line-clamp-2">
                        {photo.title}
                      </h3>
                      {photo.description && (
                        <p className="text-xs text-gray-200 line-clamp-2">
                          {photo.description}
                        </p>
                      )}
                      {photo.category && (
                        <span className="inline-block px-2 py-1 text-xs bg-white bg-opacity-20 rounded-full mt-2">
                          {photo.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-8 lg:px-16 xl:px-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Latest <span style={{ color: '#A5292A' }}>Articles </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Stay updated with our latest insights, interviews, and features across various legal publications and platforms.
            </p>
          </div>

          {blogLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#A5292A' }}></div>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#A5292A' }}>
                <ExternalLink className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No articles yet
              </h3>
              <p className="text-gray-600">
                Articles and features will appear here once published.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((blog) => (
                  <div 
                    key={blog._id}
                    className="bg-white shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 group cursor-pointer"
                    onClick={() => {
                      if (blog.externalUrl) {
                        window.open(blog.externalUrl, '_blank')
                      } else if (blog.slug) {
                        window.location.href = `/blog/${blog.slug}`
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
                            className="w-full h-40 md:h-48 object-cover"
                          />
                        ) : blog.logoUrl ? (
                          <div className="w-full h-40 md:h-48 bg-white flex items-center justify-center p-3">
                            <img
                              src={blog.logoUrl}
                              alt={blog.title}
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                        ) : (
                          <div className="w-full h-40 md:h-48 bg-gray-100 flex items-center justify-center">
                            <span className="text-gray-400 text-sm">No Image</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Content Section */}
                      <div className="w-full p-4 md:p-5">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                          {blog.title}
                        </h3>
                        
                        <p className="text-xs text-blue-600 mb-2">
                          POSTED ON {new Date(blog.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          }).toUpperCase()}
                        </p>
                        
                        <p className="text-gray-700 text-sm leading-relaxed mb-3 line-clamp-2">
                          {blog.description}
                        </p>
                        
                        <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 bg-white text-gray-700 text-xs font-medium hover:bg-gray-50 transition-colors">
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
                <div className="mt-4 text-center text-sm text-gray-600">
                  Showing page {blogCurrentPage} of {blogTotalPages} ({blogTotal} total articles)
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
