import { getZohoTransporter } from '@/lib/email-transport'
import type { EmailSendResult } from '@/lib/consultation-email'

export interface InternalWorkTaskChange {
  field: string
  from: string
  to: string
}

export interface InternalWorkUpdateEmailParams {
  assigneeName: string
  assigneeEmail: string
  taskTitle: string
  sectionLabel: string
  changes: InternalWorkTaskChange[]
  dashboardUrl?: string
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function buildInternalWorkUpdateEmailHtml(params: InternalWorkUpdateEmailParams): string {
  const dashboardLink =
    params.dashboardUrl?.trim() || 'https://fathomlegal.com/admin/dashboard'

  const changeRows = params.changes
    .map(
      (change) => `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #eee;font-weight:600;color:#333;">${escapeHtml(change.field)}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #eee;color:#666;">${escapeHtml(change.from)}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #eee;color:#222;">${escapeHtml(change.to)}</td>
        </tr>
      `
    )
    .join('')

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
          table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 14px; }
          th { text-align: left; padding: 10px 12px; background: #fafafa; border-bottom: 2px solid #eee; color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 0.4px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Task updated</h1>
            <p style="margin:0;color:#666;font-size:14px;">Fathom Legal · Internal work</p>
          </div>
          <div class="content">
            <p>Hi ${escapeHtml(params.assigneeName)},</p>
            <p style="margin-top:12px;">A task assigned to you has been updated in the internal work register.</p>
            <div class="task-box">
              <div class="task-label">Task</div>
              <p class="task-text">${escapeHtml(params.taskTitle)}</p>
            </div>
            <div class="detail"><strong>Stream:</strong> ${escapeHtml(params.sectionLabel)}</div>
            <table>
              <thead>
                <tr>
                  <th>Field</th>
                  <th>Previous</th>
                  <th>Updated</th>
                </tr>
              </thead>
              <tbody>
                ${changeRows}
              </tbody>
            </table>
            <a href="${dashboardLink}" class="button">Open task register</a>
          </div>
          <div class="footer">Fathom Legal · Internal notification</div>
        </div>
      </body>
    </html>
  `
}

export async function sendInternalWorkUpdateEmail(
  params: InternalWorkUpdateEmailParams
): Promise<EmailSendResult> {
  const zoho = getZohoTransporter()
  if (!zoho) {
    return { emailSent: false, emailError: 'Email service is not configured' }
  }

  const email = params.assigneeEmail.trim().toLowerCase()
  if (!email) {
    return { emailSent: false, emailError: 'No recipient email provided' }
  }
  if (params.changes.length === 0) {
    return { emailSent: false, emailError: 'No changes to notify' }
  }

  const html = buildInternalWorkUpdateEmailHtml(params)
  const subject = `Task updated: ${params.taskTitle} | Fathom Legal`

  try {
    await zoho.transporter.sendMail({
      from: `"Fathom Legal" <${zoho.fromEmail}>`,
      to: email,
      subject,
      html,
    })
    return { emailSent: true, emailError: null }
  } catch (error) {
    console.error('Internal work update email error:', error)
    return {
      emailSent: false,
      emailError: error instanceof Error ? error.message : 'Failed to send email',
    }
  }
}
