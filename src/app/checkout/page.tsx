'use client'

import React, { useState, useEffect, Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import Image from "next/image";
import logo from "../../assets/cropped-icon-red-192x192.png";
import { 
  ShoppingCart, 
  CreditCard, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  Trash2,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Download
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface CartItem {
  _id: string;
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
  category: string;
  fileName?: string;
  fileSize?: number;
  quantity?: number;
}

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [razorpayMethod, setRazorpayMethod] = useState<'card' | 'upi' | 'netbanking' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [purchasedItems, setPurchasedItems] = useState<CartItem[]>([]);
  const [customerEmail, setCustomerEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(1);
  
  // Quantity management functions
  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCartItems(prev => 
      prev.map(item => 
        item._id === itemId 
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
    
    // Update localStorage
    const updatedCart = cartItems.map(item => 
      item._id === itemId 
        ? { ...item, quantity: newQuantity }
        : item
    );
    localStorage.setItem('fathom_cart', JSON.stringify(updatedCart));
  };

  const removeItem = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item._id !== itemId));
    
    // Update localStorage
    const updatedCart = cartItems.filter(item => item._id !== itemId);
    localStorage.setItem('fathom_cart', JSON.stringify(updatedCart));
  };

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      console.log('✅ Razorpay script loaded successfully');
    };
    script.onerror = () => {
      console.error('❌ Failed to load Razorpay script');
    };
    document.body.appendChild(script);

    return () => {
      const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existingScript && document.body.contains(existingScript)) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  useEffect(() => {
    // Load cart items from URL params or localStorage
    const cartParam = searchParams.get('cart');
    if (cartParam) {
      try {
        const items = JSON.parse(decodeURIComponent(cartParam));
        // Set default quantity to 1 if not specified
        const itemsWithQuantity = items.map((item: CartItem) => ({
          ...item,
          quantity: item.quantity || 1
        }));
        setCartItems(itemsWithQuantity);
      } catch (error) {
        console.error('Error parsing cart data:', error);
      }
    } else {
      // Fallback to localStorage
      const savedCart = localStorage.getItem('fathom_cart');
      if (savedCart) {
        try {
          const items = JSON.parse(savedCart);
          // Set default quantity to 1 if not specified
          const itemsWithQuantity = items.map((item: CartItem) => ({
            ...item,
            quantity: item.quantity || 1
          }));
          setCartItems(itemsWithQuantity);
        } catch (error) {
          console.error('Error parsing saved cart:', error);
        }
      }
    }

    // Handle payment success/error from callback URL
    const success = searchParams.get('success');
    const error = searchParams.get('error');
    const orderId = searchParams.get('orderId');
    const paymentId = searchParams.get('paymentId');

    if (success === 'true' && orderId) {
      // Payment successful via callback URL
      // Fetch order details and show success
      fetch(`/api/orders?orderId=${orderId}`)
        .then(res => res.json())
        .then(data => {
          if (data.order && data.order.items) {
            // Convert order items to cart items format for display
            const items = data.order.items.map((item: any) => ({
              _id: item.templateId,
              title: item.title,
              price: item.price,
              quantity: item.quantity,
              category: item.category || 'Legal Documents',
              imageUrl: item.imageUrl,
              fileName: item.fileName,
              fileSize: item.fileSize
            }));
            setPurchasedItems(items);
            setCustomerEmail(data.order.customer?.email || '');
            localStorage.removeItem('fathom_cart');
            setOrderSuccess(true);
          }
        })
        .catch(err => {
          console.error('Error fetching order:', err);
        });
    } else if (error) {
      // Payment failed or cancelled
      setIsProcessing(false);
      const errorMessages: Record<string, string> = {
        payment_cancelled: 'Payment was cancelled. Please try again.',
        payment_verification_failed: 'Payment verification failed. Please contact support.',
        invalid_signature: 'Payment verification failed. The payment signature is invalid. Please contact support.',
        payment_not_captured: 'Payment was not captured. Please try again.',
        verification_failed: 'Payment verification failed. Please contact support.',
        missing_parameters: 'Payment verification failed due to missing parameters.',
        payment_error: 'An error occurred during payment. Please try again.',
        order_not_found: 'Order not found. Please contact support with your order number.'
      };
      alert(errorMessages[error] || 'Payment failed. Please try again.');
    }
  }, [searchParams]);

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal();
  };

  const removeFromCart = (itemId: string) => {
    const updatedCart = cartItems.filter(item => item._id !== itemId);
    setCartItems(updatedCart);
    localStorage.setItem('fathom_cart', JSON.stringify(updatedCart));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Name validation - at least 2 characters, no numbers, allow spaces
    const nameRegex = /^[a-zA-Z\s]{2,}$/;
    if (!customerInfo.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (customerInfo.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (!nameRegex.test(customerInfo.name.trim())) {
      newErrors.name = 'Name can only contain letters and spaces';
    }

    // Email validation - improved regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!customerInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(customerInfo.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    } else if (customerInfo.email.length > 254) {
      newErrors.email = 'Email address is too long';
    }

    // Phone validation - Indian phone numbers (10 digits, can start with 0, can have +91)
    const phoneDigits = customerInfo.phone.replace(/\D/g, '');
    if (!customerInfo.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (phoneDigits.length < 10) {
      newErrors.phone = 'Phone number must be at least 10 digits';
    } else if (phoneDigits.length > 13) {
      newErrors.phone = 'Phone number is too long';
    } else {
      // Extract the last 10 digits (in case of country code prefix)
      const last10Digits = phoneDigits.slice(-10);
      // Indian mobile numbers: first digit must be 6-9, followed by 9 more digits
      if (!/^[6-9]\d{9}$/.test(last10Digits)) {
        newErrors.phone = 'Please enter a valid Indian mobile number (should start with 6, 7, 8, or 9)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePayment = async () => {
    if (!validateForm()) {
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setIsProcessing(true);

    try {
      // Normalize phone number (extract last 10 digits)
      const phoneDigits = customerInfo.phone.replace(/\D/g, '');
      const normalizedPhone = phoneDigits.slice(-10); // Get last 10 digits
      
      // Create order data for database
      const orderData = {
        customer: {
          ...customerInfo,
          phone: normalizedPhone // Use normalized phone number
        },
        items: cartItems.map(item => ({
          templateId: item._id,
          title: item.title,
          price: Number(item.price), // Ensure it's a number
          quantity: Number(item.quantity || 1), // Ensure it's a number
          fileName: item.fileName,
          fileSize: item.fileSize ? Number(item.fileSize) : undefined
        })),
        subtotal: Number(calculateSubtotal()), // Ensure it's a number
        total: Number(calculateTotal()), // Ensure it's a number
        paymentMethod: String(paymentMethod) // Ensure it's a string
      };

      console.log('📦 Order data being sent:', {
        customer: customerInfo,
        itemsCount: orderData.items.length,
        subtotal: orderData.subtotal,
        total: orderData.total,
        paymentMethod: orderData.paymentMethod
      });

      // Store order in database
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        console.error('❌ Order creation failed:', errorData);
        console.error('❌ Response status:', orderResponse.status);
        console.error('❌ Order data sent:', orderData);
        
        // Show detailed error message
        const errorMessage = errorData.error || errorData.details || 'Failed to create order';
        alert(`Order creation failed: ${errorMessage}`);
        throw new Error(errorMessage);
      }

      const orderResult = await orderResponse.json();
      const dbOrderId = orderResult.order.id;
      const totalAmount = calculateTotal();

      // Handle Razorpay payment
      if (paymentMethod === 'razorpay') {
        // Create Razorpay order
        const razorpayResponse = await fetch('/api/razorpay/create-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId: dbOrderId,
            amount: totalAmount,
            currency: 'INR',
            customer: customerInfo
          })
        });

        if (!razorpayResponse.ok) {
          const errorData = await razorpayResponse.json();
          console.error('❌ Razorpay order creation failed:', errorData);
          throw new Error(errorData.error || 'Failed to create payment order');
        }

        const razorpayData = await razorpayResponse.json();

        // Build callback URL for payment redirect
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
        const callbackUrl = `${baseUrl}/api/razorpay/callback?orderId=${dbOrderId}`;

        // Build logo URL
        const logoUrl = typeof window !== 'undefined' 
          ? `${window.location.origin}/cropped-icon-red-192x192.png`
          : '';

        // Initialize Razorpay checkout
        const options: any = {
          key: razorpayData.order.key,
          amount: razorpayData.order.amount,
          currency: razorpayData.order.currency,
          name: 'Fathom Legal',
          description: `Order for ${cartItems.length} service(s)`,
          image: logoUrl,
          order_id: razorpayData.order.id,
          callback_url: callbackUrl,
          handler: async function (response: any) {
            try {
              // Verify payment using new endpoint
              const verifyResponse = await fetch('/api/razorpay/verify-payment', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  orderId: dbOrderId
                })
              });

              if (verifyResponse.ok) {
                const verifyData = await verifyResponse.json();
                if (verifyData.success) {
                  // Store purchased items and email for download links
                  setPurchasedItems(cartItems);
                  setCustomerEmail(customerInfo.email);

                  // Clear cart after successful order
                  localStorage.removeItem('fathom_cart');
                  setOrderSuccess(true);
                } else {
                  throw new Error('Payment verification failed');
                }
              } else {
                throw new Error('Payment verification failed');
              }
            } catch (error) {
              console.error('Payment verification error:', error);
              alert('Payment verification failed. Please contact support.');
            } finally {
              setIsProcessing(false);
            }
          },
          prefill: {
            name: customerInfo.name,
            email: customerInfo.email,
            contact: customerInfo.phone
          },
          notes: {
            orderId: dbOrderId,
            customerEmail: customerInfo.email,
            customerName: customerInfo.name
          },
          theme: {
            color: '#A5292A'
          },
          modal: {
            ondismiss: function() {
              setIsProcessing(false);
            }
          }
        };

        // @ts-ignore - Razorpay is loaded dynamically
        if (!window.Razorpay) {
          alert('Payment gateway is loading. Please wait a moment and try again.');
          setIsProcessing(false);
          return;
        }

        try {
          const razorpay = new window.Razorpay(options);
          
          // Handle payment failure
          razorpay.on('payment.failed', function (response: any) {
            console.error('Payment failed:', response);
            alert(`Payment failed: ${response.error.description || 'Please try again'}`);
            setIsProcessing(false);
          });

          // Open Razorpay modal
          razorpay.open();
          
          console.log('Razorpay modal opened');
        } catch (error: any) {
          console.error('Error opening Razorpay:', error);
          alert(`Error opening payment gateway: ${error.message || 'Please try again'}`);
          setIsProcessing(false);
        }
      } else {
        // Fallback for other payment methods (if any)
        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
          await fetch('/api/orders', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              orderId: dbOrderId,
              updates: {
                paymentStatus: 'completed',
                status: 'confirmed'
              }
            })
          });
        } catch (error) {
          console.error('Error updating order status:', error);
        }

        // Store purchased items and email for download links
        setPurchasedItems(cartItems);
        setCustomerEmail(customerInfo.email);

        // Clear cart after successful order
        localStorage.removeItem('fathom_cart');
        setOrderSuccess(true);
        setIsProcessing(false);
      }

    } catch (error: any) {
      console.error('Payment error:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      // Show detailed error message
      const errorMessage = error.message || 'An unexpected error occurred. Please try again.';
      alert(`Error: ${errorMessage}`);
      setIsProcessing(false);
    }
  };

  const handleDownload = (templateId: string) => {
    const downloadUrl = `/api/templates/${templateId}/download?email=${encodeURIComponent(customerEmail)}`;
    window.open(downloadUrl, '_blank');
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar page="checkout" />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Successful!</h1>
                <p className="text-gray-600">
                  Thank you for your purchase. Download your templates now!
                </p>
              </div>

              {/* Download Links Section */}
              {purchasedItems.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Templates</h2>
                  <div className="space-y-3">
                    {purchasedItems.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-[#A5292A] transition-colors"
                      >
                        <div className="flex items-center space-x-4 flex-1">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="w-16 h-16 object-cover rounded"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded">
                              <FileText className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{item.title}</h3>
                            <p className="text-sm text-gray-600">{item.category}</p>
                            {item.quantity && item.quantity > 1 && (
                              <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDownload(item._id)}
                          className="flex items-center space-x-2 px-4 py-2 bg-[#A5292A] text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download</span>
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> Download links are valid for your purchased templates. 
                      Make sure to save your files after downloading.
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 border-t pt-6">
                <button
                  onClick={() => router.push('/templates')}
                  className="w-full bg-[#A5292A] text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={() => router.push(`/my-purchases`)}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  View All Purchases
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Go to Home
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar page="checkout" />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h1>
              <p className="text-gray-600 mb-6">
                Add some templates to your cart to proceed with checkout.
              </p>
              <button
                onClick={() => router.push('/templates')}
                className="bg-[#A5292A] text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Browse Templates
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Customer Information</h2>
              
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={customerInfo.name.split(' ')[0] || ''}
                    onChange={(e) => {
                      const lastName = customerInfo.name.split(' ').slice(1).join(' ');
                      handleInputChange('name', `${e.target.value} ${lastName}`.trim());
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#A5292A] focus:border-[#A5292A] outline-none bg-white text-gray-900 ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="First Name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={customerInfo.name.split(' ').slice(1).join(' ') || ''}
                    onChange={(e) => {
                      const firstName = customerInfo.name.split(' ')[0] || '';
                      handleInputChange('name', `${firstName} ${e.target.value}`.trim());
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#A5292A] focus:border-[#A5292A] outline-none bg-white text-gray-900 ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Last Name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#A5292A] focus:border-[#A5292A] outline-none bg-white text-gray-900 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Email Address"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#A5292A] focus:border-[#A5292A] outline-none bg-white text-gray-900 ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Phone Number (e.g., 9876543210 or +919876543210)"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

            </div>

            <button
              onClick={() => {
                if (validateForm()) {
                  setCurrentStep(3); // Skip payment method step, go directly to review
                }
              }}
              className="w-full bg-[#A5292A] text-white py-4 px-6  font-semibold hover:bg-gray-800 transition-colors text-lg"
            >
              Continue to Review
            </button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Method</h2>
              <p className="text-gray-600">Choose your preferred payment option</p>
            </div>

            <div className="space-y-4">
              <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors">
                <input
                  type="radio"
                  name="payment"
                  value="razorpay"
                  checked={paymentMethod === 'razorpay'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-4 w-5 h-5"
                />
                <div>
                  <p className="font-semibold text-gray-900 text-lg">Razorpay</p>
                  <p className="text-gray-600">Credit/Debit Card, UPI, Net Banking</p>
                </div>
              </label>

              <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors">
                <input
                  type="radio"
                  name="payment"
                  value="payu"
                  checked={paymentMethod === 'payu'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-4 w-5 h-5"
                />
                <div>
                  <p className="font-semibold text-gray-900 text-lg">PayU</p>
                  <p className="text-gray-600">Multiple payment options</p>
                </div>
              </label>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setCurrentStep(1)}
                className="flex-1 bg-gray-200 text-gray-800 py-4 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="flex-1 bg-black text-white py-4 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                Continue to Review
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Review & Place Order</h2>
              <p className="text-gray-600">Review your order details before placing</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-4">Customer Information</h3>
              <p className="text-gray-700"><strong>Name:</strong> {customerInfo.name}</p>
              <p className="text-gray-700"><strong>Email:</strong> {customerInfo.email}</p>
              <p className="text-gray-700"><strong>Phone:</strong> {customerInfo.phone}</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-4">Payment Method</h3>
              <p className="text-gray-700 capitalize">{paymentMethod}</p>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setCurrentStep(1)}
                className="flex-1 bg-gray-200 text-gray-800 py-4 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="flex-1 bg-[#A5292A] text-white py-4 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : `Place Order - ₹${calculateTotal()}`}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
        <Navbar page="checkout" />
      
      <div className="container bg-white mx-auto px-4 py-8">
      
       
       

        {/* Main Content - 2 Columns */}
        {/* Main Wrapper */}
<div className="flex justify-center  bg-gray-100 py-10">
  <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl">

    {/* Left Column - Step Content */}
    <div className="flex-1 bg-white shadow-sm p-8">
        <p className="text-3xl  text-gray-700 mb-4">Shopping Cart</p>
        <div className="border-b border-gray-500 mb-8"></div>
      {renderStepContent()}
    </div>

     {/* Right Column - Order Summary */}
     <div className="w-96 lg:w-[450px] space-y-6">
      {/* Order Summary */}
      <div className="bg-white shadow-sm p-6 ">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

         <div className="space-y-4 mb-6">
           {cartItems.map((item) => (
             <div key={item._id} className="flex items-center space-x-4">
               {item.imageUrl ? (
                 <img
                   src={item.imageUrl}
                   alt={item.title}
                   className="w-16 h-16 object-cover cursor-pointer hover:opacity-80 transition-opacity"
                   onClick={() => window.open(`/templates/${item._id}`, '_blank')}
                 />
               ) : (
                 <div 
                   className="w-16 h-16 bg-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors"
                   onClick={() => window.open(`/templates/${item._id}`, '_blank')}
                 >
                   <FileText className="w-8 h-8 text-gray-400" />
                 </div>
               )}
               <div className="flex-grow">
                 <h3 
                   className="font-semibold text-gray-900 text-sm cursor-pointer hover:text-[#A5292A] transition-colors"
                   onClick={() => window.open(`/templates/${item._id}`, '_blank')}
                 >
                   {item.title}
                 </h3>
                 <p className="text-xs text-gray-600">{item.category}</p>
                 
                 {/* Quantity Controls */}
                 <div className="flex items-center space-x-3 mt-2">
                   {/* Quantity Selector with Yellow Border */}
                   <div className="flex items-center border-2 border-yellow-400 rounded-lg bg-white px-2 py-1">
                     <button
                       onClick={() => updateQuantity(item._id, (item.quantity || 1) - 1)}
                       className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded transition-colors text-black"
                       disabled={item.quantity === 1}
                     >
                       <span className="text-sm font-bold text-black">−</span>
                     </button>
                     <span className="text-sm font-medium mx-4 min-w-[20px] text-center text-black">{item.quantity || 1}</span>
                     <button
                       onClick={() => updateQuantity(item._id, (item.quantity || 1) + 1)}
                       className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded transition-colors text-black"
                     >
                       <span className="text-sm font-bold text-black">+</span>
                     </button>
                   </div>
                   
                   {/* Vertical Separator */}
                   <div className="w-px h-6 bg-gray-300"></div>
                   
                   {/* Delete Link */}
                   <button
                     onClick={() => removeItem(item._id)}
                     className="text-blue-600 hover:text-blue-800 hover:underline transition-colors text-sm font-medium"
                   >
                     Delete
                   </button>
                 </div>
               </div>
               <div className="text-right">
                 <p className="font-semibold text-gray-900">₹{(item.price * (item.quantity || 1)).toFixed(2)}</p>
                 <p className="text-xs text-gray-500">₹{item.price} each</p>
               </div>
             </div>
           ))}
         </div>

        <div className="border-t border-gray-200 pt-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium text-black">₹{calculateSubtotal()}</span>
          </div>
          <div className="border-t border-gray-200 pt-2">
            <div className="flex justify-between">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-lg font-bold text-[#A5292A]">₹{calculateTotal()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Need Help */}
      <div className="bg-white shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Need Help?</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>Call us: +91 9625206671</p>
          <p>Mon-Fri: 9am-6pm IST</p>
        
        </div>
      </div>
    </div>

  </div>
</div>

      </div>

      <Footer />
    </div>
  );
}

export default function Checkout() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
