import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Pill } from "lucide-react";

export default async function MedicamentosPage() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("medicamentos")
    .select("*")
    .order("nombre");

  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-1">Medicamentos</h1>
        <p className="text-gray-500">Catalogo de medicamentos</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          Error: {error.message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(data || []).map((m: any) => (
          <div key={m.medicamentoid} className="card hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Pill size={20} className="text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold">{m.nombre}</h3>
                <span className="badge badge-blue">{m.unidades}</span>
              </div>
            </div>
            <p className="text-sm text-gray-600">{m.prescripcion}</p>
            <p className="text-xs text-gray-400 mt-2">{m.descripcion}</p>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-500">Stock: <strong>{m.cantidad}</strong> {m.unidades}</span>
            </div>
          </div>
        ))}
      </div>

      {(!data || data.length === 0) && !error && (
        <div className="text-center py-16 text-gray-400">
          <Pill size={48} className="mx-auto mb-4 opacity-30" />
          <p>No hay medicamentos registrados.</p>
        </div>
      )}
    </div>
  );
}