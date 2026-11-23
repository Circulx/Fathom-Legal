import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import ClientLogo from '@/models/ClientLogo'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await connectDB()

    const logos = await ClientLogo.find({ isActive: true })
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean()

    return NextResponse.json({
      logos: logos.map((logo) => ({
        id: String(logo._id),
        name: logo.name,
        imageUrl: logo.imageUrl,
        websiteUrl: logo.websiteUrl || '',
        displayOrder: logo.displayOrder ?? 0,
      })),
    })
  } catch (error) {
    console.error('Get client logos error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
