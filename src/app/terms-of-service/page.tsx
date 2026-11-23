import { notFound } from 'next/navigation'
import { getLegalPolicyBySlug } from '@/lib/legal-policies'
import LegalPolicyPageView from '@/components/LegalPolicy/LegalPolicyPageView'

export default async function TermsOfService() {
  const policy = await getLegalPolicyBySlug('terms-of-service')
  if (!policy) notFound()
  return <LegalPolicyPageView policy={policy} />
}
