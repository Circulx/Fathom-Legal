import React from "react";
import HighlightTitle from "./HighlightTitle";

type Background = "white" | "gray" | "light";

const bgClass: Record<Background, string> = {
  white: "bg-white",
  gray: "bg-gray-100",
  light: "bg-gray-50",
};

export interface ContentSectionProps {
  title: string;
  /** Part of the title to show in brand red */
  highlight?: string;
  paragraphs: string[];
  headingLevel?: "h2" | "h3";
  bg?: Background;
  id?: string;
  children?: React.ReactNode;
}

/**
 * Full-width text section used for the new SEO content blocks
 * (heading + one or more paragraphs).
 */
export default function ContentSection({
  title,
  highlight,
  paragraphs,
  headingLevel = "h2",
  bg = "white",
  id,
  children,
}: ContentSectionProps) {
  const Heading = headingLevel;
  return (
    <section id={id} className={`py-12 sm:py-16 lg:py-20 ${bgClass[bg]}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="w-16 h-1 rounded-full mx-auto mb-6" style={{ backgroundColor: "#A5292A" }}></div>
          <Heading className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
            <HighlightTitle text={title} highlight={highlight} />
          </Heading>
          <div className="space-y-4">
            {paragraphs.map((p, i) => (
              <p key={i} className="text-base sm:text-lg text-gray-600 leading-relaxed">
                {p}
              </p>
            ))}
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}
