'use client'

import { useState } from 'react'
import Image from 'next/image'
import { 
  ArrowLeft,
  DollarSign,
  Download,
  FileText
} from 'lucide-react'
import { useRouter } from 'next/navigation'

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
  downloadCount: number
  createdAt: string
  isCustom?: boolean
  customOptions?: CustomOption[]
  defaultCalendlyLink?: string
  defaultContactEmail?: string
}

interface TemplateClientProps {
  template: Template
}

export default function TemplateClient({ template }: TemplateClientProps) {
  const router = useRouter()
  const [showCustomModal, setShowCustomModal] = useState(false)
  const [selectedCustomOption, setSelectedCustomOption] = useState<CustomOption | null>(null)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [freeDownloadEmail, setFreeDownloadEmail] = useState('')
  const [freeDownloadName, setFreeDownloadName] = useState('')
  const [downloadingTemplateId, setDownloadingTemplateId] = useState<string | null>(null)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleBuyNow = () => {
    setShowCustomModal(true)
  }

  const handleFreeDownload = async () => {
    if (!freeDownloadEmail.trim()) {
      alert('Please enter your email address')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(freeDownloadEmail.trim())) {
      alert('Please enter a valid email address')
      return
    }

    setDownloadingTemplateId(template._id)
    
    try {
      const orderData = {
        customer: {
          name: freeDownloadName.trim() || 'Guest',
          email: freeDownloadEmail.trim().toLowerCase(),
          phone: '0000000000'
        },
        items: [{
          templateId: template._id,
          title: template.title,
          price: 0,
          quantity: 1,
          fileName: template.fileName,
          fileSize: template.fileSize,
          isCustom: false
        }],
        subtotal: 0,
        total: 0,
        paymentMethod: 'free'
      }

      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      })

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json()
        throw new Error(errorData.error || 'Failed to create order')
      }

      const downloadUrl = `/api/templates/${template._id}/download?email=${encodeURIComponent(freeDownloadEmail.trim())}`
      const response = await fetch(downloadUrl)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Download failed' }))
        throw new Error(errorData.error || 'Download failed')
      }

      const contentType = response.headers.get('Content-Type') || ''
      if (contentType.includes('application/json')) {
        const jsonData = await response.json()
        alert(`This is a custom template. ${jsonData.message || 'Please contact us.'}`)
        setDownloadingTemplateId(null)
        return
      }

      const contentDisposition = response.headers.get('Content-Disposition')
      let filename = template.fileName || 'template'
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '')
        }
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      alert('Template downloaded successfully!')
      setShowEmailModal(false)
      setFreeDownloadEmail('')
      setFreeDownloadName('')
    } catch (error: any) {
      console.error('Download error:', error)
      alert(error.message || 'Failed to download template. Please try again.')
    } finally {
      setDownloadingTemplateId(null)
    }
  }

  const handleOptionSelect = (option: CustomOption | 'standard') => {
    if (option === 'standard') {
      setSelectedCustomOption(null)
    } else {
      setSelectedCustomOption(option)
    }
  }

  const addSelectedOptionToCart = () => {
    const existingCart = JSON.parse(localStorage.getItem('fathom_cart') || '[]')
    
    let existingItemIndex = -1
    
    if (selectedCustomOption) {
      existingItemIndex = existingCart.findIndex((item: any) => 
        item._id === template._id && 
        item.isCustom === true && 
        item.customOptionName === selectedCustomOption.name
      )
    } else {
      existingItemIndex = existingCart.findIndex((item: any) => 
        item._id === template._id && 
        item.isCustom === false
      )
    }
    
    if (existingItemIndex !== -1) {
      existingCart[existingItemIndex].quantity = (existingCart[existingItemIndex].quantity || 1) + 1
    } else {
      let cartItem
      
      if (selectedCustomOption) {
        cartItem = {
          _id: template._id,
          title: template.title,
          description: template.description,
          price: selectedCustomOption.price,
          imageData: template.imageData,
          imageUrl: template.imageUrl,
          category: template.category,
          fileName: template.fileName,
          fileSize: template.fileSize,
          quantity: 1,
          isCustom: true,
          customOptionName: selectedCustomOption.name,
          calendlyLink: selectedCustomOption.calendlyLink || template.defaultCalendlyLink,
          contactEmail: selectedCustomOption.contactEmail || template.defaultContactEmail
        }
      } else {
        cartItem = {
          _id: template._id,
          title: template.title,
          description: template.description,
          price: template.price,
          imageData: template.imageData,
          imageUrl: template.imageUrl,
          category: template.category,
          fileName: template.fileName,
          fileSize: template.fileSize,
          quantity: 1,
          isCustom: false
        }
      }
      
      existingCart.push(cartItem)
    }
    
    localStorage.setItem('fathom_cart', JSON.stringify(existingCart))
    setShowCustomModal(false)
    setSelectedCustomOption(null)
    router.push('/checkout')
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Templates
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Template Image */}
          <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden relative">
            {(() => {
              // Prefer imageUrl over imageData (Vercel Blob URLs are preferred)
              const imageSrc = template.imageUrl || template.imageData
              if (!imageSrc) {
                return (
                  <div className="w-full h-full flex items-center justify-center">
                    <FileText className="h-24 w-24 text-gray-400" />
                  </div>
                )
              }
              return (
                <Image 
                  src={imageSrc} 
                  alt={template.title}
                  fill
                  className="object-cover"
                  unoptimized={imageSrc.startsWith('data:')} // Only unoptimized for legacy base64
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              )
            })()}
          </div>

          {/* Template Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{template.title}</h1>
              <p className="text-gray-600">Category: {template.category}</p>
            </div>

            {/* Price */}
            <div className="flex items-center">
              {template.price === 0 ? (
                <span className="text-3xl font-bold text-green-600">Free</span>
              ) : (
                <>
                  <DollarSign className="h-6 w-6 text-green-600" />
                  <span className="text-3xl font-bold text-gray-900 ml-2">₹{template.price.toLocaleString()}</span>
                </>
              )}
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

            {/* Buy Now / Download Button */}
            <button
              onClick={handleBuyNow}
              className="w-full flex items-center justify-center px-6 py-4 bg-red-600 text-white text-lg font-semibold rounded-xl hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl"
            >
              {template.price === 0 ? (
                <>
                  <Download className="h-5 w-5 mr-2" />
                  Download Free Template
                </>
              ) : (
                <>
                  <DollarSign className="h-5 w-5 mr-2" />
                  Buy Now - ₹{template.price.toLocaleString()}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Email Modal for Free Downloads */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Download Free Template</h2>
              <p className="text-sm text-gray-600 mb-4">
                Enter your email to download <strong>{template.title}</strong>
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={freeDownloadEmail}
                    onChange={(e) => setFreeDownloadEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="your@email.com"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={freeDownloadName}
                    onChange={(e) => setFreeDownloadName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Your Name"
                  />
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowEmailModal(false)
                  setFreeDownloadEmail('')
                  setFreeDownloadName('')
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleFreeDownload}
                disabled={downloadingTemplateId === template._id}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {downloadingTemplateId === template._id ? 'Downloading...' : 'Download'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Template Options Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Select Template Option</h2>
              </div>
              <button
                onClick={() => {
                  setShowCustomModal(false)
                  setSelectedCustomOption(null)
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              {template.description && (
                <div className="mb-6 pb-4 border-b border-gray-200">
                  <p className="text-gray-700 whitespace-pre-line">{template.description}</p>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {/* Standard Option */}
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
                      {template.price === 0 ? (
                        <span>Free</span>
                      ) : (
                        <>
                          ₹{template.price.toLocaleString()}
                          <span className="text-sm font-normal text-gray-600"> per template</span>
                        </>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Instant download</p>
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

                {/* Custom Options */}
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

            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowCustomModal(false)
                  setSelectedCustomOption(null)
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              {selectedCustomOption === null && template.price === 0 ? (
                <button
                  onClick={() => {
                    setShowCustomModal(false)
                    setShowEmailModal(true)
                  }}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="h-4 w-4 inline mr-2" />
                  Download
                </button>
              ) : (
                <button
                  onClick={addSelectedOptionToCart}
                  className="px-6 py-2 bg-[#A5292A] text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Add to Cart
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
