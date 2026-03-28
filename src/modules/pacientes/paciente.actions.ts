'use server'

import { revalidatePath } from 'next/cache'
import { PacienteRepository } from './paciente.repository'
import { PacienteService } from './paciente.service'

function getService() {
  return new PacienteService(new PacienteRepository())
}

export async function getPacientesAction() {
  return getService().getAll()
}

export async function createPacienteAction(formData: FormData) {
  const data = {
    nombre: formData.get('nombre'),
    apellido: formData.get('apellido'),
    fechaNacimiento: formData.get('fechaNacimiento'),
    sexo: formData.get('sexo'),
    direccion: formData.get('direccion'),
    telefono: formData.get('telefono'),
    correoElectronico: formData.get('correoElectronico'),
  }
  const result = await getService().create(data)
  if (result.success) revalidatePath('/dashboard/pacientes')
  return result
}

export async function updatePacienteAction(id: number, formData: FormData) {
  const data = {
    nombre: formData.get('nombre'),
    apellido: formData.get('apellido'),
    fechaNacimiento: formData.get('fechaNacimiento'),
    sexo: formData.get('sexo'),
    direccion: formData.get('direccion'),
    telefono: formData.get('telefono'),
    correoElectronico: formData.get('correoElectronico'),
  }
  const result = await getService().update(id, data)
  if (result.success) revalidatePath('/dashboard/pacientes')
  return result
}

export async function deletePacienteAction(id: number) {
  const result = await getService().delete(id)
  if (result.success) revalidatePath('/dashboard/pacientes')
  return result
}