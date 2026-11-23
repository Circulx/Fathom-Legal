import mongoose, { Document, Schema } from 'mongoose'

export type InternalWorkCategorySection = 'client' | 'admin'

export interface IInternalWorkCategory extends Document {
  section: InternalWorkCategorySection
  slug: string
  label: string
  className: string
  createdAt: Date
  updatedAt: Date
}

const InternalWorkCategorySchema = new Schema<IInternalWorkCategory>(
  {
    section: { type: String, enum: ['client', 'admin'], required: true },
    slug: { type: String, required: true, trim: true, lowercase: true },
    label: { type: String, required: true, trim: true },
    className: { type: String, required: true, trim: true },
  },
  { timestamps: true }
)

InternalWorkCategorySchema.index({ section: 1, slug: 1 }, { unique: true })

export default mongoose.models.InternalWorkCategory ||
  mongoose.model<IInternalWorkCategory>('InternalWorkCategory', InternalWorkCategorySchema)
