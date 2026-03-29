/**
 * @file src/modules/formulas/formula.schema.ts
 * @description Esquemas Zod para validación de fórmulas médicas
 * @principle SRP - solo validación del módulo de fórmulas
 */

import { z } from 'zod'

export const CreateDetalleFormulaSchema = z.object({
  medicamentoid: z.coerce.number().positive('Seleccione un medicamento'),
  presentacion: z.string().min(2, 'Presentación requerida'),
  posologia: z.string().min(2, 'Posología requerida'),
  periodoUso: z.string().min(1, 'Período de uso requerido'),
  periodicidadUso: z.string().min(1, 'Periodicidad requerida'),
})

export const CreateFormulaSchema = z.object({
  tratamientoId: z.coerce.number().positive('Seleccione un tratamiento'),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida'),
  detalles: z.array(CreateDetalleFormulaSchema).min(1, 'Agregue al menos un medicamento'),
})

export type CreateFormulaInput = z.infer<typeof CreateFormulaSchema>