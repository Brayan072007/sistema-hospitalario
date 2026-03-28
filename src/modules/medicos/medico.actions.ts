'use server'

import { revalidatePath } from 'next/cache'
import { MedicoRepository } from './medico.repository'
import { MedicoService } from './medico.service'

function getService() {
  return new MedicoService(new MedicoRepository())
}

export async function getMedicosAction() {
  return getService().getAll()
}

export async function createMedicoAction(formData: FormData) {
  const data = {
    nombre: formData.get('nombre'),
    apellido: formData.get('apellido'),
    especialidadId: formData.get('especialidadId'),
    hospitalId: formData.get('hospitalId'),
    telefono: formData.get('telefono'),
    correoElectronico: formData.get('correoElectronico'),
  }
  const result = await getService().create(data)
  if (result.success) revalidatePath('/dashboard/medicos')
  return result
}

export async function updateMedicoAction(id: number, formData: FormData) {
  const data = {
    nombre: formData.get('nombre'),
    apellido: formData.get('apellido'),
    especialidadId: formData.get('especialidadId'),
    hospitalId: formData.get('hospitalId'),
    telefono: formData.get('telefono'),
    correoElectronico: formData.get('correoElectronico'),
  }
  const result = await getService().update(id, data)
  if (result.success) revalidatePath('/dashboard/medicos')
  return result
}

export async function deleteMedicoAction(id: number) {
  const result = await getService().delete(id)
  if (result.success) revalidatePath('/dashboard/medicos')
  return result
}