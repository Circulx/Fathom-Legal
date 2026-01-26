import mongoose, { Document, Schema } from 'mongoose'

export interface IOrderItem {
  templateId: string
  title: string
  price: number
  quantity: number
  fileName?: string
  fileSize?: number
  downloadExpiresAt?: Date  // Expiration timestamp for download link (24 hours from payment)
  isCustom?: boolean
  customOptionName?: string
  calendlyLink?: string
  contactEmail?: string
}

export interface ICustomer {
  name: string
  email: string
  phone: string
  address?: string
  city?: string
  state?: string
  pincode?: string
}

export interface IOrder extends Document {
  orderNumber: string
  customer: ICustomer
  items: IOrderItem[]
  subtotal: number
  total: number
  paymentMethod: string
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded'
  paymentId?: string
  razorpayOrderId?: string
  razorpayPaymentId?: string
  razorpaySignature?: string
  status: 'pending' | 'confirmed' | 'processing' | 'completed' | 'cancelled'
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const OrderSchema = new Schema<IOrder>({
  orderNumber: {
    type: String,
    required: false, // Auto-generated, not required in schema
    unique: true
  },
  customer: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      required: false,
      default: undefined,
      trim: true
    },
    city: {
      type: String,
      required: false,
      default: undefined,
      trim: true
    },
    state: {
      type: String,
      required: false,
      default: undefined,
      trim: true
    },
    pincode: {
      type: String,
      required: false,
      default: undefined,
      trim: true
    }
  },
  items: [{
    templateId: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    fileName: {
      type: String,
      required: false
    },
    fileSize: {
      type: Number,
      required: false
    },
    isCustom: {
      type: Boolean,
      required: false,
      default: false
    },
    customOptionName: {
      type: String,
      required: false,
      trim: true
    },
    calendlyLink: {
      type: String,
      required: false,
      trim: true
    },
    contactEmail: {
      type: String,
      required: false,
      trim: true
    }
  }],
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['razorpay', 'cash', 'bank_transfer', 'free']
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentId: {
    type: String,
    required: false
  },
  razorpayOrderId: {
    type: String,
    required: false
  },
  razorpayPaymentId: {
    type: String,
    required: false
  },
  razorpaySignature: {
    type: String,
    required: false
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'confirmed', 'processing', 'completed', 'cancelled'],
    default: 'pending'
  },
  notes: {
    type: String,
    required: false,
    trim: true
  }
}, {
  timestamps: true
})

// Generate order number before saving
OrderSchema.pre('save', function(next) {
  if (!this.orderNumber) {
    const timestamp = Date.now().toString()
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    this.orderNumber = `ORD-${timestamp}-${random}`
  }
  next()
})

// Clear the model cache if it exists to ensure fresh schema
if (mongoose.models.Order) {
  delete mongoose.models.Order
}

export default mongoose.model<IOrder>('Order', OrderSchema)





