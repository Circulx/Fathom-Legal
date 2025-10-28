'use client'

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { FileText, Download, Eye, Search, Filter, Trash2, ShoppingCart } from "lucide-react";

interface Template {
  _id: string
  title: string
  description: string
  category: string
  fileUrl: string
  fileName: string
  fileSize: number
  fileType: string
  imageUrl?: string
  price: number
  tags: string[]
  downloadCount: number
  createdAt: string
}

export default function Templates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAdmin, setIsAdmin] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  const categories = [
    { value: 'all', label: 'All' },
    { value: 'Legal Documents', label: 'Legal Documents' },
    { value: 'Contracts', label: 'Contracts' },
    { value: 'Agreements', label: 'Agreements' },
    { value: 'Forms', label: 'Forms' },
    { value: 'Other', label: 'Other' }
  ];

  useEffect(() => {
    fetchTemplates();
    // Check if user is on admin page
    setIsAdmin(window.location.pathname.includes('/admin'));
    // Load cart items from localStorage
    loadCartItems();
  }, [searchTerm, selectedCategory]);

  const loadCartItems = () => {
    const savedCart = localStorage.getItem('fathom_cart');
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart);
        setCartItems(items);
      } catch (error) {
        console.error('Error parsing cart:', error);
      }
    }
  };

  const addToCart = (template: Template) => {
    const existingCart = JSON.parse(localStorage.getItem('fathom_cart') || '[]');
    
    // Check if item already exists in cart
    const existingItemIndex = existingCart.findIndex((item: any) => item._id === template._id);
    
    if (existingItemIndex !== -1) {
      // Item exists, increment quantity
      existingCart[existingItemIndex].quantity += 1;
      setNotificationMessage(`${template.title} quantity updated!`);
    } else {
      // Item doesn't exist, add new item
      const cartItem = {
        _id: template._id,
        title: template.title,
        description: template.description,
        price: template.price,
        imageUrl: template.imageUrl,
        category: template.category,
        fileName: template.fileName,
        fileSize: template.fileSize,
        quantity: 1
      };
      existingCart.push(cartItem);
      setNotificationMessage(`${template.title} added to cart!`);
    }
    
    localStorage.setItem('fathom_cart', JSON.stringify(existingCart));
    setCartItems(existingCart);
    
    // Show notification
    setShowNotification(true);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const goToCheckout = () => {
    window.location.href = '/checkout';
  };

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      
      const response = await fetch(`/api/templates?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        setTemplates(data.templates);
      } else {
        console.error('Error fetching templates:', data.error);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
      const response = await fetch(`/api/admin/templates?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('Template deleted successfully!');
        fetchTemplates();
      } else {
        const data = await response.json();
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Error deleting template');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar page="templates" />
      
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
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
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
             Our <span style={{ color: '#A5292A' }}>Products </span> 
            </h1>
           
          </div>
          {/* Breadcrumb */}
            <div className="flex justify-center">
              <Breadcrumb 
                items={[
                  { label: "Home", href: "/" },
                  { label: "Templates" }
                ]} 
              />
            </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            
            {/* Category Filter and Cart */}
            <div className="flex flex-wrap justify-center items-center gap-4">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`px-4 py-2 rounded-full font-medium transition-all ${
                      selectedCategory === category.value
                        ? "bg-[#A5292A] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
              
              {/* Cart Icon */}
              <button
                onClick={goToCheckout}
                className="relative flex items-center justify-center w-12 h-12 bg-[#A5292A] text-white rounded-full hover:bg-red-700 transition-colors shadow-lg"
                title="View Cart"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>


      {/* Templates Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-items-center ml-12">
              {templates.map((template) => (
                    <div
                      key={template._id}
                      className="relative bg-white shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden w-80 flex flex-col"
                    >
                  {/* Product Image - Top Section */}
                  <div 
                    className="h-72 bg-cover bg-center bg-no-repeat relative flex-shrink-0"
                    style={{
                      backgroundImage: template.imageUrl ? `url(${template.imageUrl})` : 'none',
                      backgroundColor: template.imageUrl ? 'transparent' : '#f3f4f6'
                    }}
                  >
                    {/* Overlay for better text readability */}
                    <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                    
                    {/* Admin Delete Button */}
                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(template._id)}
                        className="absolute top-2 right-2 p-2 bg-red-600 text-white hover:bg-red-700 transition-colors z-10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                    
                    {/* Fallback Icon if no image */}
                    {!template.imageUrl && (
                      <div className="h-full flex items-center justify-center">
                        <FileText className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  {/* Content Section - Bottom */}
                  <div className="p-4 flex flex-col flex-grow">
                    {/* Title */}
                    <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 flex-grow">
                      {template.title}
                    </h3>
                    
                    {/* Price and Button at Bottom */}
                    <div className="mt-auto">
                      {/* Price */}
                      <div className="mb-3">
                        <div className="text-lg font-bold text-gray-900">
                          ₹{template.price || 0}
                        </div>
                        <div className="text-xs text-gray-500">+ Taxes</div>
                      </div>
                      
                      {/* Add to Cart Button */}
                      <button
                        onClick={() => addToCart(template)}
                        className="w-full flex items-center justify-center px-4 py-3 bg-red-600 text-white hover:bg-red-700 transition-colors font-medium"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Notification Popup */}
      {showNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 animate-popup">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Success!</h3>
                <p className="text-gray-600">{notificationMessage}</p>
              </div>
              <button
                onClick={() => setShowNotification(false)}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowNotification(false)}
                className="px-4 py-2 bg-[#A5292A] text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

