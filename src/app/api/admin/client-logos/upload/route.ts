import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { put } from '@vercel/blob'
import connectDB from '@/lib/mongodb'
import ClientLogo from '@/models/ClientLogo'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user?.role !== 'admin' && session.user?.role !== 'super-admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const formData = await request.formData()
    const image = formData.get('image')

    if (!(image instanceof File) || image.size === 0) {
      return NextResponse.json({ error: 'Logo image is required' }, { status: 400 })
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
    if (!allowedTypes.includes(image.type)) {
      return NextResponse.json(
        { error: 'Invalid image type. Use JPEG, PNG, GIF, WebP, or SVG.' },
        { status: 400 }
      )
    }

    if (image.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Image size too large. Maximum is 5MB.' }, { status: 400 })
    }

    const safeName = image.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const blob = await put(`client-logos/${Date.now()}-${safeName}`, await image.arrayBuffer(), {
      access: 'public',
      contentType: image.type,
    })

    const existingCount = await ClientLogo.countDocuments({ isActive: true })
    const nameFromFile = image.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim() || 'Client logo'

    const logo = await ClientLogo.create({
      name: nameFromFile,
      websiteUrl: '',
      displayOrder: existingCount,
      imageUrl: blob.url,
      isActive: true,
    })

    return NextResponse.json({
      message: 'Client logo uploaded successfully',
      logo: {
        id: String(logo._id),
        name: logo.name,
        imageUrl: logo.imageUrl,
        websiteUrl: '',
        displayOrder: logo.displayOrder,
      },
    })
  } catch (error) {
    console.error('Client logo upload error:', error)
    return NextResponse.json(
      {
        error: 'Failed to upload client logo',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
