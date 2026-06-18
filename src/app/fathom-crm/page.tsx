'use client'

import { Navbar } from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { Scale } from 'lucide-react'

export default function FathomCRM() {
  return (
    <main>
      <Navbar page="fathom-crm" />
      
      <div className="pt-20">
        {/* Hero Section */}
        <section className="py-20 px-4 md:px-8 lg:px-12 bg-white">
          <div className="container mx-auto max-w-4xl">
            {/* Heading */}
            <div className="text-center mb-12">
              <h3 className="text-sm md:text-base font-semibold tracking-widest mb-8" style={{ color: '#A5292A' }}>
                ADVOCATES & CORPORATE CONSULTANTS
              </h3>

              {/* Icon */}
              <div className="flex justify-center mb-12">
                <div 
                  className="w-24 h-24 rounded-3xl flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: '#A5292A' }}
                >
                  <Scale className="w-12 h-12 text-white" strokeWidth={1.5} />
                </div>
              </div>

              {/* Main Headline */}
              <div className="mb-8">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 text-balance mb-2">
                  Let our experience{' '}
                  <span style={{ color: '#A5292A', fontStyle: 'italic' }}>pave the path</span>{' '}
                  to your success.
                </h1>
              </div>

              {/* Description */}
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto text-balance leading-relaxed mb-12">
                Tell us about your matter, share a few details, and book a consultation with the right member of our legal team — all in one place.
              </p>

              {/* CTA Button */}
              <Link href="/contact">
                <button 
                  className="px-8 py-4 rounded-full font-semibold text-lg text-white hover:opacity-90 transition-all inline-flex items-center gap-2"
                  style={{ backgroundColor: '#A5292A' }}
                >
                  Begin your enquiry →
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-4 md:px-8 lg:px-12 bg-white border-t border-gray-100">
          <div className="container mx-auto max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Stat 1 */}
              <div className="text-center">
                <p className="text-4xl md:text-5xl font-bold mb-2" style={{ color: '#A5292A' }}>
                  Since 2016
                </p>
                <p className="text-sm font-semibold tracking-widest text-gray-600">
                  TRUSTED COUNSEL
                </p>
              </div>

              {/* Stat 2 */}
              <div className="text-center border-l border-r border-gray-200">
                <p className="text-4xl md:text-5xl font-bold mb-2" style={{ color: '#A5292A' }}>
                  Global
                </p>
                <p className="text-sm font-semibold tracking-widest text-gray-600">
                  SERVICE REACH
                </p>
              </div>

              {/* Stat 3 */}
              <div className="text-center">
                <p className="text-4xl md:text-5xl font-bold mb-2" style={{ color: '#A5292A' }}>
                  20 min
                </p>
                <p className="text-sm font-semibold tracking-widest text-gray-600">
                  FREE CONSULT
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  )
}
