import AdminIdleTimeout from '@/components/AdminIdleTimeout'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminIdleTimeout />
      {children}
    </>
  )
}
