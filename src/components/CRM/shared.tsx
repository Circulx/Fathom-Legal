import { CRM_STATUSES, type CrmStatus } from './data'

export const CRM_INPUT_CLASS =
  'w-full border border-[#e7e1d9] rounded-[10px] px-3 py-2.5 text-sm bg-white text-[#1c1a18] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#7a1322] focus:ring-2 focus:ring-[#f6ecee]'

export const CRM_SELECT_CLASS =
  'w-full border border-[#e7e1d9] rounded-[10px] px-3 py-2.5 text-sm bg-white text-[#1c1a18] focus:outline-none focus:border-[#7a1322] focus:ring-2 focus:ring-[#f6ecee]'

export const CRM_TEXTAREA_CLASS =
  'w-full border border-[#e7e1d9] rounded-[10px] px-3 py-2.5 text-sm bg-white text-[#1c1a18] placeholder:text-[#9ca3af] resize-y min-h-[74px] focus:outline-none focus:border-[#7a1322] focus:ring-2 focus:ring-[#f6ecee]'

export const CRM_NOTE_INPUT_CLASS =
  'flex-1 border border-[#e7e1d9] rounded-full px-4 py-2.5 text-[13px] bg-white text-[#1c1a18] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#7a1322]'

export const STATUS_STYLES: Record<CrmStatus, string> = {
  prospect: 'bg-[#f5ecdb] text-[#9a6b1f]',
  booked: 'bg-[#f6ecee] text-[#7a1322]',
  proposal: 'bg-[#ece4f3] text-[#6b4d8f]',
  engagement: 'bg-[#e7eef0] text-[#2a6b73]',
  engaged: 'bg-[#e8f1ea] text-[#3f7a52]',
  open: 'bg-[#e9eef5] text-[#3a5a8a]',
  closed: 'bg-[#eee] text-[#8a8178]',
}

export const STATUS_SWATCH: Record<CrmStatus, string> = {
  prospect: 'bg-[#9a6b1f]',
  booked: 'bg-[#7a1322]',
  proposal: 'bg-[#6b4d8f]',
  engagement: 'bg-[#2a6b73]',
  engaged: 'bg-[#3f7a52]',
  open: 'bg-[#3a5a8a]',
  closed: 'bg-[#8a8178]',
}

export function StatusBadge({ status }: { status: CrmStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11.5px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${STATUS_STYLES[status]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${STATUS_SWATCH[status]}`} />
      {CRM_STATUSES[status]}
    </span>
  )
}
