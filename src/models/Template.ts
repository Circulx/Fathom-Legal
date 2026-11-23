import mongoose, { Document, Schema } from 'mongoose'

export interface ICustomOption {
  name: string
  price: number
  description: string
  features: string[]
  calendlyLink?: string
  contactEmail?: string
}

export interface ITemplate extends Document {
  title: string
  description: string
  category: string
  fileUrl: string
  fileName?: string
  fileSize?: number
  fileType?: string
  imageUrl?: string // Legacy field - kept for backward compatibility
  imageData?: string // Base64 data URL for image (preferred)
  price: number
  uploadedBy: string
  isActive: boolean
  tags: string[]
  downloadCount?: number
  isCustom?: boolean
  customOptions?: ICustomOption[]
  defaultCalendlyLink?: string
  defaultContactEmail?: string
  countries?: string[] // Array of ISO country codes (e.g., ['IN', 'US'])
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
  imageData: {
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
  }],
  isCustom: {
    type: Boolean,
    default: false
  },
  customOptions: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    description: {
      type: String,
      required: false,
      trim: true
    },
    features: [{
      type: String,
      trim: true
    }],
    calendlyLink: {
      type: String,
      required: [true, 'Calendly link is required for custom options'],
      trim: true
    },
    contactEmail: {
      type: String,
      required: [true, 'Contact email is required for custom options'],
      trim: true
    }
  }],
  defaultCalendlyLink: {
    type: String,
    required: [true, 'Default Calendly link is required'],
    trim: true
  },
  defaultContactEmail: {
    type: String,
    required: [true, 'Default contact email is required'],
    trim: true
  },
  countries: [{
    type: String,
    trim: true,
    uppercase: true
  }]
}, {
  timestamps: true
})

// Database indexes for performance optimization
TemplateSchema.index({ isActive: 1, category: 1, createdAt: -1 }) // Compound index for list queries with filtering and sorting

export default mongoose.models.Template || mongoose.model<ITemplate>('Template', TemplateSchema)

