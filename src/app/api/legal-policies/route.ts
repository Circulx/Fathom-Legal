import { NextResponse } from 'next/server'
import { listLegalPolicies } from '@/lib/legal-policies'
import { BUILTIN_POLICY_SLUGS } from '@/lib/legal-policy-meta'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const policies = await listLegalPolicies()
    const sorted = policies
      .map((p) => ({ slug: p.slug, title: p.title, path: p.path }))
      .sort((a, b) => {
        const aIdx = BUILTIN_POLICY_SLUGS.indexOf(a.slug)
        const bIdx = BUILTIN_POLICY_SLUGS.indexOf(b.slug)
        if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx
        if (aIdx !== -1) return -1
        if (bIdx !== -1) return 1
        return a.title.localeCompare(b.title)
      })

    return NextResponse.json({ policies: sorted })
  } catch (error) {
    console.error('List public legal policies error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
