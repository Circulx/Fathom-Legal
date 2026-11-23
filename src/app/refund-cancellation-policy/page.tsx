import { notFound } from 'next/navigation'
import { getLegalPolicyBySlug } from '@/lib/legal-policies'
import LegalPolicyPageView from '@/components/LegalPolicy/LegalPolicyPageView'

export default async function RefundCancellationPolicy() {
  const policy = await getLegalPolicyBySlug('refund-cancellation-policy')
  if (!policy) notFound()
  return <LegalPolicyPageView policy={policy} />
}
