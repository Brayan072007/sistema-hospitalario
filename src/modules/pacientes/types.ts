export interface Paciente {
  pacienteId: number;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  sexo: "M" | "F";
  direccion: string;
  telefono: string;
  correoElectronico: string;
}
export type CreatePacienteDTO = Omit<Paciente, "pacienteId">;
export type UpdatePacienteDTO = Partial<CreatePacienteDTO>;
export interface PacienteFilters { nombre?: string; apellido?: string; sexo?: "M" | "F"; }