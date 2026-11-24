import type { Metadata } from "next";
import HomePage from "@/components/Home/HomePage";

export const metadata: Metadata = {
  title: "Startup & Corporate Law Firm in India | Fathom Legal",
  description:
    "Explore Fathom Legal, a trusted corporate law firm in India offering business legal services, startup advisory and dispute resolution. Contact us today!",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Startup & Corporate Law Firm in India | Fathom Legal",
    description:
      "Explore Fathom Legal, a trusted corporate law firm in India offering business legal services, startup advisory and dispute resolution. Contact us today!",
    url: "/",
    siteName: "Fathom Legal",
    type: "website",
  },
};

export default function Page() {
  return <HomePage />;
}
