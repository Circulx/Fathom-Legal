import mongoose, { Document, Schema } from 'mongoose'

export interface IGalleryItem extends Document {
  title: string
  description: string
  imageData: string[] // Array of image data URLs
  imageType: string
  isActive: boolean
}

const GalleryItemSchema = new Schema<IGalleryItem>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  imageData: {
    type: [String], // Array of strings
    required: [true, 'Image data is required'],
    validate: {
      validator: function(v: any) {
        // Handle both array and string (for legacy data)
        if (Array.isArray(v)) {
          return v.length > 0
        }
        // If it's a string, that's okay too (legacy support)
        return typeof v === 'string' && v.length > 0
      },
      message: 'At least one image is required'
    },
    // Transform legacy string to array on read
    get: function(v: any) {
      if (Array.isArray(v)) {
        return v
      }
      if (typeof v === 'string') {
        return [v]
      }
      return []
    }
  },
  imageType: {
    type: String,
    required: [true, 'Image type is required']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  // Ensure we can handle both old and new formats
  strict: true
})

// Database indexes for performance optimization
GalleryItemSchema.index({ isActive: 1, createdAt: -1 }) // Compound index for list queries

// Pre-save hook to ensure imageData is always an array
GalleryItemSchema.pre('save', function(next) {
  if (this.imageData && typeof this.imageData === 'string') {
    this.imageData = [this.imageData] as any
  }
  if (!Array.isArray(this.imageData)) {
    this.imageData = [] as any
  }
  next()
})

// Delete the model if it exists to force recompilation with new schema
if (mongoose.models.GalleryItem) {
  delete mongoose.models.GalleryItem
}

export default mongoose.model<IGalleryItem>('GalleryItem', GalleryItemSchema)
