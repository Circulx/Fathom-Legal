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
  Download, 
  Calendar,
  X
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import emailjs from '@emailjs/browser';

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
  isCustom?: boolean;
  customOptionName?: string;
  calendlyLink?: string;
  contactEmail?: string;
  defaultCalendlyLink?: string;
  defaultContactEmail?: string;
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
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<CartItem | null>(null);
  const [contactFormData, setContactFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [downloadingTemplateId, setDownloadingTemplateId] = useState<string | null>(null);
  const [showDownloadNotification, setShowDownloadNotification] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailModalData, setEmailModalData] = useState<{ recipientEmail: string; templateTitle: string } | null>(null);
  
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
          fileSize: item.fileSize ? Number(item.fileSize) : undefined,
          isCustom: item.isCustom === true ? true : false, // Explicitly set to false if not true
          customOptionName: item.isCustom === true && item.customOptionName ? item.customOptionName : undefined, // Only include if actually custom
          calendlyLink: item.calendlyLink,
          contactEmail: item.contactEmail
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

  const handleDownload = async (templateId: string) => {
    // Show download notification
    setDownloadingTemplateId(templateId);
    setShowDownloadNotification(true);
    
    try {
      // Create download URL
      const downloadUrl = `/api/templates/${templateId}/download?email=${encodeURIComponent(customerEmail)}`;
      
      // Fetch the file as a blob
      const response = await fetch(downloadUrl);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Download failed' }));
        throw new Error(errorData.error || 'Download failed');
      }
      
      // Check if response is JSON (custom template response)
      const contentType = response.headers.get('Content-Type') || '';
      if (contentType.includes('application/json')) {
        // This is a custom template - get the JSON data
        const jsonData = await response.json();
        console.error('Custom template detected, cannot download file:', jsonData);
        alert(`This is a custom template. Please use the "Schedule" or "Email" button to contact us for customization.\n\nCustom Option: ${jsonData.customOptionName || 'N/A'}`);
        setShowDownloadNotification(false);
        setDownloadingTemplateId(null);
        return;
      }
      
      // Get the filename from Content-Disposition header or use default
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'template'; // Generic fallback without extension
      
      if (contentDisposition) {
        // Try to extract filename from Content-Disposition header
        // Handle both quoted and unquoted filenames
        const filenameMatch = contentDisposition.match(/filename\*?=['"]?([^'";\n]+)['"]?/i);
        if (filenameMatch && filenameMatch[1]) {
          // Decode URI-encoded filename if present (filename*=UTF-8''encoded)
          let extractedFilename = filenameMatch[1];
          if (extractedFilename.includes("''")) {
            // Handle RFC 5987 encoded filename (filename*=UTF-8''encoded)
            const parts = extractedFilename.split("''");
            if (parts.length > 1) {
              extractedFilename = decodeURIComponent(parts[parts.length - 1]);
            }
          } else {
            // Regular filename, decode if needed
            extractedFilename = decodeURIComponent(extractedFilename);
          }
          filename = extractedFilename;
        } else {
          // Try alternative format: filename="value"
          const altMatch = contentDisposition.match(/filename="([^"]+)"/);
          if (altMatch && altMatch[1]) {
            filename = altMatch[1];
          }
        }
      }
      
      // If still no extension, try to infer from Content-Type header
      if (!filename.includes('.')) {
        if (contentType) {
          const mimeToExt: { [key: string]: string } = {
            'application/pdf': '.pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
            'application/msword': '.doc',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
            'application/vnd.ms-excel': '.xls',
            'text/plain': '.txt',
            'application/zip': '.zip',
            'application/x-rar-compressed': '.rar'
          };
          const ext = mimeToExt[contentType.split(';')[0].trim()] || '';
          filename = filename + ext;
        }
      }
      
      // Convert response to blob
      const blob = await response.blob();
      
      // Create a temporary URL for the blob
      const blobUrl = window.URL.createObjectURL(blob);
      
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename; // Force download with filename
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      
      // Hide notification after a delay
      setTimeout(() => {
        setShowDownloadNotification(false);
        setDownloadingTemplateId(null);
      }, 3000);
    } catch (error) {
      console.error('Download error:', error);
      alert(`Download failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setShowDownloadNotification(false);
      setDownloadingTemplateId(null);
    }
  };

  const handleContactClick = (item: CartItem) => {
    setSelectedTemplate(item);
    setContactFormData({
      name: customerInfo.name || '',
      email: customerInfo.email || customerEmail || '',
      phone: customerInfo.phone || '',
      message: `I would like to discuss customization for: ${item.title}${item.customOptionName ? ` (${item.customOptionName})` : ''}`
    });
    setShowContactModal(true);
    setEmailStatus('idle');
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplate) return;

    setIsSendingEmail(true);
    setEmailStatus('idle');

    try {
      // EmailJS configuration
      const serviceId = 'service_hrntxm5';
      const templateId = 'template_kq2l3yk';
      const publicKey = '5suuijzXCHnnvG_YW';

      const templateParams = {
        from_name: contactFormData.name,
        from_email: contactFormData.email,
        phone: contactFormData.phone,
        message: contactFormData.message,
        to_email: selectedTemplate.contactEmail || selectedTemplate.defaultContactEmail || 'assist@fathomlegal.com',
        template_title: selectedTemplate.title,
        template_category: selectedTemplate.category,
        custom_option: selectedTemplate.customOptionName || 'Normal',
        calendly_link: selectedTemplate.calendlyLink || selectedTemplate.defaultCalendlyLink || ''
      };

      await emailjs.send(serviceId, templateId, templateParams, publicKey);
      
      setEmailStatus('success');
      setTimeout(() => {
        setShowContactModal(false);
        setEmailStatus('idle');
      }, 2000);
    } catch (error) {
      console.error('Error sending email:', error);
      setEmailStatus('error');
    } finally {
      setIsSendingEmail(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar page="checkout" />
        <div className="container mx-auto px-4 py-8 pt-24">
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
                            {item.isCustom && item.customOptionName && (
                              <p className="text-xs text-blue-600 font-medium">Custom: {item.customOptionName}</p>
                            )}
                            {item.quantity && item.quantity > 1 && (
                              <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {!item.isCustom && (
                            <button
                              onClick={() => handleDownload(item._id)}
                              className="flex items-center space-x-2 px-4 py-2 bg-[#A5292A] text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                            >
                              <Download className="w-4 h-4" />
                              <span>Download</span>
                            </button>
                          )}
                          {(item.isCustom || item.calendlyLink || item.contactEmail || item.defaultCalendlyLink || item.defaultContactEmail) && (
                            <div className="flex gap-2">
                              {item.calendlyLink || item.defaultCalendlyLink ? (
                                <button
                                  onClick={() => {
                                    const calendlyLink = item.calendlyLink || item.defaultCalendlyLink
                                    if (calendlyLink) {
                                      window.open(calendlyLink, '_blank')
                                    }
                                  }}
                                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                  <Calendar className="w-4 h-4" />
                                  <span>Schedule</span>
                                </button>
                              ) : null}
                              {item.contactEmail || item.defaultContactEmail ? (
                                <button
                                  onClick={() => {
                                    const contactEmail = item.contactEmail || item.defaultContactEmail
                                    if (contactEmail) {
                                      setEmailModalData({
                                        recipientEmail: contactEmail,
                                        templateTitle: item.title
                                      })
                                      setContactFormData({
                                        name: customerInfo.name || '',
                                        email: customerInfo.email || customerEmail || '',
                                        phone: customerInfo.phone || '',
                                        message: ''
                                      })
                                      setShowEmailModal(true)
                                    }
                                  }}
                                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                                >
                                  <Mail className="w-4 h-4" />
                                  <span>Email</span>
                                </button>
                              ) : null}
                              {(!item.calendlyLink && !item.defaultCalendlyLink && !item.contactEmail && !item.defaultContactEmail) && (
                                <button
                                  onClick={() => handleContactClick(item)}
                                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                  <Mail className="w-4 h-4" />
                                  <span>Contact</span>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
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

              {/* Contact Modal */}
              {showContactModal && selectedTemplate && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-gray-900">Contact Template Owner</h3>
                      <button
                        onClick={() => {
                          setShowContactModal(false);
                          setEmailStatus('idle');
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                    
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Template:</p>
                      <p className="font-semibold text-gray-900">{selectedTemplate.title}</p>
                      {selectedTemplate.customOptionName && (
                        <p className="text-sm text-blue-600 mt-1">Option: {selectedTemplate.customOptionName}</p>
                      )}
                    </div>

                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Your Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={contactFormData.name}
                          onChange={(e) => setContactFormData(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter your name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Your Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={contactFormData.email}
                          onChange={(e) => setContactFormData(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter your email"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Your Phone <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={contactFormData.phone}
                          onChange={(e) => setContactFormData(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter your phone number"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Message <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          required
                          rows={4}
                          value={contactFormData.message}
                          onChange={(e) => setContactFormData(prev => ({ ...prev, message: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Describe your customization requirements..."
                        />
                      </div>

                      {emailStatus === 'success' && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <p className="text-sm text-green-800">Email sent successfully! We'll get back to you soon.</p>
                        </div>
                      )}

                      {emailStatus === 'error' && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                          <AlertCircle className="w-5 h-5 text-red-600" />
                          <p className="text-sm text-red-800">Failed to send email. Please try again.</p>
                        </div>
                      )}

                      <div className="flex gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setShowContactModal(false);
                            setEmailStatus('idle');
                          }}
                          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                          disabled={isSendingEmail}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={isSendingEmail}
                        >
                          {isSendingEmail ? 'Sending...' : 'Send Email'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Email Modal */}
              {showEmailModal && emailModalData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-gray-900">Send Email</h3>
                      <button
                        onClick={() => {
                          setShowEmailModal(false);
                          setEmailModalData(null);
                          setEmailStatus('idle');
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                    
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">To:</p>
                      <p className="font-semibold text-gray-900">{emailModalData.recipientEmail}</p>
                      <p className="text-sm text-gray-600 mt-1">Template: {emailModalData.templateTitle}</p>
                    </div>

                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      setIsSendingEmail(true);
                      setEmailStatus('idle');

                      try {
                        const serviceId = 'service_hrntxm5';
                        const templateId = 'template_kq2l3yk';
                        const publicKey = '5suuijzXCHnnvG_YW';

                        const templateParams = {
                          from_name: contactFormData.name,
                          from_email: contactFormData.email,
                          phone: contactFormData.phone,
                          message: contactFormData.message,
                          to_email: emailModalData.recipientEmail,
                          template_title: emailModalData.templateTitle,
                          custom_option: 'Normal',
                          calendly_link: ''
                        };

                        await emailjs.send(serviceId, templateId, templateParams, publicKey);
                        
                        setEmailStatus('success');
                        setTimeout(() => {
                          setShowEmailModal(false);
                          setEmailModalData(null);
                          setEmailStatus('idle');
                          setContactFormData({
                            name: '',
                            email: '',
                            phone: '',
                            message: ''
                          });
                        }, 2000);
                      } catch (error) {
                        console.error('Error sending email:', error);
                        setEmailStatus('error');
                      } finally {
                        setIsSendingEmail(false);
                      }
                    }} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Your Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={contactFormData.name}
                          onChange={(e) => setContactFormData(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder="Enter your name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Your Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={contactFormData.email}
                          onChange={(e) => setContactFormData(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder="Enter your email"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Your Phone <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={contactFormData.phone}
                          onChange={(e) => setContactFormData(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder="Enter your phone number"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Message <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          required
                          rows={4}
                          value={contactFormData.message}
                          onChange={(e) => setContactFormData(prev => ({ ...prev, message: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder="Enter your message..."
                        />
                      </div>

                      {emailStatus === 'success' && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <p className="text-sm text-green-800">Email sent successfully! We'll get back to you soon.</p>
                        </div>
                      )}

                      {emailStatus === 'error' && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                          <AlertCircle className="w-5 h-5 text-red-600" />
                          <p className="text-sm text-red-800">Failed to send email. Please try again.</p>
                        </div>
                      )}

                      <div className="flex gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setShowEmailModal(false);
                            setEmailModalData(null);
                            setEmailStatus('idle');
                          }}
                          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                          disabled={isSendingEmail}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={isSendingEmail}
                        >
                          {isSendingEmail ? 'Sending...' : 'Send Email'}
                        </button>
                      </div>
                    </form>
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
        <div className="container mx-auto px-4 py-8 pt-24">
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
      
      <div className="container bg-white mx-auto px-4 py-8 pt-24">
      
       
       

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

      {/* Download Notification */}
      {showDownloadNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full animate-popup">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Download className="w-6 h-6 text-blue-600 animate-bounce" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Downloading Template</h3>
                <p className="text-sm text-gray-600 mt-1">Your template is being downloaded. Please check your downloads folder.</p>
              </div>
              <button
                onClick={() => {
                  setShowDownloadNotification(false);
                  setDownloadingTemplateId(null);
                }}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
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
