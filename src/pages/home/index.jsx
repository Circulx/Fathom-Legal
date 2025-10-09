import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import logo from "../../assets/cropped-icon-red-192x192.png";
import Footer from "../../components/Footer";
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
import { Navbar } from "../../components/Navbar";
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

const DisclaimerPopup = ({ isOpen, onClose }) => {
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

const Home = () => {
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
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
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
      name: "Rahul Sharma",
      company: "Tech Startup Founder",
      text: "Fathom Legal provided exceptional guidance during our startup incorporation. Their expertise in the startup ecosystem is unmatched.",
      rating: 5,
    },
    {
      name: "Priya Patel",
      company: "NGO Director",
      text: "Their support for our NGO compliance and governance has been invaluable. Highly professional and knowledgeable team.",
      rating: 5,
    },
    {
      name: "Amit Kumar",
      company: "SME Owner",
      text: "Outstanding corporate legal services. They understand the unique challenges faced by small and medium businesses.",
      rating: 5,
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
          className="absolute inset-0"
          style={{
            backgroundImage: `url('/Homepage.png')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
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
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight text-white">
            Facilitating commercial<br />
            legal solutions
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-white text-opacity-90 mb-12 max-w-lg leading-relaxed">
            Our expertise across diverse practice areas and sectors covers varied and nuanced needs. 
            Backed by experienced professionals, delighted clients from across the globe, and topical, 
            commercial and specialised services, we deliver the best legal solutions for our clients.
          </p>

          {/* Mobile Navigation - Above CTA buttons */}
          <div className="lg:hidden flex justify-center items-center mb-8 relative">
            {/* Vertical Line */}
            <div className="absolute w-0.5 h-16 bg-white opacity-30"></div>
            
            {/* Navigation Items */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 group">
                <div className="w-3 h-3 rounded-full bg-white shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0"></div>
                <NavLink to="/services" className="text-white  font-bold text-sm hover:text-gray-300 transition-colors">
                  Services
                </NavLink>
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
                <NavLink to="/contact" className="text-white font-bold text-sm hover:text-gray-300 transition-colors">
                  Contact
                </NavLink>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
           <NavLink to="/contact"
              className="flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white border-2 border-white text-gray-800 font-semibold hover:bg-gray-100 transition-all duration-300 group text-sm sm:text-base"
            >
              GET FREE CONSULTATION
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </NavLink>
            <NavLink to="/services"
              className="flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-transparent border-2 border-white text-white font-semibold hover:bg-white hover:text-gray-800 transition-all duration-300 group text-sm sm:text-base"
            >
              OUR SERVICES
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </NavLink>
          </div>

          
        </div>


        {/* Desktop Right Navigation - Hidden on mobile */}
        <div className="hidden lg:flex absolute right-2 sm:right-4 lg:right-8 top-1/2 transform -translate-y-1/2 flex-col items-center z-10">
          {/* Vertical Line */}
          <div className="absolute w-0.5 h-20 sm:h-24 lg:h-32 bg-white opacity-30"></div>
          
          {/* Navigation Items */}
          <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8">
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 group">
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-white shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0"></div>
              <NavLink to="/services" className="text-white font-bold text-xs sm:text-sm lg:text-base hover:text-gray-300 transition-colors">
                Services
              </NavLink>
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
              <NavLink to="/contact" className="text-white font-bold text-xs sm:text-sm lg:text-base hover:text-gray-300 transition-colors">
                Contact
              </NavLink>
            </div>
          </div>
        </div>

      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-100">
  <div className="container mx-auto px-4">
     <div className="text-center mb-16">
      <h2 className="text-3xl md:text-4xl font-bold text-black mb-2">
        Our Legal <span style={{ color: "#A5292A" }}>Services</span>
      </h2>
     
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
               <div className="text-white mb-4">
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
               <NavLink
                 to={service.link}
                 className="inline-flex items-center justify-center w-full px-4 py-2 bg-white text-gray-800 font-semibold rounded-lg hover:bg-[#A5292A] hover:text-white transition-all duration-300"
               >
                 Learn More <ChevronRight className="ml-2 w-4 h-4" />
               </NavLink>
             </div>
           </div>
        </div>
      ))}
    </div>
    
    {/* Contact Us Button */}
    <div className="text-center mt-12">
      <NavLink
        to="/contact"
        className="inline-flex items-center justify-center px-8 py-4 bg-[#A5292A] border-2 border-gray-300 text-white font-semibold rounded-lg hover:border-gray-400 hover:bg-gray-50 hover:text-[#A5292A] transition-all duration-300 group"
      >
        Contact Us <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </NavLink>
    </div>
  </div>
</section>

      {/* Why Choose Us Section */}
      <section className="py-10 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16 ">
            <h2 className="text-3xl md:text-4xl font-bold mb-2" >
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
      <section id="track-record" className="py-8 bg-[#A5292A]">
        <div className="w-full px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Track Record Since 2016</h2>
          </div>
          
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 px-4 sm:px-8 md:px-12 lg:px-20">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-4">{counters.years}+</div>
              <div className="text-white text-sm sm:text-lg md:text-xl font-medium">Years of Service</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-4">{counters.cases}+</div>
              <div className="text-white text-sm sm:text-lg md:text-xl font-medium">Cases Handled</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-4">{counters.ipSupport}+</div>
              <div className="text-white text-sm sm:text-lg md:text-xl font-medium">IP Support</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-4">{counters.successRate}%</div>
              <div className="text-white text-sm sm:text-lg md:text-xl font-medium">Client Success Rate</div>
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
                <img 
                  src="/lawctopus.jpg" 
                  alt="Lawctopus Webinar" 
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
                <img 
                  src="/Superlawyer.jpg" 
                  alt="SuperLawyer Interview" 
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
                 <img 
                   src="/businessconnect.jpg" 
                   alt="Business Connect India Feature" 
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
      <section id="testimonials" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Client Testimonials
            </h2>
            <p className="text-xl md:text-2xl text-[#A5292A]">
              What our clients say about our legal services
            </p>
          </div>

           <div className="grid md:grid-cols-3 gap-8 px-4 sm:px-8 md:px-12 lg:px-20">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-sm border border-gray-100"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">
                  "{testimonial.text}"
                </p>
                <div>
                  <div className="font-semibold text-gray-800">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {testimonial.company}
                  </div>
                </div>
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
              <h3 className="text-xl font-bold text-gray-800 mb-4">Contact Form</h3>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#A5292A] focus:border-[#A5292A] outline-none transition-all duration-300"
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
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#A5292A] focus:border-[#A5292A] outline-none transition-all duration-300"
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
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#A5292A] focus:border-[#A5292A] outline-none transition-all duration-300"
                  />
                </div>
                <div>
                  <textarea
                    name="message"
                    placeholder="Message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#A5292A] focus:border-[#A5292A] outline-none transition-all duration-300 resize-none"
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
                  className="w-full bg-[#A5292A] text-white py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
};

export default Home;
