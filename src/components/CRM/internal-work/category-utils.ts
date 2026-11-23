import type { InternalWorkCategory, TaskSection } from './types'

export function getCategoryMap(
  categories: InternalWorkCategory[],
  section: TaskSection
): Record<string, { label: string; className: string }> {
  const map: Record<string, { label: string; className: string }> = {}
  for (const category of categories) {
    if (category.section === section) {
      map[category.slug] = {
        label: category.label,
        className: category.className,
      }
    }
  }
  return map
}

export function getCategoryLabel(
  categories: InternalWorkCategory[],
  section: TaskSection,
  slug: string
): string {
  return (
    categories.find((category) => category.section === section && category.slug === slug)
      ?.label ?? slug
  )
}
