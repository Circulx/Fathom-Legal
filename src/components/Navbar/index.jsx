"use client"

import React, { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import logo from "../../assets/cropped-icon-red-192x192.png";
export const Navbar = ({ page }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isValueServicesOpen, setIsValueServicesOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="w-12 h-12">
              <Image src={logo} alt="Fathom Legal Logo" width={48} height={48} />
            </div>
            <div className="text-2xl font-bold text-gray-800">
              Fathom <span style={{ color: "#A5292A" }}>Legal</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={
                page === "home"
                  ? "text-[#A5292A] hover:text-[#A5292A] font-bold flex items-center"
                  : "text-gray-900 hover:text-[#A5292A] font-bold flex items-center"
              }
            >
              Home
            </Link>

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
              <div className="absolute top-full left-0 bg-white shadow-lg rounded-lg py-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <Link
                  href="/services/generalcorporateadvisory"
                  className="block px-4 py-2 text-gray-900 hover:bg-[#FAFAFA] hover:text-[#A5292A]"
                >
                  General Corporate Advisory
                </Link>
                
                <Link
                  href="/services/disputeresolution"
                  className="block px-4 py-2 text-gray-900 hover:bg-[#FAFAFA] hover:text-[#A5292A]"
                >
                  Dispute Resolution
                </Link>
                <Link
                  href="/services/intellectualproperty"
                  className="block px-4 py-2 text-gray-900 hover:bg-[#FAFAFA] hover:text-[#A5292A]"
                >
                  Intellectual Property Services
                </Link>
                
                <Link
                  href="/services/realestatesolutions"
                  className="block px-4 py-2 text-gray-900 hover:bg-[#FAFAFA] hover:text-[#A5292A]"
                >
                  Real Estate Solution
                </Link>
                <Link
                  href="/services/reitsolutions"
                  className="block px-4 py-2 text-gray-900 hover:bg-[#FAFAFA] hover:text-[#A5292A]"
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
              <div className="absolute top-full left-0 bg-white shadow-lg rounded-lg py-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100">
                <Link
                  href="/valueboostingsolutions/chieflegalofficerservice"
                  className="block px-4 py-2 text-gray-900 hover:bg-[#FAFAFA] hover:text-[#A5292A]"
                >
                  Chief Legal Officer Service
                </Link>
                <Link
                  href="/valueboostingsolutions/techlegalblueprint"
                  className="block px-4 py-2 text-gray-900 hover:bg-[#FAFAFA] hover:text-[#A5292A]"
                >
                  Tech Legal Blueprint
                </Link>
                <Link
                  href="/valueboostingsolutions/vcfundingsupport"
                  className="block px-4 py-2 text-gray-900 hover:bg-[#FAFAFA] hover:text-[#A5292A]"
                >
                  VC Funding Support
                </Link>
                <Link
                  href="/valueboostingsolutions/pitchdeckservices"
                  className="block px-4 py-2 text-gray-900 hover:bg-[#FAFAFA] hover:text-[#A5292A]"
                >
                  Pitch Deck Services
                </Link>
                <Link
                  href="/valueboostingsolutions/cybersecurityservices"
                  className="block px-4 py-2 text-gray-900 hover:bg-[#FAFAFA] hover:text-[#A5292A]"
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
            {/* <button
              className="text-white px-6 py-2 rounded-lg hover:opacity-90 transition-all font-bold"
              style={{ backgroundColor: "#A5292A" }}
            >
              Get Consultation
            </button> */}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-black" />
            ) : (
              <Menu className="w-6 h-6 text-black" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                className={`block px-3 py-2 font-bold ${
                  page === "home"
                    ? "text-[#A5292A]"
                    : "text-gray-900 hover:text-[#A5292A]"
                }`}
                href="/"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>

              <Link
                className={`block px-3 py-2 font-bold ${
                  page === "aboutus"
                    ? "text-[#A5292A]"
                    : "text-gray-900 hover:text-[#A5292A]"
                }`}
                href="/about-us"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>

              {/* Services Dropdown */}
              <div>
                <button
                  className="flex items-center justify-between w-full px-3 py-2 text-gray-900 hover:text-[#A5292A] font-bold"
                  onClick={() => setIsServicesOpen(!isServicesOpen)}
                >
                  Services
                  <ChevronDown className={`w-4 h-4 transition-transform font-bold ${isServicesOpen ? 'rotate-180' : ''}`} />
                </button>
                {isServicesOpen && (
                  <div className="pl-4 space-y-1">
                    <Link
                      href="/services/generalcorporateadvisory"
                      className="block px-3 py-2 text-gray-900 hover:text-[#A5292A] text-sm"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      General Corporate Advisory
                    </Link>
                    <Link
                      href="/services/disputeresolution"
                      className="block px-3 py-2 text-gray-900 hover:text-[#A5292A] text-sm"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dispute Resolution
                    </Link>
                    <Link
                      href="/services/intellectualproperty"
                      className="block px-3 py-2 text-gray-900 hover:text-[#A5292A] text-sm"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Intellectual Property Services
                    </Link>
                    <Link
                      href="/services/realestatesolutions"
                      className="block px-3 py-2 text-gray-900 hover:text-[#A5292A] text-sm"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Real Estate Solution
                    </Link>
                    <Link
                      href="/services/reitsolutions"
                      className="block px-3 py-2 text-gray-900 hover:text-[#A5292A] text-sm"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      REIT Solution
                    </Link>
                  </div>
                )}
              </div>

              <Link
                className={`block px-3 py-2 font-bold ${
                  page === "web3law"
                    ? "text-[#A5292A]"
                    : "text-gray-900 hover:text-[#A5292A]"
                }`}
                href="/web3law"
                onClick={() => setIsMenuOpen(false)}
              >
                Web3 law
              </Link>

              <Link
                className={`block px-3 py-2 font-bold ${
                  page === "templates"
                    ? "text-[#A5292A]"
                    : "text-gray-900 hover:text-[#A5292A]"
                }`}
                href="/templates"
                onClick={() => setIsMenuOpen(false)}
              >
                Templates
              </Link>

              <Link
                className={`block px-3 py-2 font-bold ${
                  page === "gallery"
                    ? "text-[#A5292A]"
                    : "text-gray-900 hover:text-[#A5292A]"
                }`}
                href="/gallery"
                onClick={() => setIsMenuOpen(false)}
              >
                Gallery
              </Link>

              {/* Value Services Dropdown */}
              <div>
                <button
                  className="flex items-center justify-between w-full px-3 py-2 text-gray-900 hover:text-[#A5292A] font-bold"
                  onClick={() => setIsValueServicesOpen(!isValueServicesOpen)}
                >
                  Value Services
                  <ChevronDown className={`w-4 h-4 transition-transform font-bold ${isValueServicesOpen ? 'rotate-180' : ''}`} />
                </button>
                {isValueServicesOpen && (
                  <div className="pl-4 space-y-1">
                    <Link
                      href="/valueboostingsolutions/chieflegalofficerservice"
                      className="block px-3 py-2 text-gray-900 hover:text-[#A5292A] text-sm"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Chief Legal Officer Service
                    </Link>
                    <Link
                      href="/valueboostingsolutions/techlegalblueprint"
                      className="block px-3 py-2 text-gray-900 hover:text-[#A5292A] text-sm"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Tech Legal Blueprint
                    </Link>
                    <Link
                      href="/valueboostingsolutions/vcfundingsupport"
                      className="block px-3 py-2 text-gray-900 hover:text-[#A5292A] text-sm"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      VC Funding Support
                    </Link>
                    <Link
                      href="/valueboostingsolutions/pitchdeckservices"
                      className="block px-3 py-2 text-gray-900 hover:text-[#A5292A] text-sm"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Pitch Deck Services
                    </Link>
                    <Link
                      href="/valueboostingsolutions/cybersecurityservices"
                      className="block px-3 py-2 text-gray-900 hover:text-[#A5292A] text-sm"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Cybersecurity Compliance Services
                    </Link>
                    
                  </div>
                )}
              </div>

              <Link
                className={`block px-3 py-2 font-bold ${
                  page === "thoughtleadership"
                    ? "text-[#A5292A]"
                    : "text-gray-900 hover:text-[#A5292A]"
                }`}
                href="/thoughtleadership"
                onClick={() => setIsMenuOpen(false)}
              >
                Thought Leadership
              </Link>

              <Link
                className={`block px-3 py-2 font-bold ${
                  page === "contact"
                    ? "text-[#A5292A]"
                    : "text-gray-900 hover:text-[#A5292A]"
                }`}
                href="/contact"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
