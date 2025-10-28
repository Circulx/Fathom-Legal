import mongoose, { Document, Schema } from 'mongoose'

export interface IThoughtLeadershipPhoto extends Document {
  title: string
  description?: string
  imageUrl: string
  category?: string
  isActive: boolean
  displayOrder?: number
  createdAt: Date
  updatedAt: Date
}

const ThoughtLeadershipPhotoSchema = new Schema<IThoughtLeadershipPhoto>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required']
  },
  category: {
    type: String,
    trim: true,
    default: 'General'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  displayOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

export default mongoose.models.ThoughtLeadershipPhoto || mongoose.model<IThoughtLeadershipPhoto>('ThoughtLeadershipPhoto', ThoughtLeadershipPhotoSchema)




