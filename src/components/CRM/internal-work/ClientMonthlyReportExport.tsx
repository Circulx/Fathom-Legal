'use client'

import { useEffect, useMemo, useState } from 'react'
import { Download, FileText } from 'lucide-react'
import type { CrmLead } from '@/components/CRM/data'

type MonthOption = { value: string; label: string; year: number; month: number }

function monthOptionsForLead(lead: CrmLead | undefined): MonthOption[] {
  if (!lead) return []

  const now = new Date()
  let startDate: Date | null = null

  if (lead.associationStartDate?.trim()) {
    startDate = new Date(`${lead.associationStartDate.slice(0, 10)}T12:00:00`)
  }

  if (!startDate || Number.isNaN(startDate.getTime())) {
    return []
  }

  let endDate = now
  if (lead.associationEndDate?.trim()) {
    const associationEnd = new Date(`${lead.associationEndDate.slice(0, 10)}T12:00:00`)
    if (!Number.isNaN(associationEnd.getTime()) && associationEnd < now) {
      endDate = associationEnd
    }
  }

  if (endDate < startDate) {
    return []
  }

  const options: MonthOption[] = []
  let year = endDate.getFullYear()
  let month = endDate.getMonth()
  const startYear = startDate.getFullYear()
  const startMonth = startDate.getMonth()

  while (year > startYear || (year === startYear && month >= startMonth)) {
    options.push({
      value: `${year}-${month + 1}`,
      label: new Date(year, month, 1).toLocaleDateString('en-IN', {
        month: 'long',
        year: 'numeric',
      }),
      year,
      month: month + 1,
    })
    month -= 1
    if (month < 0) {
      month = 11
      year -= 1
    }
  }

  return options
}

export default function ClientMonthlyReportExport({ leads }: { leads: CrmLead[] }) {
  const [leadId, setLeadId] = useState('')
  const [period, setPeriod] = useState('')
  const [downloading, setDownloading] = useState<'pdf' | 'docx' | null>(null)
  const [error, setError] = useState('')

  const clientLeads = useMemo(
    () =>
      [...leads].sort((a, b) =>
        `${a.first} ${a.last}`.localeCompare(`${b.first} ${b.last}`)
      ),
    [leads]
  )

  const selectedLead = useMemo(
    () => clientLeads.find((lead) => lead.id === leadId),
    [clientLeads, leadId]
  )

  const months = useMemo(() => monthOptionsForLead(selectedLead), [selectedLead])

  useEffect(() => {
    if (months.length === 0) {
      setPeriod('')
      return
    }
    if (!months.some((m) => m.value === period)) {
      setPeriod(months[0].value)
    }
  }, [months, period])

  const selectedPeriod = months.find((m) => m.value === period)

  const downloadReport = async (format: 'pdf' | 'docx') => {
    if (!leadId || !selectedPeriod) {
      setError(
        selectedLead && months.length === 0
          ? 'Set an association start date on this client before exporting.'
          : 'Select a client and month.'
      )
      return
    }

    setDownloading(format)
    setError('')
    try {
      const params = new URLSearchParams({
        leadId,
        year: String(selectedPeriod.year),
        month: String(selectedPeriod.month),
        format,
      })
      const response = await fetch(`/api/admin/internal-work/client-report?${params}`)
      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to generate report')
      }

      const blob = await response.blob()
      const disposition = response.headers.get('Content-Disposition') || ''
      const match = disposition.match(/filename=\"?([^\";]+)\"?/)
      const filename = match?.[1] || `client-tasks.${format}`

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      link.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download report')
    } finally {
      setDownloading(null)
    }
  }

  return (
    <div className="bg-white border border-[#e7e1d9] rounded-[10px] p-4 shadow-sm">
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-[220px] flex-1">
          <label className="block text-[11px] uppercase tracking-wide text-[#736c63] font-semibold mb-1.5">
            Client
          </label>
          <select
            value={leadId}
            onChange={(e) => {
              setLeadId(e.target.value)
              setError('')
            }}
            className="w-full text-[12.5px] px-2.5 py-2 border border-[#e7e1d9] rounded-[6px] bg-white text-[#1c1a18]"
          >
            <option value="">Select client…</option>
            {clientLeads.map((lead) => (
              <option key={lead.id} value={lead.id}>
                {lead.first} {lead.last}
                {lead.company && lead.company !== '—' ? ` · ${lead.company}` : ''}
              </option>
            ))}
          </select>
        </div>
        <div className="min-w-[180px]">
          <label className="block text-[11px] uppercase tracking-wide text-[#736c63] font-semibold mb-1.5">
            Month
          </label>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            disabled={!leadId || months.length === 0}
            className="w-full text-[12.5px] px-2.5 py-2 border border-[#e7e1d9] rounded-[6px] bg-white text-[#1c1a18] disabled:opacity-50"
          >
            {!leadId ? (
              <option value="">Select client first</option>
            ) : months.length === 0 ? (
              <option value="">No association start date</option>
            ) : (
              months.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))
            )}
          </select>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={!leadId || !selectedPeriod || downloading !== null}
            onClick={() => void downloadReport('pdf')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-[6px] border border-[#e7e1d9] bg-white text-[#1c1a18] text-[12.5px] font-semibold hover:border-[#7a1322] hover:text-[#7a1322] disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {downloading === 'pdf' ? 'Generating…' : 'Download PDF'}
          </button>
          <button
            type="button"
            disabled={!leadId || !selectedPeriod || downloading !== null}
            onClick={() => void downloadReport('docx')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-[6px] bg-[#7a1322] text-white text-[12.5px] font-semibold hover:bg-[#5c0e1a] disabled:opacity-50"
          >
            <FileText className="w-4 h-4" />
            {downloading === 'docx' ? 'Generating…' : 'Download Word'}
          </button>
        </div>
      </div>
      <p className="text-[12px] text-[#736c63] mt-3">
        Exports completed client deliverables linked to the selected client for that month. Months
        run from the client&apos;s association start date
        {selectedLead?.associationEndDate ? ' through association end' : ' through today'}.
      </p>
      {error && <p className="text-[12px] text-[#8C3B3B] font-medium mt-2">{error}</p>}
    </div>
  )
}
