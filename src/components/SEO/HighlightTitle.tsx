import React from "react";

/**
 * Renders a heading text and colours the `highlight` part in the brand red
 * (same visual style used across existing Fathom Legal headings).
 * If `highlight` is not found inside `text`, the text is rendered as-is.
 */
export default function HighlightTitle({
  text,
  highlight,
}: {
  text: string;
  highlight?: string;
}) {
  if (!highlight) return <>{text}</>;
  const index = text.indexOf(highlight);
  if (index === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, index)}
      <span style={{ color: "#A5292A" }}>{highlight}</span>
      {text.slice(index + highlight.length)}
    </>
  );
}
