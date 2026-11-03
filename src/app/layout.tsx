import type { Metadata } from 'next'
import Script from 'next/script'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import ClientSessionProvider from '@/components/ClientSessionProvider'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.fathomlegal.com').replace(/\/$/, '')
const GA_MEASUREMENT_ID = 'G-RYR0EQTYDK'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Fathom Legal',
  description: 'Facilitating commercial legal solutions with expertise across diverse practice areas and sectors.',
  keywords: 'legal services, corporate law, startup advisory, dispute resolution, intellectual property',
  alternates: {
    canonical: '/',
  },
  // Google Search Console verification -> renders
  // <meta name="google-site-verification" content="8QS54ucEj5omoO7FMbg8bDc3Cavh_WABYHUpA-3KUSE" />
  verification: {
    google: '8QS54ucEj5omoO7FMbg8bDc3Cavh_WABYHUpA-3KUSE',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/cropped-icon-red-192x192.png" />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-inter antialiased`}>
        {/* Google tag (gtag.js) - Google Analytics 4 */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}');
            `,
          }}
        />
        <Script
          id="microsoft-clarity"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "typ3jxi703");
            `,
          }}
        />
        <ClientSessionProvider>
          {children}
        </ClientSessionProvider>
      </body>
    </html>
  )
}
