import { CheckCircle, MinusCircle, PencilSimple } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Proveedor } from '../data/types'
import { formatearFecha } from '../logic/format'
import { EstadoBadge } from './estado-badge'

interface ProveedoresTableProps {
  proveedores: Proveedor[]
  base: number
  onEditar: (proveedor: Proveedor) => void
  onDesactivar: (proveedor: Proveedor) => void
  onReactivar: (proveedor: Proveedor) => void
}

export function ProveedoresTable({
  proveedores,
  base,
  onEditar,
  onDesactivar,
  onReactivar,
}: ProveedoresTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead scope="col">#</TableHead>
          <TableHead scope="col" className="uppercase">
            Proveedor
          </TableHead>
          <TableHead scope="col" className="uppercase">
            RUC
          </TableHead>
          <TableHead scope="col" className="uppercase">
            Contacto
          </TableHead>
          <TableHead scope="col" className="uppercase">
            Ciudad
          </TableHead>
          <TableHead scope="col" className="uppercase">
            Registrado
          </TableHead>
          <TableHead scope="col" className="uppercase">
            Estado
          </TableHead>
          <TableHead scope="col" className="text-right uppercase">
            Acciones
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {proveedores.map((proveedor, indice) => {
          const activo = proveedor.estado === 'Activo'
          return (
            <TableRow key={proveedor.id}>
              <TableCell className="text-muted-foreground">
                {String(base + indice + 1).padStart(3, '0')}
              </TableCell>
              <TableCell>
                <span className="font-medium">{proveedor.nombreComercial}</span>
                <span className="block text-xs text-muted-foreground">
                  {proveedor.razonSocial}
                </span>
              </TableCell>
              <TableCell>{proveedor.ruc}</TableCell>
              <TableCell>
                <span>{proveedor.contactoNombre}</span>
                <span className="block text-xs text-muted-foreground">
                  {proveedor.contactoEmail}
                </span>
              </TableCell>
              <TableCell>{proveedor.ciudad}</TableCell>
              <TableCell>{formatearFecha(proveedor.fechaRegistro)}</TableCell>
              <TableCell>
                <EstadoBadge estado={proveedor.estado} />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Editar"
                    onClick={() => onEditar(proveedor)}
                  >
                    <PencilSimple className="text-primary" />
                  </Button>
                  {activo ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Desactivar"
                      onClick={() => onDesactivar(proveedor)}
                    >
                      <MinusCircle className="text-destructive" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Reactivar"
                      onClick={() => onReactivar(proveedor)}
                    >
                      <CheckCircle className="text-secondary" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}