'use client'

import React from "react";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import Image from "next/image";
import ContentSection from "@/components/SEO/ContentSection";
import ContentGrid from "@/components/SEO/ContentGrid";
import FAQSection from "@/components/SEO/FAQSection";
import {
  ArrowRight,
  Code,
  Shield,
  Users,
  Scale,
  CheckCircle,
  Zap,
  Globe,
  Lock,
  FileText,
  Lightbulb,
  Target,
} from "lucide-react";

export default function TechLegalBlueprint() {
  const keyFeatures = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Customized Legal Strategies",
      description:
        "Tailored legal frameworks designed specifically for your tech business needs and growth trajectory.",
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Data Protection & Privacy",
      description:
        "Comprehensive compliance with data protection regulations including GDPR, CCPA, and local privacy laws.",
    
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Intellectual Property Protection",
      description:
        "Strategic IP portfolio management, patent filing, trademark protection, and trade secret safeguarding.",
    },
    {
      icon: <Scale className="w-6 h-6" />,
      title: "Regulatory Compliance",
      description:
        "Navigate complex tech regulations, industry standards, and emerging compliance requirements.",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Scalable Solutions",
      description:
        "Legal frameworks that grow with your business, from startup to enterprise level operations.",
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Proactive Risk Management",
      description:
        "Identify and mitigate potential legal issues before they impact your business operations.",
    },
  ];

  const benefits = [
    "Strategic legal planning aligned with business objectives",
    "Comprehensive IP portfolio development and protection",
    "Data privacy and cybersecurity compliance frameworks",
    "Contract templates and negotiation strategies",
    "Regulatory compliance roadmaps and monitoring",
    "Risk assessment and mitigation protocols",
  ];

  // New SEO content blocks (from the page-content document)
  const complianceBlocks = [
    {
      title: "DPDPA Audit in India to Identify Gaps Early",
      highlight: "DPDPA Audit in India",
      paragraphs: [
        "An audit shows you where your practices differ from what the law expects. In a DPDPA audit in India, we examine consent flows, data retention, access controls, and breach response procedures. You receive a clear report that ranks gaps by risk and recommends practical fixes. Many companies use the findings to prepare for customer questionnaires, investor reviews, and regulator queries.",
      ],
    },
    {
      title: "Getting Started with DPDP Act Compliance in India",
      highlight: "DPDP Act Compliance in India",
      paragraphs: [
        "India’s Digital Personal Data Protection Act, 2023 places clear duties on businesses that handle personal data. Our approach to DPDP Act compliance in India begins with mapping what data you collect, why you collect it, and where it is stored. We then draft consent notices, privacy policies, and grievance processes that match your product. Because implementation timelines and rules continue to develop, we confirm the current position before finalizing your plan.",
      ],
      subBlocks: [
        {
          title: "Legal Services for Tech Startups",
          paragraphs: [
            "A seed-stage team and a growth-stage company face very different legal needs. We offer legal services for tech startups that cover founder agreements, equity arrangements, employment documents, customer contracts, and investor readiness. As your user base and revenue grow, we update your documents and policies so they stay accurate. This steady support helps you move through due diligence smoothly when funding opportunities arrive.",
          ],
        },
      ],
    },
  ];

  const contractBlocks = [
    {
      title: "Technology Licensing Agreement in India: Protecting Your Innovation",
      highlight: "Technology Licensing Agreement in India",
      paragraphs: [
        "Licensing lets you earn from your technology while keeping ownership of it. A well-drafted technology licensing agreement in India defines the scope of use, territory, duration, fees, and restrictions on copying or modification. We also address ownership of improvements, confidentiality, warranties, and termination rights. Clear terms reduce disputes and keep your valuable intellectual property under your control.",
      ],
    },
    {
      title: "Asset Tokenization Services in India Within a Compliant Framework",
      highlight: "Asset Tokenization Services in India",
      paragraphs: [
        "Tokenization can make assets easier to fractionalize, trade, and manage, but it raises legal questions about ownership, securities treatment, and investor protection. Our asset tokenization services in India help you assess how your model is likely to be viewed under current law, structure rights and obligations clearly, and prepare disclosures and contracts. Since this area is still developing, we review regulatory developments before advising on each project.",
      ],
    },
    {
      title: "SaaS Agreement Drafting in India for Reliable Customer Contracts",
      highlight: "SaaS Agreement Drafting in India",
      paragraphs: [
        "Software subscriptions depend on contracts that customers can understand and your team can enforce. Our SaaS agreement drafting in India covers service levels, subscription terms, acceptable use, data handling, intellectual property, liability caps, and renewal or termination. We tailor each agreement to your pricing model and customer segment, so sales teams can close deals faster with fewer lengthy negotiations.",
      ],
    },
    {
      title: "Escrow Services in India for Software and Transaction Security",
      highlight: "Escrow Services in India",
      paragraphs: [
        "Customers who rely on your software often want assurance that they can continue operating if something goes wrong. Our team structures escrow services in India arrangements that cover source code deposit, release conditions, and verification, and can also address transaction escrow where payments depend on milestones. These arrangements build trust with enterprise buyers and protect both sides of a technology deal.",
      ],
    },
  ];

  const techFaqs = [
    {
      question: "What is included in the Tech Legal Blueprint?",
      answer:
        "It is a customized legal framework for technology companies. It covers strategic legal planning, intellectual property protection, data privacy and cybersecurity compliance, regulatory compliance, and ongoing risk management, built around your product and business model.",
    },
    {
      question: "Who is the Tech Legal Blueprint designed for?",
      answer:
        "It suits software companies, SaaS providers, app developers, IT service firms, and technology startups at any stage. Early-stage teams use it to build a sound foundation, while larger companies use it to refine existing contracts and policies.",
    },
    {
      question: "How does the Blueprint process work?",
      answer:
        "It has four steps. We assess your current legal position and technology stack, develop a strategy tailored to your goals, implement the required structures, policies, and compliance frameworks, and then monitor and update them as your business changes.",
    },
    {
      question: "Does the Blueprint cover international data protection laws?",
      answer:
        "Yes. Beyond Indian privacy law, it addresses frameworks such as GDPR and CCPA where they apply to your users or customers. We identify which laws affect you based on where your users are located and how you process data.",
    },
    {
      question: "How often should a tech company review its legal framework?",
      answer:
        "A review at least once a year is a sensible baseline. You should also review it whenever you launch a new product, enter a new market, change vendors, raise funding, or when a relevant law changes.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Navbar page="vbs" />

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
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-10">
              <span style={{ color: '#A5292A' }}>Tech Legal Blueprint</span>
            </h1>
            
            {/* Breadcrumb */}
            <div className="flex justify-center">
              <Breadcrumb 
                items={[
                  { label: "Home", href: "/" },
                  { label: "Value Boosting Solutions", href: "/valueboostingsolutions" },
                  { label: "Tech Legal Blueprint" }
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
              <h2 className="text-3xl font-bold mb-8 text-gray-800">
                Strategic Blueprint for<span style={{ color: '#A5292A' }}> Legal and Business Success</span>
              </h2>
              <p className="text-base text-gray-600 mb-8 leading-relaxed">
                Navigating the complex legal landscape of the tech industry can
                be daunting. Our Tech Legal Blueprint service offers a robust
                framework tailored to your specific needs, ensuring you are
                well-prepared for growth and innovation. We deliver customized
                legal strategies, offering expert advice on intellectual
                property, regulatory compliance, and data protection. Our
                scalable solutions are designed to grow with your business,
                while our proactive risk management approach helps you identify
                and mitigate potential legal issues before they arise.
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
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="Tech legal blueprint concept"
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

      {/* Tech Legal Advisory Services (new SEO section) */}
      <ContentSection
        title="Tech Legal Advisory Services for Product-Led Companies"
        highlight="Tech Legal Advisory Services"
        bg="light"
        paragraphs={[
          "Technology businesses ship quickly, and legal questions often surface after a product is already live. Our tech legal advisory services in India bring structure to this process. We review your product, data flows, contracts, and growth plans, then build a legal roadmap that supports releases instead of slowing them down. Your team gets clear guidance on what to fix now, what can wait, and what to plan for as you scale.",
        ]}
      />

      {/* Key Features Section */}
      <section className="py-20" style={{ backgroundColor: "#FAFAFA" }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Comprehensive Tech Legal Framework
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our Tech Legal Blueprint covers every aspect of technology law,
              providing you with the tools and strategies needed to navigate the
              digital landscape successfully.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 sm:px-8 md:px-12 lg:px-20">
            {keyFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group hover:bg-[#A5292A] hover:text-white hover:z-50 hover:scale-105 relative"
              >
                <div className="flex items-start mb-6">
                  <div
                    className="text-white  bg-[#A5292A] p-3 rounded-lg mr-4 flex-shrink-0 group-hover:opacity-80 transition-opacity group-hover:bg-white group-hover:text-[#A5292A]"
                    
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 group-hover:text-white transition-colors">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed group-hover:text-white transition-colors">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DPDPA audit, DPDP Act compliance & legal services for tech startups (new SEO sections) */}
      <ContentGrid blocks={complianceBlocks} bg="white" />

      {/* Technology licensing, tokenization, SaaS & escrow (new SEO sections) */}
      <ContentGrid blocks={contractBlocks} bg="light" />

      {/* Why Choose Tech Legal Blueprint */}
      <section className="py-20 bg-white">
        <div className="container mx-auto ">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Why Tech Companies <span style={{ color: '#A5292A' }}>Trust </span>Our Legal Expertise?
            </h2>
           
          </div>

          <div className="grid md:grid-cols-3 gap-8 px-4 sm:px-8 md:px-12 lg:px-20">
                <div className="bg-gray-100 p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group hover:bg-[#A5292A] hover:text-white hover:z-50 hover:scale-105 relative">
                  <div className="text-center">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center bg-[#A5292A] text-white text-xl font-bold mb-4 mx-auto group-hover:bg-white group-hover:text-[#A5292A] transition-all duration-300"
                    
                    >
                      <Code className="w-8 h-8" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-white transition-colors">
                      Industry Expertise
                    </h3>
                    <p className="text-gray-600 group-hover:text-white transition-colors">
                      Deep understanding of technology sector challenges and
                      opportunities.
                    </p>
                  </div>
                </div>

                <div className="bg-gray-100 p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group hover:bg-[#A5292A] hover:text-white hover:z-50 hover:scale-105 relative">
                  <div className="text-center">
                    <div
                     className="w-16 h-16 rounded-full flex items-center justify-center bg-[#A5292A] text-white text-xl font-bold mb-4 mx-auto group-hover:bg-white group-hover:text-[#A5292A] transition-all duration-300"
                    >
                      <Zap className="w-8 h-8" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-white transition-colors">
                      Future-Ready Solutions
                    </h3>
                    <p className="text-gray-600 group-hover:text-white transition-colors">
                      Legal frameworks that anticipate and adapt to
                      technological evolution.
                    </p>
                  </div>
                </div>

                <div className="bg-gray-100 p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group hover:bg-[#A5292A] hover:text-white hover:z-50 hover:scale-105 relative">
                  <div className="text-center">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center bg-[#A5292A] text-white text-xl font-bold mb-4 mx-auto group-hover:bg-white group-hover:text-[#A5292A] transition-all duration-300"
                    >
                      <Target className="w-8 h-8" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-white transition-colors">
                      Practical Implementation
                    </h3>
                    <p className="text-gray-600 group-hover:text-white transition-colors">
                      Actionable strategies that integrate seamlessly with your
                      business operations.
                    </p>
                  </div>
                </div>
              </div>
        </div>
      </section>

      {/* IT Legal Consultant in India (new SEO section) */}
      <ContentSection
        title="IT Legal Consultant in India for Day-to-Day Guidance"
        highlight="IT Legal Consultant in India"
        bg="white"
        paragraphs={[
          "Technology teams need a lawyer who understands how software is built, sold, and supported. As your IT legal consultant in India, we review vendor agreements, outsourcing contracts, terms of use, and internal policies in plain language. We work closely with product, engineering, and sales teams, so legal input arrives when it is useful and decisions are not delayed.",
        ]}
      />

      {/* Process Section */}
      <section className="py-20" style={{ backgroundColor: "#FAFAFA" }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Our Blueprint Process
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              A systematic approach to building your tech legal foundation, from
              assessment to implementation and ongoing support.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 px-4 sm:px-8 md:px-12 lg:px-20">
            {[
              {
                step: "01",
                title: "Assessment",
                description:
                  "Comprehensive analysis of your current legal position and technology stack.",
              },
              {
                step: "02",
                title: "Strategy",
                description:
                  "Custom legal framework development tailored to your business model and goals.",
              },
              {
                step: "03",
                title: "Implementation",
                description:
                  "Deployment of legal structures, policies, and compliance frameworks.",
              },
              {
                step: "04",
                title: "Monitoring",
                description:
                  "Ongoing support, updates, and optimization of your legal blueprint.",
              },
            ].map((process, index) => (
              <div key={index} className="text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold mb-6 mx-auto"
                  style={{ backgroundColor: "#A5292A" }}
                >
                  {process.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {process.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {process.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-1" style={{ backgroundColor: "#A5292A" }}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="p-12 rounded-2xl text-center">
              <h3 className="text-3xl font-bold text-white mb-6">
                Ready to Build Your Tech Legal Foundation?
              </h3>
              <p className="text-lg text-white/90 mb-8 leading-relaxed">
                Let our Tech Legal Blueprint service provide you with the
                comprehensive legal framework your technology company needs to
                thrive in today’s digital landscape.
              </p>
              <button
                className="bg-white text-[#A5292A] px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all inline-flex items-center"
                onClick={() => (window.location.href = "/contact")}
              >
                Get Your Blueprint Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions (new SEO section) */}
      <FAQSection items={techFaqs} bg="light" />

      {/* Footer */}
      <Footer />
    </div>
  );
}
