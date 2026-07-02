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

  const assignee = await CrmAssignee.findOne({ name: namePattern })
    .select('email emails')
    .lean<{ email?: string; emails?: string[] }>()
  const assigneeEmails = assignee ? getAssigneeEmailsFromDoc(assignee) : []
  if (assigneeEmails.length > 0) {
    return assigneeEmails
  }

  const admin = await Admin.findOne({ name: namePattern, isActive: true })
    .select('email')
    .lean<{ email?: string }>()
  const adminEmail = admin?.email?.trim()
  if (adminEmail) {
    return [adminEmail.toLowerCase()]
  }

  return []
}
