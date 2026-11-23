export interface LegalPolicyMeta {
  slug: string
  title: string
  heroTitle: string
  navbarPage: string
  path: string
}

export const LEGAL_POLICY_META: LegalPolicyMeta[] = [
  {
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    heroTitle: 'Privacy Policy',
    navbarPage: 'privacy',
    path: '/privacy-policy',
  },
  {
    slug: 'terms-of-service',
    title: 'Terms of Service',
    heroTitle: 'Terms of Service',
    navbarPage: 'terms',
    path: '/terms-of-service',
  },
  {
    slug: 'refund-cancellation-policy',
    title: 'Refund & Cancellation Policy',
    heroTitle: 'Refund Policy',
    navbarPage: 'refund',
    path: '/refund-cancellation-policy',
  },
]

export const BUILTIN_POLICY_SLUGS = LEGAL_POLICY_META.map((p) => p.slug)

export function getLegalPolicyMeta(slug: string): LegalPolicyMeta | undefined {
  return LEGAL_POLICY_META.find((p) => p.slug === slug)
}

export function isBuiltinPolicySlug(slug: string): boolean {
  return BUILTIN_POLICY_SLUGS.includes(slug)
}

export function getLegalPolicyPath(slug: string): string {
  return getLegalPolicyMeta(slug)?.path ?? `/policies/${slug}`
}
