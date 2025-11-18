'use client'

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
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
} from "lucide-react";
import emailjs from '@emailjs/browser';

// Custom hook for scroll animations
const useScrollAnimation = (delay = 0) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
        } else {
          setIsVisible(false);
        }
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [delay]);

  return [ref, isVisible];
};

const DisclaimerPopup = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="container mx-auto px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              <span style={{ color: "#A5292A" }}>Disclaimer</span>
            </h3>
            <p className="text-base text-gray-600 leading-relaxed">
              In accordance with the regulations set by the Bar Council of India, lawyers and law firms are prohibited from actively seeking work or engaging in advertising practices. By selecting 'I Agree', you affirm that you are voluntarily seeking information about Fathom Legal, Advocates & Corporate Consultants (FLACC) and that there has been no form of advertising, direct communication, solicitation, invitation, or any other attempt from FLACC or any of its members to encourage work engagement through this website.
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-all text-sm"
              style={{ backgroundColor: "#A5292A" }}
            >
              I Agree
            </button>
            <button
              onClick={onClose}
              className="text-gray-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-all text-sm border border-gray-300"
            >
              Decline
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  
  // Contact form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  
  // Scroll animation hooks removed
  const [counters, setCounters] = useState({
    years: 0,
    cases: 0,
    ipSupport: 0,
    successRate: 0
  });

  const handleDisclaimerClose = () => {
    setShowDisclaimer(false);
  };

  // Contact form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      // EmailJS configuration
      const serviceId = 'service_hrntxm5';
      const templateId = 'template_kq2l3yk';
      const publicKey = '5suuijzXCHnnvG_YW';

      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone,
        message: formData.message,
        to_email: 'assist@fathomlegal.com'
      };

      await emailjs.send(serviceId, templateId, templateParams, publicKey);
      
      setSubmitStatus('success');
      setFormData({
        name: '',
        phone: '',
        email: '',
        message: ''
      });
    } catch (error) {
      console.error('Error sending email:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Counter animation effect with scroll trigger
  useEffect(() => {
    const trackRecordSection = document.getElementById('track-record');
    
    const animateCounters = () => {
      const targets = { years: 8, cases: 500, ipSupport: 120, successRate: 98 };
      const duration = 2000; // 2 seconds
      const steps = 60; // 60 steps for smooth animation
      const stepDuration = duration / steps;

      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        
        setCounters({
          years: Math.floor(targets.years * progress),
          cases: Math.floor(targets.cases * progress),
          ipSupport: Math.floor(targets.ipSupport * progress),
          successRate: Math.floor(targets.successRate * progress)
        });

        if (currentStep >= steps) {
          clearInterval(timer);
          setCounters(targets); // Ensure final values are exact
        }
      }, stepDuration);

      return () => clearInterval(timer);
    };

    const handleScroll = () => {
      if (trackRecordSection) {
        const rect = trackRecordSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible && counters.years === 0) {
          // Only animate if counters haven't been animated yet
          animateCounters();
        }
      }
    };

    // Add scroll listener
    window.addEventListener('scroll', handleScroll);
    
    // Check on mount in case section is already visible
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [counters.years]);

  const services = [
      {
        icon: <Scale className="w-8 h-8" />,
        title: "Web3 & Blockchain",
        description:
          "Specialized legal services for Web3 projects, DeFi protocols, NFT platforms, and blockchain compliance.",
        link: "/web3law",
      },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Startup Legal Services",
      description:
        "Specialized legal support for startups, including incorporation, funding, and growth strategies.",
      link: "/services/generalcorporateadvisory",
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Contract Management",
      description:
        "Expert contract drafting, review, and management services for businesses of all sizes.",
      link: "/services/generalcorporateadvisory",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Dispute Resolution",
      description:
        "Professional dispute resolution services including arbitration and litigation support.",
      link: "/services/disputeresolution",
    },
  ];

  const practiceAreas = [
    "Mercantile Law",
    "Corporate Advisory",
    "Startup Ecosystem",
    "SMB Legal Services",
    "NGO & NPO Legal Support",
    "Trust & Society Formation",
    "Intellectual Property",
    "Employment Law",
  ];

  const testimonials = [
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
      text:"One of the best legal firms who have handled my case of non-payment of dues from my previous employer excellently. A big shout out to my lawyer Ishita Sharma who was not only patient but drove the case to closure very quickly and efficiently. Definitely recommend using Fathom Legal’s services and if possible Ishita Sharma as your lawyer 😄 ",
      rating: 5,
      photo: "/pooja.jpg",
    },
    {
      name: "Bhaskar Chouhan",
      text: "I had an excellent experience with Fathom Legal. Their team provided top-notch legal services with professionalism and efficiency. They were attentive to my needs, kept me informed throughout the process, and achieved a great outcome. I highly recommend them for anyone seeking reliable legal assistance! ",
      rating: 5,
      photo: "/Bhaskar.jpg",
    },
    {
      name: "Anil Jangid",
      text: "I reached out to Fathom Legal to get some legal clarity on my new startup idea. Ishita and her team helped me efficiently understand and navigate the Legal and Regulatory framework of Blockchain, NFT and Crypto in India. They are really friendly and great at their work. Looking forward to working with them.",
      rating: 5,
      photo: "/anil.jpg",
    },
      {
        name: "Subhabrata Chatterjee",
        text: " Exceptional services, recheable, prompt and ofcourse ability to give life to the dead cases.Thanks so much Ms. Ishita Sharma/Fathom Legal",
        rating: 5,
        photo: null,
      },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Disclaimer Popup */}
      <DisclaimerPopup
        isOpen={showDisclaimer}
        onClose={handleDisclaimerClose}
      />

      {/* Nav Bar Component */}
      <Navbar page="home" />

      {/* Hero Section */}
      <section
        id="home"
        className="min-h-screen flex flex-col lg:flex-row relative"
      >
        {/* Full Screen Background Image */}
        <div
          className="absolute inset-0 animate-zoom-in overflow-hidden"
          style={{
            backgroundImage: `url('/Homepage.png')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
          }}
        ></div>
        
        {/* Red Overlay to match theme */}
        <div
          className="absolute inset-0"
          style={{ 
            backgroundColor: "rgba(165, 41, 42, 0.3)" 
          }}
        ></div>

        {/* Left Panel - Text Content */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-8 lg:px-16 py-12 sm:py-16 lg:py-20 relative z-10">
          
          {/* Tagline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight text-white animate-fade-in-up animate-delay-200">
            Facilitating commercial<br />
            legal solutions
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-white text-opacity-90 mb-12 max-w-lg leading-relaxed animate-fade-in-up animate-delay-400">
            Our expertise across diverse practice areas and sectors covers varied and nuanced needs. 
            Backed by experienced professionals, delighted clients from across the globe, and topical, 
            commercial and specialised services, we deliver the best legal solutions for our clients.
          </p>

          {/* Mobile Navigation - Above CTA buttons */}
          <div className="lg:hidden flex justify-center items-center mb-8 relative animate-fade-in-up animate-delay-800">
            {/* Vertical Line */}
            <div className="absolute w-0.5 h-16 bg-white opacity-30"></div>
            
            {/* Navigation Items */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 group">
                <div className="w-3 h-3 rounded-full bg-white shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0"></div>
                <Link href="/services" className="text-white  font-bold text-sm hover:text-gray-300 transition-colors">
                  Services
                </Link>
              </div>
              
              <div className="flex items-center gap-3 group">
                <div className="w-3 h-3 rounded-full border-2 border-white group-hover:bg-white group-hover:scale-110 transition-all duration-300 flex-shrink-0"></div>
                <button
                  onClick={() => {
                    const whyChooseUsSection = document.querySelector('section:nth-of-type(3)');
                    if (whyChooseUsSection) {
                      whyChooseUsSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="text-white  font-bold text-sm hover:text-gray-300 transition-colors cursor-pointer"
                >
                  Why Choose Us?
                </button>
              </div>
              
              <div className="flex items-center gap-3 group">
                <div className="w-3 h-3 rounded-full border-2 border-white group-hover:bg-white group-hover:scale-110 transition-all duration-300 flex-shrink-0"></div>
                <button
                  onClick={() => {
                    const testimonialsSection = document.getElementById('testimonials');
                    if (testimonialsSection) {
                      testimonialsSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="text-white font-bold text-sm hover:text-gray-300 transition-colors cursor-pointer"
                >
                  Client Testimonials
                </button>
              </div>
              
              <div className="flex items-center gap-3 group">
                <div className="w-3 h-3 rounded-full border-2 border-white group-hover:bg-white group-hover:scale-110 transition-all duration-300 flex-shrink-0"></div>
                <Link href="/contact" className="text-white font-bold text-sm hover:text-gray-300 transition-colors">
                  Contact
                </Link>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animate-delay-600">
           <a 
              href="https://calendly.com/ishita-fathomlegal/free-20-mins-consultation"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white border-2 border-white text-gray-800 font-semibold hover:bg-gray-100 transition-all duration-300 group text-sm sm:text-base"
            >
              GET FREE CONSULTATION
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <Link href="/services"
              className="flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-transparent border-2 border-white text-white font-semibold hover:bg-white hover:text-gray-800 transition-all duration-300 group text-sm sm:text-base"
            >
              OUR SERVICES
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          
        </div>


        {/* Desktop Right Navigation - Hidden on mobile */}
        <div className="hidden lg:flex absolute right-2 sm:right-4 lg:right-8 top-1/2 transform -translate-y-1/2 flex-col items-center z-10 animate-fade-in-right animate-delay-800">
          {/* Vertical Line */}
          <div className="absolute w-0.5 h-20 sm:h-24 lg:h-32 bg-white opacity-30"></div>
          
          {/* Navigation Items */}
          <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8">
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 group">
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-white shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0"></div>
              <Link href="/services" className="text-white font-bold text-xs sm:text-sm lg:text-base hover:text-gray-300 transition-colors">
                Services
              </Link>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 group">
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-white group-hover:bg-white group-hover:scale-110 transition-all duration-300 flex-shrink-0"></div>
              <button
                onClick={() => {
                  const whyChooseUsSection = document.querySelector('section:nth-of-type(3)');
                  if (whyChooseUsSection) {
                    whyChooseUsSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="text-white font-bold text-xs sm:text-sm lg:text-base hover:text-gray-300 transition-colors cursor-pointer"
              >
                Why Choose Us?
              </button>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 group">
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-white group-hover:bg-white group-hover:scale-110 transition-all duration-300 flex-shrink-0"></div>
              <button
                onClick={() => {
                  const testimonialsSection = document.getElementById('testimonials');
                  if (testimonialsSection) {
                    testimonialsSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="text-white font-bold text-xs sm:text-sm lg:text-base hover:text-gray-300 transition-colors cursor-pointer"
              >
                Client Testimonials
              </button>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 group">
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-white group-hover:bg-white group-hover:scale-110 transition-all duration-300 flex-shrink-0"></div>
              <Link href="/contact" className="text-white font-bold text-xs sm:text-sm lg:text-base hover:text-gray-300 transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>

      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-100">
  <div className="container mx-auto px-4">
     <div className="mb-16">
      {/* Two Column Layout: Heading on Left, Button on Right */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
        {/* Left Column: Subtitle and Heading */}
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 uppercase mb-2 ml-20">OUR SERVICES</p>
          <h2 className="text-3xl md:text-4xl font-bold ml-20">
            <span style={{ color: "black" }}>Our Trusted</span> <span style={{ color: "#A5292A" }}>Services</span>
          </h2>
        </div>
        
        {/* Right Column: Contact Us Button */}
        <p className="text-base text-gray-800 max-w-3xl mr-20">
        At <span style={{ color: "#A5292A" }}>Fathom Legal</span>, we specialize in connecting clients with top-tier legal professionals across various practice areas. Our platform facilitates access to expert lawyers who excel in their respective fields.
      </p>
      </div>
      
      {/* Description */}
     
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 px-4 sm:px-8 md:px-12 lg:px-20">
      {services.map((service, index) => (
         <div
           key={index}
           className="relative h-80 rounded-xl overflow-hidden group cursor-pointer"
         >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-110"
            style={{
              backgroundImage:
                index === 0
                  ? `url('/corporatelaw.jpg')`
                  : index === 1
                  ? `url('/legalservices.jpg')`
                  : index === 2
                  ? `url('/contract.jpg')`
                  : `url('https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')`,
            }}
          ></div>

           {/* Overlay (dark transparent layer over image) */}
           <div className="absolute inset-0 bg-black/65"></div>

           {/* Content */}
           <div className="absolute inset-0 flex flex-col justify-between p-6">
             {/* Icon and Title */}
             <div className="relative z-10 flex flex-col items-center justify-center">
               <div className="text-[#A5292A] mb-4 hover:text-[white] ">
                 {service.icon}
               </div>
               <h3 className="text-2xl font-bold text-white text-center ">
                 {service.title}
               </h3>
             </div>

             {/* Description and Learn More Button */}
             <div className="relative z-10">
               <p className="text-white text-sm mb-4 leading-relaxed">
                 {service.description}
               </p>
               <Link
                 href={service.link}
                 className="inline-flex items-center justify-center w-full px-4 py-2 bg-[#A5292A] text-white font-semibold rounded-lg hover:bg-[white] hover:text-[#A5292A] transition-all duration-300"
               >
                 Learn More <ChevronRight className="ml-2 w-4 h-4" />
               </Link>
             </div>
           </div>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* Why Choose Us Section */}
      <section className="py-10 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16 ">
            <h2 className="text-3xl text-black md:text-4xl font-bold mb-2" >
              <span style={{ color: "#A5292A" }}>Why</span> Choose Us?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 px-4 sm:px-8 md:px-12 lg:px-20">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 transition-all duration-500 ease-out hover:shadow-lg hover:-translate-y-2 hover:border-[#A5292A] group cursor-pointer">
              <div className="flex items-center mb-4">
                <ArrowRight className="w-6 h-6 mr-3 group-hover:translate-x-1 transition-transform duration-300" style={{ color: "#A5292A" }} />
                <h3 className="text-xl font-bold text-gray-800 group-hover:text-[#A5292A] transition-colors duration-300">Expert Legal Team</h3>
              </div>
              <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                Our dedicated team of experienced legal professionals brings decades of combined expertise in corporate law, startup advisory, and dispute resolution to deliver exceptional results for our clients.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 transition-all duration-500 ease-out hover:shadow-lg hover:-translate-y-2 hover:border-[#A5292A] group cursor-pointer">
              <div className="flex items-center mb-4">
                <ArrowRight className="w-6 h-6 mr-3 group-hover:translate-x-1 transition-transform duration-300" style={{ color: "#A5292A" }} />
                <h3 className="text-xl font-bold text-gray-800 group-hover:text-[#A5292A] transition-colors duration-300">Startup Specialization</h3>
              </div>
              <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                We specialize in the startup ecosystem, providing tailored legal solutions for emerging businesses, from incorporation and funding to growth strategies and compliance management.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 transition-all duration-500 ease-out hover:shadow-lg hover:-translate-y-2 hover:border-[#A5292A] group cursor-pointer">
              <div className="flex items-center mb-4">
                <ArrowRight className="w-6 h-6 mr-3 group-hover:translate-x-1 transition-transform duration-300" style={{ color: "#A5292A" }} />
                <h3 className="text-xl font-bold text-gray-800 group-hover:text-[#A5292A] transition-colors duration-300">Client-Focused Approach</h3>
              </div>
              <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                We prioritize our clients' success with a personalized approach, ethical governance, and transparent communication throughout every legal matter we handle.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 transition-all duration-500 ease-out hover:shadow-lg hover:-translate-y-2 hover:border-[#A5292A] group cursor-pointer">
              <div className="flex items-center mb-4">
                <ArrowRight className="w-6 h-6 mr-3 group-hover:translate-x-1 transition-transform duration-300" style={{ color: "#A5292A" }} />
                <h3 className="text-xl font-bold text-gray-800 group-hover:text-[#A5292A] transition-colors duration-300">Global Reach</h3>
              </div>
              <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                With nationwide and international service delivery capabilities, we provide comprehensive legal support to clients across diverse practice areas and industry verticals.
              </p>
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
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">{counters.years}+</div>
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
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">{counters.cases}+</div>
              <div className="text-white text-lg md:text-xl font-medium drop-shadow-md">Cases Handled</div>
            </div>
            
            <div className="text-center relative">
              {/* Red Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: "#A5292A" }}>
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 7H16c-.8 0-1.54.37-2.01.99L12 10.5 10.01 7.99A2.5 2.5 0 0 0 8 7H5.46c-.8 0-1.54.37-2.01.99L1 10.5V22h2v-6h2.5l2.54-7.63A1.5 1.5 0 0 1 9.46 7H12c.8 0 1.54.37 2.01.99L16 10.5V22h4z"/>
                  </svg>
                </div>
              </div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">{counters.ipSupport}+</div>
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
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">{counters.successRate}%</div>
              <div className="text-white text-lg md:text-xl font-medium drop-shadow-md">Client Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Content */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              <span style={{ color: "#A5292A" }}>Featured</span> Content
            </h2>
            <p className="text-lg text-left text-white max-w-2xl mx-auto">
              Discover our latest webinars, interviews, and featured articles that highlight 
              our expertise in immigration law, startup support, and corporate legal services.
            </p>
          </div>
          
          {/* Featured Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-8 md:px-12 lg:px-20">
            {/* Lawctopus Webinar */}
            <a
              href="https://www.lawctopus.com/webinar-fathom-legal/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden border border-gray-100"
            >
              {/* Image/Visual Section */}
              <div className="h-48 relative overflow-hidden">
                <Image 
                  src="/lawctopus.jpg" 
                  alt="Lawctopus Webinar" 
                  width={400}
                  height={192}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded px-2 py-1">
                  <span className="text-gray-800 text-xs font-medium">WEBINAR</span>
                </div>
              </div>
              
              {/* Content Section */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 leading-tight">
                  Behind the Scenes: Building International Legal Careers with Immigration Law Expertise
                </h3>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <span className="font-medium">Fathom Legal Team</span>
                  <span className="mx-2">•</span>
                  <span>15 minute read</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Featured on Lawctopus: "How to Build an International Career as an Immigration Lawyer in the USA"
                </p>
              </div>
            </a>

            {/* SuperLawyer Interview */}
            <a
              href="https://superlawyer.in/witness-ishitas-unique-approach-to-supporting-startups-smes-and-smbs-where-legal-challenges-are-met-with-a-combination-of-intersectional-learning-and-on-site-visits-to-comprehend-the-intricacies"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden border border-gray-100"
            >
              {/* Image/Visual Section */}
              <div className="h-48 relative overflow-hidden">
                <Image 
                  src="/Superlawyer.jpg" 
                  alt="SuperLawyer Interview" 
                  width={400}
                  height={192}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded px-2 py-1">
                  <span className="text-gray-800 text-xs font-medium">INTERVIEW</span>
                </div>
              </div>
              
              {/* Content Section */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 leading-tight">
                  Enhancing Startup Success Through Unique Legal Support and On-Site Visits
                </h3>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <span className="font-medium">Ishita Sharma</span>
                  <span className="mx-2">•</span>
                  <span>8 minute read</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  SuperLawyer interview featuring our unique approach to supporting startups, SMEs, and SMBs
                </p>
              </div>
            </a>

            {/* Business Connect India */}
            <a
              href="https://businessconnectindia.in/fathom-legal-advocates-corporate/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden border border-gray-100"
            >
               {/* Image/Visual Section */}
               <div className="h-48 relative overflow-hidden">
                 <Image 
                   src="/businessconnect.jpg" 
                   alt="Business Connect India Feature" 
                   width={400}
                   height={192}
                   className="w-full h-full object-cover"
                 />
                 <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded px-2 py-1">
                   <span className="text-gray-800 text-xs font-medium">FEATURE</span>
                 </div>
               </div>
              
              {/* Content Section */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 leading-tight">
                  Corporate Legal Excellence: Comprehensive Services for Modern Businesses
                </h3>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <span className="font-medium">Fathom Legal</span>
                  <span className="mx-2">•</span>
                  <span>6 minute read</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Featured on Business Connect India showcasing our corporate legal expertise and services
                </p>
              </div>
            </a>
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
              {[...Array(4)].flatMap(() => testimonials).map((testimonial, index) => (
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
          <div className="w-full h-full bg-gray-400 flex items-center justify-center">
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        )}
      </div>
    </div>
    <div className="mb-2">
      <div className="font-semibold text-gray-900 text-xs sm:text-sm mb-1">
        {testimonial.name}
      </div>
      <p className="text-gray-800 italic text-xs sm:text-sm leading-relaxed">
        "{testimonial.text}"
      </p>
    </div>
  </div>
))}

            </div>
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
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Get in <span style={{ color: "#A5292A" }}>Touch</span> with Us!
            </h2>
            <p className="text-lg text-white/90 max-w-3xl mx-auto">
              Let our experience pave the path to your success.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 px-4 sm:px-8 md:px-12 lg:px-20">
            {/* Contact Information */}
            <div className="space-y-8">
              {/* Corporate Office */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4" style={{ color: "#A5292A" }}>
                  Corporate Office
                </h3>
                <div className="space-y-3 text-white/90">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-white mt-1 flex-shrink-0" />
                    <p>27th main road, 1st sector, HSR Layout, Bangalore, 560102</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-white flex-shrink-0" />
                    <a href="tel:+919625206671" className="hover:text-white transition-colors duration-300">+919625206671</a>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-white flex-shrink-0" />
                    <a href="https://mail.google.com/mail/?view=cm&fs=1&to=assist@fathomlegal.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#A5292A] transition-colors duration-300">assist@fathomlegal.com</a>
                  </div>
                </div>
              </div>

              {/* Dubai Office */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4" style={{ color: "#A5292A" }}>
                  Dubai Office
                </h3>
                <div className="space-y-3 text-white/90">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-white mt-1 flex-shrink-0" />
                    <p> Dubai, UAE</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-white flex-shrink-0" />
                    <a href="https://mail.google.com/mail/?view=cm&fs=1&to=assist@fathomlegal.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#A5292A] transition-colors duration-300">assist@fathomlegal.com</a>
                  </div>
                </div>
              </div>

              {/* Dallas Office */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4" style={{ color: "#A5292A" }}>
                  Dallas Office
                </h3>
                <div className="space-y-3 text-white/90">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-white mt-1 flex-shrink-0" />
                    <p>Dallas, Texas, USA</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-white flex-shrink-0" />
                    <a href="https://mail.google.com/mail/?view=cm&fs=1&to=assist@fathomlegal.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#A5292A] transition-colors duration-300">assist@fathomlegal.com</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white/95 backdrop-blur-md p-6 rounded-lg shadow-2xl border border-white/30">
              <h3 className="text-xl font-bold text-[#A5292A] mb-4">Contact Form</h3>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full  bg-white px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#A5292A] focus:border-[#A5292A] outline-none transition-all duration-300"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#A5292A] focus:border-[#A5292A] outline-none transition-all duration-300"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#A5292A] focus:border-[#A5292A] outline-none transition-all duration-300"
                  />
                </div>
                <div>
                  <textarea
                    name="message"
                    placeholder="Query"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#A5292A] focus:border-[#A5292A] outline-none transition-all duration-300 resize-none"
                  ></textarea>
                </div>
                
                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                    Message sent successfully! We'll get back to you soon.
                  </div>
                )}
                {submitStatus === 'error' && (
                  <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    Failed to send message. Please try again or contact us directly.
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#A5292A] text-white py-3 px-6 rounded-lg font-semibold hover:cursor-pointer transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
