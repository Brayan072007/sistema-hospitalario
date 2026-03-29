/**
 * @file src/app/(dashboard)/dashboard/formulas/page.tsx
 * @description Página de listado de fórmulas médicas. Server Component.
 * @principle SRP - solo renderiza el listado de fórmulas
 */

import { FormulaRepository } from '@/modules/formulas/formula.repository'
import { FormulaService } from '@/modules/formulas/formula.service'

export const metadata = { title: 'Fórmulas Médicas' }

const formulaService = new FormulaService(new FormulaRepository())

export default async function FormulasPage({
  searchParams,
}: {
  searchParams: { tratamientoId?: string }
}) {
  const tratamientoId = Number(searchParams?.tratamientoId ?? 1)
  const result = await formulaService.getByTratamiento(tratamientoId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fórmulas Médicas</h1>
          <p className="text-sm text-gray-500 mt-1">Recetas con medicamentos asociados</p>
        </div>
      </div>

      {!result.success ? (
        <div className="rounded-lg bg-red-50 border border-red-200 p-6">
          <p className="text-red-600 text-sm">{result.error}</p>
        </div>
      ) : result.data?.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">No hay fórmulas registradas para este tratamiento</p>
        </div>
      ) : (
        <div className="space-y-4">
          {result.data?.map((formula) => (
            <div key={formula.formulaid} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold text-gray-800">
                  Fórmula #{formula.formulaid}
                </span>
                <span className="text-sm text-gray-500">{formula.fecha}</span>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="pb-2">Medicamento</th>
                    <th className="pb-2">Presentación</th>
                    <th className="pb-2">Posología</th>
                    <th className="pb-2">Período</th>
                  </tr>
                </thead>
                <tbody>
                  {formula.detalles.map((d) => (
                    <tr key={d.detalleid} className="border-b last:border-0">
                      <td className="py-2 font-medium text-gray-800">{d.medicamento.nombre}</td>
                      <td className="py-2 text-gray-600">{d.presentacion}</td>
                      <td className="py-2 text-gray-600">{d.posologia}</td>
                      <td className="py-2 text-gray-600">{d.periodoUso}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}