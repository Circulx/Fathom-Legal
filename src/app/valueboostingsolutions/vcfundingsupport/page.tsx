'use client'

import React from "react";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import Image from "next/image";
import {
  ArrowRight,
  TrendingUp,
  DollarSign,
  Users,
  Scale,
  CheckCircle,
  Zap,
  Globe,
  Lock,
  FileText,
  Lightbulb,
  Target,
  PieChart,
  BarChart3,
  Handshake,
  Shield,
} from "lucide-react";

export default function VCFundingSupport() {
  const fundingServices = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Investor-Ready Documentation",
      description:
        "Comprehensive preparation of term sheets, shareholder agreements, and all necessary legal documents for funding rounds.",
      imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Strategic Positioning",
      description:
        "Expert guidance on presenting your business effectively to potential investors and highlighting key value propositions.",
      imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Due Diligence Management",
      description:
        "Streamlined due diligence process management to ensure smooth and efficient investor evaluation.",
      imageUrl: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      icon: <Scale className="w-6 h-6" />,
      title: "Legal Structure Optimization",
      description:
        "Optimize your corporate structure to be attractive to investors while protecting founder interests.",
      imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      icon: <Handshake className="w-6 h-6" />,
      title: "Negotiation Support",
      description:
        "Expert negotiation support to secure favorable terms while maintaining positive investor relationships.",
      imageUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Compliance & Governance",
      description:
        "Ensure regulatory compliance and establish strong corporate governance frameworks for investor confidence.",
      imageUrl: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
  ];

  const fundingStages = [
    {
      stage: "Pre-Seed",
      description:
        "Initial structure and documentation for early-stage funding",
      icon: <Lightbulb className="w-5 h-5" />,
    },
    {
      stage: "Seed Round",
      description:
        "Comprehensive support for first institutional funding round",
      icon: <Zap className="w-5 h-5" />,
    },
    {
      stage: "Series A",
      description: "Advanced structuring and negotiation for growth capital",
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      stage: "Series B+",
      description: "Complex funding rounds with multiple investor classes",
      icon: <BarChart3 className="w-5 h-5" />,
    },
  ];

  const benefits = [
    "Comprehensive term sheet preparation and review",
    "Shareholder agreement drafting and negotiation",
    "Corporate governance framework development",
    "Investor relations legal structure setup",
    "Due diligence coordination and management",
    "Regulatory compliance and reporting systems",
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Navbar page="vbs" />

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
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-10">
              <span style={{ color: '#A5292A' }}>VC Funding Support</span>
            </h1>
            
            {/* Breadcrumb */}
            <div className="flex justify-center">
              <Breadcrumb 
                items={[
                  { label: "Home", href: "/" },
                  { label: "Value Boosting Solutions", href: "/valueboostingsolutions" },
                  { label: "VC Funding Support" }
                ]} 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center px-4 sm:px-8 md:px-12 lg:px-20">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-8">
                Fuel Your <span style={{ color: '#A5292A' }}>Growth</span> with Smart Capital
              </h2>
              <p className="text-base text-gray-600 mb-8 leading-relaxed">
                Securing venture capital is a critical step in scaling your
                business. Our VC Funding Support service equips you with the
                tools and expertise to attract and secure investment. We prepare
                investor-ready documentation, including term sheets and
                shareholder agreements, and provide strategic positioning
                guidance to help you present your business effectively to
                potential investors. Additionally, we manage the due diligence
                process, ensuring a smooth and efficient experience.
              </p>

              <div className="space-y-4">
                {benefits.slice(0, 3).map((benefit, index) => (
                  <div key={index} className="flex items-start">
                    <div
                      className="w-2 h-2 rounded-full mr-4 mt-3 flex-shrink-0"
                      style={{ backgroundColor: "#A5292A" }}
                    ></div>
                    <span className="text-gray-700 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:pl-8">
              <div className="relative">
                <Image
                  src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="VC funding and investment growth"
                  width={500}
                  height={384}
                  className="rounded-2xl shadow-lg w-full h-96 object-cover"
                />
                <div
                  className="absolute inset-0 rounded-2xl"
                  style={{ backgroundColor: "rgba(165, 41, 42, 0.1)" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Funding Services Section */}
      <section className="py-20" style={{ backgroundColor: "#FAFAFA" }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Comprehensive <span style={{ color: '#A5292A' }}> VC Funding Services</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From initial preparation to final closing, we provide end-to-end
              legal support throughout your funding journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 sm:px-8 md:px-12 lg:px-20">
            {fundingServices.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group hover:scale-105 relative transform hover:-translate-y-2 h-full flex flex-col"
                style={{
                  transformStyle: 'preserve-3d',
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                {/* Image Section */}
                <div className="relative h-48 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url('${service.imageUrl}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  ></div>
                  {/* Dark Overlay */}
                  <div 
                    className="absolute inset-0"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
                  ></div>
                </div>
                
                {/* Text Section */}
                <div className="p-8 flex-1 flex flex-col justify-between" style={{ backgroundColor: '#2D2D2D' }}>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">
                      {service.title}
                    </h3>
                    <p className="text-white text-sm leading-relaxed opacity-90">
                      {service.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Funding Stages Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Support Across All Funding Stages
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Whether you're raising your first round or scaling through
              multiple Series, we provide tailored legal support for every stage
              of growth.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 px-4 sm:px-8 md:px-12 lg:px-20">
            {fundingStages.map((stage, index) => (
              <div
                key={index}
                className="text-center p-8 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group hover:bg-[#A5292A] hover:text-white hover:z-50 hover:scale-105 relative"
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center bg-[#A5292A] text-white mb-6 mx-auto group-hover:opacity-90 transition-opacity group-hover:bg-white group-hover:text-[#A5292A]"
                
                >
                  {stage.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 group-hover:text-white transition-colors">
                  {stage.stage}
                </h3>
                <p className="text-gray-600 leading-relaxed group-hover:text-white transition-colors">
                  {stage.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20" style={{ backgroundColor: "#FAFAFA" }}>
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center px-4 sm:px-8 md:px-12 lg:px-20">
            <div className="lg:order-2">
              <h2 className="text-3xl font-bold text-[#A5292A] mb-6">
                Why Startups Choose Our VC Support
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our VC Funding Support service combines deep legal expertise
                with practical business understanding, helping you navigate the
                complex world of venture capital with confidence and success.
              </p>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div
                    className="w-3 h-3 rounded-full mr-4 mt-2"
                    style={{ backgroundColor: "#A5292A" }}
                  ></div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Startup-Focused Expertise
                    </h4>
                    <p className="text-gray-600">
                      Deep understanding of startup ecosystem and investor
                      expectations.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div
                    className="w-3 h-3 rounded-full mr-4 mt-2"
                    style={{ backgroundColor: "#A5292A" }}
                  ></div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Proven Track Record
                    </h4>
                    <p className="text-gray-600">
                      Successfully supported numerous funding rounds across
                      various industries.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div
                    className="w-3 h-3 rounded-full mr-4 mt-2"
                    style={{ backgroundColor: "#A5292A" }}
                  ></div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      End-to-End Support
                    </h4>
                    <p className="text-gray-600">
                      Complete legal framework from initial preparation to
                      post-funding compliance.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:order-1">
              <div className="relative">
                <Image
                  src="https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
                  alt="Investment partnership and funding"
                  width={500}
                  height={384}
                  className="rounded-2xl shadow-lg w-full h-96 object-cover"
                />
                <div
                  className="absolute inset-0 rounded-2xl"
                  style={{ backgroundColor: "rgba(165, 41, 42, 0.1)" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Track Record Section */}
      <section className="py-16 relative overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('/number tracker.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/65"></div>
        
        {/* Content */}
        <div className="relative z-10 w-full px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg">Track Record Since 2016</h2>
          </div>
          
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-4 sm:px-8 md:px-12 lg:px-20">
            <div className="text-center relative">
              {/* Red Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: "#A5292A" }}>
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                  </svg>
                </div>
              </div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">8+</div>
              <div className="text-white text-lg md:text-xl font-medium drop-shadow-md">Years of Service</div>
            </div>
            
            <div className="text-center relative">
              {/* Red Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: "#A5292A" }}>
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
              </div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">500+</div>
              <div className="text-white text-lg md:text-xl font-medium drop-shadow-md">Cases Handled</div>
            </div>
            
            <div className="text-center relative">
              {/* Red Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: "#A5292A" }}>
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 7H16c-.8 0-1.54.37-2.01.99L12 10.5 10.01 7.99A2.5 2.5 0 0 0 8 7H5.46c-.8 0-1.54.37-2.01.99L1 10.5V22h2v-6h2.5l2.54-7.63A1.5 1.5 0 0 1 9.46 7H12c.8 0 1.54.37 2.01.99L16 10.5V22h4z"/>
                  </svg>
                </div>
              </div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">120+</div>
              <div className="text-white text-lg md:text-xl font-medium drop-shadow-md">IP Support</div>
            </div>
            
            <div className="text-center relative">
              {/* Red Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: "#A5292A" }}>
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
              </div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">98%</div>
              <div className="text-white text-lg md:text-xl font-medium drop-shadow-md">Client Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-1" style={{ backgroundColor: "#A5292A" }}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="p-12 rounded-2xl text-center">
              <h3 className="text-3xl font-bold text-white mb-6">
                Ready to Secure Your Next Funding Round?
              </h3>
              <p className="text-lg text-white/90 mb-8 leading-relaxed">
                Let our VC Funding Support service help you navigate the complex
                world of venture capital and secure the investment your business
                needs to scale.
              </p>
              <button
                className="bg-white text-[#A5292A] px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all inline-flex items-center"
                onClick={() => (window.location.href = "/contact")}
              >
                Start Your Funding Journey
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
