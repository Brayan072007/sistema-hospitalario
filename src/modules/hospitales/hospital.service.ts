import type { IRepository, ServiceResult } from "@/lib/interfaces/repository.interface";
import type { Hospital, CreateHospitalDTO } from "./types";

export class HospitalService {
  constructor(private readonly repo: IRepository<Hospital, number, CreateHospitalDTO>) {}

  async getAll(): Promise<ServiceResult<Hospital[]>> {
    try {
      const data = await this.repo.findAll();
      return { data, error: null, success: true };
    } catch (err) { return { data: null, error: this.handleError(err), success: false }; }
  }

  async getById(id: number): Promise<ServiceResult<Hospital>> {
    try {
      const data = await this.repo.findById(id);
      if (!data) return { data: null, error: `Hospital ${id} no encontrado`, success: false };
      return { data, error: null, success: true };
    } catch (err) { return { data: null, error: this.handleError(err), success: false }; }
  }

  async create(dto: CreateHospitalDTO): Promise<ServiceResult<Hospital>> {
    try {
      if (!this.validateNIT(dto.nit))
        return { data: null, error: "NIT inválido. Formato: 800123456-7", success: false };
      const data = await this.repo.create(dto);
      return { data, error: null, success: true };
    } catch (err) { return { data: null, error: this.handleError(err), success: false }; }
  }

  async update(id: number, updates: Partial<CreateHospitalDTO>): Promise<ServiceResult<Hospital>> {
    try {
      const exists = await this.repo.findById(id);
      if (!exists) return { data: null, error: `Hospital ${id} no existe`, success: false };
      if (updates.nit && !this.validateNIT(updates.nit))
        return { data: null, error: "NIT inválido", success: false };
      const data = await this.repo.update(id, updates);
      return { data, error: null, success: true };
    } catch (err) { return { data: null, error: this.handleError(err), success: false }; }
  }

  async delete(id: number): Promise<ServiceResult<boolean>> {
    try {
      const deleted = await this.repo.delete(id);
      if (!deleted) return { data: false, error: "No se pudo eliminar. Puede tener médicos asignados.", success: false };
      return { data: true, error: null, success: true };
    } catch (err) { return { data: false, error: this.handleError(err), success: false }; }
  }

  private validateNIT(nit: string): boolean { return /^\d{8,9}-\d$/.test(nit); }
  private handleError(err: unknown): string {
    if (err instanceof Error) return err.message;
    return "Error desconocido en HospitalService";
  }
}