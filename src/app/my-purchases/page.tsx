'use client'

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { 
  Download, 
  FileText, 
  Mail, 
  Calendar,
  Package,
  CheckCircle,
  AlertCircle,
  Search,
  X
} from "lucide-react";
import emailjs from '@emailjs/browser';

interface OrderItem {
  templateId: string;
  title: string;
  price: number;
  quantity: number;
  fileName?: string;
  fileSize?: number;
  isCustom?: boolean;
  customOptionName?: string;
  calendlyLink?: string;
  contactEmail?: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: OrderItem[];
  subtotal: number;
  total: number;
  paymentMethod: string;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  status: 'pending' | 'confirmed' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
}

export default function MyPurchases() {
  const [email, setEmail] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<OrderItem | null>(null);
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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');
    setSearched(true);

    try {
      const response = await fetch(`/api/orders?email=${encodeURIComponent(email)}`);
      const data = await response.json();

      if (response.ok && data.success) {
        // Filter only completed orders
        const completedOrders = data.orders.filter((order: Order) => 
          order.paymentStatus === 'completed'
        );
        setOrders(completedOrders);
        
        if (completedOrders.length === 0) {
          setError('No completed orders found for this email address.');
        }
      } else {
        setError(data.error || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('An error occurred while fetching your orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (templateId: string, isCustom?: boolean, calendlyLink?: string, contactEmail?: string) => {
    if (isCustom && !calendlyLink) {
      // For custom templates without Calendly, show contact modal
      const order = orders.find(o => o.items.some(i => i.templateId === templateId))
      const item = order?.items.find(i => i.templateId === templateId)
      if (item) {
        handleContactClick(item)
      }
      return
    }
    
    if (isCustom && calendlyLink) {
      // Open Calendly link
      window.open(calendlyLink, '_blank')
      return
    }
    
    // Regular download
    // Show download notification
    setDownloadingTemplateId(templateId);
    setShowDownloadNotification(true);
    
    try {
      // Create download URL
      const downloadUrl = `/api/templates/${templateId}/download?email=${encodeURIComponent(email)}`;
      
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

  const handleContactClick = (item: OrderItem) => {
    setSelectedItem(item);
    const order = orders.find(o => o.items.some(i => i.templateId === item.templateId))
    setContactFormData({
      name: order?.customer.name || '',
      email: email || order?.customer.email || '',
      phone: order?.customer.phone || '',
      message: `I would like to discuss customization for: ${item.title}${item.customOptionName ? ` (${item.customOptionName})` : ''}`
    });
    setShowContactModal(true);
    setEmailStatus('idle');
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

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
        to_email: selectedItem.contactEmail || 'assist@fathomlegal.com',
        template_title: selectedItem.title,
        custom_option: selectedItem.customOptionName || 'Normal',
        calendly_link: selectedItem.calendlyLink || ''
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toFixed(2)}`;
  };

  // Get all unique templates from all orders
  const getAllPurchasedTemplates = () => {
    const templateMap = new Map<string, { item: OrderItem; orderNumber: string; orderDate: string }>();
    
    orders.forEach(order => {
      order.items.forEach(item => {
        if (!templateMap.has(item.templateId)) {
          templateMap.set(item.templateId, {
            item,
            orderNumber: order.orderNumber,
            orderDate: order.createdAt
          });
        }
      });
    });

    return Array.from(templateMap.values());
  };

  const purchasedTemplates = getAllPurchasedTemplates();

  return (
    <div className="min-h-screen bg-white">
      <Navbar page="purchases" />
      
      {/* Hero Section */}
      <section className="pt-28 pb-20 relative overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('/contactusbg.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/70"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
              My <span style={{ color: '#A5292A' }}>Purchases</span> 
            </h1>
            <p className="text-lg text-gray-300">
              View your order history and download your purchased templates
            </p>
          </div>
          {/* Breadcrumb */}
          <div className="flex justify-center mt-6">
            <Breadcrumb 
              items={[
                { label: "Home", href: "/" },
                { label: "My Purchases" }
              ]} 
            />
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-[#A5292A]" />
                Enter Your Email
              </h2>
              <form onSubmit={handleSearch} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError('');
                        setSearched(false);
                      }}
                      placeholder="Enter your email address"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A5292A] focus:border-[#A5292A] outline-none"
                      required
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 bg-[#A5292A] text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Searching...
                        </>
                      ) : (
                        <>
                          <Search className="w-5 h-5 mr-2" />
                          Search
                        </>
                      )}
                    </button>
                  </div>
                </div>
                {error && (
                  <div className={`p-3 rounded-lg flex items-center ${
                    error.includes('No completed orders') 
                      ? 'bg-yellow-50 text-yellow-800 border border-yellow-200' 
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}>
                    <AlertCircle className="w-5 h-5 mr-2" />
                    <span>{error}</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      {searched && orders.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            {/* Orders Summary */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Your Orders ({orders.length})
              </h2>
              <p className="text-gray-600">
                Found {orders.length} completed order{orders.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Orders List */}
            <div className="space-y-6 mb-12">
              {orders.map((order) => (
                <div key={order._id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order.orderNumber}
                        </h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(order.createdAt)}
                          </span>
                          <span className="flex items-center">
                            <Package className="w-4 h-4 mr-1" />
                            {order.items.length} template{order.items.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Total</p>
                          <p className="text-xl font-bold text-[#A5292A]">
                            {formatCurrency(order.total)}
                          </p>
                        </div>
                        <div className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          {order.paymentStatus}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="space-y-4">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-center space-x-4 flex-1">
                            <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded">
                              <FileText className="w-8 h-8 text-gray-400" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{item.title}</h4>
                              <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                                <span>Price: {formatCurrency(item.price)}</span>
                                {item.quantity > 1 && (
                                  <span>Quantity: {item.quantity}</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {!item.isCustom && (
                              <button
                                onClick={() => handleDownload(item.templateId)}
                                className="flex items-center space-x-2 px-4 py-2 bg-[#A5292A] text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                              >
                                <Download className="w-4 h-4" />
                                <span>Download</span>
                              </button>
                            )}
                            {(item.isCustom || item.calendlyLink || item.contactEmail) && (
                              <div className="flex gap-2">
                                {item.calendlyLink ? (
                                  <button
                                    onClick={() => window.open(item.calendlyLink, '_blank')}
                                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                  >
                                    <Calendar className="w-4 h-4" />
                                    <span>Schedule</span>
                                  </button>
                                ) : null}
                                {item.contactEmail ? (
                                  <button
                                    onClick={() => {
                                      setEmailModalData({
                                        recipientEmail: item.contactEmail!,
                                        templateTitle: item.title
                                      })
                                      setContactFormData({
                                        name: '',
                                        email: email || '',
                                        phone: '',
                                        message: ''
                                      })
                                      setShowEmailModal(true)
                                    }}
                                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                                  >
                                    <Mail className="w-4 h-4" />
                                    <span>Email</span>
                                  </button>
                                ) : null}
                                {(!item.calendlyLink && !item.contactEmail) && (
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
                  </div>
                </div>
              ))}
            </div>

            {/* All Templates Section */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                All Your Templates ({purchasedTemplates.length})
              </h2>
              <p className="text-gray-600 mb-6">
                Quick access to all your purchased templates
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {purchasedTemplates.map(({ item, orderNumber, orderDate }) => (
                  <div
                    key={item.templateId}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-[#A5292A] transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                        <p className="text-xs text-gray-500">
                          Order: {orderNumber}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(orderDate)}
                        </p>
                      </div>
                    </div>
                    {!item.isCustom ? (
                      <button
                        onClick={() => handleDownload(item.templateId)}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-[#A5292A] text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        {item.calendlyLink ? (
                          <button
                            onClick={() => window.open(item.calendlyLink, '_blank')}
                            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                          >
                            <Calendar className="w-4 h-4" />
                            <span>Schedule</span>
                          </button>
                        ) : null}
                        {item.contactEmail ? (
                          <button
                            onClick={() => {
                              window.location.href = `mailto:${item.contactEmail}?subject=Template Inquiry: ${item.title}`
                            }}
                            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
                          >
                            <Mail className="w-4 h-4" />
                            <span>Email</span>
                          </button>
                        ) : null}
                        {(!item.calendlyLink && !item.contactEmail) && (
                          <button
                            onClick={() => handleContactClick(item)}
                            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                          >
                            <Mail className="w-4 h-4" />
                            <span>Contact</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Contact Modal */}
      {showContactModal && selectedItem && (
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
              <p className="font-semibold text-gray-900">{selectedItem.title}</p>
              {selectedItem.customOptionName && (
                <p className="text-sm text-blue-600 mt-1">Option: {selectedItem.customOptionName}</p>
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

