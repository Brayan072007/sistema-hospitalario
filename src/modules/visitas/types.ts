export interface Visita {
  visitaId: number;
  pacienteId: number;
  medicoId: number;
  fecha: string;
  hora: string;
}
export interface DetalleVisita {
  detalleVisitaId: number;
  visitaId: number;
  motivoId: number;
  diagnostico: string;
}
export interface SignoVital {
  signoVitalId: number;
  visitaId: number;
  frecuenciaCardiaca: number;
  presionArterial: string;
  frecuenciaRespiratoria: number;
  temperatura: number;
  saturacionOxigeno: number;
}
export interface VisitaCompleta extends Visita {
  paciente: { nombre: string; apellido: string; telefono: string };
  medico: { nombre: string; apellido: string; especialidad: string };
  detalle?: DetalleVisita & { motivoDescripcion: string };
  signosVitales?: Omit<SignoVital, "signoVitalId" | "visitaId">;
}
export interface CreateVisitaCompletaDTO {
  pacienteId: number;
  medicoId: number;
  fecha: string;
  hora: string;
  motivoId?: number;
  diagnostico?: string;
  signosVitales?: {
    frecuenciaCardiaca: number;
    presionArterial: string;
    frecuenciaRespiratoria: number;
    temperatura: number;
    saturacionOxigeno: number;
  };
}
export interface Visita {
  visitaId: number
  pacienteId: number
  medicoId: number
  fecha: string
  hora: string
}

export interface VisitaCompleta extends Visita {
  paciente: { nombre: string; apellido: string; telefono: string }
  medico: { nombre: string; apellido: string; especialidad: string }
}

export interface CreateVisitaDTO {
  pacienteId: number
  medicoId: number
  fecha: string
  hora: string
}

export interface CreateVisitaCompletaDTO extends CreateVisitaDTO {
  motivoId?: number
  diagnostico?: string
  signosVitales?: {
    frecuenciaCardiaca: number
    presionArterial: string
    frecuenciaRespiratoria: number
    temperatura: number
    saturacionOxigeno: number
  }
}