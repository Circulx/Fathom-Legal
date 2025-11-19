import { NextRequest, NextResponse } from 'next/server'
import Order from '@/models/Order'
import connectDB from '@/lib/mongodb'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const body = await request.json()
    const { customer, items, subtotal, total, paymentMethod } = body

    console.log('📦 Creating order with data:', {
      customer: customer ? { name: customer.name, email: customer.email } : null,
      itemsCount: items?.length,
      subtotal,
      total,
      paymentMethod
    })

    // Validate required fields
    if (!customer || !items || !subtotal || !total || !paymentMethod) {
      console.error('❌ Missing required fields:', {
        hasCustomer: !!customer,
        hasItems: !!items,
        hasSubtotal: subtotal !== undefined,
        hasTotal: total !== undefined,
        hasPaymentMethod: !!paymentMethod
      })
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate customer fields
    if (!customer.name || !customer.email || !customer.phone || !customer.address || !customer.city || !customer.state || !customer.pincode) {
      console.error('❌ Invalid customer data:', customer)
      return NextResponse.json(
        { error: 'Invalid customer information' },
        { status: 400 }
      )
    }

    console.log('✅ Customer data validated:', {
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
      state: customer.state,
      pincode: customer.pincode
    })

    // Create new order
    const order = new Order({
      customer,
      items,
      subtotal,
      total,
      paymentMethod,
      paymentStatus: 'pending',
      status: 'pending'
    })

    await order.save()

    console.log('✅ Order created successfully:', {
      id: order._id,
      orderNumber: order.orderNumber,
      customer: order.customer, // Log the saved customer data
      customerName: order.customer?.name,
      customerEmail: order.customer?.email
    })

    return NextResponse.json({
      success: true,
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        total: order.total
      }
    })

  } catch (error: any) {
    console.error('❌ Error creating order:', error)
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    })
    return NextResponse.json(
      { 
        error: 'Failed to create order',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')
    const orderNumber = searchParams.get('orderNumber')
    const email = searchParams.get('email')

    // If orderId is provided, fetch single order
    if (orderId) {
      const order = await Order.findById(orderId)
      if (!order) {
        return NextResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        )
      }
      return NextResponse.json({
        success: true,
        order
      })
    }

    let query = {}
    
    if (orderNumber) {
      query = { orderNumber }
    } else if (email) {
      query = { 'customer.email': email }
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(50)

    return NextResponse.json({
      success: true,
      orders
    })

  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB()
    
    const body = await request.json()
    const { orderId, updates } = body

    if (!orderId || !updates) {
      return NextResponse.json(
        { error: 'Missing orderId or updates' },
        { status: 400 }
      )
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      updates,
      { new: true, runValidators: true }
    )

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      order
    })

  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    )
  }
}


