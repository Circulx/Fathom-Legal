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
  UserCheck,
  Shield,
  Scale,
  TrendingUp,
  Users,
  CheckCircle,
  FileText,
  Target,
  Award,
  Clock,
  Globe,
} from "lucide-react";

export default function ChiefLegalOfficerService() {
  const benefits = [
    {
      icon: <UserCheck className="w-6 h-6" />,
      title: "Executive-Level Expertise",
      description:
        "Access seasoned legal professionals with C-suite experience without the full-time executive overhead and costs.",
    },
    {
<<<<<<< HEAD
      icon: <Target className="w-6 h-6" />,
      title: "Cost-Effective Leadership",
      description:
        "Hiring a full-time general counsel is a major commitment for an early or mid-stage company. Engaging a fractional chief legal officer in India lets you pay for the time and expertise you actually need. You gain senior judgment on strategy, risk, and governance, while keeping fixed costs low. As your workload grows, the engagement can expand with you, so legal support always matches the stage of your business.",
    },
    {
=======
>>>>>>> 59e0d3c087c2128ab9f64cfe9a8d7d0dab1b2466
      icon: <Shield className="w-6 h-6" />,
      title: "Strategic Risk Management",
      description:
        "Proactive identification and mitigation of legal risks that could impact your business operations and growth.",
    },
    {
      icon: <Scale className="w-6 h-6" />,
      title: "Corporate Governance",
      description:
        "Expert guidance on board governance, compliance frameworks, and regulatory requirements for your industry.",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Business Growth Support",
      description:
        "Legal strategies aligned with your business objectives to support sustainable growth and expansion plans.",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Team Integration",
      description:
        "Seamless integration into your existing team structure with collaborative approach and clear communication.",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Flexible Engagement",
      description:
        "Scalable service model that adapts to your business needs, from part-time support to full strategic partnership.",
    },
  ];

  const serviceAreas = [
    "Corporate Strategy & Planning",
    "Compliance Management",
    "Contract Negotiation & Review",
    "Mergers & Acquisitions Support",
    "Employment Law Guidance",
    "Intellectual Property Strategy",
    "Regulatory Affairs",
    "Crisis Management",
    "Board Advisory Services",
    "Policy Development",
    "Legal Budget Management",
    "Vendor & Partner Relations",
  ];

<<<<<<< HEAD
  const cloFaqs = [
    {
      question: "What does a Chief Legal Officer do for a business?",
      answer:
        "A Chief Legal Officer leads a company’s legal strategy. They manage risk, oversee contracts and compliance, advise the board, and guide major decisions such as fundraising, partnerships, and acquisitions. They also set up policies and processes so that legal issues are handled early and consistently.",
    },
    {
      question: "Is an outsourced CLO a good fit for a small or early-stage company?",
      answer:
        "Yes. Small companies often need senior legal judgment but cannot justify a full-time executive salary. An outsourced model gives you experienced leadership on a scalable basis, so you pay for the support your business needs at its current stage.",
    },
    {
      question: "How is a CLO different from a regular lawyer or legal retainer?",
      answer:
        "A lawyer or retainer usually responds to specific questions or tasks. A CLO takes ownership of your overall legal function. They plan ahead, work closely with your management team, and tie legal decisions to business goals instead of handling issues one at a time.",
    },
    {
      question: "How quickly can the engagement begin?",
      answer:
        "It starts with an initial assessment of your legal needs, challenges, and objectives. After that, we build a customized legal roadmap and set up clear communication channels with your team. Timelines depend on the size and complexity of your business, and we will confirm them during the consultation.",
    },
    {
      question: "Can the scope of the service change as my business grows?",
      answer:
        "Yes. The engagement is flexible, ranging from part-time support to a full strategic partnership. We review it regularly and adjust the scope, whether you need more help with compliance, transactions, employment matters, or board advisory work.",
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
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 sm:mb-8 md:mb-10">
<<<<<<< HEAD
              <span style={{ color: '#A5292A' }}>Virtual Chief Legal Officer Services</span>
=======
              <span style={{ color: '#A5292A' }}>Chief Legal Officer Service</span>
>>>>>>> 59e0d3c087c2128ab9f64cfe9a8d7d0dab1b2466
            </h1>
            
            {/* Breadcrumb */}
            <div className="flex justify-center">
              <Breadcrumb 
                items={[
                  { label: "Home", href: "/" },
                  { label: "Value Boosting Solutions", href: "/valueboostingsolutions" },
                  { label: "Chief Legal Officer Service" }
                ]} 
              />
            </div>
          </div>
        </div>
      </section>

<<<<<<< HEAD
      {/* Chief Legal Officer Services in India (new SEO section) */}
      <ContentSection
        title="Chief Legal Officer Services in India for Growing Businesses"
        highlight="Chief Legal Officer Services in India"
        bg="white"
        paragraphs={[
          "Growing companies reach a point where contracts, compliance, and investor questions need senior attention, but a full-time executive is not yet practical. Our chief legal officer services in India give you that senior leadership on a flexible basis. We look at your business goals, identify legal priorities, and take ownership of the decisions that protect your growth. Instead of reacting to problems, your leadership team gets a trusted legal partner who plans ahead and communicates clearly.",
        ]}
      />

=======
>>>>>>> 59e0d3c087c2128ab9f64cfe9a8d7d0dab1b2466
      {/* Key Benefits Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
<<<<<<< HEAD
              Why Choose Our<span style={{ color: '#A5292A' }}> Chief Legal Officer Services?</span>
=======
              Why Choose Our<span style={{ color: '#A5292A' }}> CLO Service?</span>
>>>>>>> 59e0d3c087c2128ab9f64cfe9a8d7d0dab1b2466
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
              Our Chief Legal Officer service delivers executive-level legal
              expertise tailored to your business needs and growth objectives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:ml-20 lg:mr-20">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 group transform hover:-translate-y-2 hover:scale-105 perspective-1000"
                style={{
                  transformStyle: 'preserve-3d',
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                <div
                  className="text-white p-2 sm:p-3 rounded-lg mb-4 sm:mb-6 w-fit group-hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: "#A5292A" }}
                >
                  {benefit.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
                  {benefit.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Areas Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center lg:ml-20 lg:mr-20">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4 sm:mb-6 ">
<<<<<<< HEAD
                Strategic Legal Leadership for <span style={{ color: '#A5292A' }}>Growing Businesses</span>
=======
                <span style={{ color: '#A5292A' }}>Comprehensive Legal Leadership</span>
>>>>>>> 59e0d3c087c2128ab9f64cfe9a8d7d0dab1b2466
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                Our CLO service covers all aspects of legal leadership and
                strategic guidance. From day-to-day compliance matters to
                complex corporate transactions, we provide the expertise your
<<<<<<< HEAD
                business needs to thrive in today’s competitive landscape.
=======
                business needs to thrive in today's competitive landscape.
>>>>>>> 59e0d3c087c2128ab9f64cfe9a8d7d0dab1b2466
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {serviceAreas.map((area, index) => (
                  <div
                    key={index}
                    className="flex items-center p-3 sm:p-4 bg-[#FAFAFA] rounded-lg border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                    style={{
                      transformStyle: 'preserve-3d',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    <div
                      className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mr-2 sm:mr-3 flex-shrink-0"
                      style={{ backgroundColor: "#a5292a" }}
                    ></div>
                    <span className="text-xs sm:text-sm text-gray-700 font-medium">{area}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:pl-8">
<<<<<<< HEAD
              {/* Virtual CLO for remote-first teams (new SEO content) */}
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
                Virtual Chief Legal Officer Services for <span style={{ color: '#A5292A' }}>Remote-First Teams</span>
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                Many businesses now work across cities, time zones, and countries. Our virtual chief legal officer services in India are designed for this reality. We join your meetings, review documents, and advise your leaders through video calls, secure document sharing, and regular check-ins. You receive the same quality of legal leadership as an in-house executive, with the convenience of access whenever decisions need to be made.
              </p>
=======
>>>>>>> 59e0d3c087c2128ab9f64cfe9a8d7d0dab1b2466
              <div
                className="p-6 sm:p-8 rounded-2xl text-white"
                style={{ backgroundColor: "#A5292A" }}
              >
                <div className="flex items-center mb-4 sm:mb-6">
                  <Award className="w-6 h-6 sm:w-8 sm:h-8 mr-3 sm:mr-4" />
                  <h3 className="text-xl sm:text-2xl font-bold">
                    Expert Legal Leadership
                  </h3>
                </div>
                <ul className="space-y-3 sm:space-y-4">
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white bg-opacity-70 rounded-full mt-1.5 sm:mt-2 mr-2 sm:mr-3 flex-shrink-0"></div>
                    <span className="text-sm sm:text-base">
                      Strategic legal counsel aligned with business goals
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white bg-opacity-70 rounded-full mt-1.5 sm:mt-2 mr-2 sm:mr-3 flex-shrink-0"></div>
                    <span className="text-sm sm:text-base">Proactive risk identification and mitigation</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white bg-opacity-70 rounded-full mt-1.5 sm:mt-2 mr-2 sm:mr-3 flex-shrink-0"></div>
                    <span className="text-sm sm:text-base">Cost-effective alternative to full-time CLO</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white bg-opacity-70 rounded-full mt-1.5 sm:mt-2 mr-2 sm:mr-3 flex-shrink-0"></div>
                    <span className="text-sm sm:text-base">Scalable engagement based on your needs</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4 sm:mb-6">
<<<<<<< HEAD
              How Our <span style={{ color: '#A5292A' }}>CLO Service</span> Works?
=======
              How Our <span style={{ color: '#A5292A' }}>CLO Service</span> Works
>>>>>>> 59e0d3c087c2128ab9f64cfe9a8d7d0dab1b2466
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
              We follow a structured approach to integrate seamlessly with your
              business and provide maximum value from day one.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:ml-20 lg:mr-20">
            <div className="text-center group hover:scale-105 transition-all duration-500">
              <div
                className="text-white p-3 sm:p-4 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500"
                style={{ backgroundColor: "#A5292A" }}
              >
                <span className="text-lg sm:text-xl font-bold">1</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
                Initial Assessment
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Comprehensive evaluation of your current legal needs,
                challenges, and business objectives.
              </p>
            </div>

            <div className="text-center group">
              <div
                className="text-white p-3 sm:p-4 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500"
                style={{ backgroundColor: "#A5292A" }}
              >
                <span className="text-lg sm:text-xl font-bold">2</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
                Strategic Planning
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Development of customized legal strategy and roadmap aligned
                with your business goals.
              </p>
            </div>

            <div className="text-center group">
              <div
                className="text-white p-3 sm:p-4 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500"
                style={{ backgroundColor: "#A5292A" }}
              >
                <span className="text-lg sm:text-xl font-bold">3</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
                Team Integration
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Seamless integration with your existing team and establishment
                of clear communication channels.
              </p>
            </div>

            <div className="text-center group">
              <div
                className="text-white p-3 sm:p-4 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500"
                style={{ backgroundColor: "#A5292A" }}
              >
                <span className="text-lg sm:text-xl font-bold">4</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
                Ongoing Support
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Continuous legal leadership and strategic guidance with regular
                reviews and adjustments.
              </p>
            </div>
          </div>
        </div>
      </section>

<<<<<<< HEAD
      {/* Startup Legal Advisory alongside CLO (new SEO section) */}
      <ContentSection
        title="Startup Legal Advisory Services in India Alongside Your CLO"
        highlight="Startup Legal Advisory Services in India"
        bg="white"
        paragraphs={[
          "Founders often need quick answers on incorporation, fundraising, hiring, and customer contracts, as well as long-term legal planning. Our startup legal advisory services in India work hand in hand with the CLO engagement, so day-to-day questions and strategic decisions are handled by the same team. This keeps advice consistent, avoids gaps between documents, and helps you present a well-organized legal position to investors and partners.",
        ]}
      />

=======
>>>>>>> 59e0d3c087c2128ab9f64cfe9a8d7d0dab1b2466
      {/* Call to Action Section */}
      <section className="py-12 sm:py-16 lg:py-2" style={{ backgroundColor: "#A5292A" }}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="p-6 sm:p-8 lg:p-12 rounded-2xl text-center">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">
                Ready for Executive-Level Legal Leadership?
              </h3>
              <p className="text-base sm:text-lg text-white/90 mb-6 sm:mb-8 leading-relaxed">
                Transform your legal operations with our Chief Legal Officer
                service. Get the strategic legal guidance your business deserves
                without the full-time executive overhead.
              </p>
              <button
                className="bg-white text-[#A5292A] px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-gray-100 transition-all inline-flex items-center"
                onClick={() => (window.location.href = "/contact")}
              >
                Book your consultation today
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

<<<<<<< HEAD
      {/* Frequently Asked Questions (new SEO section) */}
      <FAQSection items={cloFaqs} bg="light" />

=======
>>>>>>> 59e0d3c087c2128ab9f64cfe9a8d7d0dab1b2466
      {/* Footer */}
      <Footer />
      
      {/* Custom 3D Animation Styles */}
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .group:hover {
          transform: translateY(-8px) rotateX(5deg) rotateY(5deg);
        }
        
        .group:hover .group-hover\\:scale-110 {
          transform: scale(1.1) rotate(12deg);
        }
        
        .group:hover .group-hover\\:rotate-12 {
          transform: rotate(12deg) scale(1.1);
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .group:hover {
          animation: float 2s ease-in-out infinite;
        }
        
        .group:hover .shadow-2xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(165, 41, 42, 0.1);
        }
      `}</style>
    </div>
  );
}
