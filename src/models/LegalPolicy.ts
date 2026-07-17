import mongoose, { Document, Schema } from 'mongoose'

export interface ILegalPolicy extends Document {
  slug: string
  title: string
  heroTitle: string
  navbarPage: string
  content: string
  createdAt: Date
  updatedAt: Date
}

const LegalPolicySchema = new Schema<ILegalPolicy>(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    heroTitle: { type: String, required: true, trim: true },
    navbarPage: { type: String, required: true, trim: true },
    content: { type: String, required: true, default: '' },
  },
  { timestamps: true }
)

LegalPolicySchema.index({ slug: 1 })

if (mongoose.models.LegalPolicy) {
  delete mongoose.models.LegalPolicy
}

export default mongoose.model<ILegalPolicy>('LegalPolicy', LegalPolicySchema)
