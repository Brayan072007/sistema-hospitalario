"use client";
import { useActionState } from "react";
import { createHospitalAction } from "@/modules/hospitales/hospital.actions";
import Link from "next/link";
import { ArrowLeft, Building2 } from "lucide-react";

export default function NuevoHospitalPage() {
  const [state, formAction, isPending] = useActionState(createHospitalAction, null);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/hospitales" className="btn-secondary p-2">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="mb-0">Nuevo Hospital</h1>
          <p className="text-gray-500">Registrar un nuevo centro hospitalario</p>
        </div>
      </div>

      {state && !state.success && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {state.message}
        </div>
      )}

      <div className="card">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
          <Building2 size={24} className="text-blue-600" />
          <h2 className="text-lg font-semibold">Información del Hospital</h2>
        </div>

        <form action={formAction} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Nombre del Hospital *
            </label>
            <input
              name="nombre" type="text" required
              placeholder="Ej: Hospital Central de Bogotá"
              className="input-field"
            />
            {state?.errors?.nombre && (
              <p className="text-red-500 text-xs mt-1">{state.errors.nombre[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Dirección *
            </label>
            <input
              name="direccion" type="text" required
              placeholder="Ej: Calle 123 #45-67, Bogotá"
              className="input-field"
            />
            {state?.errors?.direccion && (
              <p className="text-red-500 text-xs mt-1">{state.errors.direccion[0]}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                NIT *
              </label>
              <input
                name="nit" type="text" required
                placeholder="Ej: 800123456-7"
                className="input-field"
              />
              {state?.errors?.nit && (
                <p className="text-red-500 text-xs mt-1">{state.errors.nit[0]}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Teléfono *
              </label>
              <input
                name="telefono" type="tel" required
                placeholder="Ej: 6011234567"
                className="input-field"
              />
              {state?.errors?.telefono && (
                <p className="text-red-500 text-xs mt-1">{state.errors.telefono[0]}</p>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" disabled={isPending} className="btn-primary flex-1">
              {isPending ? "Guardando..." : "Guardar Hospital"}
            </button>
            <Link href="/dashboard/hospitales" className="btn-secondary flex-1 text-center">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}