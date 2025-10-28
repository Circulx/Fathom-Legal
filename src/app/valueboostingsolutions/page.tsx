'use client'

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import Image from "next/image";
import {
  ArrowRight,
  ChevronRight,
  Star,
  UserCheck,
  Shield,
  TrendingUp,
  FileText,
  Lock,
} from "lucide-react";

export default function ValueBoostingSolutions() {

  const services = [
    {
      icon: <UserCheck className="w-8 h-8" />,
      title: "Chief Legal Officer Service",
      description:
        "Get executive-level legal expertise without the full-time cost. Our CLO service provides strategic legal leadership for your growing business.",
      slug: "chieflegalofficerservice",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Tech Legal Blueprint",
      description:
        "Comprehensive legal framework designed specifically for tech companies, covering compliance, IP protection, and regulatory requirements.",
      slug: "techlegalblueprint",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "VC Funding Support",
      description:
        "Navigate the complex world of venture capital funding with expert legal support for term sheets, due diligence, and closing processes.",
      slug: "vcfundingsupport",
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Pitch Deck Services",
      description:
        "Professional legal review and enhancement of your pitch decks to ensure compliance and maximize investor appeal while protecting your interests.",
      slug: "pitchdeckservices",
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: "Cybersecurity Services",
      description:
        "Comprehensive cybersecurity compliance and legal protection services to safeguard your business against digital threats and regulatory risks.",
      slug: "cybersecurityservices",
    },
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      text: "Fathom Legal's CLO service has been instrumental in scaling our business. Their strategic legal guidance helped us navigate complex regulations while focusing on growth. The team's expertise in corporate law and compliance has been invaluable for our tech startup's expansion.",
      rating: 5,
      photo: "/Lakshay Sethi.jpg",
    },
    {
      name: "Priya Sharma",
      text: "The Tech Legal Blueprint service provided us with a solid foundation for our technology business. Their expertise in IP protection and compliance is exceptional. They helped us secure our intellectual property and navigate complex regulatory requirements that would have been overwhelming without their guidance.",
      rating: 5,
      photo: "/Rajat.jpg",
    },
    {
      name: "Vikram Patel",
      text: "Their VC funding support was crucial during our Series A round. The team's experience with term sheets and due diligence processes made all the difference. They protected our interests while ensuring a smooth closing process that exceeded our expectations.",
      rating: 5,
      photo: "/pooja.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Navbar page="vbs" />

      {/* Hero Section */}
      <section
        className="text-white py-20 relative"
        style={{ minHeight: "70vh" }}
      >
        {/* Background Image Layer */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>

        {/* Dark Overlay */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
        ></div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Hero Content */}
          <div className="text-center mb-16">
           
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white">
              Value Boosting
              <span style={{ color: "#A5292A" }}> Solutions</span>
            </h1>
            
            {/* Breadcrumb */}
            <div className="flex justify-center">
              <Breadcrumb 
                items={[
                  { label: "Home", href: "/" },
                  { label: "Value Boosting Solutions" }
                ]} 
                className="[&_a]:text-white [&_a]:hover:text-[#A5292A] [&_span]:text-white [&_svg]:text-white"
              />
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group"
              >
                <div className="text-[#A5292A] mb-6 group-hover:opacity-80 transition-opacity">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>
              
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <Breadcrumb 
        items={[
          { label: "Home", href: "/" },
          { label: "Value Boosting Solutions" }
        ]} 
      />

      {/* Testimonials Section */}
     
     <section id="testimonials" className="py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              The <span style={{ color: "#A5292A" }}>Trust</span> we earned
            </h2>
            <p className="text-xl md:text-2xl text-[#A5292A]">
              What our clients say about our legal services
            </p>
          </div>

          {/* Moving Testimonials Carousel */}
          <div className="relative overflow-hidden">
            <div className="flex animate-marquee" style={{ width: 'max-content' }}>
              {/* First set of testimonials */}
              {[...Array(4)].flatMap(() => testimonials).map((testimonial, index) => (
  <div
    key={index}
    className="flex-shrink-0 w-80 sm:w-[28rem] mx-4 sm:mx-6 bg-gray-100 p-4 sm:p-5 rounded-xl shadow-sm border border-gray-200"
  >
    <div className="flex justify-between items-start mb-3">
      <div className="flex">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star
            key={i}
            className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current"
          />
        ))}
      </div>
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-300 flex items-center justify-center">
        {testimonial.photo ? (
          <Image
            src={testimonial.photo}
            alt={testimonial.name}
            width={48}
            height={48}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-400 flex items-center justify-center">
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        )}
      </div>
    </div>
    <div className="mb-2">
      <div className="font-semibold text-gray-900 text-xs sm:text-sm mb-1">
        {testimonial.name}
      </div>
      <p className="text-gray-800 italic text-xs sm:text-sm leading-relaxed">
        "{testimonial.text}"
      </p>
    </div>
  </div>
))}

            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section 
        id="contact" 
        className="py-12"
        style={{ backgroundColor: "#A5292A" }}
      >
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to take your business to the next level?
            </h2>
            <p className="text-lg text-white/90 max-w-3xl mx-auto">
              Contact Fathom Legal today to learn more about our value-boosting services and how we can support your growth.
            </p>
          </div>

          <div className="flex justify-center">
            <a 
              href="https://calendly.com/ishita-fathomlegal/free-20-mins-consultation"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-white border-2 border-white text-[#A5292A] font-semibold hover:bg-gray-100 transition-all duration-300 group text-lg"
            >
              Get Quote <ArrowRight className="ml-2 w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
