import mongoose, { Document, Schema } from 'mongoose'

export interface IBlog extends Document {
  title: string
  description: string
  category: 'WEBINAR' | 'INTERVIEW' | 'FEATURE' | 'ARTICLE' | 'NEWS'
  content?: string // For direct blog uploads
  externalUrl?: string // For external blog links
  imageUrl?: string
  logoUrl?: string // For partner logos (Lawctopus, SuperLawyer, etc.)
  slug?: string // Auto-generated from title for content blogs
  isDraft?: boolean // For future draft functionality
  publishedAt?: Date // When blog was published
  isActive: boolean
  isDeleted?: boolean // For soft delete functionality
  createdAt: Date
  updatedAt: Date
}

const BlogSchema = new Schema<IBlog>({
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
    enum: ['WEBINAR', 'INTERVIEW', 'FEATURE', 'ARTICLE', 'NEWS'],
    default: 'ARTICLE'
  },
  content: {
    type: String,
    required: false
  },
  externalUrl: {
    type: String,
    required: false,
    validate: {
      validator: function(v: string) {
        // If externalUrl is provided, it should be a valid URL
        if (v) {
          return /^https?:\/\/.+/.test(v)
        }
        return true
      },
      message: 'External URL must be a valid URL'
    }
  },
  imageUrl: {
    type: String,
    required: false
  },
  logoUrl: {
    type: String,
    required: false
  },
  slug: {
    type: String,
    required: false,
    unique: true,
    sparse: true // Allows multiple null values
  },
  isDraft: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date,
    required: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

// Database indexes for performance optimization
BlogSchema.index({ isActive: 1, isDeleted: 1, category: 1, createdAt: -1 }) // Compound index for list queries with filtering and sorting
BlogSchema.index({ slug: 1 }) // Index for slug lookups 

// Ensure either content or externalUrl is provided
BlogSchema.pre('save', function(next) {
  if (!this.content && !this.externalUrl) {
    return next(new Error('Either content or external URL must be provided'))
  }
  next()
})

// Force model refresh to ensure schema changes are applied
if (mongoose.models.Blog) {
  delete mongoose.models.Blog
}

export default mongoose.model<IBlog>('Blog', BlogSchema)
