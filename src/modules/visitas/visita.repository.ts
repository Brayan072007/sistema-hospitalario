import { createServerSupabaseClient } from '@/lib/supabase/server'
import type { IRepository } from '@/lib/interfaces/repository.interface'
import type { Visita, CreateVisitaDTO, CreateVisitaCompletaDTO, VisitaCompleta } from './types'

/**
 * Repositorio para la tabla visitas.
 * @principle SRP — solo gestiona acceso a datos de visitas
 * @principle OCP — implementa IRepository sin modificarlo
 */
export class VisitaRepository implements IRepository<Visita, number, CreateVisitaDTO> {

  /**
   * Busca una visita por su ID.
   * @param id - El VisitaID
   */
  async findById(id: number): Promise<Visita | null> {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('visitas')
      .select('*')
      .eq('visitaid', id)
      .single()
    if (error || !data) return null
    return this.mapToDomain(data)
  }

  /**
   * Obtiene todas las visitas con JOIN a paciente y médico.
   * @returns Array de VisitaCompleta
   */
  async findAll(): Promise<VisitaCompleta[]> {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('visitas')
      .select(`
        visitaid,
        fecha,
        hora,
        pacienteid,
        medicoid,
        pacientes ( nombre, apellido, telefono ),
        medicos ( nombre, apellido, especialidades ( nombre ) )
      `)
      .order('fecha', { ascending: false })
    if (error || !data) return []
    return data.map(row => this.mapToCompleta(row))
  }

  /**
   * Crea una visita básica.
   * @param visitaData - DTO con datos de la visita
   */
  async create(visitaData: CreateVisitaDTO): Promise<Visita> {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('visitas')
      .insert({
        pacienteid: visitaData.pacienteId,
        medicoid: visitaData.medicoId,
        fecha: visitaData.fecha,
        hora: visitaData.hora,
      })
      .select()
      .single()
    if (error) throw new Error(error.message)
    return this.mapToDomain(data!)
  }

  /**
   * Crea una visita completa con signos vitales y detalle en 3 inserts.
   * @param dto - DTO completo con visita, signos vitales y detalle
   * @returns La visita creada con todos sus datos
   * @principle Multi — operación compuesta que mantiene consistencia
   */
  async createCompleta(dto: CreateVisitaCompletaDTO): Promise<Visita> {
    const supabase = await createServerSupabaseClient()

    // INSERT 1 — Crear la visita base
    const { data: visita, error: errorVisita } = await supabase
      .from('visitas')
      .insert({
        pacienteid: dto.pacienteId,
        medicoid: dto.medicoId,
        fecha: dto.fecha,
        hora: dto.hora,
      })
      .select()
      .single()
    if (errorVisita) throw new Error(`Error visita: ${errorVisita.message}`)

    const visitaId = visita!.visitaid

    // INSERT 2 — Crear signos vitales si se proporcionan
    if (dto.signosVitales) {
      const { error: errorSignos } = await supabase
        .from('signosvitales')
        .insert({
          visitaid: visitaId,
          frecuenciacardiaca: dto.signosVitales.frecuenciaCardiaca,
          presionarterial: dto.signosVitales.presionArterial,
          frecuenciarespiratoria: dto.signosVitales.frecuenciaRespiratoria,
          temperatura: dto.signosVitales.temperatura,
          saturacionoxigeno: dto.signosVitales.saturacionOxigeno,
        })
      if (errorSignos) throw new Error(`Error signos vitales: ${errorSignos.message}`)
    }

    // INSERT 3 — Crear detalle de visita si se proporcionan
    if (dto.motivoId && dto.diagnostico) {
      const { error: errorDetalle } = await supabase
        .from('detallesvisitas')
        .insert({
          visitaid: visitaId,
          motivoid: dto.motivoId,
          diagnostico: dto.diagnostico,
        })
      if (errorDetalle) throw new Error(`Error detalle visita: ${errorDetalle.message}`)
    }

    return this.mapToDomain(visita!)
  }

  /**
   * Actualiza una visita existente.
   * @param id - ID de la visita
   * @param updates - Campos a actualizar
   */
  async update(id: number, updates: Partial<CreateVisitaDTO>): Promise<Visita | null> {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('visitas')
      .update({
        pacienteid: updates.pacienteId,
        medicoid: updates.medicoId,
        fecha: updates.fecha,
        hora: updates.hora,
      })
      .eq('visitaid', id)
      .select()
      .single()
    if (error || !data) return null
    return this.mapToDomain(data)
  }

  /**
   * Elimina una visita por su ID.
   * @param id - ID de la visita
   */
  async delete(id: number): Promise<boolean> {
    const supabase = await createServerSupabaseClient()
    const { error } = await supabase
      .from('visitas')
      .delete()
      .eq('visitaid', id)
    return !error
  }

  /** Mapea fila de BD al tipo Visita */
  private mapToDomain(row: any): Visita {
    return {
      visitaId: row.visitaid,
      pacienteId: row.pacienteid,
      medicoId: row.medicoid,
      fecha: row.fecha,
      hora: row.hora,
    }
  }

  /** Mapea fila con JOINs al tipo VisitaCompleta */
  private mapToCompleta(row: any): VisitaCompleta {
    return {
      visitaId: row.visitaid,
      pacienteId: row.pacienteid,
      medicoId: row.medicoid,
      fecha: row.fecha,
      hora: row.hora,
      paciente: {
        nombre: row.pacientes?.nombre ?? '',
        apellido: row.pacientes?.apellido ?? '',
        telefono: row.pacientes?.telefono ?? '',
      },
      medico: {
        nombre: row.medicos?.nombre ?? '',
        apellido: row.medicos?.apellido ?? '',
        especialidad: row.medicos?.especialidades?.nombre ?? '',
      },
    }
  }
}