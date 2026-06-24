import mongoose, { Document, Schema } from 'mongoose'

export type LeadStatus =
  | 'prospect'
  | 'booked'
  | 'proposal'
  | 'engagement'
  | 'engaged'
  | 'open'
  | 'closed'

export interface ILeadTimelineItem {
  icon: string
  text: string
  when: string
}

export interface ILeadActionable {
  id: string
  text: string
  completed: boolean
  assignee: string
}

export interface ILead extends Document {
  intakeSessionId?: string
  first: string
  last: string
  email: string
  phone: string
  company: string
  source: string
  areas: string[]
  matter: string
  date: string
  time: string
  consultationDateIso?: string
  consultationTime24?: string
  googleMeetLink?: string
  status: LeadStatus
  timeline: ILeadTimelineItem[]
  actionables: ILeadActionable[]
  createdAt: Date
  updatedAt: Date
}

const TimelineSchema = new Schema<ILeadTimelineItem>(
  {
    icon: { type: String, required: true },
    text: { type: String, required: true },
    when: { type: String, required: true },
  },
  { _id: false }
)

const ActionableSchema = new Schema<ILeadActionable>(
  {
    id: { type: String, required: true },
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
    assignee: { type: String, default: 'Unassigned' },
  },
  { _id: false }
)

const LeadSchema = new Schema<ILead>(
  {
    intakeSessionId: { type: String, sparse: true, unique: true, index: true },
    first: { type: String, required: true, trim: true },
    last: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, default: '—', trim: true },
    company: { type: String, default: '—', trim: true },
    source: { type: String, required: true, trim: true },
    areas: { type: [String], default: ['Corporate advisory'] },
    matter: { type: String, default: '—', trim: true },
    date: { type: String, default: '—' },
    time: { type: String, default: '—' },
    consultationDateIso: { type: String, default: '' },
    consultationTime24: { type: String, default: '' },
    googleMeetLink: { type: String, default: '' },
    status: {
      type: String,
      enum: ['prospect', 'booked', 'proposal', 'engagement', 'engaged', 'open', 'closed'],
      default: 'prospect',
    },
    timeline: { type: [TimelineSchema], default: [] },
    actionables: { type: [ActionableSchema], default: [] },
  },
  { timestamps: true }
)

LeadSchema.index({ status: 1, createdAt: -1 })
LeadSchema.index({ email: 1, createdAt: -1 })

export default mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema)
