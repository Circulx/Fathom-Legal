import mongoose, { Schema, Document } from 'mongoose'

export interface IBookedSlot extends Document {
  date: string // Format: YYYY-MM-DD
  time: string // Format: HH:MM (e.g., 09:00, 09:20, 09:40, 10:00)
  email: string
  firstName: string
  lastName: string
  sessionId: string
  googleMeetLink: string
  services: string[]
  createdAt: Date
  updatedAt: Date
}

const BookedSlotSchema = new Schema<IBookedSlot>(
  {
    date: {
      type: String,
      required: true,
      index: true,
    },
    time: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    googleMeetLink: {
      type: String,
      default: 'https://meet.google.com/wkd-evwz-dxw',
    },
    services: [{
      type: String,
    }],
  },
  {
    timestamps: true,
  }
)

// Compound index for checking availability
BookedSlotSchema.index({ date: 1, time: 1 })

export default mongoose.models.BookedSlot || 
  mongoose.model<IBookedSlot>('BookedSlot', BookedSlotSchema)
