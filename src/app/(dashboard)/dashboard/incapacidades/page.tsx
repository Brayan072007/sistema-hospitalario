import { createServerSupabaseClient } from "@/lib/supabase/server";
import { BedDouble, Calendar } from "lucide-react";

export default async function IncapacidadesPage() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("incapacidades")
    .select(`
      incapacidadid, fecha,
      detallesincapacidades(
        detalleid, descripcion, numerodias, fechainicio, fechafin
      )
    `)
    .order("fecha", { ascending: false });

  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-1">Incapacidades</h1>
        <p className="text-gray-500">Incapacidades medicas emitidas</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          Error: {error.message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(data || []).map((i: any) => (
          <div key={i.incapacidadid} className="card hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <BedDouble size={20} className="text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold">Incapacidad #{i.incapacidadid}</h3>
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar size={12} />
                  {i.fecha}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {(i.detallesincapacidades || []).map((d: any) => (
                <div key={d.detalleid} className="bg-gray-50 rounded-lg p-3 text-sm">
                  <p className="font-medium text-gray-900">{d.descripcion}</p>
                  <div className="flex gap-4 mt-1 text-xs text-gray-500">
                    <span className="badge badge-red">{d.numerodias} dias</span>
                    <span>{d.fechainicio} → {d.fechafin}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {(!data || data.length === 0) && !error && (
        <div className="text-center py-16 text-gray-400">
          <BedDouble size={48} className="mx-auto mb-4 opacity-30" />
          <p>No hay incapacidades registradas.</p>
        </div>
      )}
    </div>
  );
}