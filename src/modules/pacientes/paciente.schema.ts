import { z } from 'zod'

export const createPacienteSchema = z.object({
  nombre: z.string().min(2, 'Nombre requerido'),
  apellido: z.string().min(2, 'Apellido requerido'),
  fechaNacimiento: z.string().min(1, 'Fecha de nacimiento requerida'),
  sexo: z.enum(['M', 'F'], { message: 'Sexo debe ser M o F' }),
  direccion: z.string().min(5, 'Dirección requerida'),
  telefono: z.string().min(7, 'Teléfono requerido'),
  correoElectronico: z.string().email('Email inválido'),
})

export const updatePacienteSchema = createPacienteSchema.partial()

export type CreatePacienteInput = z.infer<typeof createPacienteSchema>
export type UpdatePacienteInput = z.infer<typeof updatePacienteSchema>