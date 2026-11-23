'use client'

import React from "react";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import Image from "next/image";
<<<<<<< HEAD
import ContentSection from "@/components/SEO/ContentSection";
import FAQSection from "@/components/SEO/FAQSection";
=======
>>>>>>> 59e0d3c087c2128ab9f64cfe9a8d7d0dab1b2466
import {
  ArrowRight,
  Shield,
  Lock,
  Eye,
  AlertTriangle,
  CheckCircle,
  FileText,
  Users,
  Globe,
  Database,
  Key,
  Search,
  Zap,
} from "lucide-react";

export default function CybersecurityServices() {
  const services = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Security Assessment & Audits",
      description:
        "Comprehensive evaluation of your current security posture, identifying vulnerabilities and providing actionable recommendations for improvement.",
      imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
<<<<<<< HEAD
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Cybersecurity Compliance Consulting in India From Audit to Action",
      description:
        "Knowing your gaps is only useful if you act on them. Our cybersecurity compliance consulting in India turns assessment findings into a prioritized action plan. We rank issues by legal and business risk, suggest realistic timelines, and help your technical and management teams work from the same checklist. This keeps remediation focused and helps you show customers and partners that security is taken seriously.",
      imageUrl: ""
    },
    {
=======
>>>>>>> 59e0d3c087c2128ab9f64cfe9a8d7d0dab1b2466
      icon: <Lock className="w-6 h-6" />,
      title: "Data Protection Compliance",
      description:
        "Ensure compliance with GDPR, CCPA, and other data protection regulations through comprehensive privacy frameworks and legal documentation.",
      imageUrl: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
<<<<<<< HEAD
      icon: <Eye className="w-6 h-6" />,
      title: "Data Privacy Legal Advisory in India for Lawful Data Handling",
      description:
        "Privacy duties apply from the moment you collect personal information. Our data privacy legal advisory in India covers consent, notices, purpose limitation, retention, and the rights of individuals whose data you hold. We also advise on how Indian requirements interact with foreign laws if you serve overseas users. Clear documentation helps you answer customer questions and regulator inquiries with confidence.",
      imageUrl: ""
    },
    {
=======
>>>>>>> 59e0d3c087c2128ab9f64cfe9a8d7d0dab1b2466
      icon: <FileText className="w-6 h-6" />,
      title: "Policy Development",
      description:
        "Create comprehensive cybersecurity policies, incident response plans, and employee training programs to protect your organization.",
      imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Employee Training",
      description:
        "Develop and implement cybersecurity awareness programs to educate your team on best practices and threat recognition.",
      imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Vendor Risk Management",
      description:
        "Assess and manage cybersecurity risks from third-party vendors and partners through comprehensive due diligence processes.",
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Incident Response Planning",
      description:
        "Prepare for potential security breaches with detailed incident response plans and legal frameworks for data breach notifications.",
      imageUrl: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
<<<<<<< HEAD
    {
      icon: <AlertTriangle className="w-6 h-6" />,
      title: "Cybersecurity Legal Compliance in India for Breach Readiness",
      description:
        "When a breach occurs, time is limited and every decision has legal consequences. Our work on cybersecurity legal compliance in India includes defining who must be informed, what must be reported, and how evidence should be preserved. We build these steps into your incident response plan and test them through simple exercises. Because reporting requirements are updated from time to time, we confirm the current rules before finalizing your procedures.",
      imageUrl: ""
    },
=======
>>>>>>> 59e0d3c087c2128ab9f64cfe9a8d7d0dab1b2466
  ];

  const complianceAreas = [
    "GDPR Compliance Framework",
    "CCPA Data Protection",
    "SOC 2 Type II Preparation",
    "ISO 27001 Implementation",
    "HIPAA Compliance (Healthcare)",
    "PCI DSS (Payment Processing)",
    "NIST Cybersecurity Framework",
    "Industry-Specific Regulations",
  ];

  const benefits = [
    "Comprehensive security risk assessment and mitigation",
    "Legal compliance with data protection regulations",
    "Customized cybersecurity policy development",
    "Employee training and awareness programs",
    "Vendor risk assessment and management",
    "Incident response planning and legal support",
  ];

<<<<<<< HEAD
  const cyberFaqs = [
    {
      question: "Why does a business need legal support for cybersecurity?",
      answer:
        "Security failures can trigger regulatory action, customer claims, and contract disputes. Legal support helps you meet reporting duties, draft sound policies, manage vendor risk, and respond to an incident in a way that limits liability.",
    },
    {
      question: "What is included in a security assessment?",
      answer:
        "It evaluates your current security posture, identifies vulnerabilities, and checks your compliance status against relevant laws and standards. You receive actionable recommendations ranked by risk, so you know what to address first.",
    },
    {
      question: "Which frameworks and standards can you help with?",
      answer:
        "We support GDPR, CCPA, SOC 2 Type II, ISO 27001, HIPAA, PCI DSS, and the NIST Cybersecurity Framework, along with industry-specific regulations. The right set depends on your sector, customers, and where you operate.",
    },
    {
      question: "What should an incident response plan contain?",
      answer:
        "A good plan names a response team, defines what counts as an incident, sets escalation and communication steps, explains legal and regulatory notification duties, and describes how evidence is preserved. It should be tested and updated regularly.",
    },
    {
      question: "Do employees really need cybersecurity training?",
      answer:
        "Yes. Many incidents begin with human error, such as phishing or weak passwords. Regular awareness programs reduce this risk, and they also show regulators and customers that you take reasonable steps to protect data.",
    },
  ];

=======
>>>>>>> 59e0d3c087c2128ab9f64cfe9a8d7d0dab1b2466
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
              <span style={{ color: '#A5292A' }}>Cybersecurity Services</span>
            </h1>
            
            {/* Breadcrumb */}
            <div className="flex justify-center">
              <Breadcrumb 
                items={[
                  { label: "Home", href: "/" },
                  { label: "Value Boosting Solutions", href: "/valueboostingsolutions" },
                  { label: "Cybersecurity Services" }
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
                Protect Your Business in the <span style={{ color: '#A5292A' }}>Digital Age</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                In today's interconnected world, cybersecurity is not just a technical concern—it's a legal and business imperative. Our Cybersecurity Services provide comprehensive legal protection and compliance frameworks to safeguard your organization against digital threats. We help you navigate complex data protection regulations, develop robust security policies, and ensure your business meets all necessary compliance requirements.
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
                  src="https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="Cybersecurity and data protection"
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

<<<<<<< HEAD
      {/* Cybersecurity Legal Services in India (new SEO section) */}
      <ContentSection
        title="Cybersecurity Legal Services in India for Modern Businesses"
        highlight="Cybersecurity Legal Services in India"
        bg="light"
        paragraphs={[
          "A security incident quickly becomes a legal problem, involving customer claims, regulator questions, and contract disputes. Our cybersecurity legal services in India help you prepare for these risks before they arise. We review your contracts, policies, and internal practices, and we explain your legal duties in plain language. When something goes wrong, you already have documented procedures and a team that knows your business.",
        ]}
      />

=======
>>>>>>> 59e0d3c087c2128ab9f64cfe9a8d7d0dab1b2466
      {/* Services Section */}
      <section className="py-20" style={{ backgroundColor: "#FAFAFA" }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Comprehensive <span style={{ color: '#A5292A' }}>Cybersecurity Services</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From risk assessment to compliance management, we provide end-to-end cybersecurity legal support for your organization.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 sm:px-8 md:px-12 lg:px-20">
            {services.map((service, index) => (
              <div
                key={index}
<<<<<<< HEAD
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group hover:scale-105 relative transform hover:-translate-y-2 flex flex-col"
=======
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group hover:scale-105 relative transform hover:-translate-y-2"
>>>>>>> 59e0d3c087c2128ab9f64cfe9a8d7d0dab1b2466
                style={{
                  transformStyle: 'preserve-3d',
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
<<<<<<< HEAD
                {/* Image Section (new content cards without an image show the icon on a brand-red band) */}
                {service.imageUrl ? (
=======
                {/* Image Section */}
>>>>>>> 59e0d3c087c2128ab9f64cfe9a8d7d0dab1b2466
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
<<<<<<< HEAD
                ) : (
                <div className="relative h-20 flex items-center px-8 text-white" style={{ backgroundColor: '#A5292A' }}>
                  {service.icon}
                </div>
                )}
                
                {/* Text Section */}
                <div className="p-8 flex-1" style={{ backgroundColor: '#2D2D2D' }}>
=======
                
                {/* Text Section */}
                <div className="p-8" style={{ backgroundColor: '#2D2D2D' }}>
>>>>>>> 59e0d3c087c2128ab9f64cfe9a8d7d0dab1b2466
                  <h3 className="text-xl font-bold text-white mb-4">
                    {service.title}
                  </h3>
                  <p className="text-white text-sm leading-relaxed opacity-90">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Areas Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Regulatory Compliance Expertise
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We help you navigate complex cybersecurity regulations and ensure compliance across multiple jurisdictions and industry standards.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 px-4 sm:px-8 md:px-12 lg:px-20">
            {complianceAreas.map((area, index) => (
              <div
                key={index}
                className="flex items-center p-4 bg-white rounded-lg border border-gray-100 hover:shadow-lg transition-all duration-300 group hover:bg-[#A5292A] hover:text-white hover:z-50 hover:scale-105 relative transform hover:-translate-y-1"
                style={{
                  transformStyle: 'preserve-3d',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                <div
                  className="w-2 h-2 rounded-full mr-3 group-hover:bg-white"
                  style={{ backgroundColor: "#A5292A" }}
                ></div>
                <span className="text-gray-700 font-medium group-hover:text-white transition-colors">{area}</span>
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
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Why Choose Our Cybersecurity Services?
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our cybersecurity services combine deep legal expertise with practical security knowledge, ensuring your organization is not only compliant but also well-protected against evolving digital threats.
              </p>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div
                    className="w-3 h-3 rounded-full mr-4 mt-2"
                    style={{ backgroundColor: "#A5292A" }}
                  ></div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Legal & Technical Expertise
                    </h4>
                    <p className="text-gray-600">
                      Unique combination of cybersecurity knowledge and legal compliance expertise.
                    </p>
                  </div>
                </div>

<<<<<<< HEAD
                {/* Your Trusted Cyber Law Firm in India (new SEO content) */}
                <div className="flex items-start">
                  <div
                    className="w-3 h-3 rounded-full mr-4 mt-2 flex-shrink-0"
                    style={{ backgroundColor: "#A5292A" }}
                  ></div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">
                      Your Trusted Cyber Law Firm in India
                    </h3>
                    <p className="text-gray-600">
                      Technology risk calls for lawyers who understand both statutes and systems. As a cyber law firm in India, we advise on information technology law, contracts with technology providers, and the legal side of cyber incidents. We work alongside your security and IT teams, so legal advice reflects how your systems actually operate. This practical approach saves time and leads to solutions your teams can implement.
                    </p>
                  </div>
                </div>

=======
>>>>>>> 59e0d3c087c2128ab9f64cfe9a8d7d0dab1b2466
                <div className="flex items-start">
                  <div
                    className="w-3 h-3 rounded-full mr-4 mt-2"
                    style={{ backgroundColor: "#A5292A" }}
                  ></div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Proactive Risk Management
                    </h4>
                    <p className="text-gray-600">
                      Identify and mitigate potential security risks before they become costly incidents.
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
                      Industry-Specific Solutions
                    </h4>
                    <p className="text-gray-600">
                      Tailored cybersecurity frameworks for your specific industry and regulatory requirements.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:order-1">
              <div className="relative">
                <Image
                  src="https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="Cybersecurity consultation and planning"
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

      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Our Cybersecurity Process
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              A systematic approach to building your cybersecurity foundation, from assessment to implementation and ongoing support.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 px-4 sm:px-8 md:px-12 lg:px-20">
            {[
              {
                step: "01",
                title: "Assessment",
                description:
                  "Comprehensive evaluation of your current security posture and compliance status.",
              },
              {
                step: "02",
                title: "Strategy",
                description:
                  "Development of customized cybersecurity framework and compliance roadmap.",
              },
              {
                step: "03",
                title: "Implementation",
                description:
                  "Deployment of security policies, training programs, and compliance measures.",
              },
              {
                step: "04",
                title: "Monitoring",
                description:
                  "Ongoing support, compliance monitoring, and security framework optimization.",
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
                Ready to Secure Your Digital Assets?
              </h3>
              <p className="text-lg text-white/90 mb-8 leading-relaxed">
                Let our Cybersecurity Services help you build a robust security framework that protects your business while ensuring full regulatory compliance.
              </p>
              <button
                className="bg-white text-[#A5292A] px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all inline-flex items-center"
                onClick={() => (window.location.href = "/contact")}
              >
                Secure Your Business Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

<<<<<<< HEAD
      {/* Frequently Asked Questions (new SEO section) */}
      <FAQSection items={cyberFaqs} bg="light" />

=======
>>>>>>> 59e0d3c087c2128ab9f64cfe9a8d7d0dab1b2466
      {/* Footer */}
      <Footer />
    </div>
  );
}
