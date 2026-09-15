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

  // Duplicate enough times for a smooth continuous loop
  const loopLogos =
    logos.length >= 6
      ? [...logos, ...logos]
      : [...logos, ...logos, ...logos, ...logos]

  const renderLogo = (logo: ClientLogo, key: string) => {
    const cell = (
      <div className="h-44 sm:h-52 lg:h-56 w-full bg-white flex items-center justify-center overflow-hidden px-6 sm:px-8 lg:px-10 py-5 sm:py-6">
        <div className="relative w-full h-full overflow-hidden">
          <Image
            src={logo.imageUrl}
            alt={logo.name || 'Client logo'}
            fill
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 33vw"
            className="object-contain"
            unoptimized
          />
        </div>
      </div>
    )

    if (logo.websiteUrl) {
      return (
        <a
          key={key}
          href={logo.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={logo.name || 'Client logo'}
          className="block flex-shrink-0 w-[90vw] sm:w-[45vw] lg:w-[33.333vw] max-w-none hover:bg-gray-50 transition-colors"
        >
          {cell}
        </a>
      )
    }

    return (
      <div
        key={key}
        aria-label={logo.name || 'Client logo'}
        className="flex-shrink-0 w-[90vw] sm:w-[45vw] lg:w-[33.333vw] max-w-none"
      >
        {cell}
      </div>
    )
  }

  return (
    <section className="py-14 sm:py-16 bg-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-10">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            Our <span style={{ color: '#A5292A' }}>Clients</span>
          </h2>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div className="flex animate-marquee w-max">
          {loopLogos.map((logo, index) => renderLogo(logo, `${logo.id}-${index}`))}
        </div>
      </div>
    </section>
  )
}
