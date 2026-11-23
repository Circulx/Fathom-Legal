import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Template from '@/models/Template'
import Order, { IOrderItem } from '@/models/Order'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { downloadFromGCS, isGCSConfigured } from '@/lib/gcs'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    // Validate email parameter 
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required to verify purchase' },
        { status: 400 }
      )
    }

    // Find the template
    const template = await Template.findById(id)
    
    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    // Check if user has purchased this template
    // Look for orders with:
    // 1. Customer email matches
    // 2. Order contains this templateId in items
    // 3. Payment status is 'completed'
    const order = await Order.findOne({
      'customer.email': email.toLowerCase().trim(),
      'items.templateId': id,
      paymentStatus: 'completed'
    })

    if (!order) {
      return NextResponse.json(
        { 
          error: 'Access denied. Please purchase this template to download it.',
          message: 'No completed purchase found for this template with the provided email.'
        },
        { status: 403 }
      )
    }

    // Verify templateId exists in order items
    const purchasedItem = order.items.find((item: IOrderItem) => item.templateId === id.toString())
    
    if (!purchasedItem) {
      return NextResponse.json(
        { error: 'Access denied. Template not found in your purchase history.' },
        { status: 403 }
      )
    }
    
    // Log purchase item details for debugging
    console.log('Purchase item details:', {
      templateId: id,
      itemIsCustom: purchasedItem.isCustom,
      itemIsCustomType: typeof purchasedItem.isCustom,
      itemIsCustomValue: purchasedItem.isCustom,
      customOptionName: purchasedItem.customOptionName,
      customOptionNameType: typeof purchasedItem.customOptionName,
      customOptionNameValue: purchasedItem.customOptionName,
      hasCalendlyLink: !!purchasedItem.calendlyLink,
      hasContactEmail: !!purchasedItem.contactEmail,
      fullItem: JSON.stringify(purchasedItem, null, 2)
    })

    // Check if this purchased item is a custom option - return contact info instead of file
    // Only standard template purchases should allow file download
    // Custom option purchases should only show contact information
    // A purchase is custom ONLY if ALL of these are true:
    // 1. Template actually has custom options (template.isCustom === true AND template.customOptions exists)
    // 2. Order item has isCustom explicitly set to true (boolean)
    // 3. customOptionName exists and is not empty (indicating a specific custom option was selected)
    const templateHasCustomOptions = template.isCustom === true && 
                                     template.customOptions && 
                                     Array.isArray(template.customOptions) && 
                                     template.customOptions.length > 0
    
    const orderItemIsCustom = purchasedItem.isCustom === true && 
                              purchasedItem.customOptionName && 
                              typeof purchasedItem.customOptionName === 'string' &&
                              purchasedItem.customOptionName.trim().length > 0
    
    const isCustomPurchase = templateHasCustomOptions && orderItemIsCustom
    
    console.log('Checking if purchase is custom:', {
      templateId: id,
      templateIsCustom: template.isCustom,
      templateHasCustomOptions: templateHasCustomOptions,
      templateCustomOptionsCount: template.customOptions?.length || 0,
      purchasedItemIsCustom: purchasedItem.isCustom,
      purchasedItemIsCustomType: typeof purchasedItem.isCustom,
      customOptionName: purchasedItem.customOptionName,
      customOptionNameType: typeof purchasedItem.customOptionName,
      orderItemIsCustom: orderItemIsCustom,
      isCustomPurchase,
      decision: isCustomPurchase ? 'CUSTOM - return contact info' : 'STANDARD - allow download'
    })
    
    if (isCustomPurchase) {
      // Get custom option info from order item if available, or use template defaults
      const customOptionName = purchasedItem.customOptionName
      const calendlyLink = purchasedItem.calendlyLink || template.defaultCalendlyLink
      const contactEmail = purchasedItem.contactEmail || template.defaultContactEmail
      
      return NextResponse.json({
        isCustom: true,
        message: 'This is a custom template. Please contact us to proceed with customization.',
        customOptionName: customOptionName,
        calendlyLink: calendlyLink,
        contactEmail: contactEmail,
        instructions: calendlyLink 
          ? 'Schedule a consultation using the Calendly link below.'
          : contactEmail
          ? `Contact us at ${contactEmail} to proceed with customization.`
          : 'Contact information will be provided via email.'
      }, {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }

    // Get template file path
    const filePath = template.fileUrl // GCS path or local filename
    
    if (!filePath) {
      console.error('Template fileUrl is missing:', { templateId: id, fileUrl: template.fileUrl })
      return NextResponse.json(
        { error: 'Template file path is missing. Please contact support.' },
        { status: 500 }
      )
    }
    
    console.log('Attempting to download template file:', { templateId: id, filePath, isGCSConfigured: isGCSConfigured() })
    
    // Download template file from GCS or local storage
    let fileBuffer: Buffer
    try {
      // Check if file is in GCS (path starts with 'templates/')
      if (isGCSConfigured() && filePath.startsWith('templates/')) {
        // Download from GCS
        console.log('Downloading from GCS:', filePath)
        fileBuffer = await downloadFromGCS(filePath)
        console.log(`✅ Template file downloaded from GCS: ${filePath}, size: ${fileBuffer.length} bytes`)
      } else {
        // Fallback to local storage (for backward compatibility)
        // Try new documents directory first, then fallback to old pdfs directory
        const documentsDir = join(process.cwd(), 'uploads', 'templates', 'documents')
        const pdfsDir = join(process.cwd(), 'uploads', 'templates', 'pdfs')
        let filePathFull = join(documentsDir, filePath)
        
        console.log('Trying local storage:', filePathFull)
        try {
          fileBuffer = await readFile(filePathFull)
          console.log(`✅ Template file read from local storage: ${filePathFull}, size: ${fileBuffer.length} bytes`)
        } catch (docError) {
          // Fallback to old pdfs directory for backward compatibility
          console.log('Trying legacy storage:', join(pdfsDir, filePath))
          filePathFull = join(pdfsDir, filePath)
          fileBuffer = await readFile(filePathFull)
          console.log(`✅ Template file read from legacy storage: ${filePathFull}, size: ${fileBuffer.length} bytes`)
        }
      }
    } catch (fileError: any) {
      console.error('Error reading template file:', {
        error: fileError.message,
        stack: fileError.stack,
        templateId: id,
        filePath,
        isGCSConfigured: isGCSConfigured()
      })
      return NextResponse.json(
        { 
          error: 'Template file not found',
          message: `The file for this template could not be located. File path: ${filePath}`,
          details: process.env.NODE_ENV === 'development' ? fileError.message : undefined
        },
        { status: 500 }
      )
    }
    
    if (!fileBuffer || fileBuffer.length === 0) {
      console.error('File buffer is empty:', { templateId: id, filePath })
      return NextResponse.json(
        { error: 'Template file is empty or corrupted' },
        { status: 500 }
      )
    }

    // Increment download count
    try {
      await Template.findByIdAndUpdate(id, {
        $inc: { downloadCount: 1 }
      })
    } catch (updateError) {
      // Don't fail the download if count update fails
      console.error('Error updating download count:', updateError)
    }

    // Determine content type from stored fileType or use application/octet-stream as fallback
    const contentType = template.fileType || 'application/octet-stream'
    
    // Get default filename - use stored fileName or extract extension from fileType, or use generic name
    let defaultFilename = 'template'
    if (template.fileName) {
      defaultFilename = template.fileName
    } else if (template.fileType) {
      // Try to infer extension from MIME type
      const mimeToExt: { [key: string]: string } = {
        'application/pdf': '.pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
        'application/msword': '.doc',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
        'application/vnd.ms-excel': '.xls',
        'text/plain': '.txt',
        'application/zip': '.zip',
        'application/x-rar-compressed': '.rar'
      }
      const ext = mimeToExt[template.fileType] || ''
      defaultFilename = `template${ext}`
    }
    
    // Properly encode filename for Content-Disposition header (handles special characters and unicode)
    const encodedFilename = encodeURIComponent(defaultFilename)
    const contentDisposition = `attachment; filename="${defaultFilename}"; filename*=UTF-8''${encodedFilename}`
    
    // Return template file with appropriate headers to force download
    return new NextResponse(new Uint8Array(fileBuffer), {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': contentDisposition,
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'X-Content-Type-Options': 'nosniff' // Prevents browser from trying to detect file type
      }
    })

  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

