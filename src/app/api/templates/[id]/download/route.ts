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

    // Get PDF file path
    const filePath = template.fileUrl // GCS path or local filename
    
    // Download PDF from GCS or local storage
    let pdfBuffer: Buffer
    try {
      // Check if file is in GCS (path starts with 'templates/')
      if (isGCSConfigured() && filePath.startsWith('templates/')) {
        // Download from GCS
        pdfBuffer = await downloadFromGCS(filePath)
        console.log(`✅ PDF downloaded from GCS: ${filePath}`)
      } else {
        // Fallback to local storage (for backward compatibility)
        const pdfsDir = join(process.cwd(), 'uploads', 'templates', 'pdfs')
        const pdfPath = join(pdfsDir, filePath)
        pdfBuffer = await readFile(pdfPath)
        console.log(`✅ PDF read from local storage: ${pdfPath}`)
      }
    } catch (fileError) {
      console.error('Error reading PDF file:', fileError)
      return NextResponse.json(
        { error: 'Template file not found' },
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

    // Return PDF file with appropriate headers
    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${template.fileName || 'template.pdf'}"`,
        'Content-Length': pdfBuffer.length.toString(),
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
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

