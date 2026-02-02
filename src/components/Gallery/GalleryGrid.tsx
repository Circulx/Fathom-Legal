'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'

interface GalleryItem {
  _id: string
  title: string
  description: string
  imageData: string | string[]
  imageType: string
}

interface GalleryGridProps {
  initialItems: GalleryItem[]
  initialPage: number
  initialTotalPages: number
  initialTotalItems: number
}

export default function GalleryGrid({ 
  initialItems, 
  initialPage, 
  initialTotalPages, 
  initialTotalItems 
}: GalleryGridProps) {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(initialItems)
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [totalPages, setTotalPages] = useState(initialTotalPages)
  const [totalItems, setTotalItems] = useState(initialTotalItems)
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set())

  const fetchGalleryItems = async (page: number = 1) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/gallery?page=${page}&limit=8`)
      if (response.ok) {
        const data = await response.json()
        setGalleryItems(data.galleryItems || [])
        setTotalPages(data.pagination?.pages || 1)
        setTotalItems(data.pagination?.total || 0)
        setCurrentPage(page)
      }
    } catch (error) {
      console.error('Error fetching gallery items:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchGalleryItems(page)
    }
  }

  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      const start = Math.max(1, currentPage - 2)
      const end = Math.min(totalPages, start + maxVisiblePages - 1)
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
    }
    
    return pages
  }

  useEffect(() => {
    if (selectedImage) {
      const images = Array.isArray(selectedImage.imageData) ? selectedImage.imageData : [selectedImage.imageData]
      const newLoadedImages = new Set<number>()
      
      images.forEach((img, index) => {
        // Use document.createElement to avoid conflict with Next.js Image import
        const imgElement = document.createElement('img')
        imgElement.src = img
        imgElement.onload = () => {
          newLoadedImages.add(index)
          setLoadedImages(new Set(newLoadedImages))
        }
        imgElement.onerror = () => {
          console.error('Failed to preload image at index', index)
        }
      })
      
      return () => {
        setLoadedImages(new Set())
      }
    } else {
      setLoadedImages(new Set())
    }
  }, [selectedImage])

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse"
          >
            <div className="w-full h-64 bg-gray-200"></div>
            <div className="p-6">
              <div className="h-5 w-3/4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (galleryItems.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#A5292A' }}>
          <ImageIcon className="h-12 w-12 text-white" />
        </div>
        <h3 className="text-lg sm:text-xl md:text-xl font-semibold text-gray-900 mb-2">
          No gallery images yet
        </h3>
        <p className="text-sm sm:text-base text-gray-600">
          Gallery images will appear here once uploaded by our team.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {galleryItems.map((item) => {
          const images = item.imageData 
            ? (Array.isArray(item.imageData) ? item.imageData : [item.imageData])
            : []
          const firstImage = images[0]
          const imageCount = images.length
          
          if (!firstImage) {
            return null
          }
          
          return (
            <div 
              key={item._id} 
              className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer"
              onClick={() => {
                setSelectedImage(item)
                setCurrentImageIndex(0)
              }}
            >
              <div className="relative w-full h-64 overflow-hidden bg-gray-100">
                {firstImage?.startsWith('data:') ? (
                  <img
                    src={firstImage}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      console.error('Gallery image load error:', item.title)
                    }}
                  />
                ) : (
                  <Image
                    src={firstImage}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 20vw"
                    onError={(e) => {
                      console.error('Gallery image load error:', item.title)
                    }}
                  />
                )}
                {imageCount > 1 && (
                  <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
                    {imageCount} photos
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/90 rounded-full p-3">
                      <ImageIcon className="h-6 w-6 text-gray-700" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-base sm:text-lg md:text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                  {item.title}
                </h3>
                
                <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-4 line-clamp-3">
                  {item.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {totalPages > 1 && (
        <div className="mt-12 flex justify-center">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {getPageNumbers().map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-2 text-sm font-medium rounded-lg ${
                  currentPage === page
                    ? 'bg-red-600 text-white'
                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </nav>
        </div>
      )}

      {totalItems > 0 && (
        <div className="mt-4 text-center text-sm text-gray-600">
          Showing page {currentPage} of {totalPages} ({totalItems} total photos)
        </div>
      )}

      {selectedImage && (
        <ImageModal
          selectedImage={selectedImage}
          onClose={() => {
            setSelectedImage(null)
            setCurrentImageIndex(0)
          }}
          currentImageIndex={currentImageIndex}
          setCurrentImageIndex={setCurrentImageIndex}
          loadedImages={loadedImages}
          setLoadedImages={setLoadedImages}
        />
      )}
    </>
  )
}

function ImageModal({
  selectedImage,
  onClose,
  currentImageIndex,
  setCurrentImageIndex,
  loadedImages,
  setLoadedImages
}: {
  selectedImage: GalleryItem
  onClose: () => void
  currentImageIndex: number
  setCurrentImageIndex: (index: number | ((prev: number) => number)) => void
  loadedImages: Set<number>
  setLoadedImages: (set: Set<number> | ((prev: Set<number>) => Set<number>)) => void
}) {
  const images = Array.isArray(selectedImage.imageData) ? selectedImage.imageData : [selectedImage.imageData]
  const hasMultipleImages = images.length > 1

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="relative max-w-4xl max-h-[90vh] w-full flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-white/90 hover:bg-white rounded-full p-2 transition-colors"
        >
          <svg className="h-6 w-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="bg-white rounded-xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col overflow-y-auto">
          <div className="relative overflow-hidden flex-shrink-0 w-full" style={{ position: 'relative' }}>
            <div 
              className="flex transition-transform duration-300 ease-in-out"
              style={{ 
                transform: `translateX(-${currentImageIndex * (100 / images.length)}%)`,
                width: `${images.length * 100}%`,
                display: 'flex'
              }}
            >
              {images.map((img, index) => {
                const imageWidthPercent = 100 / images.length
                return (
                  <div
                    key={index}
                    className="flex-shrink-0 flex items-center justify-center bg-white relative"
                    style={{ 
                      width: `${imageWidthPercent}%`,
                      flex: `0 0 ${imageWidthPercent}%`,
                      minHeight: '500px',
                      padding: '1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxSizing: 'border-box'
                    }}
                  >
                    <div className="relative w-full h-full max-w-[calc(100%-3rem)] max-h-[70vh]">
                      <Image
                        src={img}
                        alt={`${selectedImage.title} - Image ${index + 1}`}
                        fill
                        className="object-contain"
                        style={{ 
                          opacity: loadedImages.has(index) ? 1 : 0.8,
                          transition: 'opacity 0.3s ease-in-out'
                        }}
                        unoptimized={img?.startsWith('data:')}
                        priority={index <= currentImageIndex + 1}
                        onLoad={() => {
                          setLoadedImages(prev => new Set(prev).add(index))
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
            
            {hasMultipleImages && (
              <>
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-3 transition-colors"
                  aria-label="Previous image"
                >
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-3 transition-colors"
                  aria-label="Next image"
                >
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm z-10">
                  {currentImageIndex + 1} / {images.length}
                </div>
                
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 transform translate-y-12 flex justify-center gap-2 z-10">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex 
                          ? 'bg-[#A5292A] w-8' 
                          : 'bg-white/70 hover:bg-white'
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          
          <div className="p-6 border-t border-gray-200 flex-shrink-0">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {selectedImage.title}
            </h3>
            {selectedImage.description && (
              <p className="text-gray-600">
                {selectedImage.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
