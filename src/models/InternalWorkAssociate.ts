import mongoose, { Document, Schema } from 'mongoose'

export interface IInternalWorkAssociate extends Document {
  name: string
  role: string
  email?: string
  createdAt: Date
  updatedAt: Date
}

const InternalWorkAssociateSchema = new Schema<IInternalWorkAssociate>(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true, default: 'Associate' },
    email: { type: String, trim: true, lowercase: true, default: '' },
  },
  { timestamps: true }
)

InternalWorkAssociateSchema.index({ name: 1 })

export default mongoose.models.InternalWorkAssociate ||
  mongoose.model<IInternalWorkAssociate>('InternalWorkAssociate', InternalWorkAssociateSchema)
