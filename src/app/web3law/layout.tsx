import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Web3 Lawyers & Crypto Compliance Services | Fathom Legal",
  description:
    "Get expert Web3 legal advice and crypto compliance services from Fathom Legal. Protect your business and navigate blockchain regulations. Contact us today!",
  alternates: {
    canonical: "/web3law",
  },
  openGraph: {
    title: "Web3 Lawyers & Crypto Compliance Services | Fathom Legal",
    description:
      "Get expert Web3 legal advice and crypto compliance services from Fathom Legal. Protect your business and navigate blockchain regulations. Contact us today!",
    url: "/web3law",
    siteName: "Fathom Legal",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
