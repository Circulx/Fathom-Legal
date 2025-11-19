'use client'

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import Image from "next/image";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
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
  Award,
  Target,
} from "lucide-react";
import emailjs from '@emailjs/browser';

export default function AboutUs() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Contact form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

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

  const whyChooseUs = [
    {
      icon: <Award className="w-8 h-8" />,
      title: "Expertise & Experience",
      description: <p className="text-left ml-5">Our team brings years of specialized experience in corporate law, startup ecosystem, and business regulations.</p>
        
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Client-Centric Approach",
      description:<p className="text-left ml-5">We prioritize our clients' needs and provide personalized legal solutions tailored to their specific requirements.</p>
        
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Ethical Governance",
      description:<p className="text-left ml-7">We maintain the highest standards of professional ethics and integrity in all our legal practices.</p>
        
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Result-Oriented Solutions",
      description:<p className="text-left ml-5">Our focus is on delivering practical, efficient, and effective legal solutions that drive business success.</p>
        
    },
  ];

  const practiceAreas = [
    "Corporate & Commercial Law",
    "Startup Legal Advisory",
    "Mergers & Acquisitions",
    "Contract Drafting & Review",
    "Dispute Resolution & Litigation",
    "Intellectual Property Rights",
    "Employment & Labor Law",
    "Regulatory Compliance",
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Navbar page="aboutus" />

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
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold text-white mb-6">
            About <span style={{ color: '#A5292A' }}>Fathom Legal</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-xl lg:text-lg text-white/90 mb-6">
            Excellence in Legal Practice Since Our Inception
            </p>
            <p className="text-sm sm:text-base md:text-lg text-white/90 mb-8">
            We are a full-service law firm committed to providing exceptional legal services with integrity, expertise, and a client-first approach that sets us apart in the legal landscape.
            </p>
            
            {/* Breadcrumb */}
            <div className="flex justify-center">
              <Breadcrumb 
                items={[
                  { label: "Home", href: "/" },
                  { label: "About Us" }
                ]} 
              />
            </div>
          </div>
        </div>
      </section>


      {/* Why Choose Fathom Legal */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 ">
          <div className="text-center mb-16  ">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-gray-800 mb-4">
              Why Choose <span style={{ color: '#A5292A' }}>Fathom Legal</span>?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Our commitment to excellence and client satisfaction makes us the
              preferred choice for businesses and individuals seeking reliable
              legal counsel.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-0 px-4 sm:px-8 md:px-12 lg:px-20 relative" style={{ perspective: '1000px' }}>
            {whyChooseUs.map((item, index) => (
              <div
                key={index}
                className={`p-8 text-center transition-all duration-500 ease-out group relative ${
                  index % 2 === 0 
                    ? 'bg-[#A5292A]' 
                    : 'bg-gray-100'
                } hover:scale-110 hover:z-20 hover:shadow-2xl hover:-translate-y-2`}
                style={{
                  transformStyle: 'preserve-3d',
                  zIndex: 1
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.zIndex = '20';
                  e.currentTarget.style.transform = 'scale(1.1) translateY(-8px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.zIndex = '1';
                  e.currentTarget.style.transform = 'scale(1) translateY(0)';
                }}
              >
                <div className={`mb-4 group-hover:opacity-80 transition-opacity flex justify-center ${
                  index % 2 === 0 
                    ? 'text-white' 
                    : 'text-[#A5292A]'
                }`}>
                  {item.icon}
                </div>
                <h3 className={`text-lg sm:text-xl md:text-xl font-semibold mb-4 ${
                  index % 2 === 0 
                    ? 'text-white' 
                    : 'text-[#A5292A]'
                }`}>
                  {item.title}
                </h3>
                <p className={`text-sm sm:text-base ${
                  index % 2 === 0 
                    ? 'text-white' 
                    : 'text-gray-600'
                }`}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Philosophy */}
      <section 
        className="py-20 relative overflow-hidden"
        style={{
          backgroundImage: `url('/2024-02-Legal-Consult.webp')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/70"></div>
        
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold text-white mb-4">
              Our <span style={{ color: '#A5292A' }}>Philosophy</span>
            </h2>
            <div className="w-24 h-1 bg-[#A5292A] mx-auto mb-8"></div>
          </div>

          <div className="max-w-6xl mx-auto">
            {/* Content Cards */}
            <div className="space-y-8">
              <div>
                <p className="text-base sm:text-lg md:text-xl text-white leading-relaxed">
                  At Fathom Legal, we believe that exceptional legal service
                  stems from a deep understanding of our clients' businesses,
                  challenges, and aspirations. Our philosophy is built on three
                  fundamental pillars:
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 group">
                  <div className="flex flex-col items-center text-center">
                    <div className="flex-shrink-0 w-16 h-16 bg-[#A5292A] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-lg sm:text-xl md:text-xl font-semibold text-gray-800 mb-3 group-hover:text-[#A5292A] transition-colors duration-300">
                      Client Partnership
                    </h4>
                    <p className="text-gray-600 leading-relaxed text-sm sm:text-base md:text-lg">
                      We view ourselves as partners in our clients' success,
                      working collaboratively to achieve their goals.
                    </p>
                  </div>
                </div>

                <div className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 group">
                  <div className="flex flex-col items-center text-center">
                    <div className="flex-shrink-0 w-16 h-16 bg-[#A5292A] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Target className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-lg sm:text-xl md:text-xl font-semibold text-gray-800 mb-3 group-hover:text-[#A5292A] transition-colors duration-300">
                      Innovation & Excellence
                    </h4>
                    <p className="text-gray-600 leading-relaxed text-sm sm:text-base md:text-lg">
                      We continuously evolve our practices to provide
                      cutting-edge legal solutions that meet modern business
                      needs.
                    </p>
                  </div>
                </div>

                <div className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 group">
                  <div className="flex flex-col items-center text-center">
                    <div className="flex-shrink-0 w-16 h-16 bg-[#A5292A] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-lg sm:text-xl md:text-xl font-semibold text-gray-800 mb-3 group-hover:text-[#A5292A] transition-colors duration-300">
                      Ethical Leadership
                    </h4>
                    <p className="text-gray-600 leading-relaxed text-sm sm:text-base md:text-lg">
                      We maintain the highest ethical standards and serve as
                      trusted advisors in all our professional relationships.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Founder */}
      <section className="py-20 bg-gray-200">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-gray-800 mb-4">
              Meet Our <span style={{ color: '#A5292A' }}>Founder</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600">
              Leadership that drives excellence and innovation
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-1 items-start">

              {/* Founder Image */}
              <div className="text-center lg:text-left">
                <div className="relative inline-block">
                  <Image
                    src="/2024-06-ishita-fathom.jpg"
                    alt="Adv. Ishita Sharma"
                    width={300}
                    height={400}
                    className="w-80 h-80 sm:w-96 sm:h-96 object-cover shadow-lg mx-auto lg:mx-0"
                  />
                </div>
                
                {/* Get in Touch Box */}
                <div className="mt-8 bg-white p-6 shadow-lg border-l-4 w-80 sm:w-96 mx-auto lg:mx-0" >
                  <h4 className="text-lg sm:text-xl md:text-xl font-bold text-gray-800 mb-4">Get In Touch</h4>
                  <p className="text-sm sm:text-base text-gray-600 mb-4">
                    Please feel free to contact us. We will get back to you with 1-2 business days.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-[#A5292A] mr-3" />
                      <span className="text-sm sm:text-base text-gray-700">assist@fathomlegal.com</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-[#A5292A] mr-3" />
                      <span className="text-sm sm:text-base text-gray-700">+919625206671</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 text-[#A5292A] mr-3" />
                      <span className="text-sm sm:text-base text-gray-700">27th main road, 1st sector, HSR Layout, Bangalore, 560102</span>
                    </div>
                  </div>

                  <div className="mt-8">
                <a 
                  href="https://calendly.com/ishita-fathomlegal/free-20-mins-consultation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-[#A5292A] border-2 border-white text-white font-semibold transition-all duration-300 group text-sm sm:text-base "
                >
                  Schedule Consultation <ArrowRight className="ml-2 w-4 h-4" />
                </a>
              </div>
                </div>
              </div>

              {/* Founder Details */}
              <div className="space-y-6 lg:space-y-8 pr-0 lg:pr-8 mt-8 lg:mt-0">
                {/* Header */}
                <div>
                  <h3 className="text-3xl sm:text-4xl lg:text-3xl font-bold text-gray-800 mb-2">
                    Adv. Ishita Sharma
                  </h3>
                  <p className="text-xl sm:text-2xl lg:text-xl font-semibold mb-6" style={{ color: "#A5292A" }}>
                    Founder & Managing Partner
                  </p>
                </div>

                {/* Professional Profile */}
                <div>
                 
                  
                  <div className="  space-y-4 text-gray-700 ">
                    <p className="text-sm sm:text-base md:text-lg">
                      With over a decade of experience in corporate law and business advisory, Adv. Ishita Sharma founded Fathom Legal with a vision to provide comprehensive legal solutions that truly understand and support business growth.
                    </p>

                    <p className="text-sm sm:text-base md:text-lg">
                      She specializes in corporate structuring, startup ecosystem guidance, and strategic legal planning. Her expertise spans across various industries, making her a trusted advisor for businesses at every stage of their growth journey.
                    </p>

                    <p className="text-sm sm:text-base md:text-lg">
                      Adv. Ishita is skilled at drafting and negotiating key agreements such as Shareholders' Agreements, Joint Venture Agreements, Technology Licensing Agreements, and Employment Contracts. She has guided companies through compliance and regulatory challenges across India and advised on matters under various corporate laws, helping businesses establish a strong foothold in the market.
                    </p>

                    <p className="text-sm sm:text-base md:text-lg">
                      Her expertise extends to employment law, where she advises businesses on workplace policies, contracts, and dispute resolution. She has worked across diverse industries, including automotive, FMCG, manufacturing, real estate, healthcare, education, insurance, and financial services.
                    </p>
                  </div>
                </div>

                {/* Practice Areas */}
                <div>
                  <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-6 border-b-2 pb-2" style={{ borderColor: "#A5292A" }}>
                    Practice Areas
                  </h4>
                  <div className="flex flex-wrap gap-4 gap-y-4">
                    {practiceAreas.map((area, index) => (
                      <div 
                        key={index} 
                        className="bg-gray-200 border border-black rounded-full px-3 sm:px-4 py-2 text-gray-700 text-sm sm:text-base font-medium hover:bg-[#A5292A] hover:text-white hover:border-[#A5292A] transition-colors duration-200"
                      >
                        {area}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Qualifications */}
                <div>
                  <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-6 border-b-2 pb-2" style={{ borderColor: "#A5292A" }}>
                    Qualifications
                  </h4>
                  <ul className="space-y-3 text-gray-700">
                    <li className="text-sm sm:text-base md:text-lg">• LL.B. from National Law University</li>
                    <li className="text-sm sm:text-base md:text-lg">• LL.M. in Corporate Law</li>
                    <li className="text-sm sm:text-base md:text-lg">• Member, Bar Council of India</li>
                    <li className="text-sm sm:text-base md:text-lg">• Certified Corporate Legal Advisor</li>
                  </ul>
                </div>
              </div>
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
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-white mb-4">
              Get in <span style={{ color: "#A5292A" }}>Touch</span> with Us!
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
              Let our experience pave the path to your success.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 px-4 sm:px-8 md:px-12 lg:px-20">
            {/* Contact Information */}
            <div className="space-y-8">
              {/* Corporate Office */}
              <div>
                <h3 className="text-lg sm:text-xl md:text-xl font-bold text-white mb-4" style={{ color: "#A5292A" }}>
                  Corporate Office
                </h3>
                <div className="space-y-3 text-white/90">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-white mt-1 flex-shrink-0" />
                    <p className="text-sm sm:text-base">27th main road, 1st sector, HSR Layout, Bangalore, 560102</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-white flex-shrink-0" />
                    <a href="tel:+919625206671" className="text-sm sm:text-base hover:text-white transition-colors duration-300">+919625206671</a>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-white flex-shrink-0" />
                    <a href="https://mail.google.com/mail/?view=cm&fs=1&to=assist@fathomlegal.com" target="_blank" rel="noopener noreferrer" className="text-sm sm:text-base hover:text-[#A5292A] transition-colors duration-300">assist@fathomlegal.com</a>
                  </div>
                </div>
              </div>

              {/* Dubai Office */}
              <div>
                <h3 className="text-lg sm:text-xl md:text-xl font-bold text-white mb-4" style={{ color: "#A5292A" }}>
                  Dubai Office
                </h3>
                <div className="space-y-3 text-white/90">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-white mt-1 flex-shrink-0" />
                    <p className="text-sm sm:text-base"> Dubai, UAE</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-white flex-shrink-0" />
                    <a href="https://mail.google.com/mail/?view=cm&fs=1&to=assist@fathomlegal.com" target="_blank" rel="noopener noreferrer" className="text-sm sm:text-base hover:text-[#A5292A] transition-colors duration-300">assist@fathomlegal.com</a>
                  </div>
                </div>
              </div>

              {/* Dallas Office */}
              <div>
                <h3 className="text-lg sm:text-xl md:text-xl font-bold text-white mb-4" style={{ color: "#A5292A" }}>
                  Dallas Office
                </h3>
                <div className="space-y-3 text-white/90">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-white mt-1 flex-shrink-0" />
                    <p className="text-sm sm:text-base">Dallas, Texas, USA</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-white flex-shrink-0" />
                    <a href="https://mail.google.com/mail/?view=cm&fs=1&to=assist@fathomlegal.com" target="_blank" rel="noopener noreferrer" className="text-sm sm:text-base hover:text-[#A5292A] transition-colors duration-300">assist@fathomlegal.com</a>
                  </div>
                </div>
              </div>
              
              {/* Schedule Consultation Button */}
              <div className="mt-8">
                <a 
                  href="https://calendly.com/ishita-fathomlegal/free-20-mins-consultation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white border-2 border-white text-[#A5292A] font-semibold hover:bg-[#A5292A] hover:text-white transition-all duration-300 group text-sm sm:text-base "
                >
                  Schedule Consultation <ArrowRight className="ml-2 w-4 h-4" />
                </a>
              </div>
            </div>
             

            {/* Contact Form */}
            <div className="bg-white/95 backdrop-blur-md p-6 rounded-lg shadow-2xl border border-white/30">
              <h3 className="text-lg sm:text-xl md:text-xl font-bold text-gray-800 mb-4">Contact Form</h3>
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
}
