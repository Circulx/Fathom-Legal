import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'
import crypto from 'crypto'

// Webhook handler for Razorpay payment events
export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const body = await request.text()
    const signature = request.headers.get('x-razorpay-signature')
    
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      )
    }

    // Verify webhook signature
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || ''
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex')

    if (signature !== expectedSignature) {
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 400 }
      )
    }

    const event = JSON.parse(body)

    // Handle payment success event
    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity
      const orderId = payment.notes?.orderId

      if (orderId) {
        await Order.findByIdAndUpdate(
          orderId,
          {
            paymentStatus: 'completed',
            status: 'confirmed',
            razorpayPaymentId: payment.id,
            paymentId: payment.id
          }
        )
      }
    }

    // Handle payment failure event
    if (event.event === 'payment.failed') {
      const payment = event.payload.payment.entity
      const orderId = payment.notes?.orderId

      if (orderId) {
        await Order.findByIdAndUpdate(
          orderId,
          {
            paymentStatus: 'failed'
          }
        )
      }
    }

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

