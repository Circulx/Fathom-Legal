import { NextRequest, NextResponse } from 'next/server'

/**
 * Callback URL handler for Razorpay payment redirects
 * This handles both success and failure cases when user is redirected back
 * from Razorpay payment page
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const razorpay_payment_id = searchParams.get('razorpay_payment_id')
    const razorpay_order_id = searchParams.get('razorpay_order_id')
    const razorpay_signature = searchParams.get('razorpay_signature')
    const orderId = searchParams.get('orderId')

    const baseUrl = request.nextUrl.origin

    // If payment was cancelled or failed
    if (!razorpay_payment_id) {
      return NextResponse.redirect(
        `${baseUrl}/checkout?error=payment_cancelled&orderId=${orderId || ''}`
      )
    }

    // Verify payment signature
    if (razorpay_payment_id && razorpay_order_id && razorpay_signature && orderId) {
      // Redirect to verification endpoint
      return NextResponse.redirect(
        `${baseUrl}/api/razorpay/verify-payment?razorpay_payment_id=${razorpay_payment_id}&razorpay_order_id=${razorpay_order_id}&razorpay_signature=${razorpay_signature}&orderId=${orderId}`
      )
    }

    // If missing required parameters, redirect to checkout with error
    return NextResponse.redirect(
      `${baseUrl}/checkout?error=payment_verification_failed&orderId=${orderId || ''}`
    )
  } catch (error: any) {
    console.error('Callback error:', error)
    const baseUrl = request.nextUrl.origin
    return NextResponse.redirect(
      `${baseUrl}/checkout?error=payment_error`
    )
  }
}

