import type { TaskSection } from '@/components/CRM/internal-work/types'
import {
  ADMIN_CATEGORIES,
  CLIENT_CATEGORIES,
} from '@/components/CRM/internal-work/constants'

export const DEFAULT_CATEGORY_STYLES = [
  'text-[#7a1322] bg-[#f6ecee] border-[#7a1322]',
  'text-[#4C5F6B] bg-[#E1E7E9] border-[#4C5F6B]',
  'text-[#4B6650] bg-[#E2E9DF] border-[#4B6650]',
  'text-[#94702C] bg-[#F1E6CD] border-[#94702C]',
  'text-[#6E4C8C] bg-[#EAE2F1] border-[#6E4C8C]',
  'text-[#736c63] bg-[#EDE7DA] border-[#736c63]',
]

export function slugifyCategoryLabel(label: string): string {
  const slug = label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug || `category-${Date.now()}`
}

export function pickCategoryStyle(index: number): string {
  return DEFAULT_CATEGORY_STYLES[index % DEFAULT_CATEGORY_STYLES.length]
}

export const DEFAULT_CATEGORY_SEEDS: Record<
  TaskSection,
  Array<{ slug: string; label: string; className: string }>
> = {
  client: Object.entries(CLIENT_CATEGORIES).map(([slug, value]) => ({
    slug,
    label: value.label,
    className: value.className,
  })),
  admin: Object.entries(ADMIN_CATEGORIES).map(([slug, value]) => ({
    slug,
    label: value.label,
    className: value.className,
  })),
}

export async function seedDefaultCategoriesIfEmpty(): Promise<void> {
  const InternalWorkCategory = (await import('@/models/InternalWorkCategory')).default
  const count = await InternalWorkCategory.countDocuments()
  if (count > 0) return

  const docs = (['client', 'admin'] as TaskSection[]).flatMap((section) =>
    DEFAULT_CATEGORY_SEEDS[section].map((seed) => ({
      section,
      slug: seed.slug,
      label: seed.label,
      className: seed.className,
    }))
  )

  await InternalWorkCategory.insertMany(docs)
}
