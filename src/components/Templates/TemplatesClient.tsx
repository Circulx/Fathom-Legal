'use client'

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FileText, Download, Search, Trash2, ShoppingCart } from "lucide-react";
import ReactCountryFlag from "react-country-flag";
import { useRouter } from "next/navigation";
import TemplateModal from "./TemplateModal";
import EmailModal from "./EmailModal";
import NotificationPopup from "./NotificationPopup";

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
  imageData?: string
  price: number
  tags: string[]
  downloadCount: number
  createdAt: string
  isCustom?: boolean
  customOptions?: CustomOption[]
  defaultCalendlyLink?: string
  defaultContactEmail?: string
  countries?: string[]
}

interface TemplatesClientProps {
  initialTemplates: Template[]
}

export default function TemplatesClient({ initialTemplates }: TemplatesClientProps) {
  const [templates, setTemplates] = useState<Template[]>(initialTemplates);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAdmin, setIsAdmin] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [selectedCustomOption, setSelectedCustomOption] = useState<CustomOption | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [freeDownloadEmail, setFreeDownloadEmail] = useState('');
  const [freeDownloadName, setFreeDownloadName] = useState('');
  const [freeDownloadPhone, setFreeDownloadPhone] = useState('');
  const [downloadingTemplateId, setDownloadingTemplateId] = useState<string | null>(null);
  const router = useRouter();

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
    setIsAdmin(window.location.pathname.includes('/admin'));
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
    setSelectedTemplate(template);
    setShowCustomModal(true);
  };

  const handleFreeDownload = async () => {
    if (!selectedTemplate || !freeDownloadEmail.trim()) {
      alert('Please enter your email address');
      return;
    }

    if (!freeDownloadName.trim()) {
      alert('Please enter your name');
      return;
    }

    if (!freeDownloadPhone.trim()) {
      alert('Please enter your contact number');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(freeDownloadEmail.trim())) {
      alert('Please enter a valid email address');
      return;
    }

    setDownloadingTemplateId(selectedTemplate._id);
    
    try {
      const orderData = {
        customer: {
          name: freeDownloadName.trim(),
          email: freeDownloadEmail.trim().toLowerCase(),
          phone: freeDownloadPhone.trim()
        },
        items: [{
          templateId: selectedTemplate._id,
          title: selectedTemplate.title,
          price: 0,
          quantity: 1,
          fileName: selectedTemplate.fileName,
          fileSize: selectedTemplate.fileSize,
          isCustom: false
        }],
        subtotal: 0,
        total: 0,
        paymentMethod: 'free'
      };

      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.error || 'Failed to create order');
      }

      const downloadUrl = `/api/templates/${selectedTemplate._id}/download?email=${encodeURIComponent(freeDownloadEmail.trim())}`;
      const response = await fetch(downloadUrl);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Download failed' }));
        throw new Error(errorData.error || 'Download failed');
      }

      const contentType = response.headers.get('Content-Type') || '';
      if (contentType.includes('application/json')) {
        const jsonData = await response.json();
        alert(`This is a custom template. ${jsonData.message || 'Please contact us.'}`);
        setDownloadingTemplateId(null);
        return;
      }

      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = selectedTemplate.fileName || 'template';
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '');
        }
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setNotificationMessage('Template downloaded successfully!');
      setShowNotification(true);
      setShowEmailModal(false);
      setFreeDownloadEmail('');
      setFreeDownloadName('');
      setFreeDownloadPhone('');
      setSelectedTemplate(null);
      
      fetchTemplates();
    } catch (error: any) {
      console.error('Download error:', error);
      alert(error.message || 'Failed to download template. Please try again.');
    } finally {
      setDownloadingTemplateId(null);
    }
  };

  const addSelectedOptionToCart = () => {
    if (!selectedTemplate) return;
    
    const existingCart = JSON.parse(localStorage.getItem('fathom_cart') || '[]');
    
    let existingItemIndex = -1;
    
    if (selectedCustomOption) {
      existingItemIndex = existingCart.findIndex((item: any) => 
        item._id === selectedTemplate._id && 
        item.isCustom === true && 
        item.customOptionName === selectedCustomOption.name
      );
    } else {
      existingItemIndex = existingCart.findIndex((item: any) => 
        item._id === selectedTemplate._id && 
        item.isCustom === false
      );
    }
    
    if (existingItemIndex !== -1) {
      existingCart[existingItemIndex].quantity = (existingCart[existingItemIndex].quantity || 1) + 1;
    } else {
      let cartItem;
      
      if (selectedCustomOption) {
        cartItem = {
          _id: selectedTemplate._id,
          title: selectedTemplate.title,
          description: selectedTemplate.description,
          price: selectedCustomOption.price,
          imageData: selectedTemplate.imageData,
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
        cartItem = {
          _id: selectedTemplate._id,
          title: selectedTemplate.title,
          description: selectedTemplate.description,
          price: selectedTemplate.price,
          imageData: selectedTemplate.imageData,
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
    router.push('/checkout');
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

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString()}`;
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

  const handleOptionSelect = (option: CustomOption | 'standard') => {
    if (option === 'standard') {
      setSelectedCustomOption(null);
    } else {
      setSelectedCustomOption(option);
    }
  };

  return (
    <>
      {/* Search and Filter */}
      <section className="py-8 sm:py-10 lg:py-12 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 justify-center items-center">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse"
                >
                  <div className="w-full h-64 bg-gray-200"></div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-1">
                      <div className="h-5 w-20 bg-gray-200 rounded-full"></div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 bg-gray-200 rounded"></div>
                        <div className="w-6 h-6 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                    <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 w-2/3 bg-gray-200 rounded mb-4"></div>
                    <div className="flex items-center justify-end">
                      <div className="h-8 w-24 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No templates found</h3>
              <p className="text-sm sm:text-base text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {templates.map((template) => (
                <div
                  key={template._id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow border border-gray-100 overflow-hidden"
                >
                  <div className="aspect-w-16 aspect-h-9 relative w-full h-64">
                    {(() => {
                      // Prefer imageUrl over imageData (Vercel Blob URLs are preferred)
                      const imageSrc = template.imageUrl || template.imageData
                      if (!imageSrc) {
                        return (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <FileText className="h-12 w-12 text-gray-400" />
                          </div>
                        )
                      }
                      // Check if it's a base64 data URL (legacy)
                      if (imageSrc.startsWith('data:')) {
                        return (
                          <img
                            src={imageSrc}
                            alt={template.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              console.error('Template image load error:', template.title)
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                        )
                      }
                      // Use Next.js Image for regular URLs (Vercel Blob URLs)
                      return (
                        <Image
                          src={imageSrc}
                          alt={template.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          onError={(e) => {
                            console.error('Template image load error:', template.title)
                          }}
                        />
                      )
                    })()}
                    
                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(template._id)}
                        className="absolute top-2 right-2 p-2 bg-red-600 text-white hover:bg-red-700 transition-colors z-10 rounded"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ backgroundColor: '#A5292A', color: 'white' }}>
                        {template.category}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {template.countries && template.countries.length > 0 ? (
                          template.countries.map((countryCode) => (
                            <ReactCountryFlag
                              key={countryCode}
                              countryCode={countryCode}
                              svg
                              style={{
                                width: '1.5em',
                                height: '1.5em',
                              }}
                              title={countryCode}
                            />
                          ))
                        ) : (
                          <>
                            <ReactCountryFlag
                              countryCode="IN"
                              svg
                              style={{
                                width: '1.5em',
                                height: '1.5em',
                              }}
                              title="India"
                            />
                            <ReactCountryFlag
                              countryCode="US"
                              svg
                              style={{
                                width: '1.5em',
                                height: '1.5em',
                              }}
                              title="USA"
                            />
                          </>
                        )}
                      </div>
                    </div>
                    
                    <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
                      {template.title}
                    </h3>
                    
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                      {template.description}
                    </p>
                    
                    <div className="flex items-center justify-end">
                      {template.price > 0 && (
                        <span className="text-sm font-bold text-gray-900 mr-auto">{formatPrice(template.price)}</span>
                      )}
                      <button
                        onClick={() => addToCart(template)}
                        className="flex items-center px-3 py-1.5 bg-red-600 text-white hover:bg-red-700 transition-colors text-xs font-medium rounded"
                      >
                        <ShoppingCart className="h-3 w-3 mr-1" />
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

      {showCustomModal && selectedTemplate && (
        <TemplateModal
          template={selectedTemplate}
          selectedCustomOption={selectedCustomOption}
          onOptionSelect={handleOptionSelect}
          onAddToCart={addSelectedOptionToCart}
          onDownload={() => {
            setShowCustomModal(false);
            setShowEmailModal(true);
          }}
          onClose={() => {
            setShowCustomModal(false);
            setSelectedTemplate(null);
            setSelectedCustomOption(null);
          }}
        />
      )}

      {showEmailModal && selectedTemplate && (
        <EmailModal
          template={selectedTemplate}
          email={freeDownloadEmail}
          name={freeDownloadName}
          phone={freeDownloadPhone}
          downloading={downloadingTemplateId === selectedTemplate._id}
          onEmailChange={setFreeDownloadEmail}
          onNameChange={setFreeDownloadName}
          onPhoneChange={setFreeDownloadPhone}
          onDownload={handleFreeDownload}
          onClose={() => {
            setShowEmailModal(false);
            setFreeDownloadEmail('');
            setFreeDownloadName('');
            setFreeDownloadPhone('');
            setSelectedTemplate(null);
          }}
        />
      )}

      {showNotification && (
        <NotificationPopup
          message={notificationMessage}
          onClose={() => setShowNotification(false)}
          onViewCart={() => {
            setShowNotification(false);
            router.push('/checkout');
          }}
        />
      )}
    </>
  )
}
