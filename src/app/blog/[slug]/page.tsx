import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Navbar } from '@/components/Navbar'
import Footer from '@/components/Footer'
import { BlogContent } from '@/components/BlogContent'
import { Calendar, Clock, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import connectDB from '@/lib/mongodb'
import Blog from '@/models/Blog'

interface Blog {
  id: string
  title: string
  description: string
  category: string
  content: string
  imageUrl?: string
  slug: string
  publishedAt: string
  createdAt: string
  updatedAt: string
}

interface BlogPageProps {
  params: Promise<{ slug: string }>
}

async function getBlogBySlug(slug: string): Promise<Blog | null> {
  try {
    await connectDB()
    
    const blog = await Blog.findOne({ 
      slug: slug,
      isActive: true,
      isDraft: { $ne: true } // Exclude drafts
    })

    if (!blog) {
      return null
    }

    // Only return blogs with content (not external links)
    if (!blog.content) {
      return null
    }

    return {
      id: (blog._id as any).toString(),
      title: blog.title,
      description: blog.description,
      category: blog.category,
      content: blog.content,
      imageUrl: blog.imageUrl,
      slug: blog.slug || '',
      publishedAt: blog.publishedAt?.toISOString() || new Date().toISOString(),
      createdAt: blog.createdAt.toISOString(),
      updatedAt: blog.updatedAt.toISOString()
    }
  } catch (error) {
    console.error('Error fetching blog:', error)
    return null
  }
}

// Generate static params for all blog slugs at build time
export async function generateStaticParams() {
  try {
    await connectDB()
    
    const blogs = await Blog.find({ 
      isActive: true,
      isDeleted: { $ne: true },
      isDraft: { $ne: true },
      content: { $exists: true, $ne: null } // Only blogs with content
    })
      .select('slug')
      .lean()

    return blogs
      .filter(blog => blog.slug) // Only include blogs with slugs
      .map((blog) => ({
        slug: blog.slug as string,
      }))
  } catch (error) {
    console.error('Error generating static params for blogs:', error)
    return []
  }
}

// Revalidate pages every 30 minutes (ISR)
export const revalidate = 1800

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params
  const blog = await getBlogBySlug(slug)

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
      'NEWS': 'bg-red-100 text-red-800'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar page="blog" />
      
      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link 
          href="/thoughtleadership" 
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Thought Leadership
        </Link>
      </div>

      {/* Blog Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="mb-6">
          <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${getCategoryColor(blog.category)}`}>
            {blog.category}
          </span>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
          {blog.title}
        </h1>

        <p className="text-xl text-gray-600 mb-6 leading-relaxed">
          {blog.description}
        </p>

        <div className="flex items-center text-sm text-gray-500 space-x-4 mb-8">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Published {formatDate(blog.publishedAt)}</span>
          </div>
        </div>

        {/* Featured Image */}
        {blog.imageUrl && (
          <div className="mb-8 relative w-full h-64 md:h-96">
            <Image
              src={blog.imageUrl}
              alt={blog.title}
              fill
              className="object-cover rounded-lg shadow-lg"
              unoptimized={blog.imageUrl?.startsWith('data:')}
              sizes="100vw"
            />
          </div>
        )}
      </div>

      {/* Blog Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <BlogContent content={blog.content} />
      </div>

      <Footer />
    </div>
  )
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPageProps) {
  const { slug } = await params
  const blog = await getBlogBySlug(slug)

  if (!blog) {
    return {
      title: 'Blog Not Found',
      description: 'The requested blog post could not be found.'
    }
  }

  return {
    title: `${blog.title} | Fathom Legal`,
    description: blog.description,
    openGraph: {
      title: blog.title,
      description: blog.description,
      images: blog.imageUrl ? [blog.imageUrl] : [],
    },
  }
}
