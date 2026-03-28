import { createServerSupabaseClient } from "@/lib/supabase/server";
import { FileText, Calendar } from "lucide-react";

export default async function FormulasPage() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("formulas")
    .select(`
      formulaid, fecha,
      tratamientos(tratamientoid, visitas(visitaid)),
      detallesformulas(
        detalleid, presentacion, posologia, periodouso, periodicidaduso,
        medicamentos(nombre, unidades)
      )
    `)
    .order("fecha", { ascending: false });

  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-1">Formulas Medicas</h1>
        <p className="text-gray-500">Recetas medicas emitidas</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          Error: {error.message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(data || []).map((f: any) => (
          <div key={f.formulaid} className="card hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText size={20} className="text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold">Formula #{f.formulaid}</h3>
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar size={12} />
                  {f.fecha}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {(f.detallesformulas || []).map((d: any) => (
                <div key={d.detalleid} className="bg-gray-50 rounded-lg p-3 text-sm">
                  <p className="font-medium text-gray-900">{d.medicamentos?.nombre}</p>
                  <p className="text-gray-500">{d.posologia}</p>
                  <p className="text-xs text-gray-400">Periodo: {d.periodouso} — Cada: {d.periodicidaduso}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {(!data || data.length === 0) && !error && (
        <div className="text-center py-16 text-gray-400">
          <FileText size={48} className="mx-auto mb-4 opacity-30" />
          <p>No hay formulas registradas.</p>
        </div>
      )}
    </div>
  );
}