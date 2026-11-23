import React from "react";
import HighlightTitle from "./HighlightTitle";

type Background = "white" | "gray" | "light";

const bgClass: Record<Background, string> = {
  white: "bg-white",
  gray: "bg-gray-100",
  light: "bg-gray-50",
};

export interface ContentBlock {
  title: string;
  highlight?: string;
  paragraphs: string[];
  /** Heading tag for this block (default h2) */
  headingLevel?: "h2" | "h3";
  /** Optional nested sub-blocks (rendered with h3) */
  subBlocks?: { title: string; paragraphs: string[] }[];
}

/**
 * A section that shows several heading + paragraph blocks as cards in a
 * two-column grid. Each block keeps its own heading tag (H2 by default),
 * so the heading structure requested in the SEO content document is kept.
 */
export default function ContentGrid({
  blocks,
  bg = "white",
  id,
}: {
  blocks: ContentBlock[];
  bg?: Background;
  id?: string;
}) {
  return (
    <section id={id} className={`py-12 sm:py-16 lg:py-20 ${bgClass[bg]}`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 px-0 sm:px-4 md:px-8 lg:px-20">
          {blocks.map((block, index) => {
            const Heading = block.headingLevel ?? "h2";
            const isLastOdd = blocks.length % 2 === 1 && index === blocks.length - 1;
            return (
              <div
                key={index}
                className={`bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100 border-l-4 hover:shadow-lg transition-all duration-300 ${
                  isLastOdd ? "md:col-span-2" : ""
                }`}
                style={{ borderLeftColor: "#A5292A" }}
              >
                <Heading className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
                  <HighlightTitle text={block.title} highlight={block.highlight} />
                </Heading>
                <div className="space-y-4">
                  {block.paragraphs.map((p, i) => (
                    <p key={i} className="text-sm sm:text-base text-gray-600 leading-relaxed">
                      {p}
                    </p>
                  ))}
                </div>
                {block.subBlocks?.map((sub, si) => (
                  <div key={si} className="mt-6 pt-6 border-t border-gray-100">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
                      {sub.title}
                    </h3>
                    <div className="space-y-3">
                      {sub.paragraphs.map((p, i) => (
                        <p key={i} className="text-sm sm:text-base text-gray-600 leading-relaxed">
                          {p}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
