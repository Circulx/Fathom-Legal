import type { CrmLead } from '@/components/CRM/data'

export function normalizeLeadEmail(email: string): string {
  return email.trim().toLowerCase()
}

export function buildDuplicateEmailGroups(leads: CrmLead[]): Map<string, CrmLead[]> {
  const groups = new Map<string, CrmLead[]>()
  for (const lead of leads) {
    const email = normalizeLeadEmail(lead.email)
    if (!email) continue
    const existing = groups.get(email) ?? []
    existing.push(lead)
    groups.set(email, existing)
  }
  return groups
}

/** Lead ids that share an email with at least one other lead */
export function getDuplicateLeadIds(leads: CrmLead[]): Set<string> {
  const ids = new Set<string>()
  for (const group of buildDuplicateEmailGroups(leads).values()) {
    if (group.length < 2) continue
    for (const lead of group) ids.add(lead.id)
  }
  return ids
}

export function getDuplicateSiblings(lead: CrmLead, leads: CrmLead[]): CrmLead[] {
  const email = normalizeLeadEmail(lead.email)
  if (!email) return []
  return leads.filter(
    (other) => other.id !== lead.id && normalizeLeadEmail(other.email) === email
  )
}

export function countDuplicateGroups(leads: CrmLead[]): number {
  let count = 0
  for (const group of buildDuplicateEmailGroups(leads).values()) {
    if (group.length > 1) count += 1
  }
  return count
}
