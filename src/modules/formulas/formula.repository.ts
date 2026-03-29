/**
 * @file src/modules/formulas/formula.repository.ts
 * @description Repositorio para Fórmulas (recetas médicas).
 * @principle SRP - solo acceso a datos de fórmulas
 * @principle OCP - implementa el patrón Repository sin modificar interfaces base
 */

import { createServerSupabaseClient } from '@/lib/supabase/server'
import type { Formula, CreateFormulaDTO } from './types'

interface DetalleFormulaRaw {
  detalleid: number
  presentacion: string
  posologia: string
  periodouso: string
  periodicidaduso: string
  medicamentos: {
    medicamentoid: number
    nombre: string
    prescripcion: string
    unidades: string
    descripcion: string | null
  } | null
}

export class FormulaRepository {
  /**
   * Obtiene todas las fórmulas de un tratamiento con sus medicamentos.
   * @param tratamientoId - ID del tratamiento
   */
  async findByTratamiento(tratamientoId: number): Promise<Formula[]> {
    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase
      .from('formulas')
      .select(`
        formulaid,
        fecha,
        tratamientoid,
        detallesformulas (
          detalleid,
          presentacion,
          posologia,
          periodouso,
          periodicidaduso,
          medicamentos!medicamentoid (
            medicamentoid,
            nombre,
            prescripcion,
            unidades,
            descripcion
          )
        )
      `)
      .eq('tratamientoid', tratamientoId)
      .order('fecha', { ascending: false })

    if (error) throw new Error(error.message)

    return (data ?? []).map((f) => ({
      formulaid: f.formulaid,
      tratamientoid: f.tratamientoid,
      fecha: f.fecha,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      detalles: ((f.detallesformulas ?? []) as any[]).map((d: DetalleFormulaRaw) => ({
        detalleid: d.detalleid,
        presentacion: d.presentacion,
        posologia: d.posologia,
        periodoUso: d.periodouso,
        periodicidadUso: d.periodicidaduso,
        medicamento: {
          medicamentoid: d.medicamentos?.medicamentoid ?? 0,
          nombre: d.medicamentos?.nombre ?? '',
          prescripcion: d.medicamentos?.prescripcion ?? '',
          unidades: d.medicamentos?.unidades ?? '',
          descripcion: d.medicamentos?.descripcion ?? '',
          cantidad: 0,
        },
      })),
    }))
  }

  /**
   * Crea una fórmula con sus detalles. Patrón maestro-detalle.
   * @param dto - Datos de la fórmula con medicamentos
   */
  async createConDetalles(dto: CreateFormulaDTO): Promise<Formula> {
    const supabase = await createServerSupabaseClient()

    const { data: formula, error: fErr } = await supabase
      .from('formulas')
      .insert({ tratamientoid: dto.tratamientoId, fecha: dto.fecha })
      .select('formulaid')
      .single()

    if (fErr || !formula) throw new Error(fErr?.message ?? 'Error al crear fórmula')

    if (dto.detalles.length > 0) {
      const { error: dErr } = await supabase
        .from('detallesformulas')
        .insert(
          dto.detalles.map((d) => ({
            formulaid: formula.formulaid,
            medicamentoid: d.medicamentoid,
            presentacion: d.presentacion,
            posologia: d.posologia,
            periodouso: d.periodoUso,
            periodicidaduso: d.periodicidadUso,
          }))
        )

      if (dErr) throw new Error(`Error en detalles: ${dErr.message}`)
    }

    const formulas = await this.findByTratamiento(dto.tratamientoId)
    const created = formulas.find((f) => f.formulaid === formula.formulaid)
    if (!created) throw new Error('No se pudo recuperar la fórmula creada')
    return created
  }

  /**
   * Elimina una fórmula por ID.
   * @param id - ID de la fórmula
   */
  async delete(id: number): Promise<boolean> {
    const supabase = await createServerSupabaseClient()
    const { error } = await supabase
      .from('formulas')
      .delete()
      .eq('formulaid', id)
    return !error
  }
}