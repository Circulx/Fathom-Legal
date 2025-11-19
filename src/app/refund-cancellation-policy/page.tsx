'use client'

import React from "react";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RefundCancellationPolicy() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Navbar page="refund" />

      {/* Hero Section */}
      <section className="pt-28 pb-20 relative overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('/contactusbg.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span style={{ color: '#A5292A' }}>Refund Policy</span>
            </h1>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Introduction */}
            <div className="mb-16">
              <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
                <p className="mb-6">
                  At Fathom Legal, Advocates & Corporate Consultants we aim to ensure complete transparency and satisfaction with every purchase made through our website. All our products — including templates, agreements, policies, and other digital resources — are delivered electronically and are made available for instant download immediately after successful payment.
                </p>
              </div>
            </div>

            {/* Eligibility for Refunds */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">
                Eligibility for Refunds
              </h2>
              <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
                <p className="mb-6">
                  As our products are digital and cannot be "returned," refunds are generally not provided once the product has been downloaded, accessed, or delivered to the user's registered email address. However, refunds may be considered in the following limited circumstances:
                </p>
                
                <ol className="list-decimal list-inside mb-6 space-y-4 ml-4">
                  <li>
                    <strong>Duplicate Payment:</strong> If you have been charged more than once for the same order due to a system or processing error.
                  </li>
                  <li>
                    <strong>Failed or Incomplete Download:</strong> If your payment has been successfully processed but you have not received the product download link or are unable to access it, and our support team is unable to resolve the issue within three (3) business days of notification.
                  </li>
                  <li>
                    <strong>Bank or Payment Gateway Error:</strong> If a transaction is charged erroneously due to a malfunction or technical issue originating from the payment gateway, banking partner, or network provider.
                  </li>
                </ol>
              </div>
            </div>

            {/* Process for Requesting a Refund */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">
                Process for Requesting a Refund
              </h2>
              <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
                <p className="mb-6">
                  To initiate a refund request, please contact us at <a href="mailto:assist@fathomlegal.com" className="text-[#A5292A] hover:underline">assist@fathomlegal.com</a> within seven (7) calendar days from the date of the transaction. Include your order number, proof of payment, and a brief description of the issue.
                </p>
                <p className="mb-6">
                  Our team will review your request and respond within two (2) business days. Approved refunds will be processed to the original payment method within seven (7) to ten (10) business days.
                </p>
              </div>
            </div>

            {/* Non-Refundable Situations */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">
                Non-Refundable Situations
              </h2>
              <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
                <p className="mb-6">
                  Refunds will not be issued in the following cases:
                </p>
                <ul className="list-disc list-inside mb-6 space-y-2 ml-4">
                  <li>If the product has been downloaded, opened, or accessed.</li>
                  <li>If dissatisfaction is based on personal preferences, expectations, or suitability of content.</li>
                  <li>If the refund request is made beyond the stated seven-day period.</li>
                </ul>
              </div>
            </div>

            {/* Contact */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">
                Contact
              </h2>
              <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
                <p className="mb-6">
                  For any concerns related to refunds or payment errors, please write to us at <a href="mailto:assist@fathomlegal.com" className="text-[#A5292A] hover:underline">assist@fathomlegal.com</a>. Our customer support team is available Monday to Friday, 10:00 AM to 6:00 PM (IST).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

