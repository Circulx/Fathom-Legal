import CrmAssignee from '@/models/CrmAssignee'
import Admin from '@/models/Admin'
import { getAssigneeEmailsFromDoc } from '@/lib/assignee-emails'

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export async function resolveAssigneeEmails(assigneeName: string): Promise<string[]> {
  const name = assigneeName.trim()
  if (!name || name.toLowerCase() === 'unassigned') return []

  const namePattern = new RegExp(`^${escapeRegex(name)}$`, 'i')

  const assignee = await CrmAssignee.findOne({ name: namePattern }).lean()
  const assigneeEmails = assignee ? getAssigneeEmailsFromDoc(assignee) : []
  if (assigneeEmails.length > 0) {
    return assigneeEmails
  }

  const admin = await Admin.findOne({ name: namePattern, isActive: true }).lean<{ email?: string } | null>()
  if (admin?.email?.trim()) {
    return [admin.email.trim().toLowerCase()]
  }

  return []
}
