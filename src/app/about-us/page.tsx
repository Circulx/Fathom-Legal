'use client'

import React, { useEffect, useState } from "react";
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

type TeamMember = {
  id: string
  name: string
  title: string
  image: string
  imagePosition?: string
  email?: string
  bio: string[]
  practiceAreas: string[]
  qualifications: string[]
  calendlyUrl?: string
}

export default function AboutUs() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  
  // Contact form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  useEffect(() => {
    if (!selectedMember) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedMember(null)
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [selectedMember])

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
      description: "Our team brings years of specialized experience in corporate law, startup ecosystem, and business regulations."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Client-Centric Approach",
      description: "We prioritize our clients' needs and provide personalized legal solutions tailored to their specific requirements."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Ethical Governance",
      description: "We maintain the highest standards of professional ethics and integrity in all our legal practices."
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Result-Oriented Solutions",
      description: "Our focus is on delivering practical,efficient, and effective legal solutions that drive business success."
    },
  ];

  const leadership: TeamMember[] = [
    {
      id: 'ishita',
      name: 'Adv. Ishita Sharma',
      title: 'Founder & Managing Partner',
      image: '/2024-06-ishita-fathom.jpg',
      imagePosition: 'object-[28%_18%]',
      email: 'assist@fathomlegal.com',
      bio: [
        "With over a decade of experience in corporate law and business advisory, Adv. Ishita Sharma founded Fathom Legal with a vision to provide comprehensive legal solutions that truly understand and support business growth.",
        "She specializes in corporate structuring, startup ecosystem guidance, and strategic legal planning. Her expertise spans across various industries, making her a trusted advisor for businesses at every stage of their growth journey.",
        "Adv. Ishita is skilled at drafting and negotiating key agreements such as Shareholders' Agreements, Joint Venture Agreements, Technology Licensing Agreements, and Employment Contracts. She has guided companies through compliance and regulatory challenges across India and advised on matters under various corporate laws, helping businesses establish a strong foothold in the market.",
        "Her expertise extends to employment law, where she advises businesses on workplace policies, contracts, and dispute resolution. She has worked across diverse industries, including automotive, FMCG, manufacturing, real estate, healthcare, education, insurance, and financial services.",
      ],
      practiceAreas: [
        "Corporate & Commercial Law",
        "Startup Legal Advisory",
        "Mergers & Acquisitions",
        "Contract Drafting & Review",
        "Dispute Resolution & Litigation",
        "Intellectual Property Rights",
        "Employment & Labor Law",
        "Regulatory Compliance",
      ],
      qualifications: [
        "LL.B. from National Law University",
        "Member, Bar Council of India",
      ],
      calendlyUrl: 'https://calendly.com/ishita-fathomlegal/free-20-mins-consultation',
    },
    {
      id: 'vamsi',
      name: 'Adv. Vamsi Mohana',
      title: 'Partner & Head of Operations',
      image: '/vamsi.png',
      imagePosition: 'object-[50%_12%]',
      email: 'operations@fathomlegal.com',
      bio: [
        "Vamsi Mohana is a lawyer and policy professional with over 10 years of experience across corporate advisory, commercial law, workplace compliance, policy development and emerging technology. She holds a BA LL.B. and LL.M. from Damodaram Sanjivayya National Law University (DSNLU), Visakhapatnam. Her career has included in-house and advisory roles with Gati, K Law and Kyndryl, as well as teaching at Presidency University, Bengaluru. She later worked with Equilibrio Advisory LLP, focusing on POSH, POCSO and child protection, workplace compliance, policy development, data protection and information-security compliance.",
        "For the past year, she has been associated with Fathom Legal Advocates & Corporate Consultants (FLACC), where she serves as Partner and Head of Operations. Her work increasingly focuses on deep tech and emerging technology, including corporate structuring, commercial transactions, data protection, Web3 and evolving regulatory frameworks.",
        "Her interest in environmental law and policy is also personal. Having spent significant time in Dehradun over the past five years, she has developed a strong connection with Uttarakhand and its ecology. This has shaped her interest in how law and policy can balance development, conservation and community interests in environmentally sensitive regions.",
      ],
      practiceAreas: [
        "Corporate Advisory",
        "Commercial Law",
        "Workplace Compliance",
        "Policy Development",
        "Data Protection",
        "Deep Tech & Emerging Technology",
        "Web3 & Regulatory Frameworks",
        "Environmental Law & Policy",
      ],
      qualifications: [
        "BA LL.B. from Damodaram Sanjivayya National Law University (DSNLU), Visakhapatnam",
        "LL.M. from Damodaram Sanjivayya National Law University (DSNLU), Visakhapatnam",
        "Partner & Head of Operations, Fathom Legal",
      ],
    },
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
            <p className="text-base sm:text-lg md:text-lg text-gray-600 max-w-3xl mx-auto">
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
                <p className={`text-sm sm:text-base text-left ml-5 ${
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
                <p className="text-base sm:text-lg md:text-lg text-white leading-relaxed">
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

      {/* Leadership */}
      <section className="py-14 sm:py-16 relative overflow-hidden bg-[#ece7e0]">
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              'radial-gradient(circle at 12% 18%, rgba(165,41,42,0.12), transparent 42%), radial-gradient(circle at 88% 78%, rgba(28,26,24,0.06), transparent 45%)',
          }}
        />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="text-center mb-10">
            <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.28em] text-[#A5292A] mb-2.5">
              Our people
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-gray-800 mb-3">
              Meet Our <span style={{ color: '#A5292A' }}>Founder and Partner</span>
            </h2>
            <div className="mx-auto mb-3 h-px w-16 bg-[#A5292A]" />
            <p className="text-sm sm:text-base text-gray-600">
              Select a profile to explore their experience and practice focus
            </p>
          </div>

          <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-7">
            {leadership.map((member) => {
              const roleLabel = member.id === 'ishita' ? 'Founder' : 'Partner'
              return (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => setSelectedMember(member)}
                  className="group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A5292A] focus-visible:ring-offset-4 max-w-[280px] mx-auto w-full"
                  aria-label={`View profile of ${member.name}`}
                >
                  <div className="relative h-full overflow-hidden rounded-2xl bg-white shadow-[0_10px_30px_rgba(28,26,24,0.08)] transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:shadow-[0_22px_45px_rgba(28,26,24,0.16)]">
                    <div className="absolute left-0 top-0 z-10 h-1 w-full origin-left scale-x-50 bg-[#A5292A] transition-transform duration-500 group-hover:scale-x-100" />

                    <div className="relative h-48 sm:h-52 overflow-hidden bg-[#d9d2c8]">
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        sizes="280px"
                        className={`object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] ${member.imagePosition ?? 'object-top'}`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-50 transition-opacity duration-500 group-hover:opacity-70" />
                      <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A5292A] shadow-sm backdrop-blur-sm">
                        {roleLabel}
                      </span>
                    </div>

                    <div className="relative px-4 py-3.5">
                      <p className="text-gray-900 text-[15px] font-bold leading-snug tracking-tight">
                        {member.name}
                      </p>
                      <p className="mt-1 text-[12px] font-medium leading-snug text-[#A5292A]">
                        {member.title}
                      </p>
                      <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-500 transition-colors group-hover:text-[#A5292A]">
                          View profile
                        </span>
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-all duration-300 group-hover:border-[#A5292A] group-hover:bg-[#A5292A] group-hover:text-white">
                          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Profile Modal */}
      {selectedMember && (
        <div
          className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="leadership-profile-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
            aria-label="Close profile"
            onClick={() => setSelectedMember(null)}
          />

          <div className="relative z-10 w-full max-w-3xl max-h-[82vh] overflow-hidden rounded-none sm:rounded-2xl bg-white shadow-2xl">
            <button
              type="button"
              onClick={() => setSelectedMember(null)}
              className="absolute top-4 right-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-gray-700 shadow-md hover:bg-gray-100"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-h-[82vh] overflow-y-auto p-6 sm:p-8 lg:p-10 space-y-7">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#A5292A] mb-2">
                    {selectedMember.id === 'ishita' ? 'Founder' : 'Partner'}
                  </p>
                  <h3
                    id="leadership-profile-title"
                    className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight pr-10"
                  >
                    {selectedMember.name}
                  </h3>
                  <p className="text-base sm:text-lg font-medium mt-1.5 text-gray-600">
                    {selectedMember.title}
                  </p>
                  <div className="mt-4 h-px w-12 bg-[#A5292A]" />
                </div>

                <div className="space-y-4 text-gray-700">
                  {selectedMember.bio.map((paragraph, index) => (
                    <p key={index} className="text-sm sm:text-base leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div>
                  <h4 className="text-sm font-bold uppercase tracking-[0.14em] text-gray-800 mb-4">
                    Practice Areas
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedMember.practiceAreas.map((area) => (
                      <span
                        key={area}
                        className="rounded-full border border-[#e7e1d9] bg-[#f7f4ef] px-3.5 py-1.5 text-[12.5px] font-medium text-gray-700"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold uppercase tracking-[0.14em] text-gray-800 mb-4">
                    Qualifications
                  </h4>
                  <ul className="space-y-2.5 text-gray-700">
                    {selectedMember.qualifications.map((item) => (
                      <li key={item} className="flex gap-2 text-sm sm:text-base leading-relaxed">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#A5292A]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-[#e7e1d9] bg-[#faf8f5] p-5 text-center">
                  <h4 className="text-sm font-bold uppercase tracking-[0.14em] text-gray-800 mb-3">
                    Get In Touch
                  </h4>
                  <div className="space-y-2.5 mb-5">
                    <div className="flex items-center justify-center">
                      <Mail className="w-4 h-4 text-[#A5292A] mr-3 shrink-0" />
                      <span className="text-sm text-gray-700">
                        {selectedMember.email || 'assist@fathomlegal.com'}
                      </span>
                    </div>
                    <div className="flex items-center justify-center">
                      <Phone className="w-4 h-4 text-[#A5292A] mr-3 shrink-0" />
                      <span className="text-sm text-gray-700">+919625206671</span>
                    </div>
                  </div>
                  {selectedMember.calendlyUrl && (
                    <a
                      href={selectedMember.calendlyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-5 py-2.5 bg-[#A5292A] text-white text-sm font-semibold hover:bg-[#8a2122] transition-colors"
                    >
                      Schedule Consultation <ArrowRight className="ml-2 w-4 h-4" />
                    </a>
                  )}
                </div>
            </div>
          </div>
        </div>
      )}

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
            <h2 className="text-3xl md:text-4xl lg:text-3xl font-bold text-white mb-4">
              Get in <span style={{ color: "#A5292A" }}>Touch</span> with Us!
            </h2>
            <p className="text-base sm:text-lg lg:text-base text-white/90 max-w-3xl mx-auto">
              Let our experience pave the path to your success.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 px-4 sm:px-8 md:px-12 lg:px-20 items-start">
            {/* Contact Information */}
            <div className="space-y-8">
              {/* Bangalore Office */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4" style={{ color: "#A5292A" }}>
                  Bangalore Office
                </h3>
                <div className="space-y-1 text-white/90">
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

              {/* Delhi Office */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4" style={{ color: "#A5292A" }}>
                  Delhi Office
                </h3>
                <div className="space-y-1 text-white/90">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-white mt-1 flex-shrink-0" />
                    <p>Delhi, India</p>
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

              {/* Pune Office */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4" style={{ color: "#A5292A" }}>
                  Pune Office
                </h3>
                <div className="space-y-1 text-white/90">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-white mt-1 flex-shrink-0" />
                    <p>Unit no. 403, Tower 3, Kohinoor World Towers, Old Mumbai - Pune Hwy, opp. Empire Estate, Pimpri Colony, Pune, Maharashtra 411018</p>
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

              {/* USA Office */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4" style={{ color: "#A5292A" }}>
                  USA Office
                </h3>
                <div className="space-y-1 text-white/90">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-white mt-1 flex-shrink-0" />
                    <p>3817 Trails End Rd, Aubrey, TX 76227</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-white flex-shrink-0" />
                    <a href="https://mail.google.com/mail/?view=cm&fs=1&to=assist@fathomlegal.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#A5292A] transition-colors duration-300">assist@fathomlegal.com</a>
                  </div>
                </div>
              </div>

              {/* UAE Office */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4" style={{ color: "#A5292A" }}>
                  UAE Office
                </h3>
                <div className="space-y-1 text-white/90">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-white mt-1 flex-shrink-0" />
                    <p>Sheikh Zayed Rd - Al Barsha First - Al Barsha - Dubai - United Arab Emirates</p>
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
            <div className="bg-white/95 backdrop-blur-md pt-6 px-6 pb-4 rounded-lg shadow-2xl border border-white/30 overflow-hidden">
              <h3 className="text-xl font-bold text-[#A5292A] mb-4">Contact Form</h3>
              <form onSubmit={handleSubmit} className="space-y-3 mb-0">
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 bg-white rounded-lg focus:ring-2 focus:ring-[#A5292A] focus:border-[#A5292A] outline-none transition-all duration-300"
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
                    className="w-full px-4 py-3 border bg-white border-gray-200 rounded-lg focus:ring-2 focus:ring-[#A5292A] focus:border-[#A5292A] outline-none transition-all duration-300"
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
                    className="w-full px-4 py-3  bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#A5292A] focus:border-[#A5292A] outline-none transition-all duration-300"
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
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#A5292A] focus:border-[#A5292A] outline-none transition-all duration-300 resize-none"
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
                  className="w-full bg-[#A5292A] text-white py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mb-0"
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
