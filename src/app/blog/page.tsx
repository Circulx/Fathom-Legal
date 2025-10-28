import { Navbar } from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Calendar, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface Blog {
  _id: string
  title: string
  description: string
  category: 'WEBINAR' | 'INTERVIEW' | 'FEATURE' | 'ARTICLE' | 'NEWS'
  content: string
  imageUrl?: string
  slug: string
  publishedAt: string
  createdAt: string
}

async function getBlogs(): Promise<Blog[]> {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/blogs`, {
      next: { revalidate: 3600 } // Revalidate every hour
    })

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    // Filter only blogs with content (not external links)
    return data.blogs?.filter((blog: any) => blog.content && blog.slug) || []
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return []
  }
}

export default async function BlogPage() {
  const blogs = await getBlogs()

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
      
      {/* Hero Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Legal Insights & Articles
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay informed with our latest legal insights, industry analysis, and expert commentary on corporate law, dispute resolution, and emerging legal trends.
            </p>
          </div>
        </div>
      </div>

      {/* Blog Posts */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {blogs.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
              <Calendar className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No blog posts yet</h3>
            <p className="text-gray-600">Check back soon for our latest legal insights and articles.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <article 
                key={blog._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 group"
              >
                {/* Featured Image */}
                {blog.imageUrl && (
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={blog.imageUrl}
                      alt={blog.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <div className="p-6">
                  {/* Category Badge */}
                  <div className="mb-4">
                    <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${getCategoryColor(blog.category)}`}>
                      {blog.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-red-600 transition-colors">
                    {blog.title}
                  </h2>

                  {/* Description */}
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {blog.description}
                  </p>

                  {/* Date */}
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{formatDate(blog.publishedAt)}</span>
                  </div>

                  {/* Read More Link */}
                  <Link
                    href={`/blog/${blog.slug}`}
                    className="inline-flex items-center text-red-600 hover:text-red-700 font-medium group-hover:translate-x-1 transition-all duration-200"
                  >
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export const metadata = {
  title: 'Legal Blog | Fathom Legal',
  description: 'Stay informed with our latest legal insights, industry analysis, and expert commentary on corporate law, dispute resolution, and emerging legal trends.',
}
