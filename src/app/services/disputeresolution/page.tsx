'use client'

import React, { useState } from "react";
import { Menu, X, ChevronDown, ArrowRight, Plus, Minus } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import Image from "next/image";

export default function DisputeResolution() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  const expertiseAreas = [
    {
      title: "Transactional Disputes",
      description:
        "Transactional disputes can arise in various business transactions, including mergers and acquisitions, joint ventures, and partnership agreements. Our team has extensive experience in resolving transactional disputes through negotiation, mediation, arbitration, and litigation. We work tirelessly to protect your rights and interests while minimizing disruption to your business operations.",
      image:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
    },
    {
      title: "Debt Recovery",
      description:
        "Unpaid debts can pose significant challenges to businesses, affecting cash flow and profitability. Our debt recovery specialists employ strategic approaches to recover outstanding debts efficiently and cost-effectively. Whether it's negotiating repayment plans, pursuing legal action, or enforcing judgments, we are committed to helping you recover what you're owed.",
      image:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
    },
    {
      title: "Commercial Disputes",
      description:
        "Commercial disputes can arise from contractual disagreements, business torts, intellectual property disputes, and other commercial matters. Our lawyers are skilled in handling a wide range of commercial disputes, from breach of contract claims to complex business litigation. We strive to resolve disputes through negotiation, alternative dispute resolution methods, or aggressive litigation, depending on the circumstances.",
      image:
        "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
    },
    {
      title: "Family Disputes",
      description:
        "Family disputes can be emotionally challenging and legally complex. Whether you're facing issues related to divorce, child custody, property division, or spousal support, our family law team provides compassionate yet strategic legal representation. We prioritize amicable resolutions whenever possible but are prepared to advocate vigorously for your rights in court if necessary.",
      image:
        "https://images.unsplash.com/photo-1714976694543-e32de3f43d73?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "POSH Disputes",
      description:
        "Workplace conflicts related to Prevention of Sexual Harassment (POSH) can have serious consequences for employers and employees alike. Our POSH dispute resolution team offers confidential, sensitive, and effective solutions to address allegations of sexual harassment or misconduct in the workplace. We guide clients through the complaint process, conduct thorough investigations, and provide strategic advice to ensure compliance with POSH regulations.",
      image:
        "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
    },
  ];

  const whyChooseUs = [
    {
      title: "Expertise",
      description:
        "Our team consists of highly skilled and experienced litigators who specialize in various areas of dispute resolution. We stay current with legal developments and best practices to provide you with the most effective representation.",
    },
    {
      title: "Client-Centric Approach",
      description:
        "We prioritize our clients' needs and goals, tailoring our strategies to achieve the best possible outcomes. Our commitment to personalized service ensures that you receive the attention and care your case deserves.",
    },
    {
      title: "Strategic Advocacy",
      description:
        "We develop comprehensive litigation strategies based on thorough case analysis and deep understanding of legal precedents. Our strategic approach maximizes your chances of success while minimizing risks and costs.",
    },
    {
      title: "Efficiency",
      description:
        "We understand that time is crucial in dispute resolution. Our efficient processes and proactive case management help resolve disputes quickly while maintaining the highest standards of legal representation.",
    },
    {
      title: "Integrity",
      description:
        "We maintain the highest ethical standards in all our professional dealings. Our commitment to integrity and transparency builds trust with clients, opposing parties, and the judicial system.",
    },
  ];

  const toggleAccordion = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

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
            <span style={{ color: '#A5292A' }}>Dispute Resolution</span>
            </h1>
            
            
           
            
            {/* Breadcrumb */}
            <div className="flex justify-center">
              <Breadcrumb 
                items={[
                  { label: "Home", href: "/" },
                  { label: "Services", href: "/services" },
                  { label: "Dispute Resolution" }
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
                  Our Expertise Areas
                </h3>
                <nav className="space-y-0">
                  {expertiseAreas.map((area, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        const element = document.getElementById(`expertise-${index}`);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="w-full flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-[#A5292A] hover:bg-gray-50 transition-all duration-200 group border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center">
                        <div className="w-1 h-3 sm:h-4 bg-[#A5292A] mr-2 sm:mr-3 rounded-full flex-shrink-0"></div>
                        <span className="text-left">{area.title}</span>
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
                Our Areas of Expertise Include:
              </h2>
              <p className="text-sm sm:text-base text-gray-800 leading-relaxed">
                At Fathom Legal, we specialize in resolving a wide range of
                disputes with professionalism, efficiency, and integrity. Our team
                of experienced litigators and dispute resolution experts is
                dedicated to helping clients navigate complex legal challenges and
                achieve favorable outcomes. Whether you're facing transactional
                disputes, debt recovery issues, commercial disputes, family
                disputes, or workplace conflicts, we have the expertise and
                resources to protect your interests and resolve disputes
                effectively.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 - Detailed Services */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          {expertiseAreas.map((area, index) => (
            <div
              key={index}
              id={`expertise-${index}`}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch mb-8 lg:mb-0 ${
                index !== expertiseAreas.length - 1 ? "lg:mb-8" : ""
              }`}
            >
              {/* Text Content with Dark Blue Background */}
              <div className={`${index % 2 === 0 ? "lg:order-1" : "lg:order-2"} bg-[#A5292A] p-6 sm:p-8 lg:p-12 xl:p-16 flex flex-col justify-center`}>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
                  {area.title}
                </h3>
                <p className="text-white text-sm sm:text-base leading-relaxed mb-6 sm:mb-8">
                  {area.description}
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
                  src={area.image}
                  alt={`${area.title} representation`}
                  width={500}
                  height={500}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3: Why Choose Fathom Legal? */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4 sm:mb-6">
                Why Choose Fathom Legal for Dispute Resolution?
              </h2>
              <p className="text-base sm:text-lg text-gray-600">
                Our commitment to excellence ensures that you receive the best
                legal support possible.
              </p>
            </div>

            {/* Accordion Items */}
            <div className="space-y-3 sm:space-y-4">
              {whyChooseUs.map((item, index) => (
                <div
                  key={index}
                  className="border border-gray-100 rounded-lg overflow-hidden"
                >
                  <button
                    className="w-full text-left bg-white p-4 sm:p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    onClick={() => toggleAccordion(index)}
                  >
                    <span className="font-semibold text-gray-800 text-base sm:text-lg">
                      {item.title}
                    </span>
                    {openAccordion === index ? (
                      <Minus
                        className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                        style={{ color: "#A5292A" }}
                      />
                    ) : (
                      <Plus
                        className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                        style={{ color: "#A5292A" }}
                      />
                    )}
                  </button>
                  {openAccordion === index && (
                    <div className="bg-gray-50 px-4 sm:px-6 pb-4 sm:pb-6">
                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
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
              If you're facing a dispute and need expert legal representation,
              contact Fathom Legal today. Let us help you navigate your legal
              challenges and achieve a favorable resolution.
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

