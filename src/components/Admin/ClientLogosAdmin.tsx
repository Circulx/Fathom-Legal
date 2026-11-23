'use client'

import { useCallback, useEffect, useState } from 'react'
import { Building2, Plus, Trash2, Upload, X } from 'lucide-react'
import Image from 'next/image'

type ClientLogo = {
  id: string
  name: string
  imageUrl: string
  websiteUrl: string
  displayOrder: number
}

export default function ClientLogosAdmin() {
  const [logos, setLogos] = useState<ClientLogo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showUpload, setShowUpload] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState('')

  const fetchLogos = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/admin/client-logos')
      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to load logos')
      }
      const data = await response.json()
      setLogos(data.logos || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load logos')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchLogos()
  }, [fetchLogos])

  const resetForm = () => {
    setImage(null)
    if (preview) URL.revokeObjectURL(preview)
    setPreview('')
  }

  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!image) {
      setError('Please choose a logo image from your computer')
      return
    }

    setUploading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('image', image)

      const response = await fetch('/api/admin/client-logos/upload', {
        method: 'POST',
        body: formData,
      })
      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || 'Upload failed')
      }

      setShowUpload(false)
      resetForm()
      await fetchLogos()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (logo: ClientLogo) => {
    if (!window.confirm('Remove this logo?')) return
    setError('')
    try {
      const response = await fetch(`/api/admin/client-logos/${logo.id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to delete logo')
      }
      setLogos((prev) => prev.filter((item) => item.id !== logo.id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete logo')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Client Logos</h1>
          <p className="text-gray-600 text-sm">
            Upload logo images from your computer. They appear on the homepage below Our Trusted Services.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setShowUpload(true)
            setError('')
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#A5292A] text-white text-sm font-semibold hover:bg-[#8a2122]"
        >
          <Plus className="w-4 h-4" />
          Add logo
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {loading ? (
        <div className="py-16 text-center text-gray-500">Loading logos…</div>
      ) : logos.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-gray-300 rounded-xl bg-white">
          <Building2 className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600">No client logos yet. Upload the first one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {logos.map((logo) => (
            <div
              key={logo.id}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
            >
              <div className="relative h-28 bg-gray-50 rounded-lg border border-gray-100 mb-3 flex items-center justify-center overflow-hidden">
                <Image
                  src={logo.imageUrl}
                  alt={logo.name || 'Client logo'}
                  fill
                  sizes="280px"
                  className="object-contain p-3"
                  unoptimized
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => void handleDelete(logo)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm text-gray-500 hover:text-red-700 hover:bg-red-50"
                  aria-label="Delete logo"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6 relative">
            <button
              type="button"
              onClick={() => {
                setShowUpload(false)
                resetForm()
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Upload logo</h2>
            <form onSubmit={(e) => void handleUpload(e)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Logo image *
                </label>
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#A5292A] bg-gray-50">
                  {preview ? (
                    <img src={preview} alt="Preview" className="max-h-36 object-contain p-2" />
                  ) : (
                    <div className="text-center text-gray-500 text-sm px-4">
                      <Upload className="w-6 h-6 mx-auto mb-2" />
                      Choose an image from your computer
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp,image/gif,image/svg+xml"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null
                      setImage(file)
                      if (preview) URL.revokeObjectURL(preview)
                      setPreview(file ? URL.createObjectURL(file) : '')
                    }}
                  />
                </label>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowUpload(false)
                    resetForm()
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading || !image}
                  className="px-4 py-2 text-sm font-semibold text-white bg-[#A5292A] rounded-lg hover:bg-[#8a2122] disabled:opacity-50"
                >
                  {uploading ? 'Uploading…' : 'Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
