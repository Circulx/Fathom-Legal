import type { Metadata } from "next";

// Self-referencing canonical for this page (the root layout's canonical "/"
// would otherwise point this page to the homepage).
// Title/description are not set here because the SEO document gives none for this page.
export const metadata: Metadata = {
  alternates: {
    canonical: "/valueboostingsolutions/vcfundingsupport",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
