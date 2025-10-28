'use client'

import React from "react";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import Image from "next/image";
import {
  ArrowRight,
  Building2,
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
  Gavel,
  TrendingUp,
  Handshake,
} from "lucide-react";

const REITSolutions = () => {
  const reitServices = [
    {
      title: "Structuring and Formation",
      description:
        "We guide REIT owners through entity formation and structuring, ensuring compliance with regulatory requirements and optimizing legal structures to achieve objectives.",
      icon: <Building2 className="w-6 h-6" />,
      image:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      title: "Regulatory Compliance",
      description:
        "Our team ensures REITs meet tax laws, securities regulations, and REIT-specific rules, handling reporting obligations, tax filings, and obtaining regulatory approvals.",
      icon: <Shield className="w-6 h-6" />,
      image:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      title: "Property Acquisition and Disposition",
      description:
        "We manage legal aspects of property transactions, from due diligence to negotiating agreements, ensuring smooth transfers and identifying potential risks.",
      icon: <MapPin className="w-6 h-6" />,
      image:
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80",
    },
    {
      title: "Leasing and Tenant Relations",
      description:
        "We draft and negotiate lease agreements, advise on tenant disputes, and handle legal matters related to tenant relations to protect the REIT's interests.",
      icon: <Handshake className="w-6 h-6" />,
      image:
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2126&q=80",
    },
    {
      title: "Financing and Capital Markets",
      description:
        "Our lawyers assist with debt financing, equity offerings, and securities compliance, advising on capital raising strategies and corporate governance.",
      icon: <TrendingUp className="w-6 h-6" />,
      image:
        "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      title: "Corporate Governance and Compliance",
      description:
        "We provide guidance on best practices, fiduciary duties, and regulatory compliance, assisting with board governance, internal investigations, and corporate compliance programs.",
      icon: <Users className="w-6 h-6" />,
      image:
        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2084&q=80",
    },
    {
      title: "Litigation and Dispute Resolution",
      description:
        "In case of disputes, we represent REIT owners in litigation, arbitration, and mediation, handling contract, property, shareholder, and regulatory disputes effectively.",
      icon: <Gavel className="w-6 h-6" />,
      image:
        "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
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
            <span style={{ color: '#A5292A' }}>REIT Solutions</span>
            </h1>
            
            
           
            
            {/* Breadcrumb */}
            <div className="flex justify-center">
              <Breadcrumb 
                items={[
                  { label: "Home", href: "/" },
                  { label: "Services", href: "/services" },
                  { label: "REIT Solutions" }
                ]} 
                
              />
            </div>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 sm:mb-8">
              Legal Services for Real Estate Investment Trusts (REITs)
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              At Fathom Legal, we provide comprehensive legal support to Real
              Estate Investment Trust (REIT) owners, helping them navigate
              complex legal challenges and mitigate risks. Our expertise
              includes:
            </p>
          </div>
        </div>
      </section>

      {/* REIT Services Sections */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-8 lg:px-16 xl:px-24 2xl:px-32">
          {reitServices.map((service, index) => (
            <div
              key={index}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch mb-8 lg:mb-0  lg:ml-20 lg:mr-20 ${
                index !== reitServices.length - 1 ? "lg:mb-8" : ""
              }`}
            >
              {/* Text Content with Dark Red Background */}
              <div className={`${index % 2 === 0 ? "lg:order-1" : "lg:order-2"} bg-[#A5292A] p-6 sm:p-8 lg:p-12 xl:p-16 flex flex-col justify-center`}>
                <div className="flex items-center mb-4 sm:mb-6">
                  <div className="text-white p-2 sm:p-3 rounded-lg mr-3 sm:mr-4 flex-shrink-0">
                    {service.icon}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    {service.title}
                  </h3>
                </div>
                <p className="text-white text-sm sm:text-base leading-relaxed mb-6 sm:mb-8">
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
              <div className={`${index % 2 === 0 ? "lg:order-2" : "lg:order-1"} relative h-64 sm:h-80 lg:h-auto`}>
                <Image
                  src={service.image}
                  alt={service.title}
                  width={500}
                  height={500}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us for REIT Services */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4"> 
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 2xl:px-32">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4 sm:mb-6">
                Why Choose Fathom Legal for REIT Solutions?
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                Our specialized expertise in REIT law, combined with deep
                understanding of real estate markets and regulatory
                requirements, makes us the ideal partner for your REIT
                operations and growth strategies.
              </p>
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start">
                  <div
                    className="w-2 h-2 sm:w-3 sm:h-3 rounded-full mr-3 sm:mr-4 mt-2 flex-shrink-0"
                    style={{ backgroundColor: "#A5292A" }}
                  ></div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1 sm:mb-2 text-sm sm:text-base">
                      Comprehensive REIT Expertise
                    </h4>
                    <p className="text-gray-600 text-sm sm:text-base">
                      Deep knowledge of REIT structures, regulations, and best
                      practices.
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
                      End-to-End Legal Support
                    </h4>
                    <p className="text-gray-600 text-sm sm:text-base">
                      From formation to ongoing compliance and dispute
                      resolution.
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
                      Strategic Business Focus
                    </h4>
                    <p className="text-gray-600 text-sm sm:text-base">
                      Legal solutions aligned with your business objectives and
                      growth plans.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:pl-8">
              <div className="relative">
                <Image
                  src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80"
                  alt="REIT consulting services"
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

      {/* Key Benefits Section */}
      <section className="py-12 sm:py-16 lg:py-20" style={{ backgroundColor: "#FAFAFA" }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4 sm:mb-6">
              Key Benefits of Our <span style={{ color: '#A5292A' }}>REIT Services</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-3xl mx-auto">
              Maximize your REIT's potential with our comprehensive legal
              support and strategic guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:ml-20 lg:mr-20">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
              <div
                className="text-white p-2 sm:p-3 rounded-lg mb-4 sm:mb-6 w-fit"
                style={{ backgroundColor: "#A5292A" }}
              >
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
                Regulatory Compliance
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Ensure full compliance with all REIT-specific regulations and
                reporting requirements.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
              <div
                className="text-white p-2 sm:p-3 rounded-lg mb-4 sm:mb-6 w-fit"
                style={{ backgroundColor: "#A5292A" }}
              >
                <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
                Risk Mitigation
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Identify and mitigate potential legal risks before they impact
                your operations.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
              <div
                className="text-white p-2 sm:p-3 rounded-lg mb-4 sm:mb-6 w-fit"
                style={{ backgroundColor: "#A5292A" }}
              >
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
                Growth Strategies
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Legal support for expansion, acquisitions, and capital raising
                initiatives.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
              <div
                className="text-white p-2 sm:p-3 rounded-lg mb-4 sm:mb-6 w-fit"
                style={{ backgroundColor: "#A5292A" }}
              >
                <Users className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
                Governance Support
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Expert guidance on corporate governance and best practices for
                REIT management.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
              <div
                className="text-white p-2 sm:p-3 rounded-lg mb-4 sm:mb-6 w-fit"
                style={{ backgroundColor: "#A5292A" }}
              >
                <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
                Transaction Support
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Comprehensive legal support for property acquisitions,
                dispositions, and financing.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
              <div
                className="text-white p-2 sm:p-3 rounded-lg mb-4 sm:mb-6 w-fit"
                style={{ backgroundColor: "#A5292A" }}
              >
                <Gavel className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
                Dispute Resolution
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Professional representation in all types of REIT-related
                disputes and litigation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action Notice Box */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div
              className="p-6 sm:p-8 lg:p-12 rounded-2xl text-center"
              style={{ backgroundColor: "#A5292A" }}
            >
              <p className="text-sm sm:text-base text-left text-white text-opacity-90 mb-6 sm:mb-8 leading-relaxed">
                Secure your REIT operations with expert legal support. Reach out
                to us for dedicated support in REIT compliance, regulatory
                guidance, and investment protection, tailored to safeguard your
                real estate investment trust operations.
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

export default REITSolutions;







