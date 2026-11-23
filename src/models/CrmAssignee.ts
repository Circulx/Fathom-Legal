import mongoose, { Document, Schema } from 'mongoose'

export interface ICrmAssignee extends Document {
  name: string
  email?: string
  emails?: string[]
  createdAt: Date
  updatedAt: Date
}

const CrmAssigneeSchema = new Schema<ICrmAssignee>(
  {
    name: { type: String, required: true, trim: true, unique: true },
    email: { type: String, trim: true, lowercase: true, default: '' },
    emails: { type: [String], default: [] },
  },
  { timestamps: true }
)

CrmAssigneeSchema.index({ name: 1 })

function getCrmAssigneeModel() {
  const existing = mongoose.models.CrmAssignee as mongoose.Model<ICrmAssignee> | undefined

  if (existing) {
    if (!existing.schema.path('email')) {
      existing.schema.add({
        email: { type: String, trim: true, lowercase: true, default: '' },
      })
    }
    if (!existing.schema.path('emails')) {
      existing.schema.add({
        emails: { type: [String], default: [] },
      })
    }
    return existing
  }

  return mongoose.model<ICrmAssignee>('CrmAssignee', CrmAssigneeSchema)
}

export default getCrmAssigneeModel()
