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

    // Validate required fields
    if (!image) {
      return NextResponse.json({ error: 'Template preview image is required' }, { status: 400 })
    }

    if (!pdfFile) {
      return NextResponse.json({ error: 'PDF template file is required' }, { status: 400 })
    }

    if (!description || !price) {
      return NextResponse.json({ error: 'Missing required fields (description, price)' }, { status: 400 })
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

    // Validate PDF type
    const allowedPdfTypes = ['application/pdf']
    if (!allowedPdfTypes.includes(pdfFile.type)) {
      return NextResponse.json({ 
        error: 'Invalid PDF file type. Only PDF files are allowed.' 
      }, { status: 400 })
    }

    // Validate image size (5MB limit)
    const maxImageSize = 5 * 1024 * 1024 // 5MB
    if (image.size > maxImageSize) {
      return NextResponse.json({ 
        error: 'Image size too large. Maximum size is 5MB.' 
      }, { status: 400 })
    }

    // Validate PDF size (50MB limit)
    const maxPdfSize = 50 * 1024 * 1024 // 50MB
    if (pdfFile.size > maxPdfSize) {
      return NextResponse.json({ 
        error: 'PDF file size too large. Maximum size is 50MB.' 
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

    // Create uploads directories if they don't exist
    const imagesDir = join(process.cwd(), 'public', 'uploads', 'templates')
    const pdfsDir = join(process.cwd(), 'uploads', 'templates', 'pdfs') // Outside public for security
    
    await mkdir(imagesDir, { recursive: true })
    await mkdir(pdfsDir, { recursive: true })

    const imagePath = join(imagesDir, imageFileName)
    const pdfPath = join(pdfsDir, pdfFileName)

    // Save image (publicly accessible) - keep local storage for images
    await writeFile(imagePath, imageBuffer)
    const imageUrl = `/uploads/templates/${imageFileName}`

    // Upload PDF to Google Cloud Storage
    let pdfFileUrl: string
    if (isGCSConfigured()) {
      try {
        // Upload PDF to GCS
        pdfFileUrl = await uploadToGCS(pdfBuffer, pdfFileName, 'application/pdf')
        console.log(`✅ PDF uploaded to GCS: ${pdfFileUrl}`)
      } catch (gcsError) {
        console.error('❌ GCS upload failed, falling back to local storage:', gcsError)
        // Fallback to local storage if GCS upload fails
        await writeFile(pdfPath, pdfBuffer)
        pdfFileUrl = pdfFileName
      }
    } else {
      // Fallback to local storage if GCS is not configured
      console.warn('⚠️ GCS not configured, using local storage for PDF')
      await writeFile(pdfPath, pdfBuffer)
      pdfFileUrl = pdfFileName
    }

    // Parse tags if provided
    const tagsArray = tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : []

    // Create template record
    const template = new Template({
      title: title || description, // Use provided title or fallback to description
      description,
      category: category || 'Legal Documents',
      fileUrl: pdfFileUrl, // Filename for local storage
      fileName: pdfFile.name,
      fileSize: pdfFile.size,
      fileType: 'application/pdf',
      imageUrl: imageUrl, // Local path
      price: parseFloat(price),
      uploadedBy,
      tags: tagsArray
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

