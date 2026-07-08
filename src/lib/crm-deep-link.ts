export interface CrmTaskDeepLinkParams {
  leadId: string
  taskId: string
  baseUrl?: string
}

export function buildCrmTaskDeepLink({
  leadId,
  taskId,
  baseUrl = 'https://fathomlegal.com',
}: CrmTaskDeepLinkParams): string {
  const url = new URL('/admin/dashboard', baseUrl.replace(/\/$/, ''))
  url.searchParams.set('crm', 'leads')
  url.searchParams.set('lead', leadId)
  url.searchParams.set('task', taskId)
  return url.toString()
}

export function buildInternalWorkDeepLink({
  section,
  baseUrl = 'https://fathomlegal.com',
}: {
  section: 'client' | 'admin'
  baseUrl?: string
}): string {
  const url = new URL('/admin/dashboard', baseUrl.replace(/\/$/, ''))
  url.searchParams.set('crm', section === 'client' ? 'internal-client' : 'internal-firm')
  return url.toString()
}

export function parseCrmDashboardDeepLink(searchParams: URLSearchParams): {
  view: 'leads' | 'internal-client' | 'internal-firm' | 'internal-overview' | null
  leadId: string | null
  taskId: string | null
} {
  const crm = searchParams.get('crm')
  if (crm === 'leads') {
    return {
      view: 'leads',
      leadId: searchParams.get('lead'),
      taskId: searchParams.get('task'),
    }
  }
  if (
    crm === 'internal-client' ||
    crm === 'internal-firm' ||
    crm === 'internal-overview'
  ) {
    return { view: crm, leadId: null, taskId: null }
  }
  return { view: null, leadId: null, taskId: null }
}
