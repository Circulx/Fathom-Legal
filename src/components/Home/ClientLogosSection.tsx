'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

type ClientLogo = {
  id: string
  name: string
  imageUrl: string
  websiteUrl: string
}

export default function ClientLogosSection() {
  const [logos, setLogos] = useState<ClientLogo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const response = await fetch('/api/client-logos')
        if (!response.ok) return
        const data = await response.json()
        if (!cancelled) setLogos(data.logos || [])
      } catch {
        if (!cancelled) setLogos([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [])

  if (loading || logos.length === 0) {
    return null
  }

  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            Our <span style={{ color: '#A5292A' }}>Clients</span>
          </h2>
        </div>

        <div className="max-w-6xl mx-auto border border-gray-200">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {logos.map((logo) => {
              const cell = (
                <div className="aspect-[4/3] sm:aspect-[5/3] border border-gray-200 bg-white flex items-center justify-center p-5 sm:p-6 lg:p-8">
                  <div className="relative w-full h-full max-h-16 sm:max-h-20">
                    <Image
                      src={logo.imageUrl}
                      alt={logo.name || 'Client logo'}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                </div>
              )

              if (logo.websiteUrl) {
                return (
                  <a
                    key={logo.id}
                    href={logo.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={logo.name || 'Client logo'}
                    className="block hover:bg-gray-50 transition-colors"
                  >
                    {cell}
                  </a>
                )
              }

              return (
                <div key={logo.id} aria-label={logo.name || 'Client logo'}>
                  {cell}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
