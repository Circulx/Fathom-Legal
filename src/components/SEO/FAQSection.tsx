'use client'

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

export interface FAQItem {
  question: string;
  /** Visible answer. Can be plain text or JSX. */
  answer: React.ReactNode;
  /** Plain-text answer for the FAQPage schema. Required when `answer` is JSX. */
  schemaAnswer?: string;
}

type Background = "white" | "gray" | "light";

const bgClass: Record<Background, string> = {
  white: "bg-white",
  gray: "bg-gray-100",
  light: "bg-gray-50",
};

/**
 * "Frequently Asked Questions" accordion (same look as the existing Web3 FAQ)
 * plus FAQPage JSON-LD structured data so Google can read the questions.
 */
export default function FAQSection({
  items,
  bg = "white",
  id = "faq",
}: {
  items: FAQItem[];
  bg?: Background;
  id?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text:
          item.schemaAnswer ??
          (typeof item.answer === "string" ? item.answer : ""),
      },
    })),
  };

  return (
    <section id={id} className={`py-12 sm:py-16 lg:py-20 ${bgClass[bg]}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-3xl font-bold text-gray-800 mb-8 text-center">
            Frequently Asked <span style={{ color: "#A5292A" }}>Questions</span>
          </h2>

          <div className="space-y-4">
            {items.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={index} className="border border-gray-200 rounded-lg bg-white">
                  <button
                    type="button"
                    onClick={() => toggle(index)}
                    aria-expanded={isOpen}
                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="text-base sm:text-lg font-medium text-gray-800">
                      {item.question}
                    </h3>
                    {isOpen ? (
                      <Minus className="w-6 h-6 text-[#A5292A] flex-shrink-0" />
                    ) : (
                      <Plus className="w-6 h-6 text-[#A5292A] flex-shrink-0" />
                    )}
                  </button>
                  {/* Answer stays in the HTML (hidden when closed) so search engines can read it */}
                  <div className={`px-6 pb-4 ${isOpen ? "block" : "hidden"}`}>
                    {typeof item.answer === "string" ? (
                      <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                    ) : (
                      item.answer
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
