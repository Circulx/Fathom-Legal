import { getZohoTransporter } from '@/lib/email-transport'
import type { EmailSendResult } from '@/lib/consultation-email'

export interface TaskAssignmentEmailParams {
  assigneeName: string
  assigneeEmails: string[]
  taskText: string
  leadName: string
  leadMatter?: string
  crmUrl?: string
}

function buildTaskAssignmentEmailHtml(params: TaskAssignmentEmailParams): string {
  const matter = params.leadMatter?.trim() || '—'
  const crmLink = params.crmUrl?.trim() || 'https://fathomlegal.com/admin/dashboard'

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 0; color: #333; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; background: #fff; }
          .header { padding: 28px 30px; border-bottom: 2px solid #A5292A; background: #fafafa; }
          .header h1 { margin: 0 0 8px; font-size: 22px; color: #222; }
          .content { padding: 30px; }
          .task-box { margin: 24px 0; padding: 18px 20px; background: #f9f9f9; border-left: 3px solid #A5292A; }
          .task-label { font-size: 12px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; color: #666; margin-bottom: 8px; }
          .task-text { font-size: 15px; color: #222; margin: 0; }
          .detail { font-size: 14px; margin-bottom: 8px; color: #555; }
          .button { display: inline-block; margin-top: 20px; background: #A5292A; color: #fff !important; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; }
          .footer { padding: 24px 30px; border-top: 1px solid #eee; font-size: 12px; color: #666; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New task assigned to you</h1>
            <p style="margin:0;color:#666;font-size:14px;">Fathom Legal CRM</p>
          </div>
          <div class="content">
            <p>Hi ${params.assigneeName},</p>
            <p style="margin-top:12px;">A lead task has been assigned to you in the Fathom Legal CRM.</p>
            <div class="task-box">
              <div class="task-label">Task</div>
              <p class="task-text">${params.taskText}</p>
            </div>
            <div class="detail"><strong>Lead:</strong> ${params.leadName}</div>
            <div class="detail"><strong>Matter:</strong> ${matter}</div>
            <a href="${crmLink}" class="button">Open CRM</a>
          </div>
          <div class="footer">Fathom Legal · Internal notification</div>
        </div>
      </body>
    </html>
  `
}

export async function sendTaskAssignmentEmail(
  params: TaskAssignmentEmailParams
): Promise<EmailSendResult> {
  const zoho = getZohoTransporter()
  if (!zoho) {
    return { emailSent: false, emailError: 'Email service is not configured' }
  }

  const html = buildTaskAssignmentEmailHtml(params)
  const subject = `Task assigned: ${params.leadName} | Fathom Legal CRM`

  const recipients = params.assigneeEmails.filter(Boolean)
  if (recipients.length === 0) {
    return { emailSent: false, emailError: 'No recipient emails provided' }
  }

  try {
    await zoho.transporter.sendMail({
      from: `"Fathom Legal" <${zoho.fromEmail}>`,
      to: recipients.join(', '),
      subject,
      html,
    })
    return { emailSent: true, emailError: null }
  } catch (error) {
    console.error('Task assignment email error:', error)
    return {
      emailSent: false,
      emailError: error instanceof Error ? error.message : 'Failed to send email',
    }
  }
}
