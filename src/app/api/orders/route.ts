import { NextRequest, NextResponse } from 'next/server'
import Order from '@/models/Order'
import connectDB from '@/lib/mongodb'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const body = await request.json()
    const { customer, items, subtotal, total, paymentMethod } = body

    // Validate required fields
    if (!customer || !items || !subtotal || !total || !paymentMethod) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

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

    return NextResponse.json({
      success: true,
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        total: order.total
      }
    })

  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const orderNumber = searchParams.get('orderNumber')
    const email = searchParams.get('email')

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


