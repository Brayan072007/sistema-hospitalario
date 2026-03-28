import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Stethoscope } from "lucide-react";

export default async function EspecialidadesPage() {
  const supabase = await createServerSupabaseClient();
  const { data: especialidades, error } = await supabase
    .from("especialidades")
    .select("*")
    .order("nombre");

  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-1">Especialidades</h1>
        <p className="text-gray-500">Especialidades médicas registradas</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          Error: {error.message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {(especialidades || []).map((e) => (
          <div key={e.especialidadid} className="card flex items-center gap-3 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Stethoscope size={20} className="text-indigo-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{e.nombre}</p>
              <p className="text-xs text-gray-400">ID: {e.especialidadid}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}