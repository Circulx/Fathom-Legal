'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { LEGAL_POLICY_META } from '@/lib/legal-policy-meta'

type FooterPolicyLink = {
  slug: string
  title: string
  path: string
}

const fallbackPolicies: FooterPolicyLink[] = LEGAL_POLICY_META.map((p) => ({
  slug: p.slug,
  title: p.title,
  path: p.path,
}))

export default function FooterLegalLinks() {
  const [policies, setPolicies] = useState<FooterPolicyLink[]>(fallbackPolicies)

  useEffect(() => {
    let cancelled = false

    async function loadPolicies() {
      try {
        const response = await fetch('/api/legal-policies', { cache: 'no-store' })
        if (!response.ok) return
        const data = await response.json()
        if (!cancelled && Array.isArray(data.policies) && data.policies.length > 0) {
          setPolicies(data.policies)
        }
      } catch {
        // Keep fallback links if the request fails
      }
    }

    loadPolicies()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <ul className="space-y-2 text-gray-300 text-sm">
      {policies.map((policy) => (
        <li key={policy.slug}>
          <Link href={policy.path} className="hover:text-white transition-colors">
            {policy.title}
          </Link>
        </li>
      ))}
    </ul>
  )
}
