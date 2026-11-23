import connectDB from '@/lib/mongodb'
import InternalWorkTask from '@/models/InternalWorkTask'
import InternalWorkAssociate from '@/models/InternalWorkAssociate'
import InternalWorkCategory from '@/models/InternalWorkCategory'
import Lead from '@/models/Lead'
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
  HeadingLevel,
} from 'docx'
import PDFDocument from 'pdfkit'

export type ClientReportTaskRow = {
  docketId: string
  title: string
  category: string
  assignee: string
  due: string
  completedAt: string
  notes: string
}

export type ClientReportData = {
  clientName: string
  company: string
  matter: string
  email: string
  monthLabel: string
  year: number
  month: number
  tasks: ClientReportTaskRow[]
  generatedAt: string
}

function pad2(n: number): string {
  return String(n).padStart(2, '0')
}

export function getMonthBounds(year: number, month: number) {
  const lastDay = new Date(year, month, 0).getDate()
  const monthStart = `${year}-${pad2(month)}-01`
  const monthEnd = `${year}-${pad2(month)}-${pad2(lastDay)}`
  const rangeStart = new Date(`${monthStart}T00:00:00.000Z`)
  const rangeEnd = new Date(`${monthEnd}T23:59:59.999Z`)
  const monthLabel = new Date(year, month - 1, 1).toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric',
  })
  return { monthStart, monthEnd, rangeStart, rangeEnd, monthLabel }
}

function formatDisplayDate(iso: string): string {
  if (!iso) return '—'
  const parsed = new Date(`${iso.slice(0, 10)}T12:00:00`)
  if (Number.isNaN(parsed.getTime())) return iso
  return parsed.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function docketId(section: 'client' | 'admin', taskNumber: number): string {
  return section === 'client' ? `CLI-${String(taskNumber).padStart(3, '0')}` : `PRC-${String(taskNumber).padStart(3, '0')}`
}

export async function buildClientMonthlyReport(
  leadId: string,
  year: number,
  month: number
): Promise<ClientReportData> {
  if (month < 1 || month > 12) {
    throw new Error('Month must be between 1 and 12')
  }

  await connectDB()

  const lead = await Lead.findById(leadId).lean<{
    first: string
    last: string
    company?: string
    matter?: string
    email: string
  }>()
  if (!lead) {
    throw new Error('Client not found')
  }

  const { monthStart, monthEnd, rangeStart, rangeEnd, monthLabel } = getMonthBounds(year, month)

  const rawTasks = await InternalWorkTask.find({
    section: 'client',
    leadId,
    status: 'done',
    $or: [
      { completedAt: { $gte: monthStart, $lte: monthEnd } },
      {
        $and: [
          { $or: [{ completedAt: '' }, { completedAt: { $exists: false } }] },
          { updatedAt: { $gte: rangeStart, $lte: rangeEnd } },
        ],
      },
    ],
  })
    .sort({ completedAt: 1, updatedAt: 1, taskNumber: 1 })
    .lean<
      {
        taskNumber: number
        section: 'client' | 'admin'
        category: string
        title: string
        assignee?: string
        due: string
        notes?: string
        completedAt?: string
        updatedAt: Date
      }[]
    >()

  const associateIds = [...new Set(rawTasks.map((t) => t.assignee).filter(Boolean) as string[])]
  const associates = await InternalWorkAssociate.find({ _id: { $in: associateIds } })
    .lean<{ _id: unknown; name: string }[]>()
  const associateMap = new Map(associates.map((a) => [String(a._id), a.name]))

  const categorySlugs = [...new Set(rawTasks.map((t) => t.category))]
  const categories = await InternalWorkCategory.find({
    section: 'client',
    slug: { $in: categorySlugs },
  }).lean<{ slug: string; label: string }[]>()
  const categoryMap = new Map(categories.map((c) => [c.slug, c.label]))

  const tasks: ClientReportTaskRow[] = rawTasks.map((task) => {
    const completed =
      task.completedAt?.trim() ||
      (task.updatedAt ? task.updatedAt.toISOString().slice(0, 10) : '')
    return {
      docketId: docketId(task.section, task.taskNumber),
      title: task.title,
      category: categoryMap.get(task.category) || task.category,
      assignee: task.assignee ? associateMap.get(task.assignee) || 'Unassigned' : 'Unassigned',
      due: formatDisplayDate(task.due),
      completedAt: formatDisplayDate(completed),
      notes: task.notes?.trim() || '—',
    }
  })

  return {
    clientName: `${lead.first} ${lead.last}`.trim(),
    company: lead.company && lead.company !== '—' ? lead.company : '—',
    matter: lead.matter && lead.matter !== '—' ? lead.matter : '—',
    email: lead.email,
    monthLabel,
    year,
    month,
    tasks,
    generatedAt: new Date().toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }),
  }
}

function tableHeaderRow(): TableRow {
  const headers = ['ID', 'Task', 'Category', 'Assignee', 'Due', 'Completed', 'Notes']
  return new TableRow({
    children: headers.map(
      (text) =>
        new TableCell({
          width: { size: 14, type: WidthType.PERCENTAGE },
          children: [
            new Paragraph({
              children: [new TextRun({ text, bold: true, size: 20 })],
            }),
          ],
        })
    ),
  })
}

export async function buildClientMonthlyReportDocx(data: ClientReportData): Promise<Buffer> {
  const metaLines = [
    `Client: ${data.clientName}`,
    `Company: ${data.company}`,
    `Matter: ${data.matter}`,
    `Email: ${data.email}`,
    `Period: ${data.monthLabel}`,
    `Generated: ${data.generatedAt}`,
  ]

  const children: (Paragraph | Table)[] = [
    new Paragraph({
      text: 'Monthly Client Task Report',
      heading: HeadingLevel.HEADING_1,
    }),
    ...metaLines.map(
      (line) =>
        new Paragraph({
          children: [new TextRun({ text: line, size: 22 })],
          spacing: { after: 80 },
        })
    ),
    new Paragraph({
      children: [
        new TextRun({
          text: `${data.tasks.length} completed task${data.tasks.length === 1 ? '' : 's'}`,
          bold: true,
          size: 22,
        }),
      ],
      spacing: { before: 200, after: 200 },
    }),
  ]

  if (data.tasks.length === 0) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: 'No completed tasks for this client in the selected month.', italics: true })],
      })
    )
  } else {
    children.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          tableHeaderRow(),
          ...data.tasks.map(
            (task) =>
              new TableRow({
                children: [task.docketId, task.title, task.category, task.assignee, task.due, task.completedAt, task.notes].map(
                  (text) =>
                    new TableCell({
                      children: [new Paragraph({ children: [new TextRun({ text, size: 18 })] })],
                    })
                ),
              })
          ),
        ],
      })
    )
  }

  const doc = new Document({
    sections: [{ children }],
  })

  return Packer.toBuffer(doc)
}

export async function buildClientMonthlyReportPdf(data: ClientReportData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4' })
    const chunks: Buffer[] = []

    doc.on('data', (chunk) => chunks.push(chunk as Buffer))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)

    doc.fontSize(18).fillColor('#7a1322').text('Monthly Client Task Report', { align: 'left' })
    doc.moveDown(0.5)
    doc.fontSize(10).fillColor('#1c1a18')
    doc.text(`Client: ${data.clientName}`)
    doc.text(`Company: ${data.company}`)
    doc.text(`Matter: ${data.matter}`)
    doc.text(`Email: ${data.email}`)
    doc.text(`Period: ${data.monthLabel}`)
    doc.text(`Generated: ${data.generatedAt}`)
    doc.moveDown(0.75)
    doc.fontSize(11).fillColor('#7a1322').text(`${data.tasks.length} completed task${data.tasks.length === 1 ? '' : 's'}`)
    doc.moveDown(0.5)

    if (data.tasks.length === 0) {
      doc.fontSize(10).fillColor('#736c63').text('No completed tasks for this client in the selected month.')
      doc.end()
      return
    }

    const columns = [
      { key: 'docketId', label: 'ID', width: 48 },
      { key: 'title', label: 'Task', width: 120 },
      { key: 'category', label: 'Category', width: 72 },
      { key: 'assignee', label: 'Assignee', width: 72 },
      { key: 'due', label: 'Due', width: 58 },
      { key: 'completedAt', label: 'Done', width: 58 },
    ] as const

    const startX = doc.page.margins.left
    let y = doc.y
    const rowHeight = 18
    const headerHeight = 20

    doc.fontSize(8).fillColor('#ffffff')
    doc.rect(startX, y, doc.page.width - startX * 2, headerHeight).fill('#7a1322')
    let x = startX + 4
    for (const col of columns) {
      doc.fillColor('#ffffff').text(col.label, x, y + 5, { width: col.width, lineBreak: false })
      x += col.width
    }
    y += headerHeight

    doc.fontSize(8).fillColor('#1c1a18')
    for (const task of data.tasks) {
      if (y > doc.page.height - 80) {
        doc.addPage()
        y = doc.page.margins.top
      }
      x = startX + 4
      const values = columns.map((col) => String(task[col.key]))
      const maxLines = Math.max(
        ...values.map((value, i) =>
          doc.heightOfString(value, { width: columns[i].width - 4 })
        )
      )
      const thisRowHeight = Math.max(rowHeight, maxLines + 6)

      doc.rect(startX, y, doc.page.width - startX * 2, thisRowHeight).stroke('#e7e1d9')
      for (let i = 0; i < columns.length; i++) {
        doc.text(values[i], x, y + 4, { width: columns[i].width - 4 })
        x += columns[i].width
      }
      y += thisRowHeight
      if (task.notes && task.notes !== '—') {
        if (y > doc.page.height - 60) {
          doc.addPage()
          y = doc.page.margins.top
        }
        doc.fontSize(7).fillColor('#736c63').text(`Notes: ${task.notes}`, startX + 4, y + 2, {
          width: doc.page.width - startX * 2 - 8,
        })
        y += doc.heightOfString(`Notes: ${task.notes}`, { width: doc.page.width - startX * 2 - 8 }) + 6
        doc.fontSize(8).fillColor('#1c1a18')
      }
    }

    doc.end()
  })
}

export function clientReportFilename(data: ClientReportData, ext: 'pdf' | 'docx'): string {
  const slug = data.clientName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return `client-tasks-${slug}-${data.year}-${pad2(data.month)}.${ext}`
}
