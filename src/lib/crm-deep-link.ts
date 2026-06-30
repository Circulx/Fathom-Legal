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

export function parseCrmDashboardDeepLink(searchParams: URLSearchParams): {
  view: 'leads' | null
  leadId: string | null
  taskId: string | null
} {
  const crm = searchParams.get('crm')
  if (crm !== 'leads') {
    return { view: null, leadId: null, taskId: null }
  }
  return {
    view: 'leads',
    leadId: searchParams.get('lead'),
    taskId: searchParams.get('task'),
  }
}
