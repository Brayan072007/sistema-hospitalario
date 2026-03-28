import { createServerSupabaseClient } from '@/lib/supabase/server'
import type { IRepository } from '@/lib/interfaces/repository.interface'
import type { Medico, MedicoConRelaciones, CreateMedicoDTO } from './types'

/**
 * Repositorio para la tabla medicos.
 * @principle SRP — solo gestiona acceso a datos de médicos
 * @principle OCP — implementa IRepository sin modificarlo
 * @principle LSP — puede usarse donde se espere IRepository<Medico>
 */
export class MedicoRepository implements IRepository<Medico, number, CreateMedicoDTO> {

  /**
   * Busca un médico por su ID.
   * @param id - El MedicoID
   * @returns El médico o null si no existe
   */
  async findById(id: number): Promise<Medico | null> {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('medicos')
      .select('*')
      .eq('medicoid', id)
      .single()
    if (error || !data) return null
    return this.mapToDomain(data)
  }

  /**
   * Obtiene todos los médicos con JOIN a especialidades y hospitales.
   * @returns Array de MedicoConRelaciones
   * @principle ISP — método adicional para necesidades específicas del módulo
   */
  async findAll(): Promise<MedicoConRelaciones[]> {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('medicos')
      .select(`
        medicoid,
        nombre,
        apellido,
        telefono,
        correoelectronico,
        especialidadid,
        hospitalid,
        especialidades ( especialidadid, nombre ),
        hospitales ( hospitalid, nombre, direccion, nit, telefono )
      `)
      .order('apellido', { ascending: true })
    if (error || !data) return []
    return data.map(row => this.mapToConRelaciones(row))
  }

  /**
   * Crea un nuevo médico.
   * @param medicoData - DTO con los datos del médico
   * @returns El médico creado
   */
  async create(medicoData: CreateMedicoDTO): Promise<Medico> {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('medicos')
      .insert({
        nombre: medicoData.nombre,
        apellido: medicoData.apellido,
        especialidadid: medicoData.especialidadId,
        hospitalid: medicoData.hospitalId,
        telefono: medicoData.telefono,
        correoelectronico: medicoData.correoElectronico,
      })
      .select()
      .single()
    if (error) throw new Error(error.message)
    return this.mapToDomain(data!)
  }

  /**
   * Actualiza los datos de un médico existente.
   * @param id - ID del médico
   * @param updates - Campos a actualizar
   * @returns El médico actualizado o null
   */
  async update(id: number, updates: Partial<CreateMedicoDTO>): Promise<Medico | null> {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('medicos')
      .update({
        nombre: updates.nombre,
        apellido: updates.apellido,
        especialidadid: updates.especialidadId,
        hospitalid: updates.hospitalId,
        telefono: updates.telefono,
        correoelectronico: updates.correoElectronico,
      })
      .eq('medicoid', id)
      .select()
      .single()
    if (error || !data) return null
    return this.mapToDomain(data)
  }

  /**
   * Elimina un médico por su ID.
   * @param id - ID del médico
   * @returns true si se eliminó exitosamente
   */
  async delete(id: number): Promise<boolean> {
    const supabase = await createServerSupabaseClient()
    const { error } = await supabase
      .from('medicos')
      .delete()
      .eq('medicoid', id)
    return !error
  }

  /**
   * Mapea fila de BD al tipo de dominio Medico.
   * @param row - Fila cruda de Supabase
   */
  private mapToDomain(row: any): Medico {
    return {
      medicoId: row.medicoid,
      nombre: row.nombre,
      apellido: row.apellido,
      especialidadId: row.especialidadid,
      hospitalId: row.hospitalid,
      telefono: row.telefono,
      correoElectronico: row.correoelectronico,
    }
  }

  /**
   * Mapea fila con JOIN al tipo MedicoConRelaciones.
   * @param row - Fila con datos relacionados de especialidad y hospital
   */
  private mapToConRelaciones(row: any): MedicoConRelaciones {
    return {
      medicoId: row.medicoid,
      nombre: row.nombre,
      apellido: row.apellido,
      especialidadId: row.especialidadid,
      hospitalId: row.hospitalid,
      telefono: row.telefono,
      correoElectronico: row.correoelectronico,
      especialidad: {
        especialidadId: row.especialidades?.especialidadid,
        nombre: row.especialidades?.nombre ?? 'Sin especialidad',
      },
      hospital: {
        hospitalId: row.hospitales?.hospitalid,
        nombre: row.hospitales?.nombre ?? 'Sin hospital',
        direccion: row.hospitales?.direccion ?? '',
        nit: row.hospitales?.nit ?? '',
        telefono: row.hospitales?.telefono ?? '',
      },
    }
  }
}