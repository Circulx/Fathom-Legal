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

  // Fetch thought leadership blogs
  const fetchBlogs = async () => {
    try {
      setBlogLoading(true)
      const response = await fetch('/api/thought-leadership-blogs?limit=6')
      if (response.ok) {
        const data = await response.json()
        setBlogs(data.blogs || [])
      }
    } catch (error) {
      console.error('Error fetching thought leadership blogs:', error)
    } finally {
      setBlogLoading(false)
    }
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
    fetchBlogs()
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {blogs.map((blog) => (
                <div 
                  key={blog._id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 group cursor-pointer"
                  onClick={() => {
                    if (blog.externalUrl) {
                      window.open(blog.externalUrl, '_blank')
                    } else if (blog.slug) {
                      window.location.href = `/blog/${blog.slug}`
                    }
                  }}
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Image Section */}
                    <div className="md:w-1/3">
                      {blog.imageUrl ? (
                        <img
                          src={blog.imageUrl}
                          alt={blog.title}
                          className="w-full h-48 md:h-64 object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 md:h-64 bg-gray-100 flex items-center justify-center">
                          <span className="text-gray-400 text-xl">No Image</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Content Section */}
                    <div className="md:w-2/3 p-6 md:p-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2 line-clamp-2">
                        {blog.title}
                      </h3>
                      
                      <p className="text-sm text-blue-600 mb-3">
                        POSTED ON {new Date(blog.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        }).toUpperCase()}
                      </p>
                      
                      <p className="text-gray-700 text-base leading-relaxed mb-4 line-clamp-3">
                        {blog.description}
                      </p>
                      
                      <button className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-gray-700 text-sm font-medium rounded hover:bg-gray-50 transition-colors">
                        CONTINUE READING →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
