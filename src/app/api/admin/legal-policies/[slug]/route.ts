import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { revalidatePath } from 'next/cache'
import { authOptions } from '@/lib/auth'
import { getLegalPolicyPath } from '@/lib/legal-policy-meta'
import { updateLegalPolicy } from '@/lib/legal-policies'

export const dynamic = 'force-dynamic'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user?.role !== 'admin' && session.user?.role !== 'super-admin')) {
    return null
  }
  return session
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { slug } = await params
    const body = await request.json()
    const title = typeof body.title === 'string' ? body.title.trim() : undefined
    const heroTitle = typeof body.heroTitle === 'string' ? body.heroTitle.trim() : undefined
    const content = typeof body.content === 'string' ? body.content : undefined

    if (title !== undefined && !title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }
    if (heroTitle !== undefined && !heroTitle) {
      return NextResponse.json({ error: 'Hero title is required' }, { status: 400 })
    }

    const policy = await updateLegalPolicy(slug, { title, heroTitle, content })
    if (!policy) {
      return NextResponse.json({ error: 'Policy not found' }, { status: 404 })
    }

    revalidatePath(getLegalPolicyPath(slug))
    return NextResponse.json({ policy })
  } catch (error) {
    console.error('Update legal policy error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
