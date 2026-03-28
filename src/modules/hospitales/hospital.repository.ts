import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { IRepository, IPaginableRepository } from "@/lib/interfaces/repository.interface";
import type { Hospital, CreateHospitalDTO, HospitalFilters } from "./types";

/**
 * Repositorio para la tabla hospitales.
 * @principle SRP — única responsabilidad: acceso a datos de hospitales
 * @principle OCP — implementa IRepository sin modificarlo
 * @principle LSP — puede usarse donde se espere IRepository<Hospital>
 * @principle DIP — los servicios dependen de esta abstracción, no de Supabase directamente
 */
export class HospitalRepository
  implements IRepository<Hospital, number, CreateHospitalDTO>,
    IPaginableRepository<Hospital, HospitalFilters>
{
  /**
   * Busca un hospital por su ID primario.
   * @param id - El HospitalID de la tabla hospitales
   * @returns El hospital encontrado o null si no existe
   */
  async findById(id: number): Promise<Hospital | null> {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("hospitales").select("*").eq("hospitalid", id).single();
    if (error || !data) return null;
    return this.mapToDomain(data);
  }

  /**
   * Obtiene todos los hospitales con filtros opcionales.
   * @param filters - Objeto con campos para filtrar (nombre)
   * @returns Array de hospitales ordenados alfabéticamente
   */
  async findAll(filters?: HospitalFilters): Promise<Hospital[]> {
    const supabase = await createServerSupabaseClient();
    let query = supabase.from("hospitales").select("*").order("nombre");
    if (filters?.nombre) query = query.ilike("nombre", `%${filters.nombre}%`);
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return (data || []).map((row) => this.mapToDomain(row));
  }

  /**
   * Crea un nuevo hospital en la base de datos.
   * @param hospitalData - DTO con los datos del nuevo hospital
   * @returns El hospital creado con su ID asignado por la BD
   * @throws Error si la inserción falla (NIT duplicado, etc.)
   */
  async create(hospitalData: CreateHospitalDTO): Promise<Hospital> {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("hospitales")
      .insert({
        nombre: hospitalData.nombre,
        direccion: hospitalData.direccion,
        nit: hospitalData.nit,
        telefono: hospitalData.telefono,
      })
      .select().single();
    if (error) throw new Error(error.message);
    return this.mapToDomain(data!);
  }

  /**
   * Actualiza los datos de un hospital existente.
   * @param id - ID del hospital a actualizar
   * @param updates - Campos parciales a actualizar
   * @returns El hospital actualizado o null si no existe
   */
  async update(id: number, updates: Partial<CreateHospitalDTO>): Promise<Hospital | null> {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("hospitales").update(updates).eq("hospitalid", id).select().single();
    if (error || !data) return null;
    return this.mapToDomain(data);
  }

  /**
   * Elimina un hospital por su ID.
   * @param id - ID del hospital a eliminar
   * @returns true si se eliminó exitosamente, false en caso contrario
   */
  async delete(id: number): Promise<boolean> {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from("hospitales").delete().eq("hospitalid", id);
    return !error;
  }

  /**
   * Obtiene hospitales paginados con filtros opcionales.
   * @param page - Número de página (1-indexed)
   * @param pageSize - Cantidad de registros por página
   * @param filters - Filtros opcionales de búsqueda
   * @returns Objeto con data paginada y count total
   */
  async findPaginated(page: number, pageSize: number, filters?: HospitalFilters) {
    const supabase = await createServerSupabaseClient();
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    let query = supabase.from("hospitales").select("*", { count: "exact" }).range(from, to).order("nombre");
    if (filters?.nombre) query = query.ilike("nombre", `%${filters.nombre}%`);
    const { data, error, count } = await query;
    if (error) throw new Error(error.message);
    return { data: (data || []).map((row) => this.mapToDomain(row)), count: count || 0 };
  }

  /**
   * Convierte una fila de la BD al tipo de dominio Hospital.
   * @param row - Fila cruda de Supabase (snake_case)
   * @returns Objeto Hospital con propiedades en camelCase
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private mapToDomain(row: Record<string, any>): Hospital {
    return {
      hospitalId: row.hospitalid,
      nombre: row.nombre,
      direccion: row.direccion,
      nit: row.nit,
      telefono: row.telefono,
    };
  }
}