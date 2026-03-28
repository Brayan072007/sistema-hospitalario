import type { IRepository } from '@/lib/interfaces/repository.interface'
import type { Paciente, CreatePacienteDTO } from './types'
import { createPacienteSchema, updatePacienteSchema } from './paciente.schema'

export class PacienteService {
  constructor(private readonly repo: IRepository<Paciente, number, CreatePacienteDTO>) {}

  async getAll() { return this.repo.findAll() }
  async getById(id: number) { return this.repo.findById(id) }

  async create(data: unknown) {
    const parsed = createPacienteSchema.safeParse(data)
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }
    try {
      const paciente = await this.repo.create(parsed.data)
      return { success: true, data: paciente }
    } catch (e: any) {
      return { success: false, error: e.message }
    }
  }

  async update(id: number, data: unknown) {
    const parsed = updatePacienteSchema.safeParse(data)
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }
    try {
      const paciente = await this.repo.update(id, parsed.data)
      return { success: true, data: paciente }
    } catch (e: any) {
      return { success: false, error: e.message }
    }
  }

  async delete(id: number) {
    try {
      const ok = await this.repo.delete(id)
      return { success: ok }
    } catch (e: any) {
      return { success: false, error: e.message }
    }
  }
}