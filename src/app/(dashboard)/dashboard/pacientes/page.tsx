import { createServerSupabaseClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Users, Plus, Phone, Mail, MapPin } from "lucide-react";

export default async function PacientesPage() {
  const supabase = await createServerSupabaseClient();
  const { data: pacientes, error } = await supabase
    .from("pacientes")
    .select("*")
    .order("apellido");

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="mb-1">Pacientes</h1>
          <p className="text-gray-500">Gestión de pacientes registrados</p>
        </div>
        <Link href="/dashboard/pacientes/nuevo" className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          Nuevo Paciente
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          Error: {error.message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(pacientes || []).map((p) => (
          <div key={p.pacienteid} className="card hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Users size={20} className="text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{p.nombre} {p.apellido}</h3>
                <span className={`badge ${p.sexo === "M" ? "badge-blue" : "badge-green"}`}>
                  {p.sexo === "M" ? "Masculino" : "Femenino"}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-gray-400" />
                <span>{p.direccion}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-gray-400" />
                <span>{p.telefono}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-gray-400" />
                <span>{p.correoelectronico}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(!pacientes || pacientes.length === 0) && !error && (
        <div className="text-center py-16 text-gray-400">
          <Users size={48} className="mx-auto mb-4 opacity-30" />
          <p>No hay pacientes registrados.</p>
        </div>
      )}
    </div>
  );
}