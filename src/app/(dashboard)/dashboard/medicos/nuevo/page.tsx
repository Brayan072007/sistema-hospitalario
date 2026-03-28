"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import Link from "next/link";
import { ArrowLeft, UserRound } from "lucide-react";
import toast from "react-hot-toast";

export default function NuevoMedicoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [especialidades, setEspecialidades] = useState<any[]>([]);
  const [hospitales, setHospitales] = useState<any[]>([]);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    supabase.from("especialidades").select("especialidadid, nombre").order("nombre")
      .then(({ data }) => setEspecialidades(data || []));
    supabase.from("hospitales").select("hospitalid, nombre").order("nombre")
      .then(({ data }) => setHospitales(data || []));
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const supabase = createBrowserSupabaseClient();

    const { error } = await supabase.from("medicos").insert({
      nombre: form.get("nombre") as string,
      apellido: form.get("apellido") as string,
      especialidadid: Number(form.get("especialidadId")),
      hospitalid: Number(form.get("hospitalId")),
      telefono: form.get("telefono") as string,
      correoelectronico: form.get("correo") as string,
    });

    if (error) {
      toast.error("Error: " + error.message);
    } else {
      toast.success("Medico registrado exitosamente");
      router.push("/dashboard/medicos");
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/medicos" className="btn-secondary p-2">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="mb-0">Nuevo Medico</h1>
          <p className="text-gray-500">Registrar un nuevo medico</p>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
          <UserRound size={24} className="text-indigo-600" />
          <h2 className="text-lg font-semibold">Datos del Medico</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre *</label>
              <input name="nombre" type="text" required placeholder="Juan" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Apellido *</label>
              <input name="apellido" type="text" required placeholder="Perez" className="input-field" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Especialidad *</label>
            <select name="especialidadId" required className="input-field">
              <option value="">Seleccionar especialidad...</option>
              {especialidades.map((e) => (
                <option key={e.especialidadid} value={e.especialidadid}>
                  {e.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Hospital *</label>
            <select name="hospitalId" required className="input-field">
              <option value="">Seleccionar hospital...</option>
              {hospitales.map((h) => (
                <option key={h.hospitalid} value={h.hospitalid}>
                  {h.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Telefono *</label>
            <input name="telefono" type="tel" required placeholder="3001234567" className="input-field" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Correo Electronico *</label>
            <input name="correo" type="email" required placeholder="medico@hospital.com" className="input-field" />
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? "Guardando..." : "Guardar Medico"}
            </button>
            <Link href="/dashboard/medicos" className="btn-secondary flex-1 text-center">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}