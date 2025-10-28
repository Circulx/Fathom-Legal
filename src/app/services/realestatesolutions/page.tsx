'use client'

import React from "react";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import Image from "next/image";
import {
  ArrowRight,
  Home,
  FileText,
  Shield,
  Scale,
  MapPin,
  Calculator,
  Users,
  CheckCircle,
  Eye,
  FileCheck,
  DollarSign,
  UserCheck,
} from "lucide-react";

const RealEstateSolutions = () => {
  const propertyServices = [
    {
      title: "Documentation and Verification",
      description:
        "Ensuring the authenticity of property documents and verifying clear title ownership is essential. We provide thorough due diligence and verification services, including title searches, deed verification, and ownership history tracing.",
      icon: <FileText className="w-6 h-6" />,
    },
    {
      title: "Survey and Boundary Verification",
      description:
        "Our team conducts property surveys and addresses boundary disputes with neighboring properties, ensuring clarity and legal compliance.",
      icon: <MapPin className="w-6 h-6" />,
    },
    {
      title: "Insurance Documentation",
      description:
        "Reviewing property insurance policies and managing insurance claims related to property damage or loss, safeguarding your assets.",
      icon: <Shield className="w-6 h-6" />,
    },
    {
      title: "Legal Documentation",
      description:
        "From maintaining litigation records to issuing legal notices, we handle all legal documentation related to property management with precision and diligence.",
      icon: <Scale className="w-6 h-6" />,
    },
    {
      title: "Taxation",
      description:
        "Navigating tax regulations in your home country and the country where your property is located can be complex. We provide expert advice on property taxation, including property tax documentation and financial audits.",
      icon: <Calculator className="w-6 h-6" />,
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
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 sm:mb-8 md:mb-10">
            <span style={{ color: '#A5292A' }}>Real Estate Solutions</span>
            </h1>
            
            
            
           
            
            {/* Breadcrumb */}
            <div className="flex justify-center">
              <Breadcrumb 
                items={[
                  { label: "Home", href: "/" },
                  { label: "Services", href: "/services" },
                  { label: "Real Estate Solutions" }
                ]} 
                
              />
            </div>
          </div>
        </div>
      </section>

      {/* Property Disputes and Management Sections */}
      <section className="bg-gray-50">
        <div className="container mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          {/* Property Disputes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 mt-12 sm:mt-16 lg:mt-20 items-stretch">
            {/* Text Content with Dark Red Background */}
            <div className="lg:order-1 bg-[#A5292A] p-6 sm:p-8 lg:p-12 xl:p-16 flex flex-col justify-center">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
                Property Disputes
              </h2>
              <p className="text-white text-sm sm:text-base leading-relaxed mb-6 sm:mb-8">
                Property ownership can be fraught with challenges, particularly
                for owners facing disputes over ownership, boundaries,
                encroachments, or unauthorized constructions. At Fathom Legal,
                we understand the complexities involved in resolving these
                disputes, especially from abroad. Our expertise in property law
                and dispute resolution ensures efficient and effective solutions
                to protect your investments and interests.
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
            <div className="lg:order-2 h-64 sm:h-80 lg:h-auto">
              <Image
                src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Property disputes resolution"
                width={500}
                height={500}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Property Management */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch mt-8 lg:mt-0">
            {/* Image */}
            <div className="lg:order-1 h-64 sm:h-80 lg:h-auto">
              <Image
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2126&q=80"
                alt="Property management services"
                width={500}
                height={500}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Text Content with Dark Red Background */}
            <div className="lg:order-2 bg-[#A5292A] p-6 sm:p-8 lg:p-12 xl:p-16 flex flex-col justify-center">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
                Property Management
              </h2>
              <p className="text-white text-sm sm:text-base leading-relaxed mb-6 sm:mb-8">
                Managing properties remotely poses significant challenges for
                NRIs. They may struggle to find trustworthy property management
                services that can effectively handle tasks such as tenant
                screening, rent collection, property maintenance, and handling
                emergencies. Lack of regular oversight and communication can
                lead to issues such as delayed repairs, disputes with tenants,
                and financial mismanagement.
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
          </div>
        </div>
      </section>

      {/* Property Services Grid */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4 sm:mb-6">
              Comprehensive Property Services
            </h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-3xl mx-auto">
              Our specialized services cover every aspect of property management
              and legal compliance to protect your real estate investments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {propertyServices.map((service, index) => (
              <div
                key={index}
                className="bg-white p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group"
              >
                <div className="flex items-start mb-4 sm:mb-6">
                  <div
                    className="text-white p-2 sm:p-3 rounded-lg mr-3 sm:mr-4 flex-shrink-0 group-hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: "#A5292A" }}
                  >
                    {service.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                    {service.title}
                  </h3>
                </div>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inheritance and Succession Section */}
      <section className="py-12 sm:py-16 lg:py-20" style={{ backgroundColor: "#FAFAFA" }}>
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <div className="flex items-center justify-center mb-4 sm:mb-6">
                <div
                  className="text-white p-3 sm:p-4 rounded-lg"
                  style={{ backgroundColor: "#A5292A" }}
                >
                  <Users className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4 sm:mb-6">
                Inheritance and Succession
              </h2>
            </div>

            <div className="bg-white p-6 sm:p-8 lg:p-12 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                At Fathom Legal, we specialize in guiding NRIs through the
                complexities of inheritance and succession. Our comprehensive
                services cover all aspects of estate planning, including
                drafting wills, setting up trusts, and providing legal
                consultation on succession strategies and asset protection.
              </p>

              <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                We handle probate and estate administration, assist with trust
                management, and ensure compliance with tax regulations. Our
                expertise extends to dispute resolution, property transfer,
                guardianships, conservatorships, as well as charitable giving
                and legacy planning.
              </p>

              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                With a focus on international estate planning and digital asset
                management, we provide tailored solutions to facilitate a
                seamless transfer of wealth while navigating cross-border
                complexities and ensuring the protection of your digital assets.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12">
                <div className="flex items-center p-3 sm:p-4 bg-gray-50 border-2 border-gray-700 rounded-lg">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#A5292A] mr-2 sm:mr-3 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-gray-700">Estate Planning & Wills</span>
                </div>
                <div className="flex items-center p-3 sm:p-4 bg-gray-50 rounded-lg border-2 border-gray-700">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#A5292A] mr-2 sm:mr-3 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-gray-700">Trust Management</span>
                </div>
                <div className="flex items-center p-3 sm:p-4 bg-gray-50 border-2 border-gray-700 rounded-lg">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#A5292A] mr-2 sm:mr-3 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-gray-700">Probate Administration</span>
                </div>
                <div className="flex items-center p-3 sm:p-4 bg-gray-50 border-2 border-gray-700 rounded-lg">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#A5292A] mr-2 sm:mr-3 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-gray-700">Tax Compliance</span>
                </div>
                <div className="flex items-center p-3 sm:p-4 bg-gray-50 border-2 border-gray-700 rounded-lg">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#A5292A] mr-2 sm:mr-3 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-gray-700">Cross-border Expertise</span>
                </div>
                <div className="flex items-center p-3 sm:p-4 bg-gray-50 border-2 border-gray-700 rounded-lg">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#A5292A] mr-2 sm:mr-3 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-gray-700">
                    Digital Asset Protection
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Value Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4 sm:mb-6">
                Why Choose Fathom Legal for Real Estate?
              </h2>
              <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                Our specialized expertise in real estate law, combined with deep
                understanding of NRI requirements and cross-border complexities,
                makes us your trusted partner for all property-related legal
                matters.
              </p>
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start">
                  <div
                    className="w-2 h-2 sm:w-3 sm:h-3 rounded-full mr-3 sm:mr-4 mt-2 flex-shrink-0"
                    style={{ backgroundColor: "#A5292A" }}
                  ></div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1 sm:mb-2 text-sm sm:text-base">
                      Remote Property Management
                    </h4>
                    <p className="text-gray-600 text-sm sm:text-base">
                      Specialized services designed for NRIs and overseas
                      property owners.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div
                    className="w-2 h-2 sm:w-3 sm:h-3 rounded-full mr-3 sm:mr-4 mt-2 flex-shrink-0"
                    style={{ backgroundColor: "#A5292A" }}
                  ></div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1 sm:mb-2 text-sm sm:text-base">
                      Comprehensive Legal Support
                    </h4>
                    <p className="text-gray-600 text-sm sm:text-base">
                      End-to-end legal services from dispute resolution to
                      documentation.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div
                    className="w-2 h-2 sm:w-3 sm:h-3 rounded-full mr-3 sm:mr-4 mt-2 flex-shrink-0"
                    style={{ backgroundColor: "#A5292A" }}
                  ></div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1 sm:mb-2 text-sm sm:text-base">
                      Cross-border Expertise
                    </h4>
                    <p className="text-gray-600 text-sm sm:text-base">
                      Navigate international regulations and tax implications
                      with ease.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:pl-8">
              <div className="relative">
                <Image
                  src="https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
                  alt="Professional real estate consultation"
                  width={500}
                  height={384}
                  className="rounded-2xl shadow-lg w-full h-64 sm:h-80 lg:h-96 object-cover"
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

      {/* Call-to-Action Notice Box */}
      <section className="py-12 sm:py-16 lg:py-20" style={{ backgroundColor: "#FAFAFA" }}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div
              className="p-6 sm:p-8 lg:p-12 rounded-2xl text-center"
              style={{ backgroundColor: "#A5292A" }}
            >
              <p className="text-sm sm:text-base text-left text-white text-opacity-90 mb-6 sm:mb-8 leading-relaxed">
                Trust Fathom Legal to safeguard your real estate interests and
                enhance their value. Contact us today to learn more about our
                comprehensive real estate services.
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
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default RealEstateSolutions;







