import { z } from 'zod'

export const createVisitaSchema = z.object({
  pacienteId: z.coerce.number().min(1, 'Paciente requerido'),
  medicoId: z.coerce.number().min(1, 'Médico requerido'),
  fecha: z.string().min(1, 'Fecha requerida'),
  hora: z.string().min(1, 'Hora requerida'),
})

export const updateVisitaSchema = createVisitaSchema.partial()

export type CreateVisitaInput = z.infer<typeof createVisitaSchema>
export type UpdateVisitaInput = z.infer<typeof updateVisitaSchema>