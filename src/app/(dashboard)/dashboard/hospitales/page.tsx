import Link from "next/link";
import { HospitalRepository } from "@/modules/hospitales/hospital.repository";
import { HospitalService } from "@/modules/hospitales/hospital.service";
import { Plus, Building2, Phone, MapPin, Hash } from "lucide-react";
import DeleteHospitalButton from "./DeleteHospitalButton";

export default async function HospitalesPage() {
  const service = new HospitalService(new HospitalRepository());
  const { data: hospitales, error } = await service.getAll();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="mb-1">Hospitales</h1>
          <p className="text-gray-500">Gestión de centros hospitalarios</p>
        </div>
        <Link href="/dashboard/hospitales/nuevo" className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          Nuevo Hospital
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          Error: {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(hospitales || []).map((hospital) => (
          <div key={hospital.hospitalId} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{hospital.nombre}</h3>
                  <span className="badge badge-blue">Activo</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-gray-400" />
                <span>{hospital.direccion}</span>
              </div>
              <div className="flex items-center gap-2">
                <Hash size={14} className="text-gray-400" />
                <span>NIT: {hospital.nit}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-gray-400" />
                <span>{hospital.telefono}</span>
              </div>
            </div>

            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
              <Link
                href={`/dashboard/hospitales/${hospital.hospitalId}/editar`}
                className="flex-1 text-center btn-secondary text-sm py-1.5"
              >
                Editar
              </Link>
              <DeleteHospitalButton id={hospital.hospitalId} nombre={hospital.nombre} />
            </div>
          </div>
        ))}
      </div>

      {(!hospitales || hospitales.length === 0) && !error && (
        <div className="text-center py-16 text-gray-400">
          <Building2 size={48} className="mx-auto mb-4 opacity-30" />
          <p>No hay hospitales registrados.</p>
          <Link href="/dashboard/hospitales/nuevo" className="btn-primary mt-4 inline-flex items-center gap-2">
            <Plus size={16} /> Agregar primero
          </Link>
        </div>
      )}
    </div>
  );
}