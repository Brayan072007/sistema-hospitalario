export interface Especialidad {
  especialidadId: number;
  nombre: string;
}
export type CreateEspecialidadDTO = Omit<Especialidad, "especialidadId">;