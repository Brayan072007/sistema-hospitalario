import { z } from 'zod'

export const createMedicoSchema = z.object({
  nombre: z.string().min(2, 'Nombre requerido'),
  apellido: z.string().min(2, 'Apellido requerido'),
  especialidadId: z.coerce.number().min(1, 'Especialidad requerida'),
  hospitalId: z.coerce.number().min(1, 'Hospital requerido'),
  telefono: z.string().min(7, 'Teléfono requerido'),
  correoElectronico: z.string().email('Email inválido'),
})

export const updateMedicoSchema = createMedicoSchema.partial()

export type CreateMedicoInput = z.infer<typeof createMedicoSchema>
export type UpdateMedicoInput = z.infer<typeof updateMedicoSchema>