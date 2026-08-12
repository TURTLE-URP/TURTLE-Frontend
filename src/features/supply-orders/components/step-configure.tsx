import { useEffect, useRef, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { useCalculateItems, useShortageItems } from '../logic/api/hooks'
import { DISHES, INGREDIENTS } from '../logic/__fixtures__'
import { dishQtysSchema, libreSchema } from './step-configure.form'
import type { FieldPath } from 'react-hook-form'
import type { Modality, OrderItem } from '../logic/types'
import type { DishQtysFormValues, LibreFormValues } from './step-configure.form'

interface StepConfigureProps {
  modality: Modality
  /** Called with the calculated order items when the administrator proceeds. */
  onNext: (items: OrderItem[]) => void
}

interface EscasezConfigureProps {
  calculate: ReturnType<typeof useCalculateItems>
  onNext: (items: OrderItem[]) => void
}

/** Escasez branch of step 2 — read-only shortage list computed by the backend. */
function EscasezConfigure({ calculate, onNext }: EscasezConfigureProps) {
  const shortage = useShortageItems()
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit() {
    setError(null)
    setSending(true)
    try {
      const items = await calculate.mutateAsync({ modality: 'escasez' })
      onNext(items)
    } catch {
      setError('No se pudieron calcular las cantidades. Inténtalo de nuevo.')
    } finally {
      setSending(false)
    }
  }

  if (shortage.isPending) {
    return (
      <div role="status" className="py-12 text-center text-sm text-muted-foreground">
        Calculando insumos en escasez…
      </div>
    )
  }

  if (shortage.isError) {
    return (
      <div role="alert" className="py-12 text-center text-sm text-destructive">
        No se pudieron obtener los insumos en escasez.
      </div>
    )
  }

  if (shortage.data.length === 0) {
    return (
      <div className="space-y-4">
        <div
          role="status"
          className="flex flex-col items-center gap-1 py-12 text-center text-muted-foreground"
        >
          <p className="text-sm">No hay insumos en escasez</p>
          <p className="text-xs">Todos los insumos están dentro del stock deseado.</p>
        </div>
        <div className="flex justify-end pt-2">
          <Button type="button" size="sm" disabled>
            Continuar →
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-foreground">Insumos en escasez</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Cantidades calculadas según el stock deseado y el stock actual.
        </p>
      </div>

      <div className="grid gap-2">
        {shortage.data.map((item) => (
          <div
            key={item.ingredient.id}
            className="flex items-center justify-between rounded-none border border-border bg-card px-4 py-3"
          >
            <div>
              <p className="text-sm font-medium text-card-foreground">{item.ingredient.name}</p>
              <p className="text-xs text-muted-foreground">
                Stock actual:{' '}
                <span className="font-mono">
                  {item.ingredient.currentStock} {item.ingredient.unit}
                </span>
              </p>
              <p className="text-xs text-muted-foreground">
                Stock deseado:{' '}
                <span className="font-mono">
                  {item.ingredient.desiredStock} {item.ingredient.unit}
                </span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">A solicitar</p>
              <p className="font-mono text-sm font-bold text-card-foreground">
                {item.qty} {item.ingredient.unit}
              </p>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}

      <div className="flex justify-end pt-2">
        <Button type="button" size="sm" disabled={sending} onClick={submit}>
          Continuar →
        </Button>
      </div>
    </div>
  )
}

/** Step 2 of the wizard — configure quantities for the selected modality. */
export function StepConfigure({ modality, onNext }: StepConfigureProps) {
  const calculate = useCalculateItems()
  const {
    register,
    handleSubmit,
    trigger,
    formState: { isValid },
  } = useForm<LibreFormValues>({
    resolver: zodResolver(libreSchema),
    mode: 'onChange',
    defaultValues: { quantities: {} },
  })
  const {
    register: registerDish,
    handleSubmit: handleSubmitDish,
    trigger: triggerDish,
    formState: { isValid: isValidDish },
  } = useForm<DishQtysFormValues>({
    resolver: zodResolver(dishQtysSchema),
    mode: 'onChange',
    defaultValues: { dishQtys: {} },
  })
  const [error, setError] = useState<string | null>(null)
  const validationRan = useRef(false)

  useEffect(() => {
    if (!validationRan.current) {
      validationRan.current = true
      void trigger()
      void triggerDish()
    }
  }, [trigger, triggerDish])

  async function submit(values: LibreFormValues) {
    const quantities = Object.fromEntries(
      Object.entries(values.quantities).filter(([, qty]) => qty > 0),
    )
    setError(null)
    try {
      const items = await calculate.mutateAsync({ modality: 'libre', quantities })
      onNext(items)
    } catch {
      setError('No se pudieron calcular las cantidades. Inténtalo de nuevo.')
    }
  }

  async function submitDishes(values: DishQtysFormValues) {
    const dishQtys = Object.fromEntries(
      Object.entries(values.dishQtys).filter(([, qty]) => qty > 0),
    )
    setError(null)
    try {
      const items = await calculate.mutateAsync({ modality: 'platillos', dishQtys })
      onNext(items)
    } catch {
      setError('No se pudieron calcular las cantidades. Inténtalo de nuevo.')
    }
  }

  if (modality === 'escasez') {
    return <EscasezConfigure calculate={calculate} onNext={onNext} />
  }

  if (modality === 'platillos') {
    return (
      <form onSubmit={handleSubmitDish(submitDishes)} noValidate className="space-y-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">Selecciona platillos y cantidades</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Los insumos se calculan automáticamente según las recetas del menú.
          </p>
        </div>

        <div className="grid gap-2">
          {DISHES.map((dish) => (
            <div
              key={dish.id}
              className="flex items-center justify-between rounded-none border border-border bg-card px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-card-foreground">{dish.name}</p>
                <p className="text-xs text-muted-foreground">
                  {dish.ingredients.length} insumos en la receta
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min={0}
                  step={0.5}
                  placeholder="0"
                  aria-label={`Cantidad de ${dish.name}`}
                  {...registerDish(`dishQtys.${dish.id}` as FieldPath<DishQtysFormValues>, {
                    setValueAs: (value: string) => {
                      const parsed = Number(value)
                      return Number.isFinite(parsed) ? parsed : 0
                    },
                  })}
                  className="w-20 rounded-none border border-input bg-background px-2 py-1.5 text-right font-mono text-sm text-foreground focus:ring-2 focus:ring-ring"
                />
                <span className="w-6 shrink-0 text-xs text-muted-foreground">unid.</span>
              </div>
            </div>
          ))}
        </div>

        {error && (
          <p role="alert" className="text-xs text-destructive">
            {error}
          </p>
        )}

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={!isValidDish || calculate.isPending} size="sm">
            Continuar →
          </Button>
        </div>
      </form>
    )
  }

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-foreground">Selecciona insumos y cantidades</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Ingresa la cantidad que deseas solicitar para cada insumo.
        </p>
      </div>

      <div className="grid gap-2">
        {INGREDIENTS.map((ingredient) => (
          <div
            key={ingredient.id}
            className="flex items-center justify-between rounded-none border border-border bg-card px-4 py-3"
          >
            <div>
              <p className="text-sm font-medium text-card-foreground">{ingredient.name}</p>
              <p className="text-xs text-muted-foreground">
                Stock actual: <span className="font-mono">{ingredient.currentStock} {ingredient.unit}</span>
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min={0}
                step={0.5}
                placeholder="0"
                aria-label={`Cantidad de ${ingredient.name}`}
                {...register(`quantities.${ingredient.id}` as FieldPath<LibreFormValues>, {
                  setValueAs: (value: string) => {
                    const parsed = Number(value)
                    return Number.isFinite(parsed) ? parsed : 0
                  },
                })}
                className="w-20 rounded-none border border-input bg-background px-2 py-1.5 text-right font-mono text-sm text-foreground focus:ring-2 focus:ring-ring"
              />
              <span className="w-6 shrink-0 text-xs text-muted-foreground">{ingredient.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={!isValid || calculate.isPending} size="sm">
          Continuar →
        </Button>
      </div>
    </form>
  )
}
