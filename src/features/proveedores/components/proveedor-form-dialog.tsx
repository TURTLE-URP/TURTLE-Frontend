import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useToastStore } from '@/stores/toast-store'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCrearProveedor, useDatosFiscales, useExisteRuc } from '../data/proveedores-query'
import { ProveedoresError } from '../data/proveedores-repository'
import type { Proveedor, ProveedorInput } from '../data/types'
import { validarProveedor, type ErroresProveedor } from '../logic/validation'

interface ProveedorFormDialogProps {
  abierto: boolean
  onCerrar: () => void
  onExito: (proveedor: Proveedor) => void
}

const RUC_COMPLETO_PATTERN = /^\d{11}$/

function Campo({
  id,
  etiqueta,
  error,
  bloqueado,
  opcional,
  className,
  ...props
}: React.ComponentProps<typeof Input> & {
  id: string
  etiqueta: string
  error?: string
  bloqueado?: boolean
  opcional?: boolean
}) {
  const errorId = `${id}-error`
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>
        {etiqueta}
        {opcional ? null : (
          <span aria-hidden="true" className="text-destructive">
            {' '}
            *
          </span>
        )}
      </Label>
      <Input
        id={id}
        disabled={bloqueado}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn('bg-muted', className)}
        {...props}
      />
      {error ? (
        <p id={errorId} className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}

function Seccion({ id, titulo, children }: { id: string; titulo: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="space-y-3">
      <div className="flex items-center gap-3">
        <h3
          id={id}
          className="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
        >
          {titulo}
        </h3>
        <span aria-hidden="true" className="h-px flex-1 bg-border" />
      </div>
      {children}
    </section>
  )
}

export function ProveedorFormDialog({ abierto, onCerrar, onExito }: ProveedorFormDialogProps) {
  const [nombreComercial, setNombreComercial] = useState('')
  const [ruc, setRuc] = useState('')
  const [razonSocial, setRazonSocial] = useState('')
  const [contactoNombre, setContactoNombre] = useState('')
  const [contactoTelefono, setContactoTelefono] = useState('')
  const [contactoEmail, setContactoEmail] = useState('')
  const [direccion, setDireccion] = useState('')
  const [ciudad, setCiudad] = useState('')
  const [errores, setErrores] = useState<ErroresProveedor>({})
  const [duplicado, setDuplicado] = useState(false)
  const [fiscalAplicadoPara, setFiscalAplicadoPara] = useState('')

  const notificar = useToastStore((state) => state.notificar)
  const fiscal = useDatosFiscales(ruc)
  const existeRuc = useExisteRuc(ruc)
  const crear = useCrearProveedor()

  const rucLimpio = ruc.trim()
  const rucCompleto = RUC_COMPLETO_PATTERN.test(rucLimpio)
  const formatoInvalido =
    rucLimpio.length > 0 && !rucCompleto && /[^0-9]/.test(rucLimpio)
  const duplicadoTemprano = rucCompleto && existeRuc.data === true
  const bloqueoFiscal = rucCompleto && (fiscal.isFetching || fiscal.isError)
  const desbloqueado =
    rucCompleto && !bloqueoFiscal && !duplicadoTemprano && existeRuc.data === false
  const puedeGuardar =
    rucCompleto && !bloqueoFiscal && !duplicadoTemprano && !crear.isPending

  if (
    rucCompleto &&
    fiscal.data &&
    existeRuc.data === false &&
    fiscalAplicadoPara !== rucLimpio
  ) {
    setFiscalAplicadoPara(rucLimpio)
    setNombreComercial(fiscal.data.nombreComercial)
    setRazonSocial(fiscal.data.razonSocial)
    setDireccion(fiscal.data.direccion)
    setCiudad(fiscal.data.ciudad)
  }

  function resetFormulario() {
    setNombreComercial('')
    setRuc('')
    setRazonSocial('')
    setContactoNombre('')
    setContactoTelefono('')
    setContactoEmail('')
    setDireccion('')
    setCiudad('')
    setErrores({})
    setDuplicado(false)
    setFiscalAplicadoPara('')
  }

  function handleCerrar() {
    resetFormulario()
    onCerrar()
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const input: ProveedorInput = {
      nombreComercial: nombreComercial.trim(),
      ruc: rucLimpio,
      razonSocial: razonSocial.trim(),
      contactoNombre: contactoNombre.trim(),
      contactoTelefono: contactoTelefono.trim(),
      contactoEmail: contactoEmail.trim(),
      direccion: direccion.trim(),
      ciudad: ciudad.trim(),
    }
    const validacion = validarProveedor(input)
    setErrores(validacion)
    if (Object.keys(validacion).length > 0) {
      return
    }
    crear.mutate(input, {
      onSuccess: (proveedor) => {
        notificar('success', 'Proveedor registrado correctamente.')
        resetFormulario()
        onExito(proveedor)
      },
      onError: (error) => {
        if (error instanceof ProveedoresError && error.code === 'RUC_DUPLICADO') {
          setDuplicado(true)
        } else {
          notificar(
            'error',
            error instanceof Error ? error.message : 'No se pudo registrar el proveedor.',
          )
        }
      },
    })
  }

  return (
    <Dialog
      open={abierto}
      onOpenChange={(open) => {
        if (!open) {
          handleCerrar()
        }
      }}
    >
      <DialogContent className="flex max-h-[90vh] flex-col overflow-hidden sm:max-w-lg">
        <DialogHeader className="shrink-0">
          <DialogTitle>Nuevo proveedor</DialogTitle>
          <DialogDescription>
            Completa los datos para registrar un nuevo proveedor.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto pr-1">
          <Seccion id="seccion-consulta" titulo="Consulta RUC">
            <Campo
              id="campo-ruc"
              etiqueta="RUC"
              value={ruc}
              inputMode="numeric"
              maxLength={11}
              placeholder="11 dígitos"
              onChange={(event) => {
                setRuc(event.target.value)
                setDuplicado(false)
              }}
              error={errores.ruc}
            />
            {formatoInvalido ? (
              <p role="alert" className="text-xs text-destructive">
                *Formato inválido.*
              </p>
            ) : null}
            {rucCompleto && fiscal.isFetching ? (
              <p role="status" className="text-xs text-muted-foreground">
                Buscando datos fiscales…
              </p>
            ) : null}
            {rucCompleto && fiscal.isError ? (
              <p role="alert" className="text-xs text-destructive">
                *
                {fiscal.error instanceof Error
                  ? fiscal.error.message
                  : 'No se pudieron obtener los datos fiscales.'}
                *{' '}
                <Button
                  type="button"
                  variant="link"
                  className="h-auto p-0 text-xs"
                  onClick={() => void fiscal.refetch()}
                >
                  Reintentar
                </Button>
              </p>
            ) : null}
            {duplicadoTemprano || duplicado ? (
              <p role="alert" className="text-xs text-destructive">
                *El RUC ya se encuentra registrado en el sistema.*
              </p>
            ) : null}
          </Seccion>

          <Seccion id="seccion-identificacion" titulo="Identificación">
            <Campo
              id="campo-nombre"
              etiqueta="Nombre Comercial"
              value={nombreComercial}
              bloqueado={!desbloqueado}
              placeholder="Ej: Distribuidora Andina"
              onChange={(event) => setNombreComercial(event.target.value)}
              error={errores.nombreComercial}
            />
            <Campo
              id="campo-razon"
              etiqueta="Razón Social"
              value={razonSocial}
              bloqueado={!desbloqueado}
              placeholder="Nombre legal completo de la empresa"
              onChange={(event) => setRazonSocial(event.target.value)}
              error={errores.razonSocial}
            />
          </Seccion>

          <Seccion id="seccion-contacto" titulo="Contacto">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Campo
                id="campo-contacto-nombre"
                etiqueta="Nombre de Contacto"
                value={contactoNombre}
                bloqueado={!desbloqueado}
                placeholder="Persona de contacto"
                onChange={(event) => setContactoNombre(event.target.value)}
                error={errores.contactoNombre}
              />
              <Campo
                id="campo-contacto-telefono"
                etiqueta="Teléfono"
                value={contactoTelefono}
                inputMode="tel"
                bloqueado={!desbloqueado}
                placeholder="+51 999 000 000"
                onChange={(event) => setContactoTelefono(event.target.value)}
                error={errores.contactoTelefono}
              />
            </div>
            <Campo
              id="campo-contacto-email"
              etiqueta="Correo Electrónico"
              type="email"
              value={contactoEmail}
              bloqueado={!desbloqueado}
              placeholder="contacto@empresa.pe"
              onChange={(event) => setContactoEmail(event.target.value)}
              error={errores.contactoEmail}
            />
          </Seccion>

          <Seccion id="seccion-ubicacion" titulo="Ubicación">
            <Campo
              id="campo-direccion"
              etiqueta="Dirección"
              opcional
              value={direccion}
              bloqueado={!desbloqueado}
              placeholder="Av. Industrial 1240"
              onChange={(event) => setDireccion(event.target.value)}
              error={errores.direccion}
            />
          </Seccion>
          </div>

          <DialogFooter className="shrink-0 flex-col border-t border-border pt-4 sm:flex-col">
            <p aria-live="polite" className="min-h-4 w-full text-right text-xs text-muted-foreground">
              {!rucCompleto ? 'Ingresa un RUC para continuar.' : ' '}
            </p>
            <div className="flex w-full justify-end gap-2">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={!puedeGuardar}
                className="bg-blue-700 text-white hover:bg-blue-800"
              >
                {crear.isPending ? 'Registrando…' : 'Registrar Proveedor'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}