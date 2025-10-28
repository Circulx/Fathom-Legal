'use client'

import React, { useState, useEffect } from "react";
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
  AlertCircle
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { State, City } from 'country-state-city';

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
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export default function Checkout() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
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
  
  // Get Indian states and union territories
  const indianStates = State.getStatesOfCountry('IN');
  
  // Get cities based on selected state
  const getCitiesForState = (stateCode: string) => {
    if (!stateCode) return [];
    return City.getCitiesOfState('IN', stateCode);
  };
  
  const cities = getCitiesForState(customerInfo.state);

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

    if (!customerInfo.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!customerInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!customerInfo.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(customerInfo.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    if (!customerInfo.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!customerInfo.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!customerInfo.state.trim()) {
      newErrors.state = 'State is required';
    }
    if (!customerInfo.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(customerInfo.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits';
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
    
    // Clear city when state changes
    if (field === 'state') {
      setCustomerInfo(prev => ({ ...prev, city: '' }));
      if (errors.city) {
        setErrors(prev => ({ ...prev, city: '' }));
      }
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
      // Create order data for database
      const orderData = {
        customer: customerInfo,
        items: cartItems.map(item => ({
          templateId: item._id,
          title: item.title,
          price: item.price,
          quantity: item.quantity || 1,
          fileName: item.fileName,
          fileSize: item.fileSize
        })),
        subtotal: calculateSubtotal(),
        total: calculateTotal(),
        paymentMethod
      };

      // Store order in database
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const result = await response.json();
      console.log('Order created:', result);

      // For now, simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Clear cart after successful order
      localStorage.removeItem('fathom_cart');
      setOrderSuccess(true);

      // TODO: In a real implementation, you would:
      // 1. Integrate with Razorpay/PayU/other payment gateway
      // 2. Handle payment success/failure
      // 3. Update order with payment details
      // 4. Send confirmation email
      // 5. Generate invoice

    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar page="checkout" />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Successful!</h1>
              <p className="text-gray-600 mb-6">
                Thank you for your purchase. Your templates will be available for download shortly.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/templates')}
                  className="w-full bg-[#A5292A] text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  Continue Shopping
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
                  placeholder="Phone Number"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                  Address Line 1 *
                </label>
                <input
                  type="text"
                  value={customerInfo.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#A5292A] focus:border-[#A5292A] outline-none bg-white text-gray-900 ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Street Address"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                    State *
                  </label>
                  <select
                    value={customerInfo.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#A5292A] focus:border-[#A5292A] outline-none appearance-none cursor-pointer text-gray-900 bg-white ${
                      errors.state ? 'border-red-500' : 'border-gray-300'
                    }`}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 1rem center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '1.5em 1.5em',
                      paddingRight: '3rem'
                    }}
                  >
                    <option value="">Select State</option>
                    {indianStates.map((state) => (
                      <option key={state.isoCode} value={state.isoCode}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                    City *
                  </label>
                  <select
                    value={customerInfo.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    disabled={!customerInfo.state}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#A5292A] focus:border-[#A5292A] outline-none appearance-none cursor-pointer text-gray-900 bg-white ${
                      errors.city ? 'border-red-500' : 'border-gray-300'
                    } ${!customerInfo.state ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 1rem center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '1.5em 1.5em',
                      paddingRight: '3rem'
                    }}
                  >
                    <option value="">
                      {customerInfo.state ? 'Select City' : 'Select State First'}
                    </option>
                    {cities.map((city) => (
                      <option key={city.name} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    value={customerInfo.pincode}
                    onChange={(e) => handleInputChange('pincode', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#A5292A] focus:border-[#A5292A] outline-none bg-white text-gray-900 ${
                      errors.pincode ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Pincode"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                if (validateForm()) {
                  setCurrentStep(2);
                }
              }}
              className="w-full bg-[#A5292A] text-white py-4 px-6  font-semibold hover:bg-gray-800 transition-colors text-lg"
            >
              Continue to Payment Method
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
                Back to Address
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
              <h3 className="font-semibold text-gray-900 mb-4">Shipping Address</h3>
              <p className="text-gray-700">{customerInfo.name}</p>
              <p className="text-gray-700">{customerInfo.address}</p>
              <p className="text-gray-700">{customerInfo.city}, {customerInfo.state} {customerInfo.pincode}</p>
              <p className="text-gray-700">{customerInfo.email}</p>
              <p className="text-gray-700">{customerInfo.phone}</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-4">Payment Method</h3>
              <p className="text-gray-700 capitalize">{paymentMethod}</p>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setCurrentStep(2)}
                className="flex-1 bg-gray-200 text-gray-800 py-4 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Back to Payment
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
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping</span>
            <span className="font-medium text-green-600">FREE</span>
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
