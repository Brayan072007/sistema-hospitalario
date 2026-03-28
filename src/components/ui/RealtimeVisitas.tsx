'use client'

import { useEffect, useRef, useState } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase/client'

interface VisitaRealtime {
  visitaid: number
  fecha: string
  hora: string
  pacienteid: number
  medicoid: number
}

export default function RealtimeVisitas() {
  const [visitas, setVisitas] = useState<VisitaRealtime[]>([])
  const [connected, setConnected] = useState(false)
  const supabase = useRef(createBrowserSupabaseClient()).current

  useEffect(() => {
    const loadVisitas = async () => {
      const { data } = await supabase
        .from('visitas')
        .select('*')
        .order('fecha', { ascending: false })
        .limit(5)
      if (data) setVisitas(data)
    }

    loadVisitas()

    const channel = supabase
      .channel('visitas-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'visitas' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setVisitas(prev => [payload.new as VisitaRealtime, ...prev.slice(0, 4)])
          }
          if (payload.eventType === 'DELETE') {
            setVisitas(prev => prev.filter(v => v.visitaid !== (payload.old as any).visitaid))
          }
        }
      )
      .subscribe((status) => {
        setConnected(status === 'SUBSCRIBED')
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Visitas en Tiempo Real</h2>

        {/* Badge con estilos inline — compatible con Tailwind v4 */}
        <span style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '12px',
          fontWeight: 500,
          padding: '2px 10px',
          borderRadius: '9999px',
          backgroundColor: connected ? '#dcfce7' : '#f3f4f6',
          color: connected ? '#15803d' : '#6b7280',
        }}>
          <span style={{
            display: 'inline-block',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: connected ? '#22c55e' : '#9ca3af',
          }} />
          {connected ? 'En vivo' : 'Conectando...'}
        </span>
      </div>

      {visitas.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">No hay visitas registradas</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {visitas.map((v) => (
            <li key={v.visitaid} className="py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Visita #{v.visitaid}</p>
                <p className="text-xs text-gray-400">Paciente ID: {v.pacienteid} · Médico ID: {v.medicoid}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">{v.fecha}</p>
                <p className="text-xs text-gray-400">{v.hora}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}