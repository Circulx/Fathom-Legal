import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Legal Services for Tech Companies & Startups | Fathom Legal",
  description:
    "Get tailored legal services for tech companies and startups with Fathom Legal’s Tech Legal Blueprint. Explore our solutions and get started today!",
  alternates: {
    canonical: "/valueboostingsolutions/techlegalblueprint",
  },
  openGraph: {
    title: "Legal Services for Tech Companies & Startups | Fathom Legal",
    description:
      "Get tailored legal services for tech companies and startups with Fathom Legal’s Tech Legal Blueprint. Explore our solutions and get started today!",
    url: "/valueboostingsolutions/techlegalblueprint",
    siteName: "Fathom Legal",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
