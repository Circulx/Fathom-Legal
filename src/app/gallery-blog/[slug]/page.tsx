import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import connectDB from '@/lib/mongodb'
import GalleryBlog from '@/models/GalleryBlog'
import { Navbar } from '@/components/Navbar'
import Footer from '@/components/Footer'

interface GalleryBlogPageProps {
  params: Promise<{ slug: string }>
}

async function getGalleryBlogBySlug(slug: string) {
  try {
    await connectDB()
    
    const galleryBlog = await GalleryBlog.findOne({ 
      slug: slug,
      isActive: true,
      isDraft: { $ne: true } // Exclude drafts
    })

    if (!galleryBlog) {
      return null
    }

    // Only return gallery blogs with content (not external links)
    if (!galleryBlog.content) {
      return null
    }

    return {
      id: (galleryBlog._id as any).toString(),
      title: galleryBlog.title,
      description: galleryBlog.description,
      category: galleryBlog.category,
      content: galleryBlog.content,
      imageUrl: galleryBlog.imageUrl,
      slug: galleryBlog.slug || '',
      publishedAt: galleryBlog.publishedAt?.toISOString() || new Date().toISOString(),
      createdAt: galleryBlog.createdAt.toISOString(),
      updatedAt: galleryBlog.updatedAt.toISOString()
    }
  } catch (error) {
    console.error('Error fetching gallery blog:', error)
    return null
  }
}

export default async function GalleryBlogPage({ params }: GalleryBlogPageProps) {
  const { slug } = await params
  const blog = await getGalleryBlogBySlug(slug)

  if (!blog) {
    notFound()
  }


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      'ARTICLE': 'bg-blue-100 text-blue-800',
      'WEBINAR': 'bg-purple-100 text-purple-800',
      'INTERVIEW': 'bg-green-100 text-green-800',
      'FEATURE': 'bg-orange-100 text-orange-800',
      'NEWS': 'bg-red-100 text-red-800',
      'CASE_STUDY': 'bg-indigo-100 text-indigo-800',
      'NEWSLETTER': 'bg-pink-100 text-pink-800',
      'WHITEPAPER': 'bg-gray-100 text-gray-800'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar page="gallery" />
      
      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link 
          href="/gallery" 
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Gallery
        </Link>
      </div>

      {/* Blog Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          {/* Featured Image */}
          {blog.imageUrl && (
            <div className="w-full h-64 md:h-96">
              <img
                src={blog.imageUrl}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-6 md:p-8">
            {/* Category Badge */}
            <div className="mb-4">
              <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${getCategoryColor(blog.category)}`}>
                {blog.category.replace('_', ' ')}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {blog.title}
            </h1>

            {/* Description */}
            <p className="text-lg text-gray-600 mb-6">
              {blog.description}
            </p>

            {/* Date */}
            <div className="flex items-center text-sm text-gray-500 mb-8">
              <span>Published on {formatDate(blog.publishedAt)}</span>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {blog.content ? blog.content.split('\n').map((line, index) => (
                  <p key={index} className="mb-4">{line}</p>
                )) : 'No content available'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export async function generateMetadata({ params }: GalleryBlogPageProps) {
  const { slug } = await params
  const blog = await getGalleryBlogBySlug(slug)
  
  if (!blog) {
    return {
      title: 'Gallery Blog Not Found | Fathom Legal',
    }
  }

  return {
    title: `${blog.title} | Fathom Legal`,
    description: blog.description,
  }
}
