import type { IRepository } from '@/lib/interfaces/repository.interface'
import type { Medico, CreateMedicoDTO } from './types'
import { createMedicoSchema, updateMedicoSchema } from './medico.schema'

export class MedicoService {
  constructor(private readonly repo: IRepository<Medico, number, CreateMedicoDTO>) {}

  async getAll(): Promise<Medico[]> {
    return this.repo.findAll()
  }

  async getById(id: number): Promise<Medico | null> {
    return this.repo.findById(id)
  }

  async create(data: unknown) {
    const parsed = createMedicoSchema.safeParse(data)
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message }
    }
    try {
      const medico = await this.repo.create(parsed.data)
      return { success: true, data: medico }
    } catch (e: any) {
      return { success: false, error: e.message }
    }
  }

  async update(id: number, data: unknown) {
    const parsed = updateMedicoSchema.safeParse(data)
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message }
    }
    try {
      const medico = await this.repo.update(id, parsed.data)
      return { success: true, data: medico }
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