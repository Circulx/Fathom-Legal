import mongoose, { Document, Schema } from 'mongoose'

export interface IClientLogo extends Document {
  name: string
  imageUrl: string
  websiteUrl?: string
  isActive: boolean
  displayOrder: number
  createdAt: Date
  updatedAt: Date
}

const ClientLogoSchema = new Schema<IClientLogo>(
  {
    name: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true,
    },
    imageUrl: {
      type: String,
      required: [true, 'Logo image is required'],
    },
    websiteUrl: {
      type: String,
      trim: true,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

ClientLogoSchema.index({ isActive: 1, displayOrder: 1, createdAt: -1 })

export default mongoose.models.ClientLogo ||
  mongoose.model<IClientLogo>('ClientLogo', ClientLogoSchema)
