import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Template from '@/models/Template'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { uploadToGCS, isGCSConfigured } from '@/lib/gcs'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const formData = await request.formData()
    const image = formData.get('image') as File
    const pdfFile = formData.get('pdfFile') as File
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const price = formData.get('price') as string
    const category = formData.get('category') as string
    const tags = formData.get('tags') as string
    const uploadedBy = formData.get('uploadedBy') as string
    const isCustom = formData.get('isCustom') === 'true'
    const customOptionsJson = formData.get('customOptions') as string
    const defaultCalendlyLink = formData.get('defaultCalendlyLink') as string
    const defaultContactEmail = formData.get('defaultContactEmail') as string

    // Validate required fields
    if (!image) {
      return NextResponse.json({ error: 'Template preview image is required' }, { status: 400 })
    }

    if (!pdfFile) {
      return NextResponse.json({ error: 'Template file is required' }, { status: 400 })
    }

    if (!description || !price) {
      return NextResponse.json({ error: 'Missing required fields (description, price)' }, { status: 400 })
    }

    // Validate required contact fields
    if (!defaultCalendlyLink || !defaultContactEmail) {
      return NextResponse.json({ 
        error: 'Default Calendly Link and Contact Email are required' 
      }, { status: 400 })
    }

    // Validate image type
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

    // Validate that a file type is present (allow all file types)
    if (!pdfFile.type) {
      return NextResponse.json({ 
        error: 'Invalid file. Please ensure the file has a valid type.' 
      }, { status: 400 })
    }

    // Validate image size (5MB limit)
    const maxImageSize = 5 * 1024 * 1024 // 5MB
    if (image.size > maxImageSize) {
      return NextResponse.json({ 
        error: 'Image size too large. Maximum size is 5MB.' 
      }, { status: 400 })
    }

    // Validate template file size (50MB limit)
    const maxFileSize = 50 * 1024 * 1024 // 50MB
    if (pdfFile.size > maxFileSize) {
      return NextResponse.json({ 
        error: 'Template file size too large. Maximum size is 50MB.' 
      }, { status: 400 })
    }

    // Generate unique filenames
    const timestamp = Date.now()
    const imageExtension = image.name.split('.').pop()
    const imageFileName = `${timestamp}-image-${image.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`

    const pdfExtension = pdfFile.name.split('.').pop()
    const pdfFileName = `${timestamp}-${pdfFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`

    // Convert files to buffers
    const imageBytes = await image.arrayBuffer()
    const imageBuffer = Buffer.from(imageBytes)

    const pdfBytes = await pdfFile.arrayBuffer()
    const pdfBuffer = Buffer.from(pdfBytes)

    // Create uploads directory for images only (images stay local for public access)
    const imagesDir = join(process.cwd(), 'public', 'uploads', 'templates')
    await mkdir(imagesDir, { recursive: true })

    const imagePath = join(imagesDir, imageFileName)

    // Save image (publicly accessible) - keep local storage for images
    await writeFile(imagePath, imageBuffer)
    const imageUrl = `/uploads/templates/${imageFileName}`

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

    // Parse tags if provided
    const tagsArray = tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : []

    // Parse custom options if provided
    let customOptions = []
    if (isCustom && customOptionsJson) {
      try {
        customOptions = JSON.parse(customOptionsJson)
        
        // Validate custom options have required fields
        for (let i = 0; i < customOptions.length; i++) {
          const option = customOptions[i]
          if (!option.calendlyLink || !option.contactEmail) {
            return NextResponse.json({ 
              error: `Custom Option ${i + 1} must have both Calendly Link and Contact Email` 
            }, { status: 400 })
          }
        }
      } catch (error) {
        console.error('Error parsing custom options:', error)
        return NextResponse.json({ error: 'Invalid custom options JSON format' }, { status: 400 })
      }
    }

    // Create template record
    const template = new Template({
      title: title || description, // Use provided title or fallback to description
      description,
      category: category || 'Legal Documents',
      fileUrl: pdfFileUrl, // Filename for local storage
      fileName: pdfFile.name,
      fileSize: pdfFile.size,
      fileType: pdfFile.type, // Store actual file type (PDF or DOCX)
      imageUrl: imageUrl, // Local path
      price: parseFloat(price),
      uploadedBy,
      tags: tagsArray,
      isCustom: isCustom,
      customOptions: customOptions.length > 0 ? customOptions : undefined,
      defaultCalendlyLink: defaultCalendlyLink,
      defaultContactEmail: defaultContactEmail
    })

    await template.save()

    return NextResponse.json({ 
      message: 'Template uploaded successfully',
      template: {
        id: template._id,
        title: template.title,
        description: template.description,
        category: template.category,
        fileUrl: template.fileUrl,
        fileName: template.fileName,
        fileSize: template.fileSize,
        fileType: template.fileType,
        imageUrl: template.imageUrl,
        price: template.price,
        tags: template.tags,
        createdAt: template.createdAt
      }
    })

  } catch (error) {
    console.error('Template upload error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

