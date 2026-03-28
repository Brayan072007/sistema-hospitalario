"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2, Stethoscope, Users, UserRound,
  ClipboardList, Pill, FileText, FlaskConical,
  BedDouble, LayoutDashboard,
} from "lucide-react";
import clsx from "clsx";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/hospitales", label: "Hospitales", icon: Building2 },
  { href: "/dashboard/especialidades", label: "Especialidades", icon: Stethoscope },
  { href: "/dashboard/medicos", label: "Medicos", icon: UserRound },
  { href: "/dashboard/pacientes", label: "Pacientes", icon: Users },
  { href: "/dashboard/visitas", label: "Visitas", icon: ClipboardList },
  { href: "/dashboard/medicamentos", label: "Medicamentos", icon: Pill },
  { href: "/dashboard/formulas", label: "Formulas", icon: FileText },
  { href: "/dashboard/examenes", label: "Examenes", icon: FlaskConical },
  { href: "/dashboard/incapacidades", label: "Incapacidades", icon: BedDouble },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Building2 size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-900">SistemaHosp</h1>
            <p className="text-xs text-gray-500">SENA ADSO</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={clsx(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150",
              pathname === href
                ? "bg-blue-50 text-blue-700"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            )}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <p className="text-xs text-gray-400 text-center">v1.0.0 - Next.js 16</p>
      </div>
    </aside>
  );
  
}
import LogoutButton from '@/components/ui/LogoutButton'

// Dentro del sidebar, al final de la lista de links:
<div className="mt-auto p-4 border-t border-gray-200">
  <LogoutButton />
</div>