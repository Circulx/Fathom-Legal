import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { revalidatePath } from 'next/cache'
import { authOptions } from '@/lib/auth'
import { createLegalPolicy, listLegalPolicies } from '@/lib/legal-policies'

export const dynamic = 'force-dynamic'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user?.role !== 'admin' && session.user?.role !== 'super-admin')) {
    return null
  }
  return session
}

export async function GET() {
  try {
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const policies = await listLegalPolicies()
    return NextResponse.json({ policies })
  } catch (error) {
    console.error('List legal policies error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const title = typeof body.title === 'string' ? body.title.trim() : ''
    const heroTitle = typeof body.heroTitle === 'string' ? body.heroTitle.trim() : ''
    const slug = typeof body.slug === 'string' ? body.slug.trim() : ''
    const content = typeof body.content === 'string' ? body.content : '<p></p>'

    const result = await createLegalPolicy({ slug, title, heroTitle, content })
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    revalidatePath(result.policy!.path)
    return NextResponse.json({ policy: result.policy }, { status: 201 })
  } catch (error) {
    console.error('Create legal policy error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
