'use client'

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import emailjs from '@emailjs/browser';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Send,
  CheckCircle,
  ArrowRight,
  MessageCircle,
  Users,
  Award,
  Shield,
  Globe,
  Building,
  Calendar
} from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

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
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error sending email:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const offices = [
    {
      icon: <Building className="w-8 h-8 text-[#A5292A]" />,
      title: "Corporate Office",
      address: "27th main road, 1st sector, HSR Layout, Bangalore, 560102",
      phone: "+91-9625206671",
      email: "assist@fathomlegal.com"
    },
    {
      icon: <Globe className="w-8 h-8 text-[#A5292A]" />,
      title: "Dubai Office",
      address: "Dubai, UAE",
      
    },
    {
      icon: <Globe className="w-8 h-8 text-[#A5292A]" />,
      title: "Dallas Office",
      address: "Dallas, Texas, USA",
     
    }
  ];

 

  return (
    <div className="min-h-screen bg-white">
      <Navbar page="contact" />
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
        <div className="absolute inset-0 bg-black/70"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              <span style={{ color: '#A5292A' }}>Contact </span> Us
            </h1>
            <p className="text-lg text-white/90 mb-8">We're here to assist you with any legal queries or challenges you might face. At <span style={{ color: '#A5292A' }}>Fathom Legal</span>, your legal needs are our top priority.
            Get in touch with us to discover how we can help you navigate the complexities of the legal landscape with confidence and clarity.</p>
          </div>
          {/* Breadcrumb */}
            <div className="flex justify-center">
              <Breadcrumb 
                items={[
                  { label: "Home", href: "/" },
                  { label: "Contact " }
                ]} 
              />
            </div>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Left Side - Contact Information */}
              <div className="bg-gray-50 p-8 rounded-xl">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-2 text-gray-800">
                    <span className="text-[#A5292A]">Get in</span> Touch with Us!
                  </h2>
                  <p className="text-gray-600 text-lg">
                    Let our experience pave the path to your success.
                  </p>
                </div>

                {/* Office Information */}
                <div className="space-y-6">
                  {offices.map((office, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                      <h3 className="text-lg font-bold text-[#A5292A] mb-3">
                        {office.title}
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-start">
                          <MapPin className="w-4 h-4 text-gray-500 mr-2 mt-1 flex-shrink-0" />
                          <p className="text-gray-600 text-sm">{office.address}</p>
                        </div>
                        {office.phone && (
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 text-gray-500 mr-2" />
                            <p className="text-gray-600 text-sm">{office.phone}</p>
                          </div>
                        )}
                        {office.email && (
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 text-gray-500 mr-2" />
                            <p className="text-gray-600 text-sm">{office.email}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side - Contact Form */}
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  Send us a <span className="text-[#A5292A]">Message</span>
                </h3>
                
                {submitStatus === 'success' ? (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      Message Sent Successfully!
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Thank you for contacting us. We'll get back to you within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A5292A] focus:border-[#A5292A] outline-none transition-all duration-300"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        placeholder="Your Email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A5292A] focus:border-[#A5292A] outline-none transition-all duration-300"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Your Phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A5292A] focus:border-[#A5292A] outline-none transition-all duration-300"
                      />
                    </div>
                    
                    
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Query <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="message"
                        placeholder="Write Message..."
                        rows={4}
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A5292A] focus:border-[#A5292A] outline-none transition-all duration-300 resize-none"
                      ></textarea>
                    </div>
                    
                    {/* Status Messages */}
                    {submitStatus === 'error' && (
                      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                        Failed to send message. Please try again or contact us directly.
                      </div>
                    )}
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#A5292A] text-white py-4 px-8 rounded-lg font-semibold hover:bg-[#8B1E1E] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2 inline-block"></div>
                          Sending...
                        </>
                      ) : (
                        'Send a Message'
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

    
      <Footer />
    </div>
  );
}
