'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { ExternalLink } from 'lucide-react'
import { useRouter } from 'next/navigation'

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

interface BlogGridProps {
  initialBlogs: Blog[]
  initialPage: number
  initialTotalPages: number
  initialTotal: number
}

export default function BlogGrid({
  initialBlogs,
  initialPage,
  initialTotalPages,
  initialTotal
}: BlogGridProps) {
  const [blogs, setBlogs] = useState<Blog[]>(initialBlogs)
  const [blogLoading, setBlogLoading] = useState(false)
  const [blogCurrentPage, setBlogCurrentPage] = useState(initialPage)
  const [blogTotalPages, setBlogTotalPages] = useState(initialTotalPages)
  const [blogTotal, setBlogTotal] = useState(initialTotal)
  const router = useRouter()

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

  const handleBlogPageChange = (page: number) => {
    if (page >= 1 && page <= blogTotalPages) {
      fetchBlogs(page)
    }
  }

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

  if (blogLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="bg-white shadow-sm border border-gray-100 overflow-hidden animate-pulse"
          >
            <div className="w-full h-36 md:h-40 bg-gray-200"></div>
            <div className="w-full p-4">
              <div className="h-5 w-3/4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 w-1/2 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 w-full bg-gray-200 rounded mb-2"></div>
              <div className="h-3 w-2/3 bg-gray-200 rounded mb-3"></div>
              <div className="h-8 w-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (blogs.length === 0) {
    return (
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
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {blogs.map((blog) => (
          <div 
            key={blog._id}
            className="bg-white shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 group cursor-pointer"
            onClick={() => {
              if (blog.externalUrl) {
                window.open(blog.externalUrl, '_blank')
              } else if (blog.slug) {
                router.push(`/blog/${blog.slug}`)
              }
            }}
          >
            <div className="flex flex-col">
              <div className="w-full relative h-36 md:h-40">
                {blog.imageUrl ? (
                  <Image
                    src={blog.imageUrl}
                    alt={blog.title}
                    fill
                    className="object-cover"
                    unoptimized={blog.imageUrl?.startsWith('data:')}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : blog.logoUrl ? (
                  <div className="w-full h-full bg-white flex items-center justify-center p-3 relative">
                    <Image
                      src={blog.logoUrl}
                      alt={blog.title}
                      fill
                      className="object-contain"
                      unoptimized={blog.logoUrl?.startsWith('data:')}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">No Image</span>
                  </div>
                )}
              </div>
              
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

      {blogTotalPages > 1 && (
        <div className="mt-12 flex justify-center">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => handleBlogPageChange(blogCurrentPage - 1)}
              disabled={blogCurrentPage === 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

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

      {blogTotal > 0 && (
        <div className="mt-4 text-center text-sm sm:text-base text-gray-600">
          Showing page {blogCurrentPage} of {blogTotalPages} ({blogTotal} total articles)
        </div>
      )}
    </>
  )
}
