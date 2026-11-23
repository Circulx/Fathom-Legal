import type { Metadata } from 'next'
import HomePageClient from '@/components/Home/HomePageClient'
import { homeFaqs } from '@/components/Home/homeFaqs'

export const metadata: Metadata = {
  title: 'Startup & Corporate Law Firm in India | Fathom Legal',
  description:
    'Explore Fathom Legal, a trusted corporate law firm in India offering business legal services, startup advisory and dispute resolution. Contact us today!',
  alternates: {
    canonical: '/',
  },
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: homeFaqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <HomePageClient />
    </>
  )
}
