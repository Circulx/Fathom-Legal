import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'
import crypto from 'crypto'
import Razorpay from 'razorpay'

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET

const razorpay = RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET
  ? new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET
    })
  : null

/**
 * Verify payment status and signature
 * This endpoint verifies the payment and redirects to success/failure page
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const razorpay_payment_id = searchParams.get('razorpay_payment_id')
    const razorpay_order_id = searchParams.get('razorpay_order_id')
    const razorpay_signature = searchParams.get('razorpay_signature')
    const orderId = searchParams.get('orderId')

    const baseUrl = request.nextUrl.origin

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !orderId) {
      return NextResponse.redirect(
        `${baseUrl}/checkout?error=missing_parameters&orderId=${orderId || ''}`
      )
    }

    await connectDB()

    // Retrieve order from database to get the order_id from server
    // As per Razorpay docs: "Retrieve the order_id from your server. Do not use the razorpay_order_id returned by Checkout."
    const dbOrder = await Order.findById(orderId)
    if (!dbOrder) {
      return NextResponse.redirect(
        `${baseUrl}/checkout?error=order_not_found&orderId=${orderId}`
      )
    }

    // Use the order_id stored in server (razorpayOrderId), not the one from checkout
    const serverOrderId = dbOrder.razorpayOrderId || razorpay_order_id

    // Verify payment signature using order_id from server
    const text = `${serverOrderId}|${razorpay_payment_id}`
    const generatedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET || '')
      .update(text)
      .digest('hex')

    if (generatedSignature !== razorpay_signature) {
      console.error('Invalid payment signature')
      return NextResponse.redirect(
        `${baseUrl}/checkout?error=invalid_signature&orderId=${orderId}`
      )
    }

    // Verify payment status with Razorpay API
    if (razorpay) {
      try {
        const payment = await razorpay.payments.fetch(razorpay_payment_id)
        
        if (payment.status === 'captured' || payment.status === 'authorized') {
          // Update order with payment details
          await Order.findByIdAndUpdate(
            orderId,
            {
              paymentStatus: 'completed',
              status: 'confirmed',
              razorpayPaymentId: razorpay_payment_id,
              razorpaySignature: razorpay_signature,
              paymentId: razorpay_payment_id
            },
            { new: true }
          )

          // Redirect to success page
          return NextResponse.redirect(
            `${baseUrl}/checkout?success=true&orderId=${orderId}&paymentId=${razorpay_payment_id}`
          )
        } else {
          // Payment not captured
          await Order.findByIdAndUpdate(
            orderId,
            {
              paymentStatus: 'failed',
              status: 'pending'
            }
          )

          return NextResponse.redirect(
            `${baseUrl}/checkout?error=payment_not_captured&orderId=${orderId}`
          )
        }
      } catch (error: any) {
        console.error('Error fetching payment from Razorpay:', error)
        // Still update order if signature is valid
        await Order.findByIdAndUpdate(
          orderId,
          {
            paymentStatus: 'completed',
            status: 'confirmed',
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
            paymentId: razorpay_payment_id
          }
        )

        return NextResponse.redirect(
          `${baseUrl}/checkout?success=true&orderId=${orderId}&paymentId=${razorpay_payment_id}`
        )
      }
    } else {
      // If Razorpay not configured, just verify signature and update order
      await Order.findByIdAndUpdate(
        orderId,
        {
          paymentStatus: 'completed',
          status: 'confirmed',
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          paymentId: razorpay_payment_id
        }
      )

      return NextResponse.redirect(
        `${baseUrl}/checkout?success=true&orderId=${orderId}&paymentId=${razorpay_payment_id}`
      )
    }
  } catch (error: any) {
    console.error('Payment verification error:', error)
    const orderId = request.nextUrl.searchParams.get('orderId')
    const baseUrl = request.nextUrl.origin
    return NextResponse.redirect(
      `${baseUrl}/checkout?error=verification_failed&orderId=${orderId || ''}`
    )
  }
}

/**
 * API endpoint to verify payment status (for AJAX calls)
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const body = await request.json()
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Retrieve order from database to get the order_id from server
    // As per Razorpay docs: "Retrieve the order_id from your server. Do not use the razorpay_order_id returned by Checkout."
    const dbOrder = await Order.findById(orderId)
    if (!dbOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Use the order_id stored in server (razorpayOrderId), not the one from checkout
    const serverOrderId = dbOrder.razorpayOrderId || razorpay_order_id

    // Verify payment signature using order_id from server
    const text = `${serverOrderId}|${razorpay_payment_id}`
    const generatedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET || '')
      .update(text)
      .digest('hex')

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      )
    }

    // Verify payment status with Razorpay API if available
    let paymentStatus = 'completed'
    if (razorpay) {
      try {
        const payment = await razorpay.payments.fetch(razorpay_payment_id)
        paymentStatus = payment.status
      } catch (error) {
        console.error('Error fetching payment status:', error)
      }
    }

    // Update order with payment details
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        paymentStatus: paymentStatus === 'captured' || paymentStatus === 'authorized' ? 'completed' : 'failed',
        status: paymentStatus === 'captured' || paymentStatus === 'authorized' ? 'confirmed' : 'pending',
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        paymentId: razorpay_payment_id
      },
      { new: true }
    )

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        paymentStatus: order.paymentStatus,
        status: order.status
      },
      paymentStatus
    })

  } catch (error: any) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to verify payment' },
      { status: 500 }
    )
  }
}

