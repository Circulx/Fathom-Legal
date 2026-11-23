import { NextRequest, NextResponse } from 'next/server'
import Order from '@/models/Order'
import connectDB from '@/lib/mongodb'

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    try {
      await connectDB()
      console.log('✅ Database connected')
    } catch (dbError: any) {
      console.error('❌ Database connection failed:', dbError)
      return NextResponse.json(
        { 
          error: 'Database connection failed',
          details: dbError.message || 'Unable to connect to database'
        },
        { status: 500 }
      )
    }
    
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
    // Note: subtotal and total can be 0 for free orders, so check for undefined/null instead of falsy
    if (!customer || !items || subtotal === undefined || subtotal === null || total === undefined || total === null || !paymentMethod) {
      console.error('❌ Missing required fields:', {
        hasCustomer: !!customer,
        hasItems: !!items,
        hasSubtotal: subtotal !== undefined && subtotal !== null,
        hasTotal: total !== undefined && total !== null,
        subtotalValue: subtotal,
        totalValue: total,
        hasPaymentMethod: !!paymentMethod,
        paymentMethodValue: paymentMethod
      })
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate customer fields (only name, email, phone required for digital products)
    if (!customer.name || !customer.email || !customer.phone) {
      console.error('❌ Invalid customer data:', customer)
      return NextResponse.json(
        { error: 'Invalid customer information. Name, email, and phone are required.' },
        { status: 400 }
      )
    }

    console.log('✅ Customer data validated:', {
      name: customer.name,
      email: customer.email,
      phone: customer.phone
    })

    // Validate items array
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Items array is required and must not be empty' },
        { status: 400 }
      )
    }

    // Validate each item has required fields
    for (const item of items) {
      if (!item.templateId || !item.title || item.price === undefined || !item.quantity) {
        return NextResponse.json(
          { error: `Invalid item data: ${JSON.stringify(item)}` },
          { status: 400 }
        )
      }
    }

    // Create new order
    console.log('📝 Creating order with validated data:', {
      customer: { name: customer.name, email: customer.email, phone: customer.phone },
      itemsCount: items.length,
      subtotal,
      total,
      paymentMethod
    })

    // Build customer object - only include address fields if they exist and are not empty
    const customerData: any = {
      name: customer.name,
      email: customer.email,
      phone: customer.phone
    }
    
    // Only add address fields if they exist (for backward compatibility)
    if (customer.address && customer.address.trim()) {
      customerData.address = customer.address.trim()
    }
    if (customer.city && customer.city.trim()) {
      customerData.city = customer.city.trim()
    }
    if (customer.state && customer.state.trim()) {
      customerData.state = customer.state.trim()
    }
    if (customer.pincode && customer.pincode.trim()) {
      customerData.pincode = customer.pincode.trim()
    }

    // For free orders (total === 0), auto-complete payment
    const isFreeOrder = total === 0
    const initialPaymentStatus = isFreeOrder ? 'completed' : 'pending'
    const initialStatus = isFreeOrder ? 'confirmed' : 'pending'

    const order = new Order({
      customer: customerData,
      items,
      subtotal,
      total,
      paymentMethod,
      paymentStatus: initialPaymentStatus,
      status: initialStatus
    })

    // Validate before saving
    const validationError = order.validateSync()
    if (validationError) {
      console.error('❌ Validation error before save:', validationError)
      return NextResponse.json(
        { 
          error: 'Validation error',
          details: validationError.message,
          errors: validationError.errors
        },
        { status: 400 }
      )
    }

    await order.save()

    if (isFreeOrder) {
      console.log('✅ Free order created and auto-completed:', {
        id: order._id,
        orderNumber: order.orderNumber,
        total: order.total
      })
    }

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
      stack: error.stack,
      errors: error.errors || error._message || 'No additional error details'
    })
    
    // Check if it's a validation error
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors || {}).map((err: any) => err.message).join(', ')
      return NextResponse.json(
        { 
          error: 'Validation error',
          details: validationErrors || error.message,
          message: 'Please check your order data and try again.'
        },
        { status: 400 }
      )
    }
    
    // Check if it's a duplicate key error (orderNumber)
    if (error.code === 11000) {
      return NextResponse.json(
        { 
          error: 'Duplicate order number',
          details: 'An order with this number already exists. Please try again.',
          message: 'Order creation failed due to duplicate order number.'
        },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to create order',
        details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
        message: error.message || 'An unexpected error occurred while creating the order.'
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


