'use client'

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import Image from "next/image";
import {
  Menu,
  X,
  ChevronDown,
  Phone,
  Mail,
  MapPin,
  Scale,
  Users,
  FileText,
  Shield,
  ArrowRight,
  Star,
  ChevronRight,
  Building,
  UserCheck,
  Gavel,
  Home,
  Lightbulb,
  FileSignature,
  Plus,
  Minus,
} from "lucide-react";

export default function Services() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const services = [
    {
      icon: <Scale className="w-8 h-8" />,
      title: "General Corporate Advisory",
      description:
        "Comprehensive corporate governance, compliance, and strategic legal advisory services for businesses of all sizes.",
      slug: "corporate-advisory",
      url: "/services/generalcorporateadvisory",
    },
   
    {
      icon: <Gavel className="w-8 h-8" />,
      title: "Dispute Resolution",
      description:
        "Expert mediation, arbitration, and litigation services to resolve commercial and civil disputes effectively.",
      slug: "dispute-resolution",
      url: "/services/disputeresolution",
    },
    {
      icon: <Building className="w-8 h-8" />,
      title: "REIT Solutions",
      description:
        "Complete Real Estate Investment Trust structuring, compliance, and management services for investors.",
      slug: "reit-solutions",
      url: "/services/reitsolutions",
    },
    {
      icon: <Home className="w-8 h-8" />,
      title: "Real Estate Services",
      description:
        "End-to-end real estate legal services including due diligence, transactions, and property law matters.",
      slug: "real-estate",
      url: "/services/realestatesolutions",
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Intellectual Property Management",
      description:
        "Complete IP portfolio management including trademark, copyright, patent filing and protection services.",
      slug: "ip-management",
      url: "/services/intellectualproperty",
    },
    {
      icon: <FileSignature className="w-8 h-8" />,
      title: "Agreements and Policies",
      description:
        "Expert drafting and review of contracts, agreements, and corporate policies tailored to your business needs.",
      slug: "agreements-policies",
      url: "/services/agreementandpolicies",
    },
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      company: "Tech Solutions Pvt Ltd",
      text: "Fathom Legal's corporate advisory services have been instrumental in our company's growth. Their expertise in compliance and governance is exceptional.",
      rating: 5,
    },
    {
      name: "Sneha Patel",
      company: "Real Estate Developer",
      text: "The REIT solutions provided by Fathom Legal helped us structure our investment trust perfectly. Highly professional and knowledgeable team.",
      rating: 5,
    },
    {
      name: "Arjun Sharma",
      company: "Startup Founder",
      text: "From IP management to workplace policies, Fathom Legal has been our trusted legal partner. Their comprehensive approach is remarkable.",
      rating: 5,
    },
  ];

  const counters = [
    {
      number: "150+",
      label: "Cases in Progress",
      description: "Active legal matters being handled",
    },
    {
      number: "500+",
      label: "Satisfied Clients",
      description: "Businesses and individuals served",
    },
    {
      number: "₹50Cr+",
      label: "Claims Settled",
      description: "Total value of successful resolutions",
    },
  ];

  const faqs = [
    {
      question: "What types of legal services does Fathom Legal offer?",
      answer:
        "Fathom Legal provides comprehensive legal services including corporate advisory, dispute resolution, real estate services, REIT solutions, intellectual property management, workplace safety solutions, and contract drafting. We serve businesses ranging from startups to established corporations, as well as individual clients.",
    },
    {
      question: "What makes Fathom Legal different from other law firms?",
      answer:
        "Our unique approach combines deep industry expertise with personalized service. We focus on the startup ecosystem and SMB sector, offering tailored solutions rather than one-size-fits-all approaches. Our team brings over 70 years of collective experience and maintains a client-centric philosophy.",
    },
    {
      question: "Are your services confidential?",
      answer:
        "Absolutely. We maintain strict confidentiality protocols and adhere to all professional ethics guidelines set by the Bar Council of India. All client information and legal matters are protected under attorney-client privilege and our comprehensive data security measures.",
    },
    {
      question: "What is included in your REIT solutions?",
      answer:
        "Our REIT solutions include complete structuring services, regulatory compliance, documentation, investor relations support, portfolio management advice, and ongoing legal maintenance. We handle everything from initial setup to operational compliance and strategic advisory.",
    },
    {
      question: "How does Fathom Legal support the startup ecosystem?",
      answer:
        "We specialize in startup legal needs including incorporation, funding documentation, compliance frameworks, intellectual property protection, employment law guidance, and growth strategy legal support. Our team understands the unique challenges startups face and provides cost-effective solutions.",
    },
    {
      question:
        "How does Fathom Legal ensure confidentiality and data security?",
      answer:
        "We implement multi-layered security protocols including encrypted communications, secure document management systems, restricted access controls, and regular security audits. All team members undergo confidentiality training and sign comprehensive non-disclosure agreements.",
    },
    {
      question: "Does Fathom Legal offer flexible pricing options?",
      answer:
        "Yes, we understand that different clients have different needs and budgets. We offer various pricing structures including fixed fees, hourly rates, retainer agreements, and project-based pricing. We work with clients to find the most suitable arrangement for their specific requirements.",
    },
    {
      question: "How can I schedule a consultation with Fathom Legal?",
      answer:
        "You can schedule a consultation by calling our office, sending an email to info@fathomlegal.com, or using the contact form on our website. We offer both in-person and virtual consultations to accommodate your preferences and schedule.",
    },
    {
      question:
        "What is the process for onboarding new clients at Fathom Legal?",
      answer:
        "Our onboarding process begins with an initial consultation to understand your needs, followed by a comprehensive case evaluation, engagement letter execution, and assignment of a dedicated legal team. We ensure clear communication of timelines, expectations, and deliverables from the start.",
    },
    {
      question:
        "Does Fathom Legal offer legal workshops or training for businesses?",
      answer:
        "Yes, we conduct regular workshops and training sessions on various legal topics including compliance requirements, employment law updates, contract management, and industry-specific regulations. These can be customized for individual organizations or offered as public seminars.",
    },
    {
      question: "Can Fathom Legal assist with contract drafting and review?",
      answer:
        "Absolutely. Contract drafting and review is one of our core services. We handle all types of agreements including commercial contracts, employment agreements, partnership deeds, licensing agreements, and more. Our team ensures all contracts are legally sound and protect your interests.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Navbar page="services" />

      {/* Hero Section with Services Catalogue */}
      <section
        className="text-white py-20 relative"
        style={{ minHeight: "70vh" }}
      >
        {/* Background Image Layer */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>

        {/* Dark Overlay */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
        ></div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Hero Content */}
          <div className="text-center mb-16">
            <p
              className="text-lg font-semibold mb-4 text-white"
              style={{ color: "#A5292A" }}
            >
              END-TO-END
            </p>
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white">
              Legal Solutions,{" "}
              <span style={{ color: "#A5292A" }}>Tailored for You</span>
            </h1>
            
            {/* Breadcrumb */}
            <div className="flex justify-center ">
              <Breadcrumb 
                items={[
                  { label: "Home", href: "/" },
                  { label: "Services" }
                ]}
                className="[&_a]:text-white [&_a]:hover:text-[#A5292A] [&_span]:text-white [&_svg]:text-white"
              />
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {services.map((service, index) => (
              <Link key={index} href={service.url}>
                <div
                  className="bg-white p-8 rounded-xl shadow-sm hover:shadow-2xl hover:scale-105 hover:-translate-y-2 transition-all duration-300 border border-gray-100 group cursor-pointer"
                >
                  <div className="text-[#A5292A] mb-6 group-hover:opacity-80 transition-opacity">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <button className="text-[#A5292A] font-semibold hover:opacity-80 flex items-center group-hover:translate-x-1 transition-transform">
                    Find out more <ChevronRight className="ml-1 w-4 h-4" />
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stress-Free Legal Solutions */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center px-4 sm:px-8 md:px-12 lg:px-20">
            <div>
              <p
                className="text-3xl font-semibold mb-2"
                style={{ color: "#A5292A" }}
              >
                Stress-Free Legal Solutions
              </p>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                from start to finish
              </h2>

              <p className="text-base text-gray-800 mb-8 leading-relaxed">
                At Fathom Legal, we handle all your legal needs with precision
                and care. Our team of experts provides end-to-end solutions,
                ensuring your business thrives in a complex legal landscape.
                Trust us to manage everything, so you can focus on your growth
                and success.
              </p>

              {/* Divider */}
              <div
                className="w-16 h-0.5 mb-8"
                style={{ backgroundColor: "#A5292A" }}
              ></div>

              {/* Bullet Points */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <div
                    className="w-2 h-2 rounded-full mr-4"
                    style={{ backgroundColor: "#A5292A" }}
                  ></div>
                  <span className="text-gray-700 font-medium">
                    8+ Years of Collective Experience
                  </span>
                </div>
                <div className="flex items-center">
                  <div
                    className="w-2 h-2 rounded-full mr-4"
                    style={{ backgroundColor: "#A5292A" }}
                  ></div>
                  <span className="text-gray-700 font-medium">
                    Personalized Legal Strategies
                  </span>
                </div>
                <div className="flex items-center">
                  <div
                    className="w-2 h-2 rounded-full mr-4"
                    style={{ backgroundColor: "#A5292A" }}
                  ></div>
                  <span className="text-gray-700 font-medium">
                    Full Confidentiality and Safety
                  </span>
                </div>
                <div className="flex items-center">
                  <div
                    className="w-2 h-2 rounded-full mr-4"
                    style={{ backgroundColor: "#A5292A" }}
                  ></div>
                  <span className="text-gray-700 font-medium">
                    24/7 Expert Assistance
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:pl-8">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2084&q=80"
                  alt="Legal consultation"
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

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              The <span style={{ color: "#A5292A" }}>Trust</span> we earned
            </h2>
            <p className="text-xl md:text-2xl text-[#A5292A]">
              What our clients say about our legal services
            </p>
          </div>

          {/* Moving Testimonials Carousel */}
          <div className="relative overflow-hidden">
            <div className="flex animate-marquee" style={{ width: 'max-content' }}>
              {/* First set of testimonials */}
              {[...Array(4)].flatMap(() => [
                {
                  name: "Lakshay Sethi",
                  text: "Ishita was fantastic! She took a thoughtful, systematic approach to understand my issue fully and provided an effective solution. Highly recommend!",
                  rating: 5,
                  photo: "/Lakshay Sethi.jpg",
                },
                {
                  name: "Rajat Gupta",
                  text: "I consulted Ishita for legal advice regarding the sale of my shares in a company, and she was fantastic. She reviewed all the paperwork, explained the restrictions clearly, and provided actionable guidance that made everything much easier to understand. Her professionalism, attention to detail, and ability to simplify complex legal matters were truly impressive. I highly recommend Ishita to anyone seeking expert corporate legal advice.",
                  rating: 5,
                  photo: "/Rajat.jpg",
                },
                {
                  name: "Pooja Saripalli",
                  text:"One of the best legal firms who have handled my case of non-payment of dues from my previous employer excellently. A big shout out to my lawyer Ishita Sharma who was not only patient but drove the case to closure very quickly and efficiently. Definitely recommend using Fathom Legal's services and if possible Ishita Sharma as your lawyer 😄 ",
                  rating: 5,
                  photo: "/pooja.jpg",
                },
                {
                  name: "Bhaskar Chouhan",
                  text: "Ishita Sharma provided exceptional legal guidance for our startup's incorporation and compliance requirements. Her expertise in corporate law and attention to detail helped us establish a solid legal foundation. Highly professional and responsive service.",
                  rating: 5,
                  photo: "/Bhaskar.jpg",
                }
              ]).map((testimonial, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-80 sm:w-[28rem] mx-4 sm:mx-6 bg-gray-100 p-4 sm:p-5 rounded-xl shadow-sm border border-gray-200"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-300 flex items-center justify-center">
                      {testimonial.photo ? (
                        <Image
                          src={testimonial.photo}
                          alt={testimonial.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-400 flex items-center justify-center text-white font-semibold text-sm">
                          {testimonial.name.charAt(0)}
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center">
                    <div>
                      <h4 className="font-semibold text-gray-800 text-sm sm:text-base">
                        {testimonial.name}
                      </h4>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Track Record Section */}
      <section id="track-record" className="py-16 relative overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('/number tracker.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/65"></div>
        
        {/* Content */}
        <div className="relative z-10 w-full px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg">Track Record Since 2016</h2>
          </div>
          
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-4 sm:px-8 md:px-12 lg:px-20">
            <div className="text-center relative">
              {/* Red Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: "#A5292A" }}>
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                  </svg>
                </div>
              </div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">8+</div>
              <div className="text-white text-lg md:text-xl font-medium drop-shadow-md">Years of Service</div>
            </div>
            
            <div className="text-center relative">
              {/* Red Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: "#A5292A" }}>
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
              </div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">500+</div>
              <div className="text-white text-lg md:text-xl font-medium drop-shadow-md">Cases Handled</div>
            </div>
            
            <div className="text-center relative">
              {/* Red Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: "#A5292A" }}>
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H16c-.8 0-1.54.37-2.01.99L12 11l-1.99-2.01A2.5 2.5 0 0 0 8 8H5.46c-.8 0-1.54.37-2.01.99L1 18.5V22h2v-6h2.5l2.5 7.5h2L8.5 16H11v6h2v-6h2.5l2.5 7.5h2L15.5 16H18v6h2z"/>
                  </svg>
                </div>
              </div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">120+</div>
              <div className="text-white text-lg md:text-xl font-medium drop-shadow-md">IP Support</div>
            </div>
            
            <div className="text-center relative">
              {/* Red Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: "#A5292A" }}>
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
              </div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">98%</div>
              <div className="text-white text-lg md:text-xl font-medium drop-shadow-md">Client Success Rate</div>
            </div>
          </div>
        </div>
      </section>

     
      {/* FAQ Section */}
      <section className="py-20" style={{ backgroundColor: "#FAFAFA" }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Frequently asked questions
            </h2>
            <p className="text-base text-left text-gray-600 max-w-4xl mx-auto leading-relaxed">
              At Fathom Legal, we believe in clear and open communication. Our
              FAQ section is designed to address your most pressing questions,
              providing you with the information you need to make informed
              decisions about our legal services. Whether you're curious about
              our offerings, our approach, or the specifics of how we can help
              you, we're here to answer.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="mb-4">
                <button
                  className="w-full text-left bg-white p-6 rounded-lg border border-gray-100 flex items-center justify-between hover:shadow-sm transition-shadow"
                  onClick={() => toggleFAQ(index)}
                >
                  <span className="font-semibold text-gray-800 pr-4">
                    {faq.question}
                  </span>
                  {openFAQ === index ? (
                    <Minus
                      className="w-5 h-5 flex-shrink-0"
                      style={{ color: "#A5292A" }}
                    />
                  ) : (
                    <Plus
                      className="w-5 h-5 flex-shrink-0"
                      style={{ color: "#A5292A" }}
                    />
                  )}
                </button>
                {openFAQ === index && (
                  <div className="bg-white border-l border-r border-b border-gray-100 p-6 rounded-b-lg">
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section 
        id="contact" 
        className="py-12 relative overflow-hidden"
        style={{
          backgroundImage: `url('/contactusbg.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        {/* Black Background Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-gray-900/50 to-black/70"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-[#A5292A] mb-4">
            Ready to Connect? Get a Quote Now!
            </h2>
            <p className="text-base text-white/90 max-w-3xl mx-auto">
            Let Fathom Legal handle your legal needs with expertise and dedication. Reach out to us today for a personalized quote and discover how our comprehensive legal solutions can benefit you. Your peace of mind is just a click away.
            </p>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <a 
              href="https://calendly.com/ishita-fathomlegal/free-20-mins-consultation"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#A5292A] border-2 border-gray-300 text-white font-semibold rounded-lg hover:border-gray-400 hover:bg-gray-50 hover:text-[#A5292A] transition-all duration-300 group"
            >
              Get Quote <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
