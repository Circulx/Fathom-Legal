import fs from 'fs'
import path from 'path'
import { LEGAL_POLICY_META } from '@/lib/legal-policy-meta'

function readSeedContent(slug: string): string {
  const filePath = path.join(process.cwd(), 'src/lib/legal-policy-seeds', `${slug}.html`)
  return fs.readFileSync(filePath, 'utf8').trim()
}

export function getLegalPolicySeedDocuments() {
  return LEGAL_POLICY_META.map((meta) => ({
    slug: meta.slug,
    title: meta.title,
    heroTitle: meta.heroTitle,
    navbarPage: meta.navbarPage,
    content: readSeedContent(meta.slug),
  }))
}
