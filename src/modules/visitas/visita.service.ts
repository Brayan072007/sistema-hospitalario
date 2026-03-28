import type { IRepository } from '@/lib/interfaces/repository.interface'
import type { Visita, CreateVisitaDTO } from './types'
import { createVisitaSchema, updateVisitaSchema } from './visita.schema'

export class VisitaService {
  constructor(private readonly repo: IRepository<Visita, number, CreateVisitaDTO>) {}

  async getAll() { return this.repo.findAll() }
  async getById(id: number) { return this.repo.findById(id) }

  async create(data: unknown) {
    const parsed = createVisitaSchema.safeParse(data)
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }
    try {
      const visita = await this.repo.create(parsed.data)
      return { success: true, data: visita }
    } catch (e: any) {
      return { success: false, error: e.message }
    }
  }

  async update(id: number, data: unknown) {
    const parsed = updateVisitaSchema.safeParse(data)
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }
    try {
      const visita = await this.repo.update(id, parsed.data)
      return { success: true, data: visita }
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