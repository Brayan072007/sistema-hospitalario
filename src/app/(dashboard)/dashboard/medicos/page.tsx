import { createServerSupabaseClient } from "@/lib/supabase/server";
import Link from "next/link";
import { UserRound, Plus, Phone, Mail } from "lucide-react";

export default async function MedicosPage() {
  const supabase = await createServerSupabaseClient();
  const { data: medicos, error } = await supabase
    .from("medicos")
    .select(`
      medicoid, nombre, apellido, telefono, correoelectronico,
      especialidades(nombre),
      hospitales(nombre)
    `)
    .order("apellido");

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="mb-1">Medicos</h1>
          <p className="text-gray-500">Cuerpo medico registrado</p>
        </div>
        <Link href="/dashboard/medicos/nuevo" className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          Nuevo Medico
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          Error: {error.message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(medicos || []).map((m: any) => (
          <div key={m.medicoid} className="card hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <UserRound size={20} className="text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Dr. {m.nombre} {m.apellido}</h3>
                <span className="badge badge-blue">{m.especialidades?.nombre}</span>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-gray-400" />
                <span>{m.telefono}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-gray-400" />
                <span>{m.correoelectronico}</span>
              </div>
              <p className="text-xs text-gray-400">{m.hospitales?.nombre}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}