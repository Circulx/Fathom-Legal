import React from "react";

/**
 * A white content card (heading + paragraph) placed between the existing
 * red/image service blocks on the service pages (Dispute Resolution,
 * Intellectual Property, Real Estate). Uses the same horizontal margins
 * as those blocks so it lines up with them.
 */
export default function InlineContentBlock({
  title,
  paragraphs,
  headingLevel = "h3",
  className = "",
}: {
  title: string;
  paragraphs: string[];
  headingLevel?: "h2" | "h3";
  className?: string;
}) {
  const Heading = headingLevel;
  return (
    <div
      className={`bg-white p-6 sm:p-8 lg:p-12 border border-gray-200 border-l-4 shadow-sm ${className}`}
      style={{ borderLeftColor: "#A5292A" }}
    >
      <Heading className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
        {title}
      </Heading>
      <div className="space-y-4">
        {paragraphs.map((p, i) => (
          <p key={i} className="text-sm sm:text-base text-gray-600 leading-relaxed">
            {p}
          </p>
        ))}
      </div>
    </div>
  );
}
