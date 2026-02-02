import { notFound } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import connectDB from '@/lib/mongodb'
import Template from '@/models/Template'
import TemplateClient from './TemplateClient'

interface TemplatePageProps {
  params: Promise<{ id: string }>
}

async function getTemplateById(id: string) {
  try {
    await connectDB()
    
    const template = await Template.findById(id)
      .populate('uploadedBy', 'name email')
    
    if (!template || !template.isActive) {
      return null
    }

    return {
      _id: template._id.toString(),
      title: template.title,
      description: template.description,
      category: template.category,
      fileUrl: template.fileUrl,
      fileName: template.fileName || '',
      fileSize: template.fileSize || 0,
      fileType: template.fileType || '',
      imageUrl: template.imageUrl,
      imageData: template.imageData,
      price: template.price,
      downloadCount: template.downloadCount || 0,
      createdAt: template.createdAt.toISOString(),
      isCustom: template.isCustom || false,
      customOptions: template.customOptions || [],
      defaultCalendlyLink: template.defaultCalendlyLink || '',
      defaultContactEmail: template.defaultContactEmail || ''
    }
  } catch (error) {
    console.error('Error fetching template:', error)
    return null
  }
}

// Generate static params for all active templates at build time
export async function generateStaticParams() {
  try {
    await connectDB()
    
    const templates = await Template.find({ 
      isActive: true
    })
      .select('_id')
      .lean()

    return templates.map((template: any) => ({
      id: template._id.toString(),
    }))
  } catch (error) {
    console.error('Error generating static params for templates:', error)
    return []
  }
}

// Revalidate pages every 30 minutes (ISR)
export const revalidate = 1800

export default async function TemplatePage({ params }: TemplatePageProps) {
  const { id } = await params
  const template = await getTemplateById(id)

  if (!template) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar page="templates" />
      <TemplateClient template={template} />
    </div>
  )
}

// Generate metadata for SEO
export async function generateMetadata({ params }: TemplatePageProps) {
  const { id } = await params
  const template = await getTemplateById(id)

  if (!template) {
    return {
      title: 'Template Not Found | Fathom Legal',
      description: 'The requested template could not be found.'
    }
  }

  return {
    title: `${template.title} | Fathom Legal`,
    description: template.description,
    openGraph: {
      title: template.title,
      description: template.description,
      images: template.imageData || template.imageUrl ? [template.imageData || template.imageUrl || ''] : [],
    },
  }
}
