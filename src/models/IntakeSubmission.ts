import mongoose, { Schema, Document } from 'mongoose'

export interface IIntakeSubmission extends Document {
  sessionId: string
  currentStep: number
  email: string
  
  // Step 1 Data
  selectedServices: string[]
  customNeeds?: string
  
  // Step 2 Data
  firstName?: string
  lastName?: string
  phone?: string
  company?: string
  heardAbout?: string
  matterDescription?: string
  
  // Step 3 Data
  selectedDate?: string
  selectedTime?: string
  confirmedEmail?: string
  calendlyEventId?: string
  
  // Timestamps
  createdAt: Date
  updatedAt: Date
  completedAt?: Date
}

const IntakeSubmissionSchema = new Schema<IIntakeSubmission>(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    currentStep: {
      type: Number,
      default: 1,
      min: 1,
      max: 4,
    },
    email: {
      type: String,
      sparse: true,
    },
    
    // Step 1
    selectedServices: [{
      type: String,
    }],
    customNeeds: String,
    
    // Step 2
    firstName: String,
    lastName: String,
    phone: String,
    company: String,
    heardAbout: String,
    matterDescription: String,
    
    // Step 3
    selectedDate: String,
    selectedTime: String,
    confirmedEmail: String,
    calendlyEventId: String,
    
    completedAt: Date,
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.IntakeSubmission || 
  mongoose.model<IIntakeSubmission>('IntakeSubmission', IntakeSubmissionSchema)
