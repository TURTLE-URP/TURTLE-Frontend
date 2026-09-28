import type { ReactNode } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Cotizacion } from '../data/types'
import { formatearFecha, formatearMoneda } from '../logic/format'
import { EstadoBadge } from './estado-badge'

interface CotizacionesTableProps {
  cotizaciones: Cotizacion[]
  renderAcciones?: (cotizacion: Cotizacion) => ReactNode
}

export function CotizacionesTable({ cotizaciones, renderAcciones }: CotizacionesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead scope="col">Folio</TableHead>
          <TableHead scope="col">Proveedor</TableHead>
          <TableHead scope="col">Fecha</TableHead>
          <TableHead scope="col">Estado</TableHead>
          <TableHead scope="col" className="text-right">
            Total
          </TableHead>
          <TableHead scope="col" className="text-right">
            Acciones
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cotizaciones.map((cotizacion) => (
          <TableRow key={cotizacion.id}>
            <TableCell className="font-medium">{cotizacion.folio}</TableCell>
            <TableCell>{cotizacion.proveedorNombre}</TableCell>
            <TableCell>{formatearFecha(cotizacion.fecha)}</TableCell>
            <TableCell>
              <EstadoBadge estado={cotizacion.solicitudEstado} />
            </TableCell>
            <TableCell className="text-right">
              {formatearMoneda(cotizacion.total, cotizacion.moneda)}
            </TableCell>
            <TableCell className="text-right">
              {renderAcciones ? renderAcciones(cotizacion) : null}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
