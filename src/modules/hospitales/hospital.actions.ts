"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { HospitalRepository } from "./hospital.repository";
import { HospitalService } from "./hospital.service";
import { CreateHospitalSchema } from "./hospital.schema";

const hospitalService = new HospitalService(new HospitalRepository());

type FormState = { success: boolean; message: string; errors?: Record<string, string[]> };

export async function createHospitalAction(_prev: FormState | null, formData: FormData): Promise<FormState> {
  const rawData = {
    nombre: formData.get("nombre") as string,
    direccion: formData.get("direccion") as string,
    nit: formData.get("nit") as string,
    telefono: formData.get("telefono") as string,
  };
  const validation = CreateHospitalSchema.safeParse(rawData);
  if (!validation.success) {
    return { success: false, message: "Corrija los errores del formulario", errors: validation.error.flatten().fieldErrors };
  }
  const result = await hospitalService.create(validation.data);
  if (!result.success) return { success: false, message: result.error || "Error desconocido" };
  revalidatePath("/dashboard/hospitales");
  redirect("/dashboard/hospitales");
}

export async function deleteHospitalAction(_prev: FormState | null, formData: FormData): Promise<FormState> {
  const id = Number(formData.get("id"));
  if (!id || isNaN(id)) return { success: false, message: "ID inválido" };
  const result = await hospitalService.delete(id);
  if (!result.success) return { success: false, message: result.error || "Error al eliminar" };
  revalidatePath("/dashboard/hospitales");
  return { success: true, message: "Hospital eliminado exitosamente" };
}