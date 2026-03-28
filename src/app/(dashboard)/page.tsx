import dynamic from 'next/dynamic'

const RealtimeVisitas = dynamic(
  () => import('@/components/ui/RealtimeVisitas'),
  { ssr: false }
)

export default function DashboardPage() {
  return (
    <div style={{ padding: 40 }}>
      <h1>Dashboard</h1>
      <RealtimeVisitas />
    </div>
  )
}