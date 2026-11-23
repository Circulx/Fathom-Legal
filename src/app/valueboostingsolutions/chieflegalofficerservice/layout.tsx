import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Virtual Chief Legal Officer Services India | Fathom Legal",
  description:
    "Secure executive-level legal counsel with Fathom Legal's virtual chief legal officer services in India. Strategic governance, compliance, and growth advisory.",
  alternates: {
    canonical: "/valueboostingsolutions/chieflegalofficerservice",
  },
  openGraph: {
    title: "Virtual Chief Legal Officer Services India | Fathom Legal",
    description:
      "Secure executive-level legal counsel with Fathom Legal's virtual chief legal officer services in India. Strategic governance, compliance, and growth advisory.",
    url: "/valueboostingsolutions/chieflegalofficerservice",
    siteName: "Fathom Legal",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
