import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Building2, Users, UserRound, ClipboardList } from "lucide-react";
import RealtimeVisitas from "@/components/ui/RealtimeVisitas";

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();

  const today = new Date().toISOString().split("T")[0];

  const [h, m, p, v] = await Promise.all([
    supabase.from("hospitales").select("*", { count: "exact", head: true }),
    supabase.from("medicos").select("*", { count: "exact", head: true }),
    supabase.from("pacientes").select("*", { count: "exact", head: true }),
    supabase.from("visitas").select("*", { count: "exact", head: true }).eq("fecha", today),
  ]);

  const stats = [
    { label: "Hospitales", value: h.count ?? 0, icon: Building2, bg: "bg-blue-100", text: "text-blue-600" },
    { label: "Médicos", value: m.count ?? 0, icon: UserRound, bg: "bg-indigo-100", text: "text-indigo-600" },
    { label: "Pacientes", value: p.count ?? 0, icon: Users, bg: "bg-green-100", text: "text-green-600" },
    { label: "Visitas Hoy", value: v.count ?? 0, icon: ClipboardList, bg: "bg-orange-100", text: "text-orange-600" },
  ];

  return (
    <div>
      <h1 className="mb-2">Dashboard</h1>
      <p className="text-gray-500 mb-8">Sistema de Gestión Hospitalaria — SENA ADSO</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(({ label, value, icon: Icon, bg, text }) => (
          <div key={label} className="card flex items-center gap-4">
            <div className={`p-3 rounded-xl ${bg}`}>
              <Icon size={24} className={text} />
            </div>
            <div>
              <p className="text-sm text-gray-500">{label}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <RealtimeVisitas />
      </div>
    </div>
  );
}