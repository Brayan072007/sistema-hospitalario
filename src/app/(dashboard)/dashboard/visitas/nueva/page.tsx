"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import Link from "next/link";
import { ArrowLeft, ClipboardList } from "lucide-react";
import toast from "react-hot-toast";

export default function NuevaVisitaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [medicos, setMedicos] = useState<any[]>([]);
  const [motivos, setMotivos] = useState<any[]>([]);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    supabase.from("pacientes").select("pacienteid, nombre, apellido").order("apellido")
      .then(({ data }) => setPacientes(data || []));
    supabase.from("medicos").select("medicoid, nombre, apellido").order("apellido")
      .then(({ data }) => setMedicos(data || []));
    supabase.from("motivosvisitas").select("motivoid, descripcion")
      .then(({ data }) => setMotivos(data || []));
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const supabase = createBrowserSupabaseClient();

    // 1. Crear la visita
    const { data: visita, error: visitaError } = await supabase
      .from("visitas")
      .insert({
        pacienteid: Number(form.get("pacienteId")),
        medicoid: Number(form.get("medicoId")),
        fecha: form.get("fecha") as string,
        hora: form.get("hora") as string,
      })
      .select("visitaid")
      .single();

    if (visitaError || !visita) {
      toast.error("Error al crear visita: " + visitaError?.message);
      setLoading(false);
      return;
    }

    const visitaId = visita.visitaid;

    // 2. Crear detalle de visita si hay motivo y diagnostico
    const motivoId = form.get("motivoId");
    const diagnostico = form.get("diagnostico") as string;
    if (motivoId && diagnostico) {
      await supabase.from("detallesvisitas").insert({
        visitaid: visitaId,
        motivoid: Number(motivoId),
        diagnostico,
      });
    }

    // 3. Crear signos vitales si se llenaron
    const frecuenciaCardiaca = form.get("frecuenciaCardiaca");
    const presionArterial = form.get("presionArterial");
    if (frecuenciaCardiaca && presionArterial) {
      await supabase.from("signosvitales").insert({
        visitaid: visitaId,
        frecuenciacardiaca: Number(frecuenciaCardiaca),
        presionarterial: presionArterial as string,
        frecuenciarespiratoria: Number(form.get("frecuenciaRespiratoria")),
        temperatura: Number(form.get("temperatura")),
        saturacionoxigeno: Number(form.get("saturacionOxigeno")),
      });
    }

    toast.success("Visita registrada exitosamente");
    router.push("/dashboard/visitas");
    router.refresh();
    setLoading(false);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/visitas" className="btn-secondary p-2">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="mb-0">Nueva Visita</h1>
          <p className="text-gray-500">Registrar una nueva visita medica</p>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
          <ClipboardList size={24} className="text-blue-600" />
          <h2 className="text-lg font-semibold">Datos de la Visita</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Paciente *</label>
            <select name="pacienteId" required className="input-field">
              <option value="">Seleccionar paciente...</option>
              {pacientes.map((p) => (
                <option key={p.pacienteid} value={p.pacienteid}>
                  {p.nombre} {p.apellido}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Medico *</label>
            <select name="medicoId" required className="input-field">
              <option value="">Seleccionar medico...</option>
              {medicos.map((m) => (
                <option key={m.medicoid} value={m.medicoid}>
                  Dr. {m.nombre} {m.apellido}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Fecha *</label>
              <input name="fecha" type="date" required className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Hora *</label>
              <input name="hora" type="time" required className="input-field" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Motivo de Visita</label>
            <select name="motivoId" className="input-field">
              <option value="">Seleccionar motivo...</option>
              {motivos.map((m) => (
                <option key={m.motivoid} value={m.motivoid}>
                  {m.descripcion}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Diagnostico</label>
            <textarea
              name="diagnostico"
              rows={3}
              placeholder="Descripcion del diagnostico..."
              className="input-field resize-none"
            />
          </div>

          {/* Signos Vitales */}
          <div className="border-t border-gray-100 pt-4">
            <h3 className="font-medium text-gray-700 mb-4">Signos Vitales</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1.5">Frecuencia Cardiaca (bpm)</label>
                <input name="frecuenciaCardiaca" type="number" placeholder="72" className="input-field" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1.5">Presion Arterial</label>
                <input name="presionArterial" type="text" placeholder="120/80" className="input-field" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1.5">Frec. Respiratoria</label>
                <input name="frecuenciaRespiratoria" type="number" placeholder="16" className="input-field" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1.5">Temperatura (°C)</label>
                <input name="temperatura" type="number" step="0.1" placeholder="36.5" className="input-field" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1.5">Saturacion O2 (%)</label>
                <input name="saturacionOxigeno" type="number" step="0.1" placeholder="98.0" className="input-field" />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? "Guardando..." : "Guardar Visita"}
            </button>
            <Link href="/dashboard/visitas" className="btn-secondary flex-1 text-center">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}