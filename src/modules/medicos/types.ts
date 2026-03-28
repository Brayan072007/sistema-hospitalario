import type { Especialidad } from "../especialidades/types";
import type { Hospital } from "../hospitales/types";

export interface Medico {
  medicoId: number;
  nombre: string;
  apellido: string;
  especialidadId: number;
  hospitalId: number;
  telefono: string;
  correoElectronico: string;
}
export interface MedicoConRelaciones extends Medico {
  especialidad: Especialidad;
  hospital: Hospital;
}
export type CreateMedicoDTO = Omit<Medico, "medicoId">;
export type UpdateMedicoDTO = Partial<CreateMedicoDTO>;