import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Template from '@/models/Template'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Build query
    let query: any = { isActive: true }

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

    // Get templates with pagination
    const skip = (page - 1) * limit
    const templates = await Template.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Template.countDocuments(query)

    return NextResponse.json({
      templates,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Get templates error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB()
    
    const formData = await request.formData()
    const id = formData.get('id') as string
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const price = formData.get('price') as string
    const category = formData.get('category') as string
    const image = formData.get('image') as File | null
    const pdfFile = formData.get('pdfFile') as File | null
    const isCustom = formData.get('isCustom') === 'true'
    const customOptionsJson = formData.get('customOptions') as string
    const defaultCalendlyLink = formData.get('defaultCalendlyLink') as string
    const defaultContactEmail = formData.get('defaultContactEmail') as string
    const countriesJson = formData.get('countries') as string

    if (!id) {
      return NextResponse.json({ error: 'Template ID is required' }, { status: 400 })
    }

    if (!title || !description || !price) {
      return NextResponse.json({ error: 'Missing required fields (title, description, price)' }, { status: 400 })
    }

    if (!defaultCalendlyLink || !defaultContactEmail) {
      return NextResponse.json({ 
        error: 'Default Calendly Link and Contact Email are required' 
      }, { status: 400 })
    }

    const template = await Template.findById(id)
    
    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    // Parse countries
    let countries: string[] = template.countries && template.countries.length > 0 ? template.countries : ['IN', 'US']
    if (countriesJson) {
      try {
        countries = JSON.parse(countriesJson)
        if (!Array.isArray(countries)) {
          countries = ['IN', 'US']
        }
      } catch {
        countries = template.countries && template.countries.length > 0 ? template.countries : ['IN', 'US']
      }
    }

    // Update basic fields
    template.title = title
    template.description = description
    template.price = parseFloat(price)
    template.category = category || 'Legal Documents'
    template.defaultCalendlyLink = defaultCalendlyLink
    template.defaultContactEmail = defaultContactEmail
    template.countries = countries

    // Handle image update if provided
    if (image && image.size > 0) {
      const allowedImageTypes = [
        'image/jpeg',
        'image/jpg', 
        'image/png',
        'image/gif',
        'image/webp'
      ]

      if (!allowedImageTypes.includes(image.type)) {
        return NextResponse.json({ 
          error: 'Invalid image type. Only JPEG, PNG, GIF, and WebP images are allowed.' 
        }, { status: 400 })
      }

      const maxSize = 5 * 1024 * 1024 // 5MB
      if (image.size > maxSize) {
        return NextResponse.json({ 
          error: 'Image size too large. Maximum size is 5MB for database storage.' 
        }, { status: 400 })
      }

      // Convert image to Base64 for MongoDB storage
      const imageBytes = await image.arrayBuffer()
      const imageBuffer = Buffer.from(imageBytes)
      const base64Data = imageBuffer.toString('base64')
      const imageDataUrl = `data:${image.type};base64,${base64Data}`
      
      template.imageData = imageDataUrl
      console.log(`✅ Template image stored in MongoDB as base64`)
    }

    // Handle PDF file update if provided
    if (pdfFile && pdfFile.size > 0) {
      const maxSize = 50 * 1024 * 1024 // 50MB
      if (pdfFile.size > maxSize) {
        return NextResponse.json({ 
          error: 'File size too large. Maximum size is 50MB.' 
        }, { status: 400 })
      }

      // Use GCS if configured, otherwise use local storage (same as upload route)
      const { uploadToGCS, isGCSConfigured } = await import('@/lib/gcs')
      const { writeFile, mkdir } = await import('fs/promises')
      const { join } = await import('path')
      
      const timestamp = Date.now()
      const pdfExtension = pdfFile.name.split('.').pop()
      const pdfFileName = `${timestamp}-${pdfFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
      
      const pdfBytes = await pdfFile.arrayBuffer()
      const pdfBuffer = Buffer.from(pdfBytes)
      
      // Upload template file to Google Cloud Storage (REQUIRED - no fallback)
      if (!isGCSConfigured()) {
        return NextResponse.json({ 
          error: 'Google Cloud Storage is not configured. Please configure GCS credentials and bucket name.' 
        }, { status: 500 })
      }

      let pdfFileUrl: string
      try {
        // Upload file to GCS with actual content type
        pdfFileUrl = await uploadToGCS(pdfBuffer, pdfFileName, pdfFile.type)
        console.log(`✅ Template file uploaded to GCS: ${pdfFileUrl}`)
      } catch (gcsError) {
        console.error('❌ GCS upload failed:', gcsError)
        return NextResponse.json({ 
          error: 'Failed to upload template file to Google Cloud Storage. Please check GCS configuration and try again.',
          details: gcsError instanceof Error ? gcsError.message : 'Unknown error'
        }, { status: 500 })
      }
      
      template.fileUrl = pdfFileUrl
      template.fileName = pdfFile.name
      template.fileSize = pdfFile.size
      template.fileType = pdfFile.type
    }

    // Handle custom options
    if (isCustom && customOptionsJson) {
      try {
        const customOptions = JSON.parse(customOptionsJson)
        template.isCustom = true
        template.customOptions = customOptions.map((opt: any) => ({
          ...opt,
          calendlyLink: defaultCalendlyLink,
          contactEmail: defaultContactEmail
        }))
      } catch (error) {
        console.error('Error parsing custom options:', error)
        return NextResponse.json({ error: 'Invalid custom options format' }, { status: 400 })
      }
    } else {
      template.isCustom = false
      template.customOptions = undefined
    }

    await template.save()

    return NextResponse.json({ 
      message: 'Template updated successfully',
      template: {
        id: template._id,
        title: template.title,
        description: template.description,
        price: template.price,
        category: template.category
      }
    })

  } catch (error) {
    console.error('Update template error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Template ID is required' }, { status: 400 })
    }

    const template = await Template.findByIdAndUpdate(id, { isActive: false })
    
    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Template deleted successfully' })

  } catch (error) {
    console.error('Delete template error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}












