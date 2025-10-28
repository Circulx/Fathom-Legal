import mongoose, { Document, Schema } from 'mongoose'

export interface IGalleryBlog extends Document {
  title: string
  description: string
  category: 'WEBINAR' | 'INTERVIEW' | 'FEATURE' | 'ARTICLE' | 'NEWS' | 'CASE_STUDY' | 'NEWSLETTER' | 'WHITEPAPER'
  content?: string
  externalUrl?: string
  imageUrl?: string
  logoUrl?: string
  slug?: string
  isDraft?: boolean
  publishedAt?: Date
  isActive: boolean
  isDeleted?: boolean
  createdAt: Date
  updatedAt: Date
}

const GalleryBlogSchema = new Schema<IGalleryBlog>(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true },
    description: { type: String, required: [true, 'Description is required'], trim: true },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'WEBINAR',
        'INTERVIEW',
        'FEATURE',
        'ARTICLE',
        'NEWS',
        'CASE_STUDY',
        'NEWSLETTER',
        'WHITEPAPER'
      ],
      default: 'ARTICLE'
    },
    content: { type: String },
    externalUrl: {
      type: String,
      validate: {
        validator: function (v: string) {
          if (v) return /^https?:\/\/.+/.test(v)
          return true
        },
        message: 'External URL must be a valid URL'
      }
    },
    imageUrl: { type: String },
    logoUrl: { type: String },
    slug: { type: String, unique: true, sparse: true },
    isDraft: { type: Boolean, default: false },
    publishedAt: { type: Date },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true }
)

// Ensure either content or externalUrl is provided
GalleryBlogSchema.pre('save', function (next) {
  if (!this.content && !this.externalUrl) {
    return next(new Error('Either content or external URL must be provided'))
  }
  next()
})

// 🔒 Ensure deleted blogs are automatically inactive
GalleryBlogSchema.pre(['findOneAndUpdate', 'updateOne'], function (next) {
  const update = this.getUpdate() as any
  if (update?.isDeleted === true) {
    // If using $set (recommended), modify it inside $set
    if (update.$set) {
      update.$set.isActive = false
    } else {
      update.isActive = false
    }
  }
  next()
})

// Force model refresh (important during hot reload)
if (mongoose.models.GalleryBlog) {
  delete mongoose.models.GalleryBlog
}

export default mongoose.model<IGalleryBlog>('GalleryBlog', GalleryBlogSchema)
