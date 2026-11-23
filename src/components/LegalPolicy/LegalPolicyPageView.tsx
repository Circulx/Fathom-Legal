import { Navbar } from '@/components/Navbar'
import Footer from '@/components/Footer'
import { BlogContent } from '@/components/BlogContent'
import type { LegalPolicyDto } from '@/lib/legal-policies'

export default function LegalPolicyPageView({ policy }: { policy: LegalPolicyDto }) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar page={policy.navbarPage} />

      <section className="pt-28 pb-20 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('/contactusbg.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span style={{ color: '#A5292A' }}>{policy.heroTitle}</span>
            </h1>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <BlogContent content={policy.content} />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
