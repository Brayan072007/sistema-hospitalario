export interface DetalleFormula {
  detalleid: number;
  presentacion: string;
  posologia: string;
  periodoUso: string;
  periodicidadUso: string;
  medicamento: {
    medicamentoid: number;
    nombre: string;
    prescripcion: string;
    unidades: string;
    descripcion: string;
    cantidad: number;
  };
}
export interface Formula {
  formulaid: number;
  tratamientoid: number;
  fecha: string;
  detalles: DetalleFormula[];
}
export interface CreateFormulaDetalleDTO {
  medicamentoid: number;
  presentacion: string;
  posologia: string;
  periodoUso: string;
  periodicidadUso: string;
}
export interface CreateFormulaDTO {
  tratamientoId: number;
  fecha: string;
  detalles?: CreateFormulaDetalleDTO[];
}