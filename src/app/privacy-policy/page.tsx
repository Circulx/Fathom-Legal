import { notFound } from 'next/navigation'
import { getLegalPolicyBySlug } from '@/lib/legal-policies'
import LegalPolicyPageView from '@/components/LegalPolicy/LegalPolicyPageView'

export default async function PrivacyPolicy() {
  const policy = await getLegalPolicyBySlug('privacy-policy')
  if (!policy) notFound()
  return <LegalPolicyPageView policy={policy} />
}
