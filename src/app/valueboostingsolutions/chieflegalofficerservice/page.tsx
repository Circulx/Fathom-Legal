'use client'

import React from "react";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import Image from "next/image";
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

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Navbar page="vbs" />

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
              <span style={{ color: '#A5292A' }}>Chief Legal Officer Service</span>
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

      {/* Key Benefits Section */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Why Choose Our<span style={{ color: '#A5292A' }}> CLO Service?</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our Chief Legal Officer service delivers executive-level legal
              expertise tailored to your business needs and growth objectives.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 sm:px-8 md:px-12 lg:px-20 ">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 group transform hover:-translate-y-2 hover:scale-105 perspective-1000"
                style={{
                  transformStyle: 'preserve-3d',
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                <div
                  className="text-white p-3 rounded-lg mb-6 w-fit group-hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: "#A5292A" }}
                >
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Areas Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center px-4 sm:px-8 md:px-12 lg:px-20">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">
                <span style={{ color: '#A5292A' }}>Comprehensive Legal Leadership</span>
              </h2>
              <p className="text-base text-gray-600 mb-8 leading-relaxed">
                Our CLO service covers all aspects of legal leadership and
                strategic guidance. From day-to-day compliance matters to
                complex corporate transactions, we provide the expertise your
                business needs to thrive in today's competitive landscape.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                {serviceAreas.map((area, index) => (
                  <div
                    key={index}
                    className="flex items-center p-4 bg-[#FAFAFA] rounded-lg border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                    style={{
                      transformStyle: 'preserve-3d',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    <div
                      className="w-2 h-2 rounded-full mr-3"
                      style={{ backgroundColor: "#a5292a" }}
                    ></div>
                    <span className="text-gray-700 font-medium">{area}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:pl-8">
              <div
                className="p-8 rounded-2xl text-white"
                style={{ backgroundColor: "#A5292A" }}
              >
                <div className="flex items-center mb-6">
                  <Award className="w-8 h-8 mr-4" />
                  <h3 className="text-2xl font-bold">
                    Expert Legal Leadership
                  </h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-white bg-opacity-70 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>
                      Strategic legal counsel aligned with business goals
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-white bg-opacity-70 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Proactive risk identification and mitigation</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-white bg-opacity-70 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Cost-effective alternative to full-time CLO</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-white bg-opacity-70 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Scalable engagement based on your needs</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              How Our <span style={{ color: '#A5292A' }}>CLO Service</span> Works
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We follow a structured approach to integrate seamlessly with your
              business and provide maximum value from day one.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 px-4 sm:px-8 md:px-12 lg:px-2">
            <div className="text-center group hover:scale-105 transition-all duration-500">
              <div
                className="text-white p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500"
                style={{ backgroundColor: "#A5292A" }}
              >
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Initial Assessment
              </h3>
              <p className="text-gray-600">
                Comprehensive evaluation of your current legal needs,
                challenges, and business objectives.
              </p>
            </div>

            <div className="text-center group">
              <div
                className="text-white p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500"
                style={{ backgroundColor: "#A5292A" }}
              >
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Strategic Planning
              </h3>
              <p className="text-gray-600">
                Development of customized legal strategy and roadmap aligned
                with your business goals.
              </p>
            </div>

            <div className="text-center group">
              <div
                className="text-white p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500"
                style={{ backgroundColor: "#A5292A" }}
              >
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Team Integration
              </h3>
              <p className="text-gray-600">
                Seamless integration with your existing team and establishment
                of clear communication channels.
              </p>
            </div>

            <div className="text-center group">
              <div
                className="text-white p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500"
                style={{ backgroundColor: "#A5292A" }}
              >
                <span className="text-xl font-bold">4</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Ongoing Support
              </h3>
              <p className="text-gray-600">
                Continuous legal leadership and strategic guidance with regular
                reviews and adjustments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-1" style={{ backgroundColor: "#A5292A" }}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="p-12 rounded-2xl text-center">
              <h3 className="text-3xl font-bold text-white mb-6">
                Ready for Executive-Level Legal Leadership?
              </h3>
              <p className="text-lg text-white/90 mb-8 leading-relaxed">
                Transform your legal operations with our Chief Legal Officer
                service. Get the strategic legal guidance your business deserves
                without the full-time executive overhead.
              </p>
              <button
                className="bg-white text-[#A5292A] px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all inline-flex items-center"
                onClick={() => (window.location.href = "/contact")}
              >
                Book your consultation today
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

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
