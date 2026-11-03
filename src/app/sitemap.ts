import type { MetadataRoute } from 'next'
import connectDB from '@/lib/mongodb'
import Blog from '@/models/Blog'
import GalleryBlog from '@/models/GalleryBlog'
import Template from '@/models/Template'

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.fathomlegal.com').replace(/\/$/, '')

// Regenerate the sitemap at most once per hour so new blogs/templates appear automatically.
export const revalidate = 3600

type Entry = MetadataRoute.Sitemap[number]

// All public pages that exist in src/app
const STATIC_ROUTES: { path: string; priority: number; changeFrequency: Entry['changeFrequency'] }[] = [
  { path: '', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/about-us', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/services', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/services/generalcorporateadvisory', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/services/disputeresolution', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/services/intellectualproperty', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/services/realestatesolutions', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/services/reitsolutions', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/web3law', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/valueboostingsolutions', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/valueboostingsolutions/chieflegalofficerservice', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/valueboostingsolutions/techlegalblueprint', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/valueboostingsolutions/vcfundingsupport', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/valueboostingsolutions/pitchdeckservices', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/valueboostingsolutions/cybersecurityservices', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/templates', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/thoughtleadership', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/blog', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/gallery', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/fathom-crm', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/careers', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.8, changeFrequency: 'yearly' },
  { path: '/client-intake', priority: 0.7, changeFrequency: 'yearly' },
  { path: '/privacy-policy', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/terms-of-service', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/refund-cancellation-policy', priority: 0.3, changeFrequency: 'yearly' },
]

async function getDynamicEntries(): Promise<MetadataRoute.Sitemap> {
  try {
    await connectDB()

    const [blogs, galleryBlogs, templates] = await Promise.all([
      Blog.find(
        { isActive: true, isDraft: { $ne: true }, isDeleted: { $ne: true }, slug: { $exists: true, $ne: '' }, content: { $exists: true, $ne: '' } },
        { slug: 1, updatedAt: 1 }
      ).lean(),
      GalleryBlog.find(
        { isActive: true, isDraft: { $ne: true }, isDeleted: { $ne: true }, slug: { $exists: true, $ne: '' } },
        { slug: 1, updatedAt: 1 }
      ).lean(),
      Template.find({ isActive: true }, { _id: 1, updatedAt: 1 }).lean(),
    ])

    return [
      ...(blogs as any[]).map((b) => ({
        url: `${SITE_URL}/blog/${b.slug}`,
        lastModified: b.updatedAt ? new Date(b.updatedAt) : new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      })),
      ...(galleryBlogs as any[]).map((g) => ({
        url: `${SITE_URL}/gallery-blog/${g.slug}`,
        lastModified: g.updatedAt ? new Date(g.updatedAt) : new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      })),
      ...(templates as any[]).map((t) => ({
        url: `${SITE_URL}/templates/${String(t._id)}`,
        lastModified: t.updatedAt ? new Date(t.updatedAt) : new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      })),
    ]
  } catch (error) {
    // If the DB is unreachable, still serve the static pages.
    console.error('Sitemap: failed to load dynamic entries', error)
    return []
  }
}

// Served at /sitemap.xml
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }))

  return [...staticEntries, ...(await getDynamicEntries())]
}
