import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../../components/Navbar";
import Footer from "../../components/Footer";
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

const Web3Law = () => {
  const [openFAQ, setOpenFAQ] = useState(null);
  const navigate = useNavigate();

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const handleContactClick = () => {
    navigate('/contact');
  };
  
  

 
  return (
    <div className="min-h-screen bg-white">
      <Navbar page="web3law" />
      
      {/* 1. Hero Section */}
      <section
        className="text-gray-800 py-20 relative"
        style={{ backgroundColor: "#FAFAFA" }}
      >
        {/* Background Image Layer with Blur */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2084&q=80')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            filter: "blur(2px)",
          }}
        ></div>

        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "rgba(250, 250, 250, 0.9)" }}
        ></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Web3 <span style={{ color: "#A5292A" }}>Legal</span>
            </h1>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-700 mb-4">
              Building Confidence & Mitigating Risk in Web3 Legal Practice
            </h2>
            <p className="text-lg text-gray-600 mb-4 max-w-4xl mx-auto">
              Navigating the complex and rapidly changing regulatory environment to unlock opportunities in Web3 legal matters.
            </p>
            <button 
              onClick={handleContactClick}
              className="text-white px-8 py-4 rounded-lg text-lg font-semibold hover:opacity-90 transition-all flex items-center justify-center mx-auto hover:cursor-pointer" 
              style={{ backgroundColor: "#A5292A" }}
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>

          {/*  Web3 Legal Services */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">Comprehensive Legal Services</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Crypto & Digital Assets */}
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <FileCheck className="w-6 h-6" style={{ color: "#A5292A" }} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Digital Asset Licensing & Compliance</h3>
                <p className="text-gray-600 text-base mb-4">
                  We help digital-asset ventures navigate the complex regulatory landscape by securing necessary licenses, ensuring full compliance, and building frameworks that align innovation with enforceable law.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    License structuring across jurisdictions
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Regulatory gap analysis & compliance roadmap
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    AML / KYC / CFT policy drafting
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Ongoing supervision & liaison with regulators
                  </li>
                </ul>
              </div>

              
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Gavel className="w-6 h-6" style={{ color: "#A5292A" }} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Legal Opinion on Tokens</h3>
                <p className="text-gray-600 text-base mb-4">
                  We issue authoritative opinions assessing whether a token qualifies as a security, commodity, or utility, thereby providing clarity and defensibility to issuers and investors.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Token classification analysis
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Jurisdictional risk & legal exposure review
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Regulatory alignment & disclosure requirements
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Mitigation of investor liability
                  </li>
                </ul>
              </div>

              
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Briefcase className="w-6 h-6" style={{ color: "#A5292A" }} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Global Incorporation & Structuring</h3>
                <p className="text-gray-600 text-base mb-4">
                  For blockchain firms eyeing global reach, we design corporate structures that optimize taxation, regulatory burden, and capital flows across jurisdictions.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Holding / operating / licensing entity design
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Tax-efficient cross-border models
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Regulatory compliance per jurisdiction
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Capital flow & repatriation planning
                  </li>
                </ul>
              </div>

          
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <FileSignature className="w-6 h-6" style={{ color: "#A5292A" }} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Legal Drafting: SAFE, SAFT, Token Warrants</h3>
                <p className="text-gray-600 text-base mb-4">
                  We draft and tailor investment instruments (SAFEs, SAFTs, warrants) that balance founder interests, investor protections, and regulatory compliance.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Drafting token sale & investment agreements
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Risk allocation & indemnity clauses
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Vesting, anti-dilution & conversion mechanisms
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Compliance disclosures & protective covenants
                  </li>
                </ul>
              </div>

              
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Copyright className="w-6 h-6" style={{ color: "#A5292A" }} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Blockchain-based IP</h3>
                <p className="text-gray-600 text-base mb-4">
                  We help clients tokenize intellectual property, manage licensing in Web3 environments, and protect rights in decentralized contexts.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Tokenization of copyrights, patents & trade marks
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Licensing & royalty frameworks on-chain
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Enforcement in decentralized settings
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Revenue sharing & secondary market rights
                  </li>
                </ul>
              </div>

              
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <UserCheck className="w-6 h-6" style={{ color: "#A5292A" }} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Tokens for Employees (ETOPs)</h3>
                <p className="text-gray-600 text-base mb-4">
                  We design employee token incentive plans that respect securities regulation, labor law, and taxation, while fostering alignment and retention.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Structuring employee token allocation schemes
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Vesting schedules, performance triggers & lock-ups
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Compliance with labor & securities laws
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Tax treatment and reporting strategy
                  </li>
                </ul>
          </div>

              
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Search className="w-6 h-6" style={{ color: "#A5292A" }} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Smart Contract Legal Audit</h3>
                <p className="text-gray-600 text-base mb-4">
                  We perform a legal audit of smart contracts to identify risks, gaps, and compliance issues, working alongside technical audits to strengthen legal defensibility.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Review of contract terms & logic flows
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Liability & indemnity assessment
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Regulatory compliance checks
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Dispute-resolution & upgrade clauses
                  </li>
                </ul>
              </div>

              
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <FileBarChart className="w-6 h-6" style={{ color: "#A5292A" }} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">FIU-IND Registration</h3>
                <p className="text-gray-600 text-base mb-4">
                  We assist Virtual Asset Service Providers (VASPs) in India with registration before the Financial Intelligence Unit (FIU-IND), setting up compliance structures per local law.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Application preparation & liaison
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    AML / CFT program design
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Reporting systems & audit trails
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Ongoing compliance support
                  </li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Calculator className="w-6 h-6" style={{ color: "#A5292A" }} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">VDA Tax Services</h3>
                <p className="text-gray-600 text-base mb-4">
                  We specialize in taxation of Virtual Digital Assets (VDAs), helping clients classify, compute, plan, and comply with domestic and cross-border tax obligations.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Tax classification & event mapping
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Income tax, capital gains & GST treatment
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Cross-border tax planning
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Audit defense & disclosure strategy
                  </li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <ArrowUpRight className="w-6 h-6" style={{ color: "#A5292A" }} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Web2 to Web3 Transition</h3>
                <p className="text-gray-600 text-base mb-4">
                  We guide traditional Web2 firms in legally transitioning into the Web3 space — migrating assets, contracts, governance, and compliance frameworks.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Contractual migration & amendments
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    IP re-licensing & tokenization strategy
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Compliance transformation roadmap
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Stakeholder transition & governance realignment
                  </li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <FileSpreadsheet className="w-6 h-6" style={{ color: "#A5292A" }} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Indian FEMA Compliances</h3>
                <p className="text-gray-600 text-base mb-4">
                  We help crypto & blockchain businesses comply with India's foreign exchange (FEMA) rules when dealing with cross-border flows, investments, or token transfers.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Structuring foreign inward / outward remittances
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Reporting & approvals under FEMA
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    RBI coordination & regulatory advisory
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Cross-border capital movement planning
                  </li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6" style={{ color: "#A5292A" }} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Whitepapers</h3>
                <p className="text-gray-600 text-base mb-4">
                  We draft legally robust whitepapers that combine technical clarity with regulatory disclosures, risk statements, and investor protections.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Market, technical & legal narrative balance
                  </li>

                  <li className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Review and vetting
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Risk & compliance disclosures
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Tokenomics & governance explanation
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Legal disclaimers & regulatory alignment
                  </li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Settings className="w-6 h-6" style={{ color: "#A5292A" }} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Governance & Policy</h3>
                <p className="text-gray-600 text-base mb-4">
                  We assist DAOs, protocols, and blockchain platforms to design governance rules, policy frameworks, and liability shields that are legally resilient and operationally coherent.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    DAO constitutional design & rules
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Voting mechanisms & dispute resolution
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Liability limiting frameworks
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Policy drafting (privacy, token use, KYC)
                  </li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Plane className="w-6 h-6" style={{ color: "#A5292A" }} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">India to Global Transitions</h3>
                <p className="text-gray-600 text-base mb-4">
                  We support Indian blockchain ventures in expanding overseas — structuring international legal presence, ensuring compliance abroad, and facilitating global fundraising.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Jurisdiction selection & entity setup
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Cross-border regulatory & tax compliance
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: "#A5292A" }}>
                      <span className="text-white text-xs">✓</span>
                    </span>
                    Global investor onboarding
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
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
           <h2 className="text-4xl font-bold mb-4">Contact Us</h2>
           <p className="text-xl mb-4 text-white text-opacity-90 max-w-4xl mx-auto">
             Ready to discuss your Web3 legal needs? Contact our experienced team for professional legal consultation.
           </p>
           <div className="flex flex-col sm:flex-row gap-6 justify-center">
             <button 
               onClick={handleContactClick}
               className="bg-white text-[#A5292A] px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-all hover:cursor-pointer text-lg"
             >
               Contact Us
             </button>
             <button className="border-2 border-white text-white hover:bg-white hover:text-[#A5292A] px-8 py-4 rounded-lg font-semibold transition-all text-lg">
               Call Us: 9625206671
             </button>
           </div>
         </div>
       </section>


      
     

           
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">Comprehensive Web3 Legal Solutions</h2>
            <p className="text-lg text-gray-600 mb-4 text-center">
              Our Web3 legal team provides comprehensive support across all aspects of decentralized technology law:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="flex items-start">
                  <Building className="w-6 h-6 text-[#A5292A] mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Entity Formation</h3>
                    <p className="text-gray-600 text-sm">Strategic jurisdiction selection, tax optimization, and comprehensive risk assessment for DAOs and Web3 organizations</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <TrendingUp className="w-6 h-6 text-[#A5292A] mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Strategic Planning</h3>
                    <p className="text-gray-600 text-sm">Legal framework development for DAO operations and associated investment structures</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FileText className="w-6 h-6 text-[#A5292A] mr-3 mt-1 flex-shrink-0" />
            <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Contract Services</h3>
                    <p className="text-gray-600 text-sm">Comprehensive contract lifecycle management including drafting, negotiation, and enforcement across Web3 platforms</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <Shield className="w-6 h-6 text-[#A5292A] mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Intellectual Property</h3>
                    <p className="text-gray-600 text-sm">Advanced IP protection strategies for digital assets, licensing frameworks, and cross-border IP enforcement</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Scale className="w-6 h-6 text-[#A5292A] mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Dispute Resolution</h3>
                    <p className="text-gray-600 text-sm">Specialized dispute resolution for Web3 conflicts including smart contract disputes and cross-border litigation</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-[#A5292A] mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Compliance</h3>
                    <p className="text-gray-600 text-sm">Regulatory compliance across multiple jurisdictions including securities law, data protection, and emerging Web3 regulations</p>
              </div>
            </div>
              </div>
            </div>
          </div>
        </div>
      </section>

     

      

     
      {/* 9. Frequently Asked Questions */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleFAQ(0)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-lg  text-gray-800">What Are the Primary Legal Challenges in Web3?</h3>
                  {openFAQ === 0 ? (
                    <Minus className="w-6 h-6 text-[#A5292A]" />
                  ) : (
                    <Plus className="w-6 h-6 text-[#A5292A]" />
                  )}
                </button>
                {openFAQ === 0 && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 leading-relaxed mb-4">
                      Web3 technologies present unique legal challenges that traditional legal frameworks weren't designed to address. As these technologies mature, businesses face unprecedented legal complexities that require specialized expertise. Key areas of concern include:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                      <li><strong>Data privacy and security:</strong> While blockchain technology offers enhanced security through decentralization, the transparent nature of public blockchains can conflict with privacy regulations. Organizations must carefully balance transparency benefits with data protection requirements across different jurisdictions.</li>
                      <li><strong>Intellectual property protection:</strong> The decentralized and global nature of Web3 creates challenges for traditional IP enforcement. Creators and businesses need innovative strategies to protect their intellectual property in an environment where traditional legal boundaries are less clear.</li>
                      <li><strong>Regulatory compliance:</strong> The absence of centralized authority in Web3 systems creates uncertainty around regulatory oversight and enforcement. Businesses must proactively develop compliance strategies that anticipate evolving regulatory frameworks across multiple jurisdictions.</li>
                    </ul>
                  </div>
                )}
          </div>

              <div className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleFAQ(1)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-lg  text-gray-800">What Constitutes Web3 Assets?</h3>
                  {openFAQ === 1 ? (
                    <Minus className="w-6 h-6 text-[#A5292A]" />
                  ) : (
                    <Plus className="w-6 h-6 text-[#A5292A]" />
                  )}
                </button>
                {openFAQ === 1 && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 leading-relaxed">
                      Web3 assets encompass any digital or digitized items that leverage blockchain technology for ownership, transfer, or verification. These assets operate within decentralized networks, creating new possibilities for value creation and exchange. Examples include digital currencies, tokenized real estate, virtual collectibles, digital art, gaming assets, and even fractionalized ownership of physical assets. The flexibility of Web3 technology enables businesses to create innovative asset classes and new forms of customer engagement that weren't possible with traditional systems.
                    </p>
                  </div>
                )}
                </div>

              <div className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleFAQ(2)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-lg  text-gray-800">What is the Current Legal Status of Cryptocurrency in India?</h3>
                  {openFAQ === 2 ? (
                    <Minus className="w-6 h-6 text-[#A5292A]" />
                  ) : (
                    <Plus className="w-6 h-6 text-[#A5292A]" />
                  )}
                </button>
                {openFAQ === 2 && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 leading-relaxed">
                      India's approach to cryptocurrency regulation is currently in a transitional phase, with the government and regulatory bodies developing comprehensive frameworks for digital assets. While cryptocurrencies are not explicitly prohibited, they are not recognized as legal tender. The regulatory environment includes evolving tax policies, anti-money laundering requirements, and securities law considerations. Successfully operating in this space requires careful legal planning and ongoing compliance monitoring as regulations continue to develop.
                    </p>
                </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      

    

      <Footer />
    </div>
  );
};

export default Web3Law;