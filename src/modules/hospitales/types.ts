export interface Hospital {
  hospitalId: number;
  nombre: string;
  direccion: string;
  nit: string;
  telefono: string;
}
export type CreateHospitalDTO = Omit<Hospital, "hospitalId">;
export type UpdateHospitalDTO = Partial<CreateHospitalDTO>;
export interface HospitalFilters { nombre?: string; }