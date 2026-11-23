import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import {
  buildClientMonthlyReport,
  buildClientMonthlyReportDocx,
  buildClientMonthlyReportPdf,
  clientReportFilename,
} from '@/lib/internal-work-client-report'

export const dynamic = 'force-dynamic'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user?.role !== 'admin' && session.user?.role !== 'super-admin')) {
    return null
  }
  return session
}

export async function GET(request: NextRequest) {
  try {
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const leadId = searchParams.get('leadId')?.trim()
    const format = searchParams.get('format')?.trim().toLowerCase()
    const year = parseInt(searchParams.get('year') || '', 10)
    const month = parseInt(searchParams.get('month') || '', 10)

    if (!leadId) {
      return NextResponse.json({ error: 'Client (leadId) is required' }, { status: 400 })
    }
    if (!format || !['pdf', 'docx'].includes(format)) {
      return NextResponse.json({ error: 'Format must be pdf or docx' }, { status: 400 })
    }
    if (!Number.isFinite(year) || !Number.isFinite(month)) {
      return NextResponse.json({ error: 'Year and month are required' }, { status: 400 })
    }

    const report = await buildClientMonthlyReport(leadId, year, month)
    const filename = clientReportFilename(report, format as 'pdf' | 'docx')

    if (format === 'pdf') {
      const buffer = await buildClientMonthlyReportPdf(report)
      return new NextResponse(new Uint8Array(buffer), {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      })
    }

    const buffer = await buildClientMonthlyReportDocx(report)
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('Client report export error:', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    const status = message.includes('not found') ? 404 : message.includes('Month') ? 400 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
