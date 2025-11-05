'use client'

import React from "react";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Navbar page="privacy" />

      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
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
            <h1 className="text-5xl md:text-6xl font-bold  mb-6">
               <span style={{ color: '#A5292A' }}> Privacy Policy</span>
            </h1>
           
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Section 1: Who We Are */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">
                1. Who We Are
              </h2>
              <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
                <p className="mb-6">
                  Fathom Legal is a full-service legal consultancy based in India. We provide legal advisory, documentation, and compliance services, and also offer downloadable legal templates and policies through our website.
                </p>
                <p className="mb-6">
                  This Privacy Policy applies to all visitors, clients, and users ("you") who access or interact with our website or services.
                </p>
              </div>
            </div>

            {/* Section 2: Information We Collect */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">
                2. Information We Collect
              </h2>
              <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
                <p className="mb-6">
                  We collect and process the following types of information:
                </p>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-4 mt-8">
                  A. Information You Provide Directly
                </h3>
                <ul className="list-disc list-inside mb-6 space-y-2 ml-4">
                  <li>Name, email address, phone number, and other contact details.</li>
                  <li>Company or business information when engaging our legal services.</li>
                  <li>Billing or payment information for purchases or retainers.</li>
                  <li>Any documents or data shared with us for legal consultation or drafting purposes.</li>
                  <li>Messages or correspondence sent to us through forms, chat, or email.</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-4 mt-8">
                  B. Information Collected Automatically
                </h3>
                <p className="mb-4">
                  When you visit our website, we may automatically collect:
                </p>
                <ul className="list-disc list-inside mb-6 space-y-2 ml-4">
                  <li>IP address, browser type, operating system, and device details.</li>
                  <li>Date, time, and pages visited on our website.</li>
                  <li>Cookies or analytics data that help us improve site performance and user experience.</li>
                </ul>
              </div>
            </div>

            {/* Section 3: How We Use Your Information */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">
                3. How We Use Your Information
              </h2>
              <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
                <p className="mb-6">
                  We use your personal information for legitimate business purposes, including:
                </p>
                <ul className="list-disc list-inside mb-6 space-y-2 ml-4">
                  <li>Providing legal services and fulfilling our contractual obligations.</li>
                  <li>Processing payments and issuing invoices.</li>
                  <li>Responding to your queries, requests, or communications.</li>
                  <li>Delivering digital products or downloadable policies purchased on our website.</li>
                  <li>Sending legal updates, newsletters, or promotional content (only if you have opted in).</li>
                  <li>Maintaining compliance with applicable laws and professional obligations.</li>
                </ul>
                <p className="mb-6 font-semibold text-gray-800">
                  We will never sell or rent your personal information to third parties.
                </p>
              </div>
            </div>

            {/* Section 4: Sharing of Information */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">
                4. Sharing of Information
              </h2>
              <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
                <p className="mb-6">
                  Your personal information may be shared only in the following limited situations:
                </p>
                <ul className="list-disc list-inside mb-6 space-y-2 ml-4">
                  <li><strong>Service Providers:</strong> With trusted partners who assist in payment processing, hosting, or analytics, under strict confidentiality obligations.</li>
                  <li><strong>Legal or Regulatory Compliance:</strong> When required by law, court order, or regulatory authority.</li>
                  <li><strong>Professional Engagements:</strong> Within our affiliated entities or consultants involved in delivering your legal service, bound by confidentiality.</li>
                </ul>
              </div>
            </div>

            {/* Section 5: Data Retention */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">
                5. Data Retention
              </h2>
              <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
                <p className="mb-6">
                  We retain personal data only for as long as necessary to:
                </p>
                <ul className="list-disc list-inside mb-6 space-y-2 ml-4">
                  <li>Fulfil the purpose for which it was collected;</li>
                  <li>Comply with legal or regulatory obligations; or</li>
                  <li>Maintain professional records as required under applicable law.</li>
                </ul>
                <p className="mb-6">
                  After this period, data will be securely deleted or anonymized.
                </p>
              </div>
            </div>

            {/* Section 6: Data Security */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">
                6. Data Security
              </h2>
              <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
                <p className="mb-6">
                  We employ appropriate technical and organizational measures to protect your information from unauthorized access, misuse, or disclosure. These include secure servers, encrypted payment gateways, and restricted access to client files. However, while we take all reasonable precautions, no transmission or storage system can be guaranteed to be completely secure.
                </p>
              </div>
            </div>

            {/* Section 7: Cookies and Analytics */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">
                7. Cookies and Analytics
              </h2>
              <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
                <p className="mb-6">
                  Our website uses cookies and third-party analytics tools (such as Google Analytics) to improve website functionality and understand user behavior. You can control cookie settings through your browser. Disabling cookies may affect some website features.
                </p>
              </div>
            </div>

            {/* Section 8: Your Rights */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">
                8. Your Rights
              </h2>
              <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
                <p className="mb-6">
                  Under applicable data protection laws, you may have the right to:
                </p>
                <ul className="list-disc list-inside mb-6 space-y-2 ml-4">
                  <li>Access and request a copy of your personal data;</li>
                  <li>Request correction or deletion of your information;</li>
                  <li>Withdraw consent for marketing communications;</li>
                  <li>Raise concerns regarding the processing of your data.</li>
                </ul>
                <p className="mb-6">
                  You can exercise these rights by emailing us at <a href="mailto:support@fathomlegal.in" className="text-[#A5292A] hover:underline">support@fathomlegal.in</a>.
                </p>
              </div>
            </div>

            {/* Section 9: Data Transfers */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">
                9. Data Transfers
              </h2>
              <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
                <p className="mb-6">
                  If you are located outside India, please note that your information may be transferred to and processed in India. By using our website or services, you consent to this transfer in accordance with applicable laws.
                </p>
              </div>
            </div>

            {/* Section 10: Confidentiality of Legal Information */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">
                10. Confidentiality of Legal Information
              </h2>
              <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
                <p className="mb-6">
                  All client information and documents shared with Fathom Legal in the course of legal engagements are treated as strictly confidential and protected by the principles of professional legal privilege. Such information will not be disclosed to any third party without the client's express consent, except as required by law.
                </p>
              </div>
            </div>

            {/* Section 11: Third-Party Links */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">
                11. Third-Party Links
              </h2>
              <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
                <p className="mb-6">
                  Our website may include links to other websites or platforms. We are not responsible for the content or privacy practices of such third-party sites and encourage you to review their policies before sharing any personal data.
                </p>
              </div>
            </div>

            {/* Section 12: Updates to This Policy */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">
                12. Updates to This Policy
              </h2>
              <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
                <p className="mb-6">
                  We may update this Privacy Policy periodically to reflect legal, operational, or technological changes. The most recent version will always be available on our website with the "Last Updated" date. Continued use of our website or services after any such update constitutes your acceptance of the revised policy.
                </p>
              </div>
            </div>

            {/* Section 13: Contact Us */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">
                13. Contact Us
              </h2>
              <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
                <p className="mb-6">
                  If you have any questions or concerns about this Privacy Policy or the handling of your data, please contact us at:
                </p>
                <p className="mb-6">
                  <strong>Email:</strong> <a href="mailto:Assist@fathomlegal.com" className="text-[#A5292A] hover:underline">Assist@fathomlegal.com</a>
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
