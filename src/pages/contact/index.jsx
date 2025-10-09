import React, { useState } from "react";
import { Navbar } from "../../components/Navbar";
import Footer from "../../components/Footer";
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
  Shield
} from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

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

  const contactInfo = [
    {
      icon: <MapPin className="w-8 h-8 text-blue-600" />,
      title: "Corporate Office",
      details: ["27th main road, 1st sector, HSR Layout", "Bangalore, 560102"],
      description: "Offices also in Dubai and Dallas"
    },
    {
      icon: <Phone className="w-8 h-8 text-green-600" />,
      title: "Phone",
      details: ["+919625206671"],
      description: "Call us for immediate legal assistance"
    },
    {
      icon: <Mail className="w-8 h-8 text-purple-600" />,
      title: "Email",
      details: ["assist@fathomlegal.com"],
      description: "Send us your legal queries via email"
    },
    {
      icon: <Clock className="w-8 h-8 text-orange-600" />,
      title: "Business Hours",
      details: ["Mon - Fri: 9:00 AM - 6:00 PM", "Sat: 10:00 AM - 4:00 PM"],
      description: "We're available during business hours"
    }
  ];


  return (
    <div className="min-h-screen bg-white">
      <Navbar page="contact" />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-800 mb-6">
              Get in <span style={{ color: "#A5292A" }}>Touch</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Ready to discuss your legal needs? Contact our experienced team 
              for professional legal consultation and expert guidance.
            </p>
            
           
          </div>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Headlines Section */}
            <div className="grid lg:grid-cols-2 gap-12 mb-12">
              <div className="text-center lg:text-left">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                  Contact Information
                </h2>
                <p className="text-lg text-gray-600">
                  Get in touch with our legal experts. We're here to help you 
                  navigate complex legal challenges and provide expert guidance.
                </p>
              </div>
              <div className="text-center lg:text-left">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                  Send us a Message
                </h2>
                <p className="text-lg text-gray-600">
                  Fill out the form below and we'll get back to you within 24 hours
                </p>
              </div>
            </div>

            {/* Contact Information and Form Section */}
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Information Section */}
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl shadow-lg border-2 border-gray-300 hover:border-[#A5292A] hover:shadow-xl transition-all duration-300">
                      <div className="text-center">
                        <div className="flex justify-center mb-6">
                          <div>
                            {info.icon}
                          </div>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                          {info.title}
                        </h3>
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="text-gray-600 mb-2 text-sm md:text-base">
                            {detail}
                          </p>
                        ))}
                        <p className="text-xs md:text-sm text-gray-500 mt-3">
                          {info.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Contact CTA */}
                <div className="bg-gradient-to-br from-[#A5292A] to-[#8B1E1E] p-6 rounded-2xl text-white shadow-lg text-center mt-20">
                  <h3 className="text-xl font-semibold mb-4">
                    Need Immediate Assistance?
                  </h3>
                  <p className="text-white text-opacity-90 mb-6 text-base">
                    For urgent legal matters, call us directly or schedule a 
                    same-day consultation.
                  </p>
                  <a 
                    href="https://calendly.com/ishita-fathomlegal/free-20-mins-consultation"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white border-2 border-white text-[#A5292A] font-semibold hover:bg-[#A5292A] hover:text-white transition-all duration-300 group text-sm sm:text-base rounded-lg"
                  >
                    Schedule Consultation <ArrowRight className="ml-2 w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Contact Form Section */}
              <div className="bg-white pt-4 px-4 pb-3 rounded-lg shadow-2xl border border-gray-200 h-133">
                <h3 className="text-lg font-bold text-gray-800 mb-3">Contact Form</h3>
              
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
                   <form onSubmit={handleSubmit} className="space-y-10">
                    <div>
                      <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#A5292A] focus:border-[#A5292A] outline-none transition-all duration-300"
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
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#A5292A] focus:border-[#A5292A] outline-none transition-all duration-300"
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
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#A5292A] focus:border-[#A5292A] outline-none transition-all duration-300"
                      />
                    </div>
                    <div>
                      <textarea
                        name="message"
                        placeholder="Message"
                        rows={3}
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#A5292A] focus:border-[#A5292A] outline-none transition-all duration-300 resize-none"
                      ></textarea>
                    </div>
                    
                    {/* Status Messages */}
                    {submitStatus === 'error' && (
                      <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                        Failed to send message. Please try again or contact us directly.
                      </div>
                    )}
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#A5292A] text-white py-2 px-6 rounded-lg font-semibold hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
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
};
export default Contact;
