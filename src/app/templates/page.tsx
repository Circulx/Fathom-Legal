'use client'

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { FileText, Download, Eye, Search, Filter, Trash2, ShoppingCart } from "lucide-react";

interface CustomOption {
  name: string
  price: number
  description?: string
  features: string[]
  calendlyLink?: string
  contactEmail?: string
}

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
  isCustom?: boolean
  customOptions?: CustomOption[]
  defaultCalendlyLink?: string
  defaultContactEmail?: string
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
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [selectedCustomOption, setSelectedCustomOption] = useState<CustomOption | null>(null);

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
    // Always show modal if template has custom options, otherwise show modal with just standard option
    // This allows users to see all available options (standard + custom)
    setSelectedTemplate(template);
    setShowCustomModal(true);
  };

  const addStandardTemplateToCart = (template: Template) => {
    const existingCart = JSON.parse(localStorage.getItem('fathom_cart') || '[]');
    
    // Check if item already exists in cart
    const existingItemIndex = existingCart.findIndex((item: any) => item._id === template._id);
    
    if (existingItemIndex !== -1) {
      // Item exists, increment quantity
      existingCart[existingItemIndex].quantity += 1;
      setNotificationMessage('Successfully added to cart!');
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
        quantity: 1,
        isCustom: false
      };
      existingCart.push(cartItem);
      setNotificationMessage('Successfully added to cart!');
    }
    
    localStorage.setItem('fathom_cart', JSON.stringify(existingCart));
    setCartItems(existingCart);
    
    // Show notification
    setShowNotification(true);
  };

  const handleOptionSelect = (option: CustomOption | 'standard') => {
    if (!selectedTemplate) return;
    
    if (option === 'standard') {
      setSelectedCustomOption(null); // Mark as standard
    } else {
      setSelectedCustomOption(option);
    }
  };

  const addSelectedOptionToCart = () => {
    if (!selectedTemplate) return;
    
    const existingCart = JSON.parse(localStorage.getItem('fathom_cart') || '[]');
    
    // Check if the same item already exists in cart
    let existingItemIndex = -1;
    
    if (selectedCustomOption) {
      // For custom options, check by template ID and custom option name
      existingItemIndex = existingCart.findIndex((item: any) => 
        item._id === selectedTemplate._id && 
        item.isCustom === true && 
        item.customOptionName === selectedCustomOption.name
      );
    } else {
      // For standard options, check by template ID and that it's not custom
      existingItemIndex = existingCart.findIndex((item: any) => 
        item._id === selectedTemplate._id && 
        item.isCustom === false
      );
    }
    
    if (existingItemIndex !== -1) {
      // Item exists, increment quantity
      existingCart[existingItemIndex].quantity = (existingCart[existingItemIndex].quantity || 1) + 1;
    } else {
      // Item doesn't exist, add new item
      let cartItem;
      
      if (selectedCustomOption) {
        // Custom option selected
        cartItem = {
          _id: selectedTemplate._id,
          title: selectedTemplate.title,
          description: selectedTemplate.description,
          price: selectedCustomOption.price,
          imageUrl: selectedTemplate.imageUrl,
          category: selectedTemplate.category,
          fileName: selectedTemplate.fileName,
          fileSize: selectedTemplate.fileSize,
          quantity: 1,
          isCustom: true,
          customOptionName: selectedCustomOption.name,
          calendlyLink: selectedCustomOption.calendlyLink || selectedTemplate.defaultCalendlyLink,
          contactEmail: selectedCustomOption.contactEmail || selectedTemplate.defaultContactEmail
        };
      } else {
        // Standard option selected
        cartItem = {
          _id: selectedTemplate._id,
          title: selectedTemplate.title,
          description: selectedTemplate.description,
          price: selectedTemplate.price,
          imageUrl: selectedTemplate.imageUrl,
          category: selectedTemplate.category,
          fileName: selectedTemplate.fileName,
          fileSize: selectedTemplate.fileSize,
          quantity: 1,
          isCustom: false
        };
      }
      
      existingCart.push(cartItem);
    }
    
    localStorage.setItem('fathom_cart', JSON.stringify(existingCart));
    setCartItems(existingCart);
    
    setNotificationMessage('Successfully added to cart!');
    setShowNotification(true);
    setShowCustomModal(false);
    setSelectedTemplate(null);
    setSelectedCustomOption(null);
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
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold text-white mb-4 mt-6 sm:mb-6">
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
      <section className="py-8 sm:py-10 lg:py-12 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 justify-center items-center">
            {/* Search */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 sm:pl-10 pr-4 py-2 sm:py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm sm:text-base"
              />
            </div>
            
            {/* Category Filter and Cart */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full lg:w-auto">
              <div className="flex flex-wrap gap-2 justify-center">
                {categories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium transition-all text-xs sm:text-sm ${
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
                className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-[#A5292A] text-white rounded-full hover:bg-red-700 transition-colors shadow-lg"
                title="View Cart"
              >
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>


      {/* Templates Grid */}
      <section className="py-16 lg:py-20 xl:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-red-600"></div>
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No templates found</h3>
              <p className="text-sm sm:text-base text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                    <div
                      key={template._id}
                      className="relative bg-white shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col"
                    >
                  {/* Product Image - Top Section */}
                  <div 
                    className="h-40 bg-cover bg-center bg-no-repeat relative flex-shrink-0"
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
                        className="absolute top-2 right-2 p-1.5 sm:p-2 bg-red-600 text-white hover:bg-red-700 transition-colors z-10"
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                    )}
                    
                    {/* Fallback Icon if no image */}
                    {!template.imageUrl && (
                      <div className="h-full flex items-center justify-center">
                        <FileText className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  {/* Content Section - Bottom */}
                  <div className="p-5 flex flex-col flex-grow">
                    {/* Title */}
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 flex-grow">
                      {template.title}
                    </h3>
                    
                    {/* Price and Button at Bottom */}
                    <div className="mt-auto">
                      {/* Price */}
                      <div className="mb-3">
                        <div className="text-lg font-bold text-gray-900">
                          ₹{template.price || 0}
                        </div>
                      </div>
                      
                      {/* Add to Cart Button */}
                      <button
                        onClick={() => addToCart(template)}
                        className="w-full flex items-center justify-center px-4 py-2.5 bg-red-600 text-white hover:bg-red-700 transition-colors font-medium text-sm"
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
          <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 max-w-md w-full mx-4 animate-popup">
            <div className="flex items-center space-x-3 sm:space-x-4 mb-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Success!</h3>
                <p className="text-sm sm:text-base text-gray-600">{notificationMessage}</p>
              </div>
              <button
                onClick={() => setShowNotification(false)}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowNotification(false)}
                className="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm sm:text-base"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => {
                  setShowNotification(false);
                  window.location.href = '/checkout';
                }}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#A5292A] text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm sm:text-base"
              >
                View Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Template Options Modal - Shows Standard + Custom Options */}
      {showCustomModal && selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Select Template Option</h2>
              </div>
              <button
                onClick={() => {
                  setShowCustomModal(false);
                  setSelectedTemplate(null);
                  setSelectedCustomOption(null);
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Modal Body - Options in Columns */}
            <div className="p-6">
              {/* Template Description */}
              {selectedTemplate.description && (
                <div className="mb-6 pb-4 border-b border-gray-200">
                  <p className="text-gray-700 whitespace-pre-line">{selectedTemplate.description}</p>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {/* Standard Option - Always First Column */}
                <div
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all flex flex-col ${
                    selectedCustomOption === null
                      ? 'border-[#A5292A] bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleOptionSelect('standard')}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">Standard</h3>
                      {selectedCustomOption === null && (
                        <span className="bg-[#A5292A] text-white text-xs px-2 py-1 rounded">Selected</span>
                      )}
                    </div>
                    <div className="text-2xl font-bold text-[#A5292A] mb-2">
                      ₹{selectedTemplate.price.toLocaleString()}
                      <span className="text-sm font-normal text-gray-600"> per template</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Instant download</p>
                    
                    {/* Default Features for Standard Option */}
                    <div className="mb-3">
                      <ul className="space-y-1">
                        <li className="flex items-start text-sm text-gray-700">
                          <span className="text-green-500 mr-2">✓</span>
                          <span>Instant Download</span>
                        </li>
                        <li className="flex items-start text-sm text-gray-700">
                          <span className="text-green-500 mr-2">✓</span>
                          <span>Editable File</span>
                        </li>
                        <li className="flex items-start text-sm text-gray-700">
                          <span className="text-green-500 mr-2">✓</span>
                          <span>No Customization</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Custom Options - Columns 2-5 */}
                {selectedTemplate.customOptions && selectedTemplate.customOptions.map((option, index) => (
                  <div
                    key={index}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all flex flex-col ${
                      selectedCustomOption?.name === option.name
                        ? 'border-[#A5292A] bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleOptionSelect(option)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{option.name}</h3>
                        {selectedCustomOption?.name === option.name && (
                          <span className="bg-[#A5292A] text-white text-xs px-2 py-1 rounded">Selected</span>
                        )}
                      </div>
                      <div className="text-2xl font-bold text-[#A5292A] mb-2">
                        ₹{option.price.toLocaleString()}
                        <span className="text-sm font-normal text-gray-600"> per template</span>
                      </div>
                      {option.description && (
                        <p className="text-sm text-gray-600 mb-3">{option.description}</p>
                      )}
                      
                      {/* Features List */}
                      {option.features && option.features.length > 0 && (
                        <div className="mb-3">
                          <ul className="space-y-1">
                            {option.features.map((feature, idx) => (
                              <li key={idx} className="flex items-start text-sm text-gray-700">
                                <span className="text-green-500 mr-2">✓</span>
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Contact Information */}
                      <div className="mt-auto pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-500">
                          {option.calendlyLink || selectedTemplate.defaultCalendlyLink
                            ? 'Schedule via Calendly'
                            : option.contactEmail || selectedTemplate.defaultContactEmail
                            ? 'Contact via Email'
                            : 'Contact after purchase'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowCustomModal(false);
                  setSelectedTemplate(null);
                  setSelectedCustomOption(null);
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addSelectedOptionToCart}
                className="px-6 py-2 bg-[#A5292A] text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

