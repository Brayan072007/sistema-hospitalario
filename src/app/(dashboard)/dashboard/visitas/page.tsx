import { createServerSupabaseClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ClipboardList, Plus, Calendar, Clock } from "lucide-react";

export default async function VisitasPage() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("visitas")
    .select(`
      visitaid, fecha, hora,
      pacientes(nombre, apellido),
      medicos(nombre, apellido)
    `)
    .order("fecha", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="mb-1">Visitas</h1>
          <p className="text-gray-500">Registro de visitas medicas</p>
        </div>
        <Link href="/dashboard/visitas/nueva" className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          Nueva Visita
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          Error: {error.message}
        </div>
      )}

      <div className="card p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-gray-500 font-medium">ID</th>
              <th className="text-left px-6 py-3 text-gray-500 font-medium">Paciente</th>
              <th className="text-left px-6 py-3 text-gray-500 font-medium">Medico</th>
              <th className="text-left px-6 py-3 text-gray-500 font-medium">Fecha</th>
              <th className="text-left px-6 py-3 text-gray-500 font-medium">Hora</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(data || []).map((v: any) => (
              <tr key={v.visitaid} className="table-row">
                <td className="px-6 py-4 font-medium">#{v.visitaid}</td>
                <td className="px-6 py-4">
                  {v.pacientes?.nombre} {v.pacientes?.apellido}
                </td>
                <td className="px-6 py-4">
                  Dr. {v.medicos?.nombre} {v.medicos?.apellido}
                </td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} className="text-gray-400" />
                    {v.fecha}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-1">
                    <Clock size={14} className="text-gray-400" />
                    {v.hora}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(!data || data.length === 0) && !error && (
          <div className="text-center py-16 text-gray-400">
            <ClipboardList size={48} className="mx-auto mb-4 opacity-30" />
            <p>No hay visitas registradas.</p>
          </div>
        )}
      </div>
    </div>
  );
}