'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { 
  ArrowLeft,
  DollarSign,
  Download,
  FileText
} from 'lucide-react'
import { Navbar } from '@/components/Navbar'

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
  downloadCount: number
  createdAt: string
  uploadedBy: {
    name: string
    email: string
  }
  isCustom?: boolean
  customOptions?: CustomOption[]
  defaultCalendlyLink?: string
  defaultContactEmail?: string
}

export default function TemplateDetails() {
  const params = useParams()
  const [template, setTemplate] = useState<Template | null>(null)
  const [loading, setLoading] = useState(true)
  const [showCustomModal, setShowCustomModal] = useState(false)
  const [selectedCustomOption, setSelectedCustomOption] = useState<CustomOption | null>(null)

  useEffect(() => {
    if (params.id) {
      fetchTemplate()
    }
  }, [params.id])

  const fetchTemplate = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/templates/${params.id}`)
      const data = await response.json()
      
      if (response.ok) {
        setTemplate(data.template)
      } else {
        console.error('Error fetching template:', data.error)
      }
    } catch (error) {
      console.error('Error fetching template:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleBuyNow = () => {
    if (!template) return;
    
    // Show modal to select option (normal or custom)
    setShowCustomModal(true);
  }

  const handleOptionSelect = (option: CustomOption | 'normal') => {
    if (!template) return;
    
    if (option === 'normal') {
      setSelectedCustomOption(null);
    } else {
      setSelectedCustomOption(option);
    }
  };

  const addSelectedOptionToCart = () => {
    if (!template) return;
    
    const existingCart = JSON.parse(localStorage.getItem('fathom_cart') || '[]');
    
    // Check if the same item already exists in cart
    let existingItemIndex = -1;
    
    if (selectedCustomOption) {
      // For custom options, check by template ID and custom option name
      existingItemIndex = existingCart.findIndex((item: any) => 
        item._id === template._id && 
        item.isCustom === true && 
        item.customOptionName === selectedCustomOption.name
      );
    } else {
      // For normal options, check by template ID and that it's not custom
      existingItemIndex = existingCart.findIndex((item: any) => 
        item._id === template._id && 
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
          _id: template._id,
          title: template.title,
          description: template.description,
          price: selectedCustomOption.price,
          imageUrl: template.imageUrl,
          category: template.category,
          fileName: template.fileName,
          fileSize: template.fileSize,
          quantity: 1,
          isCustom: true,
          customOptionName: selectedCustomOption.name,
          calendlyLink: selectedCustomOption.calendlyLink || template.defaultCalendlyLink,
          contactEmail: selectedCustomOption.contactEmail || template.defaultContactEmail
        };
      } else {
        // Normal option selected
        cartItem = {
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
      }
      
      existingCart.push(cartItem);
    }
    
    // Save to localStorage
    localStorage.setItem('fathom_cart', JSON.stringify(existingCart));
    
    // Close modal and redirect to checkout
    setShowCustomModal(false);
    setSelectedCustomOption(null);
    window.location.href = '/checkout';
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar page="templates" />
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </div>
      </div>
    )
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar page="templates" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Template not found</h1>
            <p className="text-gray-600 mb-6">The template you're looking for doesn't exist.</p>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar page="templates" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Templates
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Template Image */}
          <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
            {template.imageUrl ? (
              <img 
                src={template.imageUrl} 
                alt={template.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FileText className="h-24 w-24 text-gray-400" />
              </div>
            )}
          </div>

          {/* Template Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{template.title}</h1>
              <p className="text-gray-600">Category: {template.category}</p>
            </div>

            {/* Price */}
            <div className="flex items-center">
              <DollarSign className="h-6 w-6 text-green-600" />
              <span className="text-3xl font-bold text-gray-900 ml-2">₹{template.price}</span>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-line">{template.description}</p>
              </div>
            </div>

            {/* Template Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Template Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">File Name:</span>
                  <span className="text-gray-900">{template.fileName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">File Size:</span>
                  <span className="text-gray-900">{formatFileSize(template.fileSize)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Downloads:</span>
                  <span className="text-gray-900">{template.downloadCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Uploaded:</span>
                  <span className="text-gray-900">{new Date(template.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Buy Now Button */}
            <button
              onClick={handleBuyNow}
              className="w-full flex items-center justify-center px-6 py-4 bg-red-600 text-white text-lg font-semibold rounded-xl hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl"
            >
              <DollarSign className="h-5 w-5 mr-2" />
              Buy Now - ₹{template.price}
            </button>
          </div>
        </div>
      </div>

      {/* Template Options Modal - Shows Normal + Custom Options */}
      {showCustomModal && template && (
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
              {template.description && (
                <div className="mb-6 pb-4 border-b border-gray-200">
                  <p className="text-gray-700 whitespace-pre-line">{template.description}</p>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {/* Normal Option - Always First Column */}
                <div
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all flex flex-col ${
                    selectedCustomOption === null
                      ? 'border-[#A5292A] bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleOptionSelect('normal')}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">Normal</h3>
                      {selectedCustomOption === null && (
                        <span className="bg-[#A5292A] text-white text-xs px-2 py-1 rounded">Selected</span>
                      )}
                    </div>
                    <div className="text-2xl font-bold text-[#A5292A] mb-2">
                      ₹{template.price.toLocaleString()}
                      <span className="text-sm font-normal text-gray-600"> per template</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Instant download</p>
                    
                    {/* Default Features for Normal Option */}
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
                {template.customOptions && template.customOptions.map((option, index) => (
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
                          {option.calendlyLink || template.defaultCalendlyLink
                            ? 'Schedule via Calendly'
                            : option.contactEmail || template.defaultContactEmail
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
    </div>
  )
}














