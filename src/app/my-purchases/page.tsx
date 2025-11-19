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
  Search
} from "lucide-react";

interface OrderItem {
  templateId: string;
  title: string;
  price: number;
  quantity: number;
  fileName?: string;
  fileSize?: number;
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

  const handleDownload = (templateId: string) => {
    const downloadUrl = `/api/templates/${templateId}/download?email=${encodeURIComponent(email)}`;
    window.open(downloadUrl, '_blank');
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
                          <button
                            onClick={() => handleDownload(item.templateId)}
                            className="flex items-center space-x-2 px-4 py-2 bg-[#A5292A] text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                          >
                            <Download className="w-4 h-4" />
                            <span>Download</span>
                          </button>
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
                    <button
                      onClick={() => handleDownload(item.templateId)}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-[#A5292A] text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}

