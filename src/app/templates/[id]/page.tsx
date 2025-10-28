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
}

export default function TemplateDetails() {
  const params = useParams()
  const [template, setTemplate] = useState<Template | null>(null)
  const [loading, setLoading] = useState(true)

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
    
    // Add to cart and redirect to checkout
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
    
    // Save to localStorage
    const existingCart = JSON.parse(localStorage.getItem('fathom_cart') || '[]');
    existingCart.push(cartItem);
    localStorage.setItem('fathom_cart', JSON.stringify(existingCart));
    
    // Redirect to checkout
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
    </div>
  )
}














