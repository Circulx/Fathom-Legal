import React, { useState } from "react";
import { Navbar } from "../../components/Navbar";
import philo_image from "../../assets/2024-02-Legal-Consult.webp";
import founder_image from "../../assets/2024-06-ishita-fathom.jpg";
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
  Award,
  Target,
} from "lucide-react";
import emailjs from '@emailjs/browser';

const AboutUs = () => {
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

  const whyChooseUs = [
    {
      icon: <Award className="w-8 h-8" />,
      title: "Expertise & Experience",
      description:
        "Our team brings years of specialized experience in corporate law, startup ecosystem, and business regulations.",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Client-Centric Approach",
      description:
        "We prioritize our clients' needs and provide personalized legal solutions tailored to their specific requirements.",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Ethical Governance",
      description:
        "We maintain the highest standards of professional ethics and integrity in all our legal practices.",
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Result-Oriented Solutions",
      description:
        "Our focus is on delivering practical, efficient, and effective legal solutions that drive business success.",
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
      <Navbar />

      {/* Hero Section with Background Image */}
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
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              About <span style={{ color: "#A5292A" }}>Fathom Legal</span>
            </h1>
            <p className="text-xl mb-4 text-gray-700">
              Excellence in Legal Practice Since Our Inception
            </p>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We are a full-service law firm committed to providing exceptional
              legal services with integrity, expertise, and a client-first
              approach that sets us apart in the legal landscape.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Fathom Legal */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 ">
          <div className="text-center mb-16  ">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Why Choose Fathom Legal?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our commitment to excellence and client satisfaction makes us the
              preferred choice for businesses and individuals seeking reliable
              legal counsel.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 px-4 sm:px-8 md:px-12 lg:px-20">
            {whyChooseUs.map((item, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group text-center"
              >
                <div className="text-[#A5292A] mb-4 group-hover:opacity-80 transition-opacity flex justify-center">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Philosophy */}
      <section className="py-20" style={{ backgroundColor: "#FAFAFA" }}>
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center px-4 sm:px-8 md:px-12 lg:px-20">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Our Philosophy
              </h2>
              <div className="space-y-6 text-lg text-gray-600">
                <p>
                  At Fathom Legal, we believe that exceptional legal service
                  stems from a deep understanding of our clients' businesses,
                  challenges, and aspirations. Our philosophy is built on three
                  fundamental pillars:
                </p>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <div
                      className="w-3 h-3 rounded-full mr-4 mt-2"
                      style={{ backgroundColor: "#A5292A" }}
                    ></div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Client Partnership
                      </h4>
                      <p className="text-gray-600">
                        We view ourselves as partners in our clients' success,
                        working collaboratively to achieve their goals.
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
                        Innovation & Excellence
                      </h4>
                      <p className="text-gray-600">
                        We continuously evolve our practices to provide
                        cutting-edge legal solutions that meet modern business
                        needs.
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
                        Ethical Leadership
                      </h4>
                      <p className="text-gray-600">
                        We maintain the highest ethical standards and serve as
                        trusted advisors in all our professional relationships.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:pl-8">
              <div className="relative">
                <img
                  src={philo_image}
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

      {/* Meet Our Founder */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Meet Our Founder
            </h2>
            <p className="text-xl text-gray-600">
              Leadership that drives excellence and innovation
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center px-4 sm:px-8 md:px-12 lg:px-20">
              {/* Founder Image */}
              <div className="text-center">
                <div className="relative inline-block">
                  <img
                    src={founder_image}
                    alt="Adv. Ishita Sharma"
                    className="w-120 h-150 rounded-2xl object-cover shadow-lg mx-auto"
                  />
                  <div
                    className="absolute inset-0 rounded-2xl"
                    style={{ backgroundColor: "rgba(165, 41, 42, 0.05)" }}
                  ></div>
                </div>
              </div>

              {/* Founder Details */}
              <div>
                <h3 className="text-3xl font-bold text-gray-800 mb-3">
                  Adv. Ishita Sharma
                </h3>
                <p className="text-xl mb-4" style={{ color: "#A5292A" }}>
                  Founder & Managing Partner
                </p>

                <div className="space-y-6 text-gray-600">
                  <p className="text-lg">
                    With over a decade of experience in corporate law and
                    business advisory, Adv. Ishita Sharma founded Fathom Legal
                    with a vision to provide comprehensive legal solutions that
                    truly understand and support business growth.
                  </p>

                  <p className="text-base">
                    She specializes in corporate structuring, startup ecosystem
                    guidance, and strategic legal planning. Her expertise spans
                    across various industries, making her a trusted advisor for
                    businesses at every stage of their growth journey.
                  </p>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">
                      Areas of Practice:
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {practiceAreas.map((area, index) => (
                        <div key={index} className="flex items-center">
                          <div
                            className="w-2 h-2 rounded-full mr-3"
                            style={{ backgroundColor: "#A5292A" }}
                          ></div>
                          <span className="text-gray-700 text-sm md:text-base">{area}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">
                      Qualifications:
                    </h4>
                    <ul className="space-y-3 text-gray-600">
                      <li className="text-sm md:text-base">• LL.B. from National Law University</li>
                      <li className="text-sm md:text-base">• LL.M. in Corporate Law</li>
                      <li className="text-sm md:text-base">• Member, Bar Council of India</li>
                      <li className="text-sm md:text-base">• Certified Corporate Legal Advisor</li>
                    </ul>
                  </div>
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

export default AboutUs;
