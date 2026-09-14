import { useState } from 'react'
import { CaretDown, CaretUp, Plus, Trash, WarningCircle } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { useToastStore } from '@/stores/toast-store'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
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
import { useActualizarProveedor, useCrearProveedor, useDatosFiscales, useExisteRuc } from '../data/proveedores-query'
import { ProveedoresError } from '../data/proveedores-repository'
import type { Contacto, Proveedor, ProveedorInput } from '../data/types'
import { validarProveedor, type ErroresProveedor } from '../logic/validation'

interface ProveedorFormDialogProps {
  abierto: boolean
  onCerrar: () => void
  onExito: (proveedor: Proveedor) => void
  proveedor?: Proveedor
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
  return (
    <div className={cn('space-y-1', className)}>
      <Label htmlFor={id} className={bloqueado ? 'text-muted-foreground' : ''}>
        {etiqueta}
        {!opcional ? <span className="text-destructive"> *</span> : null}
      </Label>
      <Input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        disabled={bloqueado}
        className={bloqueado ? 'opacity-60' : ''}
        {...props}
      />
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs text-destructive">
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

function ContactoGrupo({
  index,
  contacto,
  error,
  bloqueado,
  puedeEliminar,
  expandido,
  onToggle,
  onActualizar,
  onEliminar,
}: {
  index: number
  contacto: Contacto
  error?: { nombre?: string; telefono?: string; email?: string }
  bloqueado: boolean
  puedeEliminar: boolean
  expandido: boolean
  onToggle: () => void
  onActualizar: (contacto: Contacto) => void
  onEliminar: () => void
}) {
  const nombreResumen = contacto.nombre.trim() || `Contacto ${index + 1}`

  return (
    <div className="rounded-md border">
      <div className="flex items-center justify-between px-3 py-2">
        <button
          type="button"
          onClick={onToggle}
          className="flex flex-1 items-center gap-2 text-left text-xs font-medium text-foreground"
          aria-expanded={expandido}
        >
          {expandido ? (
            <CaretUp className="size-4 shrink-0 text-muted-foreground" />
          ) : (
            <CaretDown className="size-4 shrink-0 text-muted-foreground" />
          )}
          <span className="truncate">{nombreResumen}</span>
          {!expandido && contacto.telefono.trim() ? (
            <span className="truncate text-muted-foreground">· {contacto.telefono}</span>
          ) : null}
        </button>
        {puedeEliminar && !bloqueado ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onEliminar}
            aria-label={`Eliminar contacto ${index + 1}`}
          >
            <Trash className="text-destructive" />
          </Button>
        ) : null}
      </div>
      {expandido ? (
        <div className="space-y-3 border-t px-3 pb-3 pt-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Campo
              id={`campo-contacto-nombre-${index}`}
              etiqueta="Nombre de Contacto"
              value={contacto.nombre}
              bloqueado={bloqueado}
              placeholder="Persona de contacto"
              onChange={(event) => onActualizar({ ...contacto, nombre: event.target.value })}
              error={error?.nombre}
            />
            <Campo
              id={`campo-contacto-telefono-${index}`}
              etiqueta="Teléfono"
              value={contacto.telefono}
              inputMode="tel"
              bloqueado={bloqueado}
              placeholder="+51 999 000 000"
              onChange={(event) => onActualizar({ ...contacto, telefono: event.target.value })}
              error={error?.telefono}
            />
          </div>
          <Campo
            id={`campo-contacto-email-${index}`}
            etiqueta="Correo Electrónico"
            type="email"
            value={contacto.email}
            bloqueado={bloqueado}
            placeholder="contacto@empresa.pe"
            onChange={(event) => onActualizar({ ...contacto, email: event.target.value })}
            error={error?.email}
          />
        </div>
      ) : null}
    </div>
  )
}

export function ProveedorFormDialog({
  abierto,
  onCerrar,
  onExito,
  proveedor,
}: ProveedorFormDialogProps) {
  const modoEdicion = proveedor !== undefined
  const [nombreComercial, setNombreComercial] = useState(proveedor?.nombreComercial ?? '')
  const [ruc, setRuc] = useState(proveedor?.ruc ?? '')
  const [razonSocial, setRazonSocial] = useState(proveedor?.razonSocial ?? '')
  const [contactos, setContactos] = useState<Contacto[]>(
    proveedor?.contactos ?? [{ nombre: '', telefono: '', email: '' }]
  )
  const [contactoExpandido, setContactoExpandido] = useState<number | null>(null)
  const [contactoAEliminar, setContactoAEliminar] = useState<number | null>(null)
  const [direccion, setDireccion] = useState(proveedor?.direccion ?? '')
  const [errores, setErrores] = useState<ErroresProveedor>({})
  const [duplicado, setDuplicado] = useState(false)
  const [fiscalAplicadoPara, setFiscalAplicadoPara] = useState(proveedor?.ruc.trim() ?? '')

  const notificar = useToastStore((state) => state.notificar)
  const fiscal = useDatosFiscales(ruc, { habilitado: !modoEdicion })
  const existeRuc = useExisteRuc(ruc, proveedor?.id)
  const crear = useCrearProveedor()
  const actualizar = useActualizarProveedor()

  const rucLimpio = ruc.trim()
  const rucCompleto = RUC_COMPLETO_PATTERN.test(rucLimpio)
  const formatoInvalido =
    rucLimpio.length > 0 && !rucCompleto && /[^0-9]/.test(rucLimpio)
  const duplicadoTemprano = rucCompleto && existeRuc.data === true
  const bloqueoFiscal = rucCompleto && (fiscal.isFetching || fiscal.isError)
  const desbloqueado =
    rucCompleto && !bloqueoFiscal && !duplicadoTemprano && existeRuc.data === false
  const guardando = crear.isPending || actualizar.isPending
  const puedeGuardar =
    rucCompleto && !bloqueoFiscal && !duplicadoTemprano && !guardando

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
  }

  function resetFormulario() {
    setNombreComercial('')
    setRuc('')
    setRazonSocial('')
    setContactos([{ nombre: '', telefono: '', email: '' }])
    setContactoExpandido(null)
    setContactoAEliminar(null)
    setDireccion('')
    setErrores({})
    setDuplicado(false)
    setFiscalAplicadoPara('')
  }

  function handleCerrar() {
    resetFormulario()
    onCerrar()
  }

  function actualizarContacto(index: number, contacto: Contacto) {
    setContactos((prev) => prev.map((c, i) => (i === index ? contacto : c)))
  }

  function agregarContacto() {
    if (contactos.length < 5) {
      setContactos((prev) => [...prev, { nombre: '', telefono: '', email: '' }])
      setContactoExpandido(contactos.length)
    }
  }

  function eliminarContacto(index: number) {
    if (contactos.length > 1) {
      setContactos((prev) => prev.filter((_, i) => i !== index))
      setContactoExpandido((prev) => {
        if (prev === null) return null
        if (index < prev) return prev - 1
        if (index === prev) return Math.min(prev, contactos.length - 2)
        return prev
      })
    }
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const input: ProveedorInput = {
      nombreComercial: nombreComercial.trim(),
      ruc: rucLimpio,
      razonSocial: razonSocial.trim(),
      contactos: contactos.map((c) => ({
        nombre: c.nombre.trim(),
        telefono: c.telefono.trim(),
        email: c.email.trim(),
      })),
      direccion: direccion.trim(),
    }
    const validacion = validarProveedor(input)
    setErrores(validacion)
    if (Object.keys(validacion).length > 0) {
      return
    }
    if (modoEdicion && proveedor) {
      const id = proveedor.id
      actualizar.mutate(
        { id, input },
        {
          onSuccess: (actualizado) => {
            notificar('success', 'Proveedor actualizado correctamente.')
            resetFormulario()
            onExito(actualizado)
          },
          onError: (error) => {
            if (error instanceof ProveedoresError && error.code === 'RUC_DUPLICADO') {
              setDuplicado(true)
            } else {
              notificar(
                'error',
                error instanceof Error ? error.message : 'No se pudo actualizar el proveedor.',
              )
            }
          },
        },
      )
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
    <>
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
          <DialogTitle>{modoEdicion ? 'Ver/Editar proveedor' : 'Nuevo proveedor'}</DialogTitle>
          <DialogDescription>
            {modoEdicion
              ? 'Visualiza y edita los datos del proveedor.'
              : 'Completa los datos para registrar un nuevo proveedor.'}
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
              bloqueado={modoEdicion}
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
              bloqueado={modoEdicion || !desbloqueado}
              placeholder="Ej: Distribuidora Andina"
              onChange={(event) => setNombreComercial(event.target.value)}
              error={errores.nombreComercial}
            />
            <Campo
              id="campo-razon"
              etiqueta="Razón Social"
              value={razonSocial}
              bloqueado={modoEdicion || !desbloqueado}
              placeholder="Nombre legal completo de la empresa"
              onChange={(event) => setRazonSocial(event.target.value)}
              error={errores.razonSocial}
            />
          </Seccion>

          <Seccion id="seccion-contacto" titulo="Contacto">
            {errores.contactos ? (
              <p role="alert" className="text-xs text-destructive">
                {errores.contactos}
              </p>
            ) : null}
            <div className="space-y-2">
              {contactos.map((contacto, index) => (
                <ContactoGrupo
                  key={index}
                  index={index}
                  contacto={contacto}
                  error={errores.contactosDetalle?.[index]}
                  bloqueado={modoEdicion ? false : !desbloqueado}
                  puedeEliminar={contactos.length > 1}
                  expandido={contactoExpandido === index}
                  onToggle={() =>
                    setContactoExpandido((prev) => (prev === index ? null : index))
                  }
                  onActualizar={(c) => actualizarContacto(index, c)}
                  onEliminar={() => setContactoAEliminar(index)}
                />
              ))}
            </div>
            {contactos.length < 5 && (modoEdicion || desbloqueado) ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={agregarContacto}
                className="mt-2"
              >
                <Plus className="mr-1 size-4" />
                Agregar contacto
              </Button>
            ) : null}
          </Seccion>

          <Seccion id="seccion-ubicacion" titulo="Ubicación">
            <Campo
              id="campo-direccion"
              etiqueta="Dirección"
              opcional
              value={direccion}
              bloqueado={modoEdicion || !desbloqueado}
              placeholder="Av. Industrial 1240"
              onChange={(event) => setDireccion(event.target.value)}
              error={errores.direccion}
            />
          </Seccion>
          </div>

          <DialogFooter className="shrink-0 flex-col border-t border-border pt-4 sm:flex-col">
            <p aria-live="polite" className="min-h-4 w-full text-right text-xs text-muted-foreground">
              {!rucCompleto ? 'Ingresa un RUC para continuar.' : ' '}
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
                {guardando ? 'Guardando…' : modoEdicion ? 'Guardar cambios' : 'Registrar Proveedor'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

    <AlertDialog
      open={contactoAEliminar !== null}
      onOpenChange={(open) => {
        if (!open) setContactoAEliminar(null)
      }}
    >
      <AlertDialogContent>
        <div className="flex items-start gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
            <WarningCircle className="size-5 text-destructive" weight="fill" />
          </div>
          <div className="flex-1 space-y-2">
            <AlertDialogHeader>
              <AlertDialogTitle>Eliminar contacto</AlertDialogTitle>
              <AlertDialogDescription>
                ¿Deseas eliminar a{' '}
                <strong>
                  {contactoAEliminar !== null
                    ? contactos[contactoAEliminar]?.nombre.trim() ||
                      `Contacto ${contactoAEliminar + 1}`
                    : ''}
                </strong>
                ? Esta acción no se podrá deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline" onClick={() => setContactoAEliminar(null)}>
              Cancelar
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              onClick={() => {
                if (contactoAEliminar !== null) {
                  eliminarContacto(contactoAEliminar)
                  setContactoAEliminar(null)
                }
              }}
            >
              Sí, eliminar
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  )
}