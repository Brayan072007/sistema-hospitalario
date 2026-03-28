import { createServerSupabaseClient } from '@/lib/supabase/server'
import type { IRepository } from '@/lib/interfaces/repository.interface'
import type { Paciente, CreatePacienteDTO } from './types'

export class PacienteRepository implements IRepository<Paciente, number, CreatePacienteDTO> {
  async findById(id: number): Promise<Paciente | null> {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('pacientes')
      .select('*')
      .eq('pacienteid', id)
      .single()
    if (error || !data) return null
    return this.mapToDomain(data)
  }

  async findAll(): Promise<Paciente[]> {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('pacientes')
      .select('*')
      .order('apellido', { ascending: true })
    if (error || !data) return []
    return data.map(row => this.mapToDomain(row))
  }

  async create(pacienteData: CreatePacienteDTO): Promise<Paciente> {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('pacientes')
      .insert({
        nombre: pacienteData.nombre,
        apellido: pacienteData.apellido,
        fechanacimiento: pacienteData.fechaNacimiento,
        sexo: pacienteData.sexo,
        direccion: pacienteData.direccion,
        telefono: pacienteData.telefono,
        correoelectronico: pacienteData.correoElectronico,
      })
      .select()
      .single()
    if (error) throw new Error(error.message)
    return this.mapToDomain(data!)
  }

  async update(id: number, updates: Partial<CreatePacienteDTO>): Promise<Paciente | null> {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('pacientes')
      .update({
        nombre: updates.nombre,
        apellido: updates.apellido,
        fechanacimiento: updates.fechaNacimiento,
        sexo: updates.sexo,
        direccion: updates.direccion,
        telefono: updates.telefono,
        correoelectronico: updates.correoElectronico,
      })
      .eq('pacienteid', id)
      .select()
      .single()
    if (error || !data) return null
    return this.mapToDomain(data)
  }

  async delete(id: number): Promise<boolean> {
    const supabase = await createServerSupabaseClient()
    const { error } = await supabase
      .from('pacientes')
      .delete()
      .eq('pacienteid', id)
    return !error
  }

  private mapToDomain(row: any): Paciente {
    return {
      pacienteId: row.pacienteid,
      nombre: row.nombre,
      apellido: row.apellido,
      fechaNacimiento: row.fechanacimiento,
      sexo: row.sexo,
      direccion: row.direccion,
      telefono: row.telefono,
      correoElectronico: row.correoelectronico,
    }
  }
}