import { CRM_STATUSES, type CrmLead } from '@/components/CRM/data'

function escapeCsv(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

export function downloadLeadsCsv(leads: CrmLead[], filename?: string) {
  const headers = [
    'First name',
    'Last name',
    'Email',
    'Phone',
    'Company',
    'Source',
    'Practice areas',
    'Matter',
    'Status',
    'Consultation date',
    'Consultation time',
    'Created',
  ]

  const rows = leads.map((lead) => [
    lead.first,
    lead.last,
    lead.email,
    lead.phone,
    lead.company,
    lead.source,
    lead.areas.join('; '),
    lead.matter,
    CRM_STATUSES[lead.status],
    lead.date,
    lead.time,
    new Date(lead.createdAt).toLocaleDateString('en-US'),
  ])

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => escapeCsv(String(cell))).join(','))
    .join('\r\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download =
    filename ?? `fathom-legal-leads-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
