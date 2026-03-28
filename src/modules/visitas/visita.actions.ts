'use server'

import { revalidatePath } from 'next/cache'
import { VisitaRepository } from './visita.repository'
import { VisitaService } from './visita.service'

function getService() {
  return new VisitaService(new VisitaRepository())
}

export async function getVisitasAction() {
  return getService().getAll()
}

export async function createVisitaAction(formData: FormData) {
  const data = {
    pacienteId: formData.get('pacienteId'),
    medicoId: formData.get('medicoId'),
    fecha: formData.get('fecha'),
    hora: formData.get('hora'),
  }
  const result = await getService().create(data)
  if (result.success) revalidatePath('/dashboard/visitas')
  return result
}

export async function deleteVisitaAction(id: number) {
  const result = await getService().delete(id)
  if (result.success) revalidatePath('/dashboard/visitas')
  return result
}