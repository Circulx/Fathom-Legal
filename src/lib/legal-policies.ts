import connectDB from '@/lib/mongodb'
import LegalPolicy, { type ILegalPolicy } from '@/models/LegalPolicy'
import {
  getLegalPolicyMeta,
  getLegalPolicyPath,
  isBuiltinPolicySlug,
} from '@/lib/legal-policy-meta'
import { getLegalPolicySeedDocuments } from '@/lib/legal-policy-seeds'
import { generateSlug } from '@/lib/slug'

export type LegalPolicyDto = {
  slug: string
  title: string
  heroTitle: string
  navbarPage: string
  path: string
  content: string
  updatedAt: string
  isBuiltin: boolean
}

function toDto(doc: ILegalPolicy): LegalPolicyDto {
  return {
    slug: doc.slug,
    title: doc.title,
    heroTitle: doc.heroTitle,
    navbarPage: doc.navbarPage,
    path: getLegalPolicyPath(doc.slug),
    content: doc.content,
    updatedAt: doc.updatedAt.toISOString(),
    isBuiltin: isBuiltinPolicySlug(doc.slug),
  }
}

export async function ensureLegalPoliciesSeeded(): Promise<void> {
  await connectDB()
  const seeds = getLegalPolicySeedDocuments()
  for (const seed of seeds) {
    await LegalPolicy.updateOne({ slug: seed.slug }, { $setOnInsert: seed }, { upsert: true })
  }
}

export async function listLegalPolicies(): Promise<LegalPolicyDto[]> {
  await ensureLegalPoliciesSeeded()
  const docs = await LegalPolicy.find().sort({ slug: 1 })
  return docs.map(toDto)
}

export async function getLegalPolicyBySlug(slug: string): Promise<LegalPolicyDto | null> {
  await ensureLegalPoliciesSeeded()
  const doc = await LegalPolicy.findOne({ slug })
  return doc ? toDto(doc) : null
}

export function normalizePolicySlug(input: string): string {
  return generateSlug(input)
}

export function isValidPolicySlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
}

export async function createLegalPolicy(data: {
  slug: string
  title: string
  heroTitle: string
  content?: string
}): Promise<{ policy?: LegalPolicyDto; error?: string }> {
  const title = data.title.trim()
  const heroTitle = data.heroTitle.trim()
  const slug = normalizePolicySlug(data.slug || title)

  if (!title) return { error: 'Title is required' }
  if (!heroTitle) return { error: 'Hero title is required' }
  if (!slug) return { error: 'URL slug is required' }
  if (!isValidPolicySlug(slug)) {
    return { error: 'URL slug may only contain lowercase letters, numbers, and hyphens' }
  }
  if (isBuiltinPolicySlug(slug)) {
    return { error: 'This URL slug is reserved for a built-in policy' }
  }

  await connectDB()
  const existing = await LegalPolicy.findOne({ slug })
  if (existing) {
    return { error: 'A policy with this URL slug already exists' }
  }

  const doc = await LegalPolicy.create({
    slug,
    title,
    heroTitle,
    navbarPage: 'policy',
    content: data.content ?? '<p></p>',
  })

  return { policy: toDto(doc) }
}

export async function updateLegalPolicy(
  slug: string,
  data: { title?: string; heroTitle?: string; content?: string }
): Promise<LegalPolicyDto | null> {
  await connectDB()
  const existing = await LegalPolicy.findOne({ slug })
  if (!existing) return null

  const meta = getLegalPolicyMeta(slug)
  const doc = await LegalPolicy.findOneAndUpdate(
    { slug },
    {
      $set: {
        title: data.title !== undefined ? data.title.trim() : existing.title,
        heroTitle: data.heroTitle !== undefined ? data.heroTitle.trim() : existing.heroTitle,
        content: data.content !== undefined ? data.content : existing.content,
        navbarPage: meta?.navbarPage ?? existing.navbarPage ?? 'policy',
      },
    },
    { new: true }
  )

  return doc ? toDto(doc) : null
}
