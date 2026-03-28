"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

export default function EditHospitalForm({ hospital }: { hospital: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nombre: hospital.nombre,
    direccion: hospital.direccion,
    nit: hospital.nit,
    telefono: hospital.telefono,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase
      .from("hospitales")
      .update(form)
      .eq("hospitalid", hospital.hospitalid);

    if (error) {
      toast.error("Error al actualizar: " + error.message);
    } else {
      toast.success("Hospital actualizado exitosamente");
      router.push("/dashboard/hospitales");
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre *</label>
        <input
          type="text" required className="input-field"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Direccion *</label>
        <input
          type="text" required className="input-field"
          value={form.direccion}
          onChange={(e) => setForm({ ...form, direccion: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">NIT *</label>
          <input
            type="text" required className="input-field"
            value={form.nit}
            onChange={(e) => setForm({ ...form, nit: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Telefono *</label>
          <input
            type="tel" required className="input-field"
            value={form.telefono}
            onChange={(e) => setForm({ ...form, telefono: e.target.value })}
          />
        </div>
      </div>
      <div className="flex gap-3 pt-4">
        <button type="submit" disabled={loading} className="btn-primary flex-1">
          {loading ? "Guardando..." : "Actualizar Hospital"}
        </button>
      </div>
    </form>
  );
}