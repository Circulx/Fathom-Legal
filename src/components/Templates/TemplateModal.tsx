'use client'

import React from 'react'
import { Download } from 'lucide-react'

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

interface TemplateModalProps {
  template: Template
  selectedCustomOption: CustomOption | null
  onOptionSelect: (option: CustomOption | 'standard') => void
  onAddToCart: () => void
  onDownload: () => void
  onClose: () => void
}

export default function TemplateModal({
  template,
  selectedCustomOption,
  onOptionSelect,
  onAddToCart,
  onDownload,
  onClose
}: TemplateModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Select Template Option</h2>
          </div>
          <button
            onClick={onClose}
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
            <div
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all flex flex-col ${
                selectedCustomOption === null
                  ? 'border-[#A5292A] bg-red-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onOptionSelect('standard')}
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

            {template.customOptions && template.customOptions.map((option, index) => (
              <div
                key={index}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all flex flex-col ${
                  selectedCustomOption?.name === option.name
                    ? 'border-[#A5292A] bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => onOptionSelect(option)}
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
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          {template && selectedCustomOption === null && template.price === 0 ? (
            <button
              onClick={onDownload}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </button>
          ) : (
            <button
              onClick={onAddToCart}
              className="px-6 py-2 bg-[#A5292A] text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
