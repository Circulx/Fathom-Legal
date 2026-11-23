import React from 'react'
import { Navbar } from '@/components/Navbar'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import TemplatesClient from '@/components/Templates/TemplatesClient'
import connectDB from '@/lib/mongodb'
import Template from '@/models/Template'

interface CustomOption {
  name: string
  price: number
  description?: string
  features: string[]
  calendlyLink?: string
  contactEmail?: string
}

interface Template {
  _id: string
  title: string
  description: string
  category: string
  fileUrl: string
  fileName: string
  fileSize: number
  fileType: string
  imageUrl?: string
  imageData?: string
  price: number
  tags: string[]
  downloadCount: number
  createdAt: string
  isCustom?: boolean
  customOptions?: CustomOption[]
  defaultCalendlyLink?: string
  defaultContactEmail?: string
  countries?: string[]
}

async function getTemplates(search?: string, category?: string) {
  try {
    await connectDB()
    
    const query: any = { isActive: true }
    
    if (category && category !== 'all') {
      query.category = category
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ]
    }
    
    const templates = await Template.find(query)
      .sort({ createdAt: -1 })
      .limit(100) // Get more templates for initial load
      .select('-uploadedBy')
      .lean()
    
    return templates.map((template: any) => {
      // Ensure imageData and imageUrl are properly serialized as strings
      const imageData = template.imageData ? String(template.imageData) : undefined
      const imageUrl = template.imageUrl ? String(template.imageUrl) : undefined
      
      return {
        _id: template._id.toString(),
        title: template.title,
        description: template.description,
        category: template.category,
        fileUrl: template.fileUrl,
        fileName: template.fileName,
        fileSize: template.fileSize,
        fileType: template.fileType,
        imageUrl: imageUrl,
        imageData: imageData,
        price: template.price,
        tags: template.tags || [],
        downloadCount: template.downloadCount || 0,
        createdAt: template.createdAt?.toISOString() || new Date().toISOString(),
        isCustom: template.isCustom,
        customOptions: template.customOptions ? template.customOptions.map((option: any) => ({
          name: option.name,
          price: option.price,
          description: option.description,
          features: option.features || [],
          calendlyLink: option.calendlyLink,
          contactEmail: option.contactEmail
        })) : undefined,
        defaultCalendlyLink: template.defaultCalendlyLink,
        defaultContactEmail: template.defaultContactEmail,
        countries: template.countries || []
      }
    })
  } catch (error) {
    console.error('Error fetching templates:', error)
    return []
  }
}

export default async function Templates() {
  const templates = await getTemplates()

  return (
    <div className="min-h-screen bg-white">
      <Navbar page="templates" />
      
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('/contactusbg.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
        
        <div className="absolute inset-0 bg-black/70"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold text-white mb-4 mt-6 sm:mb-6">
              Our <span style={{ color: '#A5292A' }}>Products </span> 
            </h1>
          </div>
          <div className="flex justify-center">
            <Breadcrumb 
              items={[
                { label: "Home", href: "/" },
                { label: "Templates" }
              ]} 
            />
          </div>
        </div>
      </section>

      <TemplatesClient initialTemplates={templates} />

      <Footer />
    </div>
  )
}
