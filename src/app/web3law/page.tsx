'use client'

import React from "react";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import ContentSection from "@/components/SEO/ContentSection";
import InlineContentBlock from "@/components/SEO/InlineContentBlock";
import FAQSection from "@/components/SEO/FAQSection";
import { 
  Shield, 
  FileText, 
  Users, 
  Globe, 
  Lock, 
  Scale,
  ArrowRight,
  CheckCircle,
  Star,
  Zap,
  Database,
  Smartphone,
  Coins,
  Network,
  Palette,
  TrendingUp,
  Building,
  Eye,
  AlertTriangle,
  BookOpen,
  MessageCircle,
  Plus,
  Minus,
  FileCheck,
  Gavel,
  Briefcase,
  FileSignature,
  Copyright,
  UserCheck,
  Search,
  FileBarChart,
  Calculator,
  ArrowUpRight,
  FileSpreadsheet,
  Settings,
  Plane
} from "lucide-react";

export default function Web3Law() {
  const web3Faqs = [
    {
      question: "What Are the Primary Legal Challenges in Web3?",
      answer: (
        <>
          <p className="text-gray-600 leading-relaxed mb-4">
            Web3 technologies present unique legal challenges that traditional legal frameworks weren't designed to address. As these technologies mature, businesses face unprecedented legal complexities that require specialized expertise. Key areas of concern include:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
            <li><strong>Data privacy and security:</strong> While blockchain technology offers enhanced security through decentralization, the transparent nature of public blockchains can conflict with privacy regulations. Organizations must carefully balance transparency benefits with data protection requirements across different jurisdictions.</li>
            <li><strong>Intellectual property protection:</strong> The decentralized and global nature of Web3 creates challenges for traditional IP enforcement. Creators and businesses need innovative strategies to protect their intellectual property in an environment where traditional legal boundaries are less clear.</li>
            <li><strong>Regulatory compliance:</strong> The absence of centralized authority in Web3 systems creates uncertainty around regulatory oversight and enforcement. Businesses must proactively develop compliance strategies that anticipate evolving regulatory frameworks across multiple jurisdictions.</li>
          </ul>
        </>
      ),
      schemaAnswer:
        "Web3 technologies present unique legal challenges that traditional legal frameworks weren't designed to address. Key areas of concern include data privacy and security, intellectual property protection, and regulatory compliance across multiple jurisdictions.",
    },
    {
      question: "What Constitutes Web3 Assets?",
      answer:
        "Web3 assets encompass any digital or digitized items that leverage blockchain technology for ownership, transfer, or verification. These assets operate within decentralized networks, creating new possibilities for value creation and exchange. Examples include digital currencies, tokenized real estate, virtual collectibles, digital art, gaming assets, and even fractionalized ownership of physical assets. The flexibility of Web3 technology enables businesses to create innovative asset classes and new forms of customer engagement that weren't possible with traditional systems.",
    },
    {
      question: "What is the Current Legal Status of Cryptocurrency in India?",
      answer:
        "India's approach to cryptocurrency regulation is currently in a transitional phase, with the government and regulatory bodies developing comprehensive frameworks for digital assets. While cryptocurrencies are not explicitly prohibited, they are not recognized as legal tender. The regulatory environment includes evolving tax policies, anti-money laundering requirements, and securities law considerations. Successfully operating in this space requires careful legal planning and ongoing compliance monitoring as regulations continue to develop.",
    },
    {
      question: "How Are Virtual Digital Assets Taxed in India?",
      answer:
        "Virtual digital assets are subject to a dedicated tax regime. Gains on transfer are generally taxed at a flat rate, with limited scope to set off losses, and certain transfers attract tax deducted at source. Businesses also need to consider GST on related services. Because rates and rules are updated periodically, confirm the current position with a tax professional before filing.",
    },
    {
      question: "Is a DAO Legally Recognised in India?",
      answer:
        "India has no specific law that recognises DAOs as a distinct legal form. Without a recognised structure, members may face uncertainty about liability, contracts, and taxation. Many projects therefore use a company or foundation in a suitable jurisdiction as a legal wrapper around the DAO. A lawyer can help you choose a structure that protects participants and fits your governance model.",
    },
    {
      question: "Can an Indian Web3 Startup Raise Funds from Overseas Investors?",
      answer:
        "Yes, but the way you structure the raise matters. Foreign investment into an Indian company must follow exchange control rules on pricing, reporting, and permitted routes. Token sales to overseas buyers raise further questions about securities laws in the buyer’s country. Many founders set up a foreign entity for fundraising and keep an Indian entity for operations, supported by properly drafted SAFE or SAFT documents.",
    },
  ];

  const handleContactClick = () => {
    window.location.href = '/contact';
  };
  
  return (
    <div className="min-h-screen bg-white">
      <Navbar page="web3law" />
      
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
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold text-white mb-4">
              Web3 <span style={{ color: '#A5292A' }}>Legal</span> Services
            </h1>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-3xl font-semibold text-white mb-4">
              Building Confidence & Mitigating Risk in Web3 Legal Practice
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-8 max-w-4xl mx-auto">
              Navigating the complex and rapidly changing regulatory environment to unlock opportunities in Web3 legal matters.
            </p>
            <button 
              onClick={handleContactClick}
              className="text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:opacity-90 transition-all flex items-center justify-center mx-auto hover:cursor-pointer border-2 border-white hover:bg-white hover:text-[#A5292A]" 
            >
              Contact Us
            </button>
            
            {/* Breadcrumb */}
            <div className="flex justify-center mt-8">
              <Breadcrumb 
                items={[
                  { label: "Home", href: "/" },
                  { label: "Web3 Law" }
                ]} 
                
              />
            </div>
          </div>
        </div>
      </section>

      {/* Reliable Web3 Legal Services India (new SEO section) */}
      <ContentSection
        title="Reliable Web3 Legal Services India Founders Can Trust"
        highlight="Web3 Legal Services India"
        bg="white"
        paragraphs={[
          "Blockchain businesses move fast, and regulation rarely waits. Our Web3 legal services India practice helps founders, protocols, exchanges, and investors understand what the law expects before they launch, raise funds, or expand. We translate technical models into clear legal positions, flag risks early, and build compliance structures that regulators and investors can follow. From incorporation to token design and ongoing supervision, you get one team that understands both decentralized technology and Indian regulation.",
        ]}
      />

      {/*  Web3 Legal Services */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-gray-800 mb-12 text-center">Comprehensive <span style={{ color: '#A5292A' }}>Web3 Legal Services</span></h2>
            <div className="flex flex-wrap justify-center gap-6">
              {/* Crypto & Digital Assets */}
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-2xl hover:scale-105 hover:-translate-y-2 hover:bg-[#A5292A] hover:text-white transition-all duration-300 border border-gray-100 group cursor-pointer w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <FileCheck className="w-6 h-6 text-[#A5292A] group-hover:text-white" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-xl font-semibold text-gray-800 group-hover:text-white mb-4">Digital Asset Licensing & Compliance</h3>
                <p className="text-gray-600 group-hover:text-white text-sm sm:text-base mb-4">
                  We help digital-asset ventures navigate the complex regulatory landscape by securing necessary licenses, ensuring full compliance, and building frameworks that align innovation with enforceable law.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm sm:text-base text-gray-600 group-hover:text-white">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    License structuring across jurisdictions
                  </li>
                  <li className="flex items-center text-sm sm:text-base text-gray-600 group-hover:text-white">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Regulatory gap analysis & compliance roadmap
                  </li>
                  <li className="flex items-center text-sm sm:text-base text-gray-600 group-hover:text-white">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    AML / KYC / CFT policy drafting
                  </li>
                  <li className="flex items-center text-sm sm:text-base text-gray-600 group-hover:text-white">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Ongoing supervision & liaison with regulators
                  </li>
                </ul>
              </div>

              
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-2xl hover:scale-105 hover:-translate-y-2 hover:bg-[#A5292A] hover:text-white transition-all duration-300 border border-gray-100 group cursor-pointer w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Gavel className="w-6 h-6 text-[#A5292A] group-hover:text-white" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-xl font-semibold text-gray-800 group-hover:text-white mb-4">Legal Opinion on Tokens</h3>
                <p className="text-gray-600 group-hover:text-white text-sm sm:text-base mb-4">
                  We issue authoritative opinions assessing whether a token qualifies as a security, commodity, or utility, thereby providing clarity and defensibility to issuers and investors.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm sm:text-base text-gray-600 group-hover:text-white">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Token classification analysis
                  </li>
                  <li className="flex items-center text-sm sm:text-base text-gray-600 group-hover:text-white">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Jurisdictional risk & legal exposure review
                  </li>
                  <li className="flex items-center text-sm sm:text-base text-gray-600 group-hover:text-white">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Regulatory alignment & disclosure requirements
                  </li>
                  <li className="flex items-center text-sm sm:text-base text-gray-600 group-hover:text-white">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Mitigation of investor liability
                  </li>
                </ul>
              </div>

              
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-2xl hover:scale-105 hover:-translate-y-2 hover:bg-[#A5292A] hover:text-white transition-all duration-300 border border-gray-100 group cursor-pointer w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Briefcase className="w-6 h-6 text-[#A5292A] group-hover:text-white" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-xl font-semibold text-gray-800 group-hover:text-white mb-4">Global Incorporation & Structuring</h3>
                <p className="text-gray-600 group-hover:text-white text-sm sm:text-base mb-4">
                  For blockchain firms eyeing global reach, we design corporate structures that optimize taxation, regulatory burden, and capital flows across jurisdictions.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm sm:text-base text-gray-600 group-hover:text-white">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Holding / operating / licensing entity design
                  </li>
                  <li className="flex items-center text-sm sm:text-base text-gray-600 group-hover:text-white">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Tax-efficient cross-border models
                  </li>
                  <li className="flex items-center text-sm sm:text-base text-gray-600 group-hover:text-white">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Regulatory compliance per jurisdiction
                  </li>
                  <li className="flex items-center text-sm sm:text-base text-gray-600 group-hover:text-white">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Capital flow & repatriation planning
                  </li>
                </ul>
              </div>

          
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-2xl hover:scale-105 hover:-translate-y-2 hover:bg-[#A5292A] hover:text-white transition-all duration-300 border border-gray-100 group cursor-pointer w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <FileSignature className="w-6 h-6 text-[#A5292A] group-hover:text-white" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-xl font-semibold text-gray-800 group-hover:text-white mb-4">Legal Drafting: SAFE, SAFT, Token Warrants</h3>
                <p className="text-gray-600 group-hover:text-white text-sm sm:text-base mb-4">
                  We draft and tailor investment instruments (SAFEs, SAFTs, warrants) that balance founder interests, investor protections, and regulatory compliance.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm sm:text-base text-gray-600 group-hover:text-white">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Drafting token sale & investment agreements
                  </li>
                  <li className="flex items-center text-sm sm:text-base text-gray-600 group-hover:text-white">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Risk allocation & indemnity clauses
                  </li>
                  <li className="flex items-center text-sm sm:text-base text-gray-600 group-hover:text-white">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Vesting, anti-dilution & conversion mechanisms
                  </li>
                  <li className="flex items-center text-sm sm:text-base text-gray-600 group-hover:text-white">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Compliance disclosures & protective covenants
                  </li>
                </ul>
              </div>

              
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-2xl hover:scale-105 hover:-translate-y-2 hover:bg-[#A5292A] hover:text-white transition-all duration-300 border border-gray-100 group cursor-pointer w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Copyright className="w-6 h-6 text-[#A5292A] group-hover:text-white" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-xl font-semibold text-gray-800 group-hover:text-white mb-4">Blockchain-based IP</h3>
                <p className="text-gray-600 group-hover:text-white text-sm sm:text-base mb-4">
                  We help clients tokenize intellectual property, manage licensing in Web3 environments, and protect rights in decentralized contexts.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm sm:text-base text-gray-600 group-hover:text-white">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Tokenization of copyrights, patents & trade marks
                  </li>
                  <li className="flex items-center text-sm sm:text-base text-gray-600 group-hover:text-white">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Licensing & royalty frameworks on-chain
                  </li>
                  <li className="flex items-center text-sm sm:text-base text-gray-600 group-hover:text-white">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Enforcement in decentralized settings
                  </li>
                  <li className="flex items-center text-sm sm:text-base text-gray-600 group-hover:text-white">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Revenue sharing & secondary market rights
                  </li>
                </ul>
              </div>

              
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-2xl hover:scale-105 hover:-translate-y-2 hover:bg-[#A5292A] hover:text-white transition-all duration-300 border border-gray-100 group cursor-pointer w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <UserCheck className="w-6 h-6 text-[#A5292A] group-hover:text-white" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-xl font-semibold text-gray-800 group-hover:text-white mb-4">Tokens for Employees (ETOPs)</h3>
                <p className="text-gray-600 group-hover:text-white text-sm sm:text-base mb-4">
                  We design employee token incentive plans that respect securities regulation, labor law, and taxation, while fostering alignment and retention.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm sm:text-base text-gray-600 group-hover:text-white">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Structuring employee token allocation schemes
                  </li>
                  <li className="flex items-center text-sm sm:text-base text-gray-600 group-hover:text-white">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Vesting schedules, performance triggers & lock-ups
                  </li>
                  <li className="flex items-center text-sm sm:text-base text-gray-600 group-hover:text-white">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Compliance with labor & securities laws
                  </li>
                  <li className="flex items-center text-sm sm:text-base text-gray-600 group-hover:text-white">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Tax treatment and reporting strategy
                  </li>
                </ul>
          </div>

              
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-2xl hover:scale-105 hover:-translate-y-2 hover:bg-[#A5292A] hover:text-white transition-all duration-300 border border-gray-100 group cursor-pointer w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-[#A5292A] group-hover:text-white" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-xl font-semibold text-gray-800 group-hover:text-white mb-4">Smart Contract Legal Audit</h3>
                <p className="text-gray-600 group-hover:text-white text-sm sm:text-base mb-4">
                  We perform a legal audit of smart contracts to identify risks, gaps, and compliance issues, working alongside technical audits to strengthen legal defensibility.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm sm:text-base text-gray-600 group-hover:text-white">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Review of contract terms & logic flows
                  </li>
                  <li className="flex items-center text-sm sm:text-base text-gray-600 group-hover:text-white">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Liability & indemnity assessment
                  </li>
                  <li className="flex items-center text-sm sm:text-base text-gray-600 group-hover:text-white">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Regulatory compliance checks
                  </li>
                  <li className="flex items-center text-sm sm:text-base text-gray-600 group-hover:text-white">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Dispute-resolution & upgrade clauses
                  </li>
                </ul>
              </div>

              
              </div>

            {/* Key Legal Considerations for Smart Contracts Under Indian Law (new SEO content) */}
            <InlineContentBlock
              headingLevel="h2"
              className="my-10 rounded-lg"
              title="Key Legal Considerations for Smart Contracts Under Indian Law"
              paragraphs={[
                "Code can execute an agreement, but it does not automatically make that agreement enforceable. Questions about smart contracts under Indian law usually turn on offer, acceptance, consideration, and consent, along with how disputes will be resolved. Our legal audit checks whether contract logic matches the commercial deal, whether liability is allocated fairly, and whether upgrade and dispute clauses are workable. The result is a smart contract that performs technically and stands up legally.",
              ]}
            />

            <div className="flex flex-wrap justify-center gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-2xl hover:scale-105 hover:-translate-y-2 hover:bg-[#A5292A] hover:text-white transition-all duration-300 border border-gray-100 group cursor-pointer w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <FileBarChart className="w-6 h-6 text-[#A5292A] group-hover:text-white" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-xl font-semibold text-gray-800 group-hover:text-white mb-4">FIU-IND Registration</h3>
                <p className="text-gray-600 group-hover:text-white text-sm sm:text-base mb-4">
                  We assist Virtual Asset Service Providers (VASPs) in India with registration before the Financial Intelligence Unit (FIU-IND), setting up compliance structures per local law.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm sm:text-base text-gray-600 group-hover:text-white">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Application preparation & liaison
                  </li>
                  <li className="flex items-center text-sm sm:text-base text-gray-600 group-hover:text-white">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    AML / CFT program design
                  </li>
                  <li className="flex items-center text-sm sm:text-base text-gray-600 group-hover:text-white">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Reporting systems & audit trails
                  </li>
                  <li className="flex items-center text-sm sm:text-base text-gray-600 group-hover:text-white">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Ongoing compliance support
                  </li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-2xl hover:scale-105 hover:-translate-y-2 hover:bg-[#A5292A] hover:text-white transition-all duration-300 border border-gray-100 group cursor-pointer w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-[#A5292A] group-hover:text-white" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-xl font-semibold text-gray-800 group-hover:text-white mb-4">FIU-IND Registration Consultant for Virtual Asset Service Providers</h3>
                <p className="text-gray-600 group-hover:text-white text-sm sm:text-base">
                  Registration is the first step, and ongoing reporting is where many platforms struggle. As your FIU-IND registration consultant, we prepare the application, design anti-money laundering and counter-terrorist financing programs, and set up reporting systems with proper audit trails. We also help you appoint responsible officers and train staff, so your compliance function works in daily practice and not only on paper.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-2xl hover:scale-105 hover:-translate-y-2 hover:bg-[#A5292A] hover:text-white transition-all duration-300 border border-gray-100 group cursor-pointer w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Calculator className="w-6 h-6 text-[#A5292A] group-hover:text-white" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-xl font-semibold text-gray-800 group-hover:text-white mb-4">VDA Tax Services</h3>
                <p className="text-gray-600 group-hover:text-white text-sm sm:text-base mb-4">
                  We specialize in taxation of Virtual Digital Assets (VDAs), helping clients classify, compute, plan, and comply with domestic and cross-border tax obligations.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm sm:text-base text-gray-600 group-hover:text-white">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Tax classification & event mapping
                  </li>
                  <li className="flex items-center text-sm sm:text-base text-gray-600 group-hover:text-white">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Income tax, capital gains & GST treatment
                  </li>
                  <li className="flex items-center text-sm sm:text-base text-gray-600 group-hover:text-white">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Cross-border tax planning
                  </li>
                  <li className="flex items-center text-sm sm:text-base text-gray-600 group-hover:text-white">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Audit defense & disclosure strategy
                  </li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-2xl hover:scale-105 hover:-translate-y-2 hover:bg-[#A5292A] hover:text-white transition-all duration-300 border border-gray-100 group cursor-pointer w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <FileCheck className="w-6 h-6 text-[#A5292A] group-hover:text-white" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-xl font-semibold text-gray-800 group-hover:text-white mb-4">VDA Compliance Services India for Tax and Reporting</h3>
                <p className="text-gray-600 group-hover:text-white text-sm sm:text-base">
                  Tax treatment of virtual digital assets affects pricing, record keeping, and customer communication. Our VDA compliance services India help you map taxable events, maintain accurate transaction records, and meet reporting and withholding duties. We also prepare you for notices and assessments by organizing documentation early. Because rules and rates are updated from time to time, we confirm the current position before advising on any filing.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-2xl hover:scale-105 hover:-translate-y-2 hover:bg-[#A5292A] hover:text-white transition-all duration-300 border border-gray-100 group cursor-pointer w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <ArrowUpRight className="w-6 h-6 text-[#A5292A] group-hover:text-white" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-xl font-semibold text-gray-800 group-hover:text-white mb-4">Web2 to Web3 Transition</h3>
                <p className="text-gray-600 group-hover:text-white text-sm sm:text-base mb-4">
                  We guide traditional Web2 firms in legally transitioning into the Web3 space — migrating assets, contracts, governance, and compliance frameworks.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm sm:text-base text-gray-600 group-hover:text-white">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Contractual migration & amendments
                  </li>
                  <li className="flex items-center text-sm sm:text-base text-gray-600 group-hover:text-white">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    IP re-licensing & tokenization strategy
                  </li>
                  <li className="flex items-center text-sm sm:text-base text-gray-600 group-hover:text-white">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Compliance transformation roadmap
                  </li>
                  <li className="flex items-center text-sm sm:text-base text-gray-600 group-hover:text-white">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Stakeholder transition & governance realignment
                  </li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-2xl hover:scale-105 hover:-translate-y-2 hover:bg-[#A5292A] hover:text-white transition-all duration-300 border border-gray-100 group cursor-pointer w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <FileSpreadsheet className="w-6 h-6 text-[#A5292A] group-hover:text-white" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-xl font-semibold text-gray-800 group-hover:text-white mb-4">Indian FEMA Compliances</h3>
                <p className="text-gray-600 group-hover:text-white text-sm sm:text-base mb-4">
                  We help crypto & blockchain businesses comply with India's foreign exchange (FEMA) rules when dealing with cross-border flows, investments, or token transfers.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm sm:text-base text-gray-600 group-hover:text-white">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Structuring foreign inward / outward remittances
                  </li>
                  <li className="flex items-center text-sm sm:text-base text-gray-600 group-hover:text-white">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Reporting & approvals under FEMA
                  </li>
                  <li className="flex items-center text-sm sm:text-base text-gray-600 group-hover:text-white">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    RBI coordination & regulatory advisory
                  </li>
                  <li className="flex items-center text-sm sm:text-base text-gray-600 group-hover:text-white">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Cross-border capital movement planning
                  </li>
                </ul>
              </div>

              </div>

            {/* FEMA Compliance for Crypto Businesses Made Practical (new SEO content) */}
            <InlineContentBlock
              headingLevel="h2"
              className="my-10 rounded-lg"
              title="FEMA Compliance for Crypto Businesses Made Practical"
              paragraphs={[
                "Foreign investment, overseas customers, and international token sales all raise exchange control questions. Our approach to FEMA compliance for crypto businesses begins with mapping every cross-border flow, including inward investment, outward remittances, and token transfers. We then structure transactions, prepare required reports, and coordinate with banks and authorities where approvals are needed. This helps you raise capital and serve global users without regulatory surprises.",
              ]}
            />

            <div className="flex flex-wrap justify-center gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-2xl hover:scale-105 hover:-translate-y-2 hover:bg-[#A5292A] hover:text-white transition-all duration-300 border border-gray-100 group cursor-pointer w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-[#A5292A] group-hover:text-white" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-xl font-semibold text-gray-800 group-hover:text-white mb-4">Whitepapers</h3>
                <p className="text-gray-600 group-hover:text-white text-sm sm:text-base mb-4">
                  We draft legally robust whitepapers that combine technical clarity with regulatory disclosures, risk statements, and investor protections.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm sm:text-base text-gray-600 group-hover:text-white">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Market, technical & legal narrative balance
                  </li>

                  <li className="flex items-center text-sm sm:text-base text-gray-600 group-hover:text-white">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Review and vetting
                  </li>
                  <li className="flex items-center text-sm sm:text-base text-gray-600 group-hover:text-white">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Risk & compliance disclosures
                  </li>
                  <li className="flex items-center text-sm sm:text-base text-gray-600 group-hover:text-white">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Tokenomics & governance explanation
                  </li>
                  <li className="flex items-center text-sm sm:text-base text-gray-600 group-hover:text-white">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Legal disclaimers & regulatory alignment
                  </li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-2xl hover:scale-105 hover:-translate-y-2 hover:bg-[#A5292A] hover:text-white transition-all duration-300 border border-gray-100 group cursor-pointer w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Settings className="w-6 h-6 text-[#A5292A] group-hover:text-white" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-xl font-semibold text-gray-800 group-hover:text-white mb-4">Governance & Policy</h3>
                <p className="text-gray-600 group-hover:text-white text-sm sm:text-base mb-4">
                  We assist DAOs, protocols, and blockchain platforms to design governance rules, policy frameworks, and liability shields that are legally resilient and operationally coherent.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm sm:text-base text-gray-600 group-hover:text-white">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    DAO constitutional design & rules
                  </li>
                  <li className="flex items-center text-sm sm:text-base text-gray-600 group-hover:text-white">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Voting mechanisms & dispute resolution
                  </li>
                  <li className="flex items-center text-sm sm:text-base text-gray-600 group-hover:text-white">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Liability limiting frameworks
                  </li>
                  <li className="flex items-center text-sm sm:text-base text-gray-600 group-hover:text-white">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Policy drafting (privacy, token use, KYC)
                  </li>
                </ul>
              </div>

              </div>

            {/* Crypto KYC Compliance India for Safer Onboarding (new SEO content) */}
            <InlineContentBlock
              headingLevel="h2"
              className="my-10 rounded-lg"
              title="Crypto KYC Compliance India for Safer Onboarding"
              paragraphs={[
                "Strong onboarding protects both your users and your licence to operate. Our crypto KYC compliance India support includes drafting customer due diligence policies, defining verification workflows, and setting rules for monitoring suspicious activity. We align these policies with your privacy obligations, so you collect only the data you need and store it securely. Clear procedures also make audits and regulator queries far easier to handle.",
              ]}
            />

            <div className="flex flex-wrap justify-center gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-2xl hover:scale-105 hover:-translate-y-2 hover:bg-[#A5292A] hover:text-white transition-all duration-300 border border-gray-100 group cursor-pointer w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Plane className="w-6 h-6 text-[#A5292A] group-hover:text-white" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-xl font-semibold text-gray-800 group-hover:text-white mb-4">India to Global Transitions</h3>
                <p className="text-gray-600 group-hover:text-white text-sm sm:text-base mb-4">
                  We support Indian blockchain ventures in expanding overseas — structuring international legal presence, ensuring compliance abroad, and facilitating global fundraising.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm sm:text-base text-gray-600 group-hover:text-white">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Jurisdiction selection & entity setup
                  </li>
                  <li className="flex items-center text-sm sm:text-base text-gray-600 group-hover:text-white">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Cross-border regulatory & tax compliance
                  </li>
                  <li className="flex items-center text-sm sm:text-base text-gray-600 group-hover:text-white">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Global investor onboarding
                  </li>
                  <li className="flex items-center text-sm sm:text-base text-gray-600 group-hover:text-white">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Capital repatriation & exit structuring
                  </li>
                </ul>
              </div>


            </div>
          </div>
        </div>
      </section>
       {/* 9. Contact Section */}
       <section className="py-20 text-white" style={{ backgroundColor: "#A5292A" }}>
         <div className="container mx-auto px-4 text-center">
           <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold mb-4 text-white">Contact Us</h2>
           <p className="text-base sm:text-lg md:text-xl mb-4 text-white/90 max-w-4xl mx-auto">
             Ready to discuss your Web3 legal needs? Contact our experienced team for professional legal consultation.
           </p>
           <div className="flex flex-col sm:flex-row gap-6 justify-center">
             <button 
               onClick={handleContactClick}
               className="bg-white text-[#A5292A] px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:opacity-90 transition-all hover:cursor-pointer text-base sm:text-lg"
             >
               Contact Us
             </button>
             <button className="border-2 border-white text-white hover:bg-white hover:text-[#A5292A] px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transition-all text-base sm:text-lg">
               Call Us: 9625206671
             </button>
           </div>
         </div>
       </section>


      
     

           
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-3xl font-bold text-gray-800 mb-4 text-center">Comprehensive Web3 Legal Solutions</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-4 text-center">
              Our Web3 legal team provides comprehensive support across all aspects of decentralized technology law:
            </p>
            
            <div className="grid md:grid-cols-2 gap-14">
              <div className="space-y-6">
                  <div className="flex items-start">
                  <Building className="w-6 h-6 text-[#A5292A] mr-3 mt-1 flex-shrink-0 " />
                  <div>
                     <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Entity Formation</h3>
                    <p className="text-xs sm:text-sm md:text-base text-gray-600">Strategic jurisdiction selection, tax optimization, and comprehensive risk assessment for DAOs and Web3 organizations</p>
                  </div>
                </div>
                 <div className="flex items-start">
                  <TrendingUp className="w-6 h-6 text-[#A5292A] mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Strategic Planning</h3>
                    <p className="text-xs sm:text-sm md:text-base text-gray-600">Legal framework development for DAO operations and associated investment structures</p>
                  </div>
                </div>
                 <div className="flex items-start">
                  <FileText className="w-6 h-6 text-[#A5292A] mr-3 mt-1 flex-shrink-0" />
            <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Contract Services</h3>
                    <p className="text-xs sm:text-sm md:text-base text-gray-600">Comprehensive contract lifecycle management including drafting, negotiation, and enforcement across Web3 platforms</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                 <div className="flex items-start">
                  <Shield className="w-6 h-6 text-[#A5292A] mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Intellectual Property</h3>
                    <p className="text-xs sm:text-sm md:text-base text-gray-600">Advanced IP protection strategies for digital assets, licensing frameworks, and cross-border IP enforcement</p>
                  </div>
                </div>
                 <div className="flex items-start">
                  <Scale className="w-6 h-6 text-[#A5292A] mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Dispute Resolution</h3>
                    <p className="text-xs sm:text-sm md:text-base text-gray-600">Specialized dispute resolution for Web3 conflicts including smart contract disputes and cross-border litigation</p>
                  </div>
                </div>
                 <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-[#A5292A] mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Compliance</h3>
                    <p className="text-xs sm:text-sm md:text-base text-gray-600">Regulatory compliance across multiple jurisdictions including securities law, data protection, and emerging Web3 regulations</p>
              </div>
            </div>
              </div>
            </div>
          </div>
        </div>
      </section>

     

      

     
      {/* Crypto Compliance Services India (new SEO section) */}
      <ContentSection
        title="Crypto Compliance Services India for Exchanges and Startups"
        highlight="Crypto Compliance Services India"
        bg="white"
        paragraphs={[
          "Compliance works best when it is built into the product from day one. Our crypto compliance services India cover licensing checks, policy frameworks, internal controls, and regular compliance reviews tailored to your business model. We monitor regulatory developments and update your processes as expectations change, so your team can focus on growth instead of chasing every new notice.",
        ]}
      />

      {/* FIU-IND registration question (new SEO section) */}
      <ContentSection
        title="Do Crypto Businesses in India Need to Register with FIU-IND?"
        highlight="Register with FIU-IND?"
        bg="light"
        paragraphs={[
          "Yes, in most cases. Businesses that exchange, transfer, safekeep, or administer virtual digital assets for others are treated as reporting entities under India’s anti-money laundering law. Meeting PMLA/FIU-IND compliance in India usually means registering with the Financial Intelligence Unit, appointing a compliance officer, verifying customers, keeping records, and filing required reports. Whether your model falls within scope depends on your activities, so a legal review before launch is wise.",
        ]}
      />

      {/* 9. Frequently Asked Questions (existing questions kept + new questions added) */}
      <FAQSection items={web3Faqs} bg="white" />

      <Footer />
    </div>
  );
}

