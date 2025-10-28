'use client'

import React, { useState } from "react";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import Image from "next/image";

const IntellectualProperty = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const services = [
    {
      title: "Trademark Registration and Protection",
      description:
        "We assist with the entire trademark registration process, including conducting thorough trademark searches, filing applications, responding to office actions, and enforcing trademark rights through litigation or alternative dispute resolution.",
      image:
        "https://images.unsplash.com/photo-1619418602850-35ad20aa1700?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "Copyright Registration and Enforcement",
      description:
        "Our team provides guidance on registering copyrights for various creative works, including literary, artistic, musical, software, and architectural designs. We also offer enforcement services such as cease and desist letters, DMCA takedown notices, and litigation.",
      image:
        "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
    },
    {
      title: "Trade Secret Protection",
      description:
        "We advise on safeguarding trade secrets by drafting non-disclosure agreements (NDAs), implementing protection policies, conducting internal audits to identify valuable trade secrets, and pursuing legal action against misappropriation.",
      image:
        "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
    },
    {
      title: "Intellectual Property Licensing",
      description:
        "Our lawyers negotiate and draft licensing agreements for trademarks, copyrights, trade secrets, and know-how. We help clients structure licensing deals and ensure compliance with all agreement terms.",
      image:
        "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
    },
    {
      title: "IP Portfolio Management",
      description:
        "We provide strategic management of intellectual property portfolios, conducting IP audits, assessing the value of IP assets, identifying monetization opportunities, and implementing strategies to maximize IP value.",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
    },
    {
      title: "Domain Name Disputes",
      description:
        "We resolve domain name disputes, including issues of domain name infringement, cybersquatting, and hijacking. Our services include legal representation in domain name arbitration and litigation.",
      image:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
    },
    {
      title: "Brand Protection",
      description:
        "We develop comprehensive strategies for brand protection, including monitoring for trademark infringement, counterfeit goods, and brand dilution. Our proactive measures safeguard your brand's reputation and enforce your rights against infringers.",
      image:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
    },
    {
      title: "IP Due Diligence",
      description:
        "In corporate transactions such as mergers, acquisitions, and licensing deals, we conduct thorough IP due diligence to assess assets and risks, informing decision-making and mitigating potential liabilities.",
      image:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
    },
    {
      title: "IP Litigation and Dispute Resolution",
      description:
        "Our team represents clients in IP litigation, including infringement lawsuits, opposition proceedings, and appeals. We also use alternative dispute resolution methods, such as mediation and arbitration, to resolve disputes efficiently.",
      image:
        "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
    },
    {
      title: "IP Strategy Consulting",
      description:
        "We provide strategic advice and guidance on IP matters, helping clients develop long-term IP strategies aligned with business objectives, evaluate competitive IP landscapes, and manage IP-related risks and opportunities.",
      image:
        "https://images.unsplash.com/photo-1553484771-371a605b060b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Navbar page="services" />

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
              <span style={{ color: '#A5292A' }}>Intellectual Property</span>
            </h1>
            
            {/* Breadcrumb */}
            <div className="flex justify-center">
              <Breadcrumb 
                items={[
                  { label: "Home", href: "/" },
                  { label: "Services", href: "/services" },
                  { label: "Intellectual Property" }
                ]} 
                
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 1 - Intro Content with Side Navigation */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
            {/* Side Navigation Box */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-black p-6 sticky top-24">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Our IP Services
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
                      className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-[#A5292A] hover:bg-gray-50 transition-all duration-200 group border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center">
                        <div className="w-1 h-4 bg-[#A5292A] mr-3 rounded-full flex-shrink-0"></div>
                        <span className="text-left">{service.title}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#A5292A] transition-colors duration-200 flex-shrink-0" />
                    </button>
                  ))}
                </nav>
              </div>
            </div>
            {/* Services We Offer Content */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">
                Our IP Services Include:
              </h2>
              <p className="text-base text-gray-800 leading-relaxed">
                At Fathom Legal, we offer a comprehensive range of Intellectual
                Property (IP) services designed to protect and maximize the value
                of your creative assets. Our expertise includes trademark registration,
                copyright protection, trade secret safeguarding, IP licensing,
                portfolio management, and domain name disputes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 - Detailed Services */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-12 lg:px-24 xl:px-32">
          {services.map((service, index) => (
            <div
              key={index}
              id={`service-${index}`}
              className={`grid lg:grid-cols-2 gap-0 items-stretch ${
                index !== services.length - 1 ? "" : ""
              }`}
            >
              {/* Text Content with Dark Red Background */}
              <div className={`${index % 2 === 0 ? "order-1" : "order-2"} bg-[#A5292A] p-16 flex flex-col justify-center`}>
                <h3 className="text-2xl font-bold text-white mb-6">
                  {service.title}
                </h3>
                <p className="text-white text-base leading-relaxed mb-8">
                  {service.description}
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
              <div className={`${index % 2 === 0 ? "order-2" : "order-1"} h-full`}>
                <Image
                  src={service.image}
                  alt={`${service.title} illustration`}
                  width={500}
                  height={500}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3 - Notice Box (Call to Action) */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div
            className="max-w-4xl mx-auto text-center p-12 rounded-2xl"
            style={{ backgroundColor: "#A5292A" }}
          >
            <p className="text-base text-left text-white text-opacity-90 mb-8 leading-relaxed">
              Secure your intellectual property with Fathom Legal. Reach out to
              us for dedicated support in trademark and copyright protection,
              tailored to safeguard your creative and brand assets.
            </p>
            <div className="text-center">
              <a 
                href="https://calendly.com/ishita-fathomlegal/free-20-mins-consultation"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 bg-white border-2 border-gray-300 text-[#A5292A] font-semibold rounded-lg hover:border-gray-400 hover:bg-[#A5292A] hover:text-white transition-all duration-300 group"
              >
                Book your free consultation <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default IntellectualProperty;







