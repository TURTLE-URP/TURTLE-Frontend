import { PencilSimple, Trash } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Proveedor } from '../data/types'
import { CondicionBadge } from './estado-badge'

interface ProveedoresTableProps {
  proveedores: Proveedor[]
  base: number
  onEditar: (proveedor: Proveedor) => void
  onEliminar: (proveedor: Proveedor) => void
}

export function ProveedoresTable({
  proveedores,
  base,
  onEditar,
  onEliminar,
}: ProveedoresTableProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <Table className="table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead scope="col" className="w-[8%] text-center">
              #
            </TableHead>
            <TableHead scope="col" className="w-[28%] text-center uppercase">
              Proveedor
            </TableHead>
            <TableHead scope="col" className="w-[22%] text-center uppercase">
              RUC
            </TableHead>
            <TableHead scope="col" className="w-[22%] text-center uppercase">
              Condición
            </TableHead>
            <TableHead scope="col" className="w-[20%] text-center uppercase">
              Acciones
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {proveedores.map((proveedor, indice) => (
            <TableRow key={proveedor.id}>
              <TableCell className="text-center text-muted-foreground">
                {String(base + indice + 1).padStart(3, '0')}
              </TableCell>
              <TableCell className="text-center">
                <span className="font-medium">{proveedor.nombreComercial}</span>
                <span className="block truncate text-xs text-muted-foreground">
                  {proveedor.razonSocial}
                </span>
              </TableCell>
              <TableCell className="text-center">{proveedor.ruc}</TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center">
                  <CondicionBadge condicion={proveedor.condicion} />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex justify-center gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Ver/Editar"
                        onClick={() => onEditar(proveedor)}
                      >
                        <PencilSimple className="text-primary" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Ver/Editar</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Eliminar"
                        onClick={() => onEliminar(proveedor)}
                      >
                        <Trash className="text-destructive" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Eliminar proveedor</TooltipContent>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TooltipProvider>
  )
}