'use client'

import React from "react";
import { Navbar } from "@/components/Navbar";
import { ArrowRight } from "lucide-react";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import Image from "next/image";

export default function GeneralCorporateAdvisory() {
  const services = [
    {
      title: "Private Equity and Venture Capital",
      text: "Navigating the complexities of private equity and venture capital transactions requires expert legal guidance. Our team assists with every aspect of these transactions, from due diligence and structuring to negotiation and closing. We ensure that your interests are protected and that you achieve favourable outcomes.",
      image:
        "https://images.unsplash.com/photo-1635859890085-ec8cb5466806?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      imageAlt: "Business handshake representing private equity deals",
    },
    {
      title: "Intellectual Property",
      text: "Protecting your intellectual property (IP) is crucial in maintaining your competitive edge. We offer comprehensive IP services, including trademark registration, copyright protection, patent filing, and IP portfolio management. Our goal is to safeguard your innovations and creations against infringement.",
      image:
        "https://images.unsplash.com/photo-1593444285553-28163240e3f1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      imageAlt: "Intellectual property concept with lightbulb and gears",
    },
    {
      title: "Review and Drafting of Agreements and Policies",
      text: "Clear, precise agreements and policies are the backbone of any successful business. We specialize in drafting, reviewing, and negotiating a wide range of legal documents, including employment contracts, partnership agreements, service agreements, and corporate policies. Our meticulous approach ensures that your contracts are enforceable and aligned with your business objectives.",
      image:
        "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
      imageAlt: "Legal documents and contracts on desk",
    },
    {
      title: "Legal Advisory on Business Transactions",
      text: "From mergers and acquisitions to joint ventures and strategic alliances, our legal advisory services cover all aspects of business transactions. We provide thorough due diligence, risk assessment, and strategic advice to facilitate smooth and successful transactions.",
      image:
        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
      imageAlt: "Business meeting for M&A transactions",
    },
    {
      title: "Strengthening Sales Processes by Expert Legal Guidance",
      text: "Effective sales processes are vital for business growth. Our legal experts help streamline and strengthen your sales operations by providing guidance on compliance, contract management, and dispute resolution. We ensure that your sales processes are legally sound and optimized for success.",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
      imageAlt: "Sales growth chart and business analytics",
    },
    {
      title: "Day-to-Day Advisory on Business Operations",
      text: "Running a business involves navigating a myriad of legal issues on a daily basis. Our team offers ongoing legal support to address everyday operational challenges, from regulatory compliance and employment law to commercial disputes and corporate governance. We are your trusted legal partner, committed to ensuring your business operates smoothly and efficiently.",
      image:
        "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
      imageAlt: "Modern office team working on business operations",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Navbar page="services" />

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
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 sm:mb-8 md:mb-10">
            <span style={{ color: '#A5292A' }}>General Corporate Advisory</span>
            </h1>
            
            
           
            
            {/* Breadcrumb */}
            <div className="flex justify-center">
              <Breadcrumb 
                items={[
                  { label: "Home", href: "/" },
                  { label: "Services", href: "/services" },
                  { label: "General Corporate Advisory" }
                ]} 
                
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 1 - Intro Content with Side Navigation */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 max-w-7xl mx-auto">
             {/* Side Navigation Box */}
             <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="bg-white rounded-lg shadow-sm border border-black p-4 sm:p-6 lg:sticky lg:top-24">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
                  Our Services
                </h3>
                <nav className="space-y-0">
                  {services.map((service, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        const element = document.getElementById(`service-${index}`);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="w-full flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-[#A5292A] hover:bg-gray-50 transition-all duration-200 group border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center">
                        <div className="w-1 h-3 sm:h-4 bg-[#A5292A] mr-2 sm:mr-3 rounded-full flex-shrink-0"></div>
                        <span className="text-left">{service.title}</span>
                      </div>
                      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover:text-[#A5292A] transition-colors duration-200 flex-shrink-0" />
                    </button>
                  ))}
                </nav>
              </div>
            </div>
            {/* Services We Offer Content */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">
                Services We Offer:
              </h2>
              <p className="text-sm sm:text-base text-gray-800 leading-relaxed">
                At Fathom Legal, our General Corporate Advisory services are
                designed to support businesses at every stage of their growth. We
                offer a comprehensive suite of legal solutions tailored to meet
                the unique needs of startups, SMEs, and established enterprises.
                Our team of experienced corporate lawyers is dedicated to
                providing practical, insightful, and proactive legal advice to
                help your business thrive in a competitive market.
              </p>
            </div>

           
          </div>
        </div>
      </section>

      {/* Section 2 - Detailed Services */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-100 ">
        <div className="container mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 ">
          {services.map((service, index) => (
            <div
              key={index}
              id={`service-${index}`}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch mb-8 lg:mb-0  lg:ml-20 lg:mr-20 ${
                index !== services.length - 1 ? "lg:mb-8" : ""
              }`}
            >
              {/* Text Content with Dark Red Background */}
              <div className={`${index % 2 === 0 ? "lg:order-1" : "lg:order-2"} bg-[#A5292A] p-6 sm:p-8 lg:p-12 xl:p-16 flex flex-col justify-center`}>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
                  {service.title}
                </h3>
                <p className="text-white text-sm sm:text-base leading-relaxed mb-6 sm:mb-8">
                  {service.text}
                </p>
                <a 
                  href="https://calendly.com/ishita-fathomlegal/free-20-mins-consultation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-white hover:text-gray-200 transition-colors text-sm font-medium"
                >
                  Contact Us
                  <ArrowRight className="ml-2 w-4 h-4" />
                </a>
              </div>

              {/* Image */}
              <div className={`${index % 2 === 0 ? "lg:order-2" : "lg:order-1"} relative h-64 sm:h-80 lg:h-auto`}>
                <Image
                  src={service.image}
                  alt={service.imageAlt}
                  width={600}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3 - Notice Box (Call to Action) */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div
            className="max-w-4xl mx-auto text-center p-6 sm:p-8 lg:p-12 rounded-2xl"
            style={{ backgroundColor: "#A5292A" }}
          >
            <p className="text-sm sm:text-base text-left text-white text-opacity-90 mb-6 sm:mb-8 leading-relaxed">
              At Fathom Legal, we understand that every business is unique. Our
              General Corporate Advisory services are tailored to provide the
              specific legal support your business needs, allowing you to focus
              on what you do best—growing your business. Contact us today to
              learn how we can support your corporate legal needs.
            </p>
            <div className="text-center">
            <a 
              href="https://calendly.com/ishita-fathomlegal/free-20-mins-consultation"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white border-2 border-gray-300 text-[#A5292A] font-semibold rounded-lg hover:border-gray-400 hover:bg-[#A5292A] hover:text-white transition-all duration-300 group text-sm sm:text-base"
            >
              Book your slot today <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

