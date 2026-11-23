import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Template from '@/models/Template'

// Cache this route for 30 minutes (1800 seconds)
export const revalidate = 1800

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    
    const { id } = await params
    
    const template = await Template.findById(id)
      .populate('uploadedBy', 'name email')
    
    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      template: {
        _id: template._id,
        title: template.title,
        description: template.description,
        category: template.category,
        fileUrl: template.fileUrl,
        fileName: template.fileName,
        fileSize: template.fileSize,
        fileType: template.fileType,
        imageUrl: template.imageUrl, // Legacy field
        imageData: template.imageData, // Base64 data URL (preferred)
        price: template.price,
        downloadCount: template.downloadCount,
        createdAt: template.createdAt,
        uploadedBy: template.uploadedBy,
        countries: template.countries,
        isCustom: template.isCustom,
        customOptions: template.customOptions,
        defaultCalendlyLink: template.defaultCalendlyLink,
        defaultContactEmail: template.defaultContactEmail
      }
    })

  } catch (error) {
    console.error('Get template error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

