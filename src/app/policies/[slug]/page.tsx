import { notFound } from 'next/navigation'
import { isBuiltinPolicySlug } from '@/lib/legal-policy-meta'
import { getLegalPolicyBySlug } from '@/lib/legal-policies'
import LegalPolicyPageView from '@/components/LegalPolicy/LegalPolicyPageView'

export default async function CustomPolicyPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  if (isBuiltinPolicySlug(slug)) notFound()

  const policy = await getLegalPolicyBySlug(slug)
  if (!policy) notFound()

  return <LegalPolicyPageView policy={policy} />
}
