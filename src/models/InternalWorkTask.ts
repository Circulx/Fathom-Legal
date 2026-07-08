import mongoose, { Document, Schema } from 'mongoose'

export type InternalWorkTaskSection = 'client' | 'admin'
export type InternalWorkTaskPriority = 'high' | 'med' | 'low'
export type InternalWorkTaskStatus = 'todo' | 'progress' | 'blocked' | 'done'

export interface IInternalWorkTask extends Document {
  taskNumber: number
  section: InternalWorkTaskSection
  category: string
  title: string
  assignee: string
  priority: InternalWorkTaskPriority
  due: string
  status: InternalWorkTaskStatus
  notes: string
  leadId?: string
  createdAt: Date
  updatedAt: Date
}

const InternalWorkTaskSchema = new Schema<IInternalWorkTask>(
  {
    taskNumber: { type: Number, required: true, unique: true },
    section: { type: String, enum: ['client', 'admin'], required: true },
    category: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    assignee: { type: String, default: '' },
    priority: { type: String, enum: ['high', 'med', 'low'], default: 'med' },
    due: { type: String, required: true },
    status: { type: String, enum: ['todo', 'progress', 'blocked', 'done'], default: 'todo' },
    notes: { type: String, default: '' },
    leadId: { type: String, default: '' },
  },
  { timestamps: true }
)

InternalWorkTaskSchema.index({ section: 1, status: 1, due: 1 })
InternalWorkTaskSchema.index({ assignee: 1 })

export default mongoose.models.InternalWorkTask ||
  mongoose.model<IInternalWorkTask>('InternalWorkTask', InternalWorkTaskSchema)
