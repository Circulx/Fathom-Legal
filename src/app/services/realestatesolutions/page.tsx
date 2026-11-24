'use client'

import React from "react";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import Image from "next/image";
import ContentSection from "@/components/SEO/ContentSection";
import InlineContentBlock from "@/components/SEO/InlineContentBlock";
import FAQSection from "@/components/SEO/FAQSection";
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
      title: "Property Due Diligence Services in India Before You Buy",
      description:
        "Paying for a property with a hidden defect can lead to years of litigation. Our property due diligence services in India examine the chain of ownership, encumbrances, pending cases, approvals, and statutory dues. We also check whether the seller has the right to sell and whether the land use matches the intended purpose. You receive a clear report that helps you decide whether to proceed, negotiate, or walk away.",
      icon: <Eye className="w-6 h-6" />,
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
      title: "Agreement to Sell in India: Locking in Terms Before Transfer",
      description:
        "An agreement to sell in India records the price, payment schedule, possession date, and conditions that both parties must meet before the final transfer. It is a promise to sell and does not by itself transfer ownership. We draft clauses on advance payments, delays, default, and refund, so buyers and sellers each know what happens if the deal changes. Careful drafting at this stage prevents disputes later.",
      icon: <FileCheck className="w-6 h-6" />,
    },
    {
      title: "Rent Agreement Drafting That Protects Landlords and Tenants",
      description:
        "Informal tenancy arrangements frequently lead to disagreements over rent, repairs, and eviction. Our rent agreement drafting covers rent and escalation, security deposit, maintenance duties, lock-in periods, notice terms, and handover conditions. We tailor the document to your property type and city requirements. A balanced, well-recorded agreement keeps the relationship smooth and gives you a firm basis if a dispute arises.",
      icon: <Home className="w-6 h-6" />,
    },
    {
      title: "Taxation",
      description:
        "Navigating tax regulations in your home country and the country where your property is located can be complex. We provide expert advice on property taxation, including property tax documentation and financial audits.",
      icon: <Calculator className="w-6 h-6" />,
    },
  ];

  const realEstateFaqs = [
    {
      question: "Can I manage and protect my Indian property while living abroad?",
      answer:
        "Yes. With a power of attorney or a trusted representative, along with regular reporting, you can handle verification, tenant matters, repairs, and legal issues remotely. Choose your representative carefully and define their powers clearly in writing.",
    },
    {
      question: "Which documents should I check before buying a property?",
      answer:
        "Review the title deed, previous sale deeds, encumbrance certificate, approved building plan, tax receipts, and any society or builder approvals. A lawyer’s title search confirms that ownership is clear and that no claims or litigation affect the property.",
    },
    {
      question: "What should I do if my property is encroached upon?",
      answer:
        "Collect proof of ownership, survey records, and photographs, then consult a lawyer promptly. Depending on the facts, the response may involve a legal notice, a survey, negotiation, or a civil suit to protect your rights.",
    },
    {
      question: "How do NRIs plan inheritance for property in India?",
      answer:
        "A properly drafted will is the most important step, often supported by trusts for larger estates. Succession can involve probate and tax compliance, so early planning reduces delays and family disputes.",
    },
    {
      question: "Do tenancy and sale documents need to be registered?",
      answer:
        "Requirements depend on the type of document, its duration, and the state in which the property is located. Registration and stamp duty rules vary, so a lawyer should confirm what applies before you sign.",
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

      {/* Real Estate Legal Services in India (new SEO section) */}
      <ContentSection
        title="Real Estate Legal Services in India for Owners and Investors"
        highlight="Real Estate Legal Services in India"
        bg="white"
        paragraphs={[
          "Property is often the largest asset a person or business owns, so mistakes in paperwork can be costly. Our real estate legal services in India cover title checks, documentation, tenancy arrangements, transfers, and disputes. We explain each step in plain language and flag risks before you commit money. Whether you live in India or abroad, you get one team that handles the legal details from start to finish.",
        ]}
      />

      {/* Property Disputes and Management Sections */}
      <section className="bg-gray-50">
        <div className="container mx-auto px-4 sm:px-8 lg:px-16 xl:px-24 2xl:px-32">
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

          {/* Property Legal Consultant in India (new SEO content) */}
          <InlineContentBlock
            className="my-8"
            title="Property Legal Consultant in India for Early, Practical Advice"
            paragraphs={[
              "Many disputes grow from small problems that were ignored. A property legal consultant in India can review your documents, assess your position, and suggest the right response before a conflict reaches court. We advise on notices, negotiation, and settlement, and we prepare cases carefully when litigation is unavoidable. Early guidance often saves time, money, and relationships.",
            ]}
          />

          {/* Property Management */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch">
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

          {/* Leave and Licence Agreement in India (new SEO content) */}
          <InlineContentBlock
            className="mt-8 mb-12 sm:mb-16 lg:mb-20"
            title="Leave and Licence Agreement in India for Safe Occupancy"
            paragraphs={[
              "When you allow someone to occupy your property without giving up possession rights, the agreement must be clear. A leave and licence agreement in India sets out the licence fee, deposit, duration, permitted use, and conditions for ending the arrangement. It is commonly used for shorter periods, and stamp duty and registration requirements vary by state. We prepare the document, explain your obligations, and help you register it where required.",
            ]}
          />
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6  sm:gap-8  lg:ml-20 lg:mr-20">
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

      {/* Property Transfer Legal Services in India (new SEO section) */}
      <ContentSection
        title="Property Transfer Legal Services in India: Sale, Gift, and Succession"
        highlight="Property Transfer Legal Services in India"
        bg="white"
        paragraphs={[
          "Property can pass to a new owner through sale, gift, will, or inheritance, and each route has its own legal steps. Our property transfer legal services in India include drafting transfer documents, calculating stamp duty, arranging registration, and updating municipal and revenue records. We also guide families through succession paperwork. Proper completion of these steps ensures the new owner’s rights are recognized and protected.",
        ]}
      />

      {/* Trust & Value Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 2xl:px-32">
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

      {/* Frequently Asked Questions (new SEO section) */}
      <FAQSection items={realEstateFaqs} bg="white" />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default RealEstateSolutions;







