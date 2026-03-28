import { createServerSupabaseClient } from "@/lib/supabase/server";
import { FlaskConical, Calendar } from "lucide-react";

export default async function ExamenesPage() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("orden_examenes")
    .select(`
      ordenexamenid, fecha,
      detallesexamenes(detalleexamenid, tipoexamen, nombreexamen, indicaciones)
    `)
    .order("fecha", { ascending: false });

  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-1">Ordenes de Examenes</h1>
        <p className="text-gray-500">Examenes de laboratorio ordenados</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          Error: {error.message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(data || []).map((o: any) => (
          <div key={o.ordenexamenid} className="card hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                <FlaskConical size={20} className="text-teal-600" />
              </div>
              <div>
                <h3 className="font-semibold">Orden #{o.ordenexamenid}</h3>
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar size={12} />
                  {o.fecha}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {(o.detallesexamenes || []).map((d: any) => (
                <div key={d.detalleexamenid} className="bg-gray-50 rounded-lg p-3 text-sm">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-gray-900">{d.nombreexamen}</p>
                    <span className="badge badge-blue">{d.tipoexamen}</span>
                  </div>
                  <p className="text-xs text-gray-500">{d.indicaciones}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {(!data || data.length === 0) && !error && (
        <div className="text-center py-16 text-gray-400">
          <FlaskConical size={48} className="mx-auto mb-4 opacity-30" />
          <p>No hay ordenes de examenes registradas.</p>
        </div>
      )}
    </div>
  );
}