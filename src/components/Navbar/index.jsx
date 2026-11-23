"use client"

import React, { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const Navbar = ({ page }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isValueServicesOpen, setIsValueServicesOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <div className="w-12 h-12">
              <Image src="/cropped-icon-red-192x192.png" alt="Fathom Legal Logo" width={48} height={48} />
            </div>
            <div className="text-gray-800 leading-tight">
              <div className="text-2xl font-bold">
                Fathom <span style={{ color: "#A5292A" }}>Legal</span>
              </div>
              <div className="text-[11px] font-medium tracking-wide text-gray-600">
                Advocates &amp; Corporate Consultants
              </div>
            </div>
          </Link>

          {/* Desktop Navigation - Hidden, Now Hamburger Menu */}
          <nav className="hidden items-center space-x-8">
            <Link
              className={
                page === "aboutus"
                  ? "text-[#A5292A] hover:text-[#A5292A] font-bold flex items-center"
                  : "text-gray-900 hover:text-[#A5292A] font-bold flex items-center"
              }
              href="/about-us"
            >
              About Us
            </Link>
            {/* Services Dropdown */}
            <div className="relative group">
              <Link
                href="/services"
                className={
                  page === "services"
                    ? "text-[#A5292A] hover:text-[#A5292A] font-bold flex items-center"
                    : "text-gray-900 hover:text-[#A5292A] font-bold flex items-center"
                }
              >
                Services <ChevronDown className="ml-1 w-4 h-4 font-bold" />
              </Link>
              <div className="absolute top-full left-0 bg-white shadow-lg py-3 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border-b-2" style={{ borderBottomColor: "#A5292A" }}>
                <Link
                  href="/services/generalcorporateadvisory"
                  className="block px-5 py-3 text-gray-900 hover:bg-[#FAFAFA] hover:text-[#A5292A] relative"
                >
                  General Corporate Advisory
                  <div className="absolute bottom-0 left-5 right-5 h-px bg-gray-200"></div>
                </Link>
                
                <Link
                  href="/services/disputeresolution"
                  className="block px-5 py-3 text-gray-900 hover:bg-[#FAFAFA] hover:text-[#A5292A] relative"
                >
                  Dispute Resolution
                  <div className="absolute bottom-0 left-5 right-5 h-px bg-gray-200"></div>
                </Link>
                <Link
                  href="/services/intellectualproperty"
                  className="block px-5 py-3 text-gray-900 hover:bg-[#FAFAFA] hover:text-[#A5292A] relative"
                >
                  Intellectual Property Services
                  <div className="absolute bottom-0 left-5 right-5 h-px bg-gray-200"></div>
                </Link>
                
                <Link
                  href="/services/realestatesolutions"
                  className="block px-5 py-3 text-gray-900 hover:bg-[#FAFAFA] hover:text-[#A5292A] relative"
                >
                  Real Estate Solution
                  <div className="absolute bottom-0 left-5 right-5 h-px bg-gray-200"></div>
                </Link>
                <Link
                  href="/services/reitsolutions"
                  className="block px-5 py-3 text-gray-900 hover:bg-[#FAFAFA] hover:text-[#A5292A]"
                >
                  REIT Solution
                </Link>
              </div>
            </div>
            
            <Link
              href="/web3law"
              className={
                page === "web3law"
                  ? "text-[#A5292A] hover:text-[#A5292A] font-bold flex items-center"
                  : "text-gray-900 hover:text-[#A5292A] font-bold flex items-center"
              }
            >
              Web3 law
            </Link>

            <Link
              href="/templates"
              className={
                page === "templates"
                  ? "text-[#A5292A] hover:text-[#A5292A] font-bold flex items-center"
                  : "text-gray-900 hover:text-[#A5292A] font-bold flex items-center"
              }
            >
              Templates
            </Link>

            <Link
              href="/gallery"
              className={
                page === "gallery"
                  ? "text-[#A5292A] hover:text-[#A5292A] font-bold flex items-center"
                  : "text-gray-900 hover:text-[#A5292A] font-bold flex items-center"
              }
            >
              Gallery
            </Link>

           
            

            {/* VBS Dropdown */}
            <div className="relative group">
              <Link
                href="/valueboostingsolutions"
                className={
                  page === "vbs"
                    ? "text-[#A5292A] hover:text-[#A5292A] font-bold flex items-center"
                    : "text-gray-900 hover:text-[#A5292A] font-bold flex items-center"
                }
              >
                Value Services <ChevronDown className="ml-1 w-4 h-4 font-bold" />
              </Link>
              <div className="absolute top-full left-0 bg-white shadow-lg py-3 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100 border-b-2" style={{ borderBottomColor: "#A5292A" }}>
                <Link
                  href="/valueboostingsolutions/chieflegalofficerservice"
                  className="block px-5 py-3 text-gray-900 hover:bg-[#FAFAFA] hover:text-[#A5292A] relative"
                >
                  Chief Legal Officer Service
                  <div className="absolute bottom-0 left-5 right-5 h-px bg-gray-200"></div>
                </Link>
                <Link
                  href="/valueboostingsolutions/techlegalblueprint"
                  className="block px-5 py-3 text-gray-900 hover:bg-[#FAFAFA] hover:text-[#A5292A] relative"
                >
                  Tech Legal Blueprint
                  <div className="absolute bottom-0 left-5 right-5 h-px bg-gray-200"></div>
                </Link>
                <Link
                  href="/valueboostingsolutions/vcfundingsupport"
                  className="block px-5 py-3 text-gray-900 hover:bg-[#FAFAFA] hover:text-[#A5292A] relative"
                >
                  VC Funding Support
                  <div className="absolute bottom-0 left-5 right-5 h-px bg-gray-200"></div>
                </Link>
                <Link
                  href="/valueboostingsolutions/pitchdeckservices"
                  className="block px-5 py-3 text-gray-900 hover:bg-[#FAFAFA] hover:text-[#A5292A] relative"
                >
                  Pitch Deck Services
                  <div className="absolute bottom-0 left-5 right-5 h-px bg-gray-200"></div>
                </Link>
                <Link
                  href="/valueboostingsolutions/cybersecurityservices"
                  className="block px-5 py-3 text-gray-900 hover:bg-[#FAFAFA] hover:text-[#A5292A]"
                >
                  Cybersecurity Compliance Services
                </Link>
              </div>
            </div>

            {/* Thought Leadership */}
            <div className="relative group">
              <Link
                href="/thoughtleadership"
                className={
                  page === "thoughtleadership"
                    ? "text-[#A5292A] hover:text-[#A5292A] font-bold flex items-center"
                    : "text-gray-900 hover:text-[#A5292A] font-bold flex items-center"
                }
              >
                Thought Leadership
              
              </Link>
             
              </div>
            
            
            <Link
              href="/contact"
              className={
                page === "contact"
                  ? "text-[#A5292A] hover:text-[#A5292A] font-bold"
                  : "text-gray-900 hover:text-[#A5292A] font-bold"
              }
            >
              Contact
            </Link>

            <Link
              href="/fathom-crm"
              className="text-white px-3 py-1 rounded-lg hover:opacity-90 transition-all font-bold"
              style={{ backgroundColor: "#A5292A" }}
            >
              Book a Call
            </Link>
          </nav>

          {/* Hamburger menu button - Always visible */}
          <button
            className="flex items-center justify-center"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-black" />
            ) : (
              <Menu className="w-6 h-6 text-black" />
            )}
          </button>
        </div>

        {/* Sidebar Navigation - Opens from hamburger on all screen sizes */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsMenuOpen(false)}>
            <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl border-l border-gray-200" onClick={(e) => e.stopPropagation()}>
              <div className="h-20 flex items-center justify-end px-6 border-b border-gray-100">
                <button onClick={() => setIsMenuOpen(false)}>
                  <X className="w-6 h-6 text-black" />
                </button>
              </div>
              <div className="overflow-y-auto h-full pb-20">
              <div className="px-2 pt-4 pb-3 space-y-1">
              <Link
                className={`block px-6 py-3 font-bold text-lg ${
                  page === "aboutus"
                    ? "text-[#A5292A] bg-[#A5292A]/5 border-l-4 border-[#A5292A]"
                    : "text-gray-900 hover:text-[#A5292A] hover:bg-gray-50"
                }`}
                href="/about-us"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>

              {/* Services Dropdown */}
              <div>
                <button
                  className={`flex items-center justify-between w-full px-6 py-3 text-lg font-bold ${
                    page === "services"
                      ? "text-[#A5292A] bg-[#A5292A]/5 border-l-4 border-[#A5292A]"
                      : "text-gray-900 hover:text-[#A5292A] hover:bg-gray-50"
                  }`}
                  onClick={() => setIsServicesOpen(!isServicesOpen)}
                >
                  Services
                  <ChevronDown className={`w-4 h-4 transition-transform font-bold ${isServicesOpen ? 'rotate-180' : ''}`} />
                </button>
                {isServicesOpen && (
                  <div className="pl-8 space-y-1 bg-gray-50">
                    <Link
                      href="/services/generalcorporateadvisory"
                      className="block px-6 py-2.5 text-gray-800 hover:text-[#A5292A] hover:bg-white text-sm font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      General Corporate Advisory
                    </Link>
                    <Link
                      href="/services/disputeresolution"
                      className="block px-6 py-2.5 text-gray-800 hover:text-[#A5292A] hover:bg-white text-sm font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dispute Resolution
                    </Link>
                    <Link
                      href="/services/intellectualproperty"
                      className="block px-6 py-2.5 text-gray-800 hover:text-[#A5292A] hover:bg-white text-sm font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Intellectual Property Services
                    </Link>
                    <Link
                      href="/services/realestatesolutions"
                      className="block px-6 py-2.5 text-gray-800 hover:text-[#A5292A] hover:bg-white text-sm font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Real Estate Solution
                    </Link>
                    <Link
                      href="/services/reitsolutions"
                      className="block px-6 py-2.5 text-gray-800 hover:text-[#A5292A] hover:bg-white text-sm font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      REIT Solution
                    </Link>
                  </div>
                )}
              </div>

              <Link
                className={`block px-6 py-3 text-lg font-bold ${
                  page === "web3law"
                    ? "text-[#A5292A] bg-[#A5292A]/5 border-l-4 border-[#A5292A]"
                    : "text-gray-900 hover:text-[#A5292A] hover:bg-gray-50"
                }`}
                href="/web3law"
                onClick={() => setIsMenuOpen(false)}
              >
                Web3 law
              </Link>

              <Link
                className={`block px-6 py-3 text-lg font-bold ${
                  page === "templates"
                    ? "text-[#A5292A] bg-[#A5292A]/5 border-l-4 border-[#A5292A]"
                    : "text-gray-900 hover:text-[#A5292A] hover:bg-gray-50"
                }`}
                href="/templates"
                onClick={() => setIsMenuOpen(false)}
              >
                Templates
              </Link>

              <Link
                className={`block px-6 py-3 text-lg font-bold ${
                  page === "gallery"
                    ? "text-[#A5292A] bg-[#A5292A]/5 border-l-4 border-[#A5292A]"
                    : "text-gray-900 hover:text-[#A5292A] hover:bg-gray-50"
                }`}
                href="/gallery"
                onClick={() => setIsMenuOpen(false)}
              >
                Gallery
              </Link>

              {/* Value Services Dropdown */}
              <div>
                <button
                  className={`flex items-center justify-between w-full px-6 py-3 text-lg font-bold ${
                    page === "vbs"
                      ? "text-[#A5292A] bg-[#A5292A]/5 border-l-4 border-[#A5292A]"
                      : "text-gray-900 hover:text-[#A5292A] hover:bg-gray-50"
                  }`}
                  onClick={() => setIsValueServicesOpen(!isValueServicesOpen)}
                >
                  Value Services
                  <ChevronDown className={`w-4 h-4 transition-transform font-bold ${isValueServicesOpen ? 'rotate-180' : ''}`} />
                </button>
                {isValueServicesOpen && (
                  <div className="pl-8 space-y-1 bg-gray-50">
                    <Link
                      href="/valueboostingsolutions/chieflegalofficerservice"
                      className="block px-6 py-2.5 text-gray-800 hover:text-[#A5292A] hover:bg-white text-sm font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Chief Legal Officer Service
                    </Link>
                    <Link
                      href="/valueboostingsolutions/techlegalblueprint"
                      className="block px-6 py-2.5 text-gray-800 hover:text-[#A5292A] hover:bg-white text-sm font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Tech Legal Blueprint
                    </Link>
                    <Link
                      href="/valueboostingsolutions/vcfundingsupport"
                      className="block px-6 py-2.5 text-gray-800 hover:text-[#A5292A] hover:bg-white text-sm font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      VC Funding Support
                    </Link>
                    <Link
                      href="/valueboostingsolutions/pitchdeckservices"
                      className="block px-6 py-2.5 text-gray-800 hover:text-[#A5292A] hover:bg-white text-sm font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Pitch Deck Services
                    </Link>
                    <Link
                      href="/valueboostingsolutions/cybersecurityservices"
                      className="block px-6 py-2.5 text-gray-800 hover:text-[#A5292A] hover:bg-white text-sm font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Cybersecurity Compliance Services
                    </Link>
                    
                  </div>
                )}
              </div>

              <Link
                className={`block px-6 py-3 text-lg font-bold ${
                  page === "thoughtleadership"
                    ? "text-[#A5292A] bg-[#A5292A]/5 border-l-4 border-[#A5292A]"
                    : "text-gray-900 hover:text-[#A5292A] hover:bg-gray-50"
                }`}
                href="/thoughtleadership"
                onClick={() => setIsMenuOpen(false)}
              >
                Thought Leadership
              </Link>

              <Link
                className={`block px-6 py-3 text-lg font-bold ${
                  page === "contact"
                    ? "text-[#A5292A] bg-[#A5292A]/5 border-l-4 border-[#A5292A]"
                    : "text-gray-900 hover:text-[#A5292A] hover:bg-gray-50"
                }`}
                href="/contact"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>

              <div className="px-6 py-4 mt-4 border-t border-gray-200">
                <Link
                  className="block w-full px-4 py-3 font-bold text-white text-center rounded-lg hover:opacity-90 transition-all"
                  style={{ backgroundColor: "#A5292A" }}
                  href="/fathom-crm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Book a Call
                </Link>
              </div>
            </div>
              </div>
            </div>
          </div>
        )}
      </div> 
    </header>
  );
};
