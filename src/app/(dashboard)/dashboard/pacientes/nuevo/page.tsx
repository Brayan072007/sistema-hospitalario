"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";
import toast from "react-hot-toast";

export default function NuevoPacientePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const supabase = createBrowserSupabaseClient();

    const { error } = await supabase.from("pacientes").insert({
      nombre: form.get("nombre") as string,
      apellido: form.get("apellido") as string,
      fechanacimiento: form.get("fechaNacimiento") as string,
      sexo: form.get("sexo") as string,
      direccion: form.get("direccion") as string,
      telefono: form.get("telefono") as string,
      correoelectronico: form.get("correo") as string,
    });

    if (error) {
      toast.error("Error: " + error.message);
    } else {
      toast.success("Paciente registrado exitosamente");
      router.push("/dashboard/pacientes");
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/pacientes" className="btn-secondary p-2">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="mb-0">Nuevo Paciente</h1>
          <p className="text-gray-500">Registrar un nuevo paciente</p>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
          <Users size={24} className="text-green-600" />
          <h2 className="text-lg font-semibold">Datos del Paciente</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre *</label>
              <input name="nombre" type="text" required placeholder="Carlos" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Apellido *</label>
              <input name="apellido" type="text" required placeholder="Martinez" className="input-field" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Fecha de Nacimiento *</label>
              <input name="fechaNacimiento" type="date" required className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Sexo *</label>
              <select name="sexo" required className="input-field">
                <option value="">Seleccionar...</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Direccion *</label>
            <input name="direccion" type="text" required placeholder="Calle 10 #20-30, Bogota" className="input-field" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Telefono *</label>
            <input name="telefono" type="tel" required placeholder="3101234567" className="input-field" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Correo Electronico *</label>
            <input name="correo" type="email" required placeholder="paciente@gmail.com" className="input-field" />
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? "Guardando..." : "Guardar Paciente"}
            </button>
            <Link href="/dashboard/pacientes" className="btn-secondary flex-1 text-center">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}