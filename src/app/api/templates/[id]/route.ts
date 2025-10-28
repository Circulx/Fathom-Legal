import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Template from '@/models/Template'

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
        imageUrl: template.imageUrl,
        price: template.price,
        downloadCount: template.downloadCount,
        createdAt: template.createdAt,
        uploadedBy: template.uploadedBy
      }
    })

  } catch (error) {
    console.error('Get template error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

