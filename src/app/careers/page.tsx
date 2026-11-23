'use client'

import React from "react";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";

export default function Careers() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar page="careers" />
      
     

      {/* Coming Soon Section */}
      <section className="py-60 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white p-12 rounded-xl shadow-sm">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-6">Thanks for your visit!</h2>
              <p className="text-base font-inter sm:text-lg md:text-xl text-gray-600 mb-8">
              We’re preparing new roles and opportunities. Check back shortly or reach out to us for inquiries.
              </p>
              <div className="mt-8">
                <a
                  href="/contact"
                  className="inline-block bg-[#A5292A] text-white px-8 py-3 font-semibold hover:bg-[#8B1E1E] transition-all duration-300 uppercase tracking-wide"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

