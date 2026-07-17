import { NextRequest, NextResponse } from 'next/server'
import { getLegalPolicyBySlug } from '@/lib/legal-policies'

export const dynamic = 'force-dynamic'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const policy = await getLegalPolicyBySlug(slug)
    if (!policy) {
      return NextResponse.json({ error: 'Policy not found' }, { status: 404 })
    }
    return NextResponse.json(policy)
  } catch (error) {
    console.error('Get legal policy error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
