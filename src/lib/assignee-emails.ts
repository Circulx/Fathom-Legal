const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email.trim())
}

export function normalizeEmailList(values: unknown): string[] {
  const raw: string[] = []

  if (Array.isArray(values)) {
    for (const item of values) {
      if (typeof item === 'string') raw.push(item)
    }
  } else if (typeof values === 'string') {
    raw.push(
      ...values
        .split(/[,;]+/)
        .map((part) => part.trim())
        .filter(Boolean)
    )
  }

  const seen = new Set<string>()
  const normalized: string[] = []
  for (const value of raw) {
    const email = value.trim().toLowerCase()
    if (!email || !isValidEmail(email) || seen.has(email)) continue
    seen.add(email)
    normalized.push(email)
  }
  return normalized
}

export function getAssigneeEmailsFromDoc(doc: {
  email?: string | null
  emails?: string[] | null
}): string[] {
  const fromArray = normalizeEmailList(doc.emails ?? [])
  const legacy = doc.email?.trim().toLowerCase() || ''
  if (legacy && isValidEmail(legacy) && !fromArray.includes(legacy)) {
    return [legacy, ...fromArray]
  }
  return fromArray
}

export function formatAssigneeRecord(assignee: {
  _id: unknown
  name: string
  email?: string | null
  emails?: string[] | null
}) {
  const emails = getAssigneeEmailsFromDoc(assignee)
  return {
    id: String(assignee._id),
    name: assignee.name,
    emails,
    email: emails[0] || '',
  }
}
