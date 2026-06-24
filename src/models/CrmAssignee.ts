import mongoose, { Document, Schema } from 'mongoose'

export interface ICrmAssignee extends Document {
  name: string
  createdAt: Date
  updatedAt: Date
}

const CrmAssigneeSchema = new Schema<ICrmAssignee>(
  {
    name: { type: String, required: true, trim: true, unique: true },
  },
  { timestamps: true }
)

CrmAssigneeSchema.index({ name: 1 })

export default mongoose.models.CrmAssignee ||
  mongoose.model<ICrmAssignee>('CrmAssignee', CrmAssigneeSchema)
