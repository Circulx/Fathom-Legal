import mongoose, { Document, Schema } from 'mongoose'

export interface IGalleryItem extends Document {
  title: string
  description: string
  imageData: string
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
    type: String,
    required: [true, 'Image data is required']
  },
  imageType: {
    type: String,
    required: [true, 'Image type is required']
  },
  isActive: {
    type: Boolean,
    default: true
  }
})

export default mongoose.models.GalleryItem || mongoose.model<IGalleryItem>('GalleryItem', GalleryItemSchema)
