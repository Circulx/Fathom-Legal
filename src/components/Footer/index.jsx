import React from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../../assets/cropped-icon-red-192x192.png";
import { FaLinkedin, FaInstagram, FaFacebook, FaYoutube, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-16">
      <div className="container mx-auto px-8 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 mr-3">
                <Image src={logo} alt="Fathom Legal Logo" width={40} height={40} />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white">
                Fathom <span style={{ color: "#A5292A" }}>Legal</span>
              </div>
            </div>
            <p className="text-gray-300 text-sm sm:text-base mb-4">
              Expert legal services for businesses and individuals with a focus
              on startup ecosystem and SMB sector.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-2 text-white">Services</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
            <li>
                <a href="/web3law" className="hover:text-white transition-colors">
                  Web3 Law
                </a>
              </li>
              <li>
                <a href="/services/generalcorporateadvisory" className="hover:text-white transition-colors">
                  General Corporate Advisory
                </a>
              </li>
              <li>
                <a href="/services/disputeresolution" className="hover:text-white transition-colors">
                  Dispute Resolution
                </a>
              </li>
              <li>
                <a href="/services/intellectualproperty" className="hover:text-white transition-colors">
                  Intellectual Property
                </a>
              </li>
              <li>
                <a href="/services/realestate" className="hover:text-white transition-colors">
                  Real Estate
                </a>
              </li>
             
              
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-2 text-white">Company</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>
                <a href="/about-us" className="hover:text-white transition-colors">
                  About Us
                </a>
              </li>
             
              <li>
                <a href="/careers" className="hover:text-white transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-2 text-white">Legal</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>
                <Link 
                  href="/privacy-policy" 
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms-of-service" 
                  className="hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link 
                  href="/refund-cancellation-policy" 
                  className="hover:text-white transition-colors"
                >
                  Refund and Cancellation Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Section */}
        <div className="border-t border-gray-700 mt-6 pt-4">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <p className="text-center lg:text-left text-gray-300 text-sm">
              &copy; 2024 Fathom Legal Advocates & Corporate Consultants. All
              rights reserved.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
              <p className="text-gray-300 text-sm">Connect with us on:</p>
              <div className="flex space-x-3">
                <a 
                  href="https://www.linkedin.com/company/fathom-legal/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-[#0077B5] transition-colors duration-300"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin size={20} />
                </a>
                <a 
                  href="https://www.instagram.com/p/DQTdaqAiOYw/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-[#E4405F] transition-colors duration-300"
                  aria-label="Instagram"
                >
                  <FaInstagram size={20} />
                </a>
                <a 
                  href="https://www.facebook.com/share/p/1Jk8RH2qxG/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-[#1877F2] transition-colors duration-300"
                  aria-label="Facebook"
                >
                  <FaFacebook size={20} />
                </a>
                <a 
                  href="https://youtube.com/@fathomlegal" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-[#FF0000] transition-colors duration-300"
                  aria-label="YouTube"
                >
                  <FaYoutube size={20} />
                </a>
                <a 
                  href="https://wa.me/919625206671" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-[#25D366] transition-colors duration-300"
                  aria-label="WhatsApp"
                >
                  <FaWhatsapp size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;