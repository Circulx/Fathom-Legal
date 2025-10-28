import mongoose, { Document, Schema } from 'mongoose'

export interface ITemplate extends Document {
  title: string
  description: string
  category: string
  fileUrl: string
  fileName?: string
  fileSize?: number
  fileType?: string
  imageUrl?: string
  price: number
  uploadedBy: string
  isActive: boolean
  tags: string[]
  downloadCount?: number
  createdAt: Date
  updatedAt: Date
}

const TemplateSchema = new Schema<ITemplate>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Legal Documents', 'Contracts', 'Agreements', 'Forms', 'Other']
  },
  fileUrl: {
    type: String,
    required: [true, 'File URL is required']
  },
  fileName: {
    type: String,
    required: false
  },
  fileSize: {
    type: Number,
    required: false
  },
  fileType: {
    type: String,
    required: false
  },
  imageUrl: {
    type: String,
    required: false
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  uploadedBy: {
    type: String,
    ref: 'Admin',
    required: false // Make it optional to handle legacy data
  },
  isActive: {
    type: Boolean,
    default: true
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
})

export default mongoose.models.Template || mongoose.model<ITemplate>('Template', TemplateSchema)

