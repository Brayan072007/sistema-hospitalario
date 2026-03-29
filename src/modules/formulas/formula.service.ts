/**
 * @file src/modules/formulas/formula.service.ts
 * @description Service Layer para fórmulas médicas.
 * @principle SRP - solo lógica de negocio de fórmulas
 * @principle DIP - recibe el repositorio por inyección de dependencias
 */

import type { FormulaRepository } from './formula.repository'
import type { CreateFormulaDTO, Formula } from './types'

interface ServiceResult<T> {
  success: boolean
  data?: T
  error?: string
}

export class FormulaService {
  /** @principle DIP - depende de la abstracción, no de la implementación */
  constructor(private readonly repo: FormulaRepository) {}

  async getByTratamiento(tratamientoId: number): Promise<ServiceResult<Formula[]>> {
    try {
      const data = await this.repo.findByTratamiento(tratamientoId)
      return { success: true, data }
    } catch (e) {
      return { success: false, error: e instanceof Error ? e.message : 'Error desconocido' }
    }
  }

  async create(dto: CreateFormulaDTO): Promise<ServiceResult<Formula>> {
    try {
      if (!dto.detalles || dto.detalles.length === 0) {
        return { success: false, error: 'La fórmula debe tener al menos un medicamento' }
      }
      const data = await this.repo.createConDetalles(dto)
      return { success: true, data }
    } catch (e) {
      return { success: false, error: e instanceof Error ? e.message : 'Error al crear fórmula' }
    }
  }

  async delete(id: number): Promise<ServiceResult<boolean>> {
    try {
      const ok = await this.repo.delete(id)
      return { success: ok, data: ok }
    } catch (e) {
      return { success: false, error: e instanceof Error ? e.message : 'Error al eliminar' }
    }
  }
}