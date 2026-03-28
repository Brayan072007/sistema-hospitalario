import { createServerSupabaseClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowLeft, Building2 } from "lucide-react";
import EditHospitalForm from "./EditHospitalForm";

export default async function EditarHospitalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: hospital, error } = await supabase
    .from("hospitales")
    .select("*")
    .eq("hospitalid", Number(id))
    .single();

  if (error || !hospital) {
    return (
      <div className="text-center py-16">
        <p className="text-red-500">Hospital no encontrado.</p>
        <Link href="/dashboard/hospitales" className="btn-primary mt-4 inline-block">
          Volver
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/hospitales" className="btn-secondary p-2">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="mb-0">Editar Hospital</h1>
          <p className="text-gray-500">{hospital.nombre}</p>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
          <Building2 size={24} className="text-blue-600" />
          <h2 className="text-lg font-semibold">Actualizar Informacion</h2>
        </div>
        <EditHospitalForm hospital={hospital} />
      </div>
    </div>
  );
}