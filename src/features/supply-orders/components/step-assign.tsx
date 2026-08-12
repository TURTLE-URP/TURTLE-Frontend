import { useEffect, useMemo, useRef } from 'react'
import { CheckCircle, Warning } from '@phosphor-icons/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { formatCurrency } from '../logic/calculations'
import { SUPPLIER_PRODUCTS } from '../logic/__fixtures__'
import { buildAssignSchema } from './step-assign.form'
import type { FieldPath } from 'react-hook-form'
import type { OrderItem, SupplierProduct } from '../logic/types'
import type { AssignFormValues } from './step-assign.form'

interface StepAssignProps {
  /** Required items; each gains a selectedProduct as the administrator assigns. */
  items: OrderItem[]
  /** Called whenever an assignment changes so the parent can sync. */
  onUpdate: (items: OrderItem[]) => void
  /** Called with the fully assigned items to advance to the summary. */
  onNext: (items: OrderItem[]) => void
}

/** Step 3 of the wizard — assign a supplier product to each ingredient. */
export function StepAssign({ items, onUpdate, onNext }: StepAssignProps) {
  const schema = useMemo(
    () => buildAssignSchema(items.map((item) => item.ingredient.id)),
    [items],
  )
  const { control, handleSubmit, trigger, formState } = useForm<AssignFormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: { selections: {} },
  })
  const selections = useWatch<AssignFormValues, 'selections'>({ control, name: 'selections' })
  const validationRan = useRef(false)

  useEffect(() => {
    if (!validationRan.current) {
      validationRan.current = true
      void trigger()
    }
  }, [trigger])

  function handleUpdate(item: OrderItem, product: SupplierProduct) {
    onUpdate(
      items.map((entry) =>
        entry.ingredient.id === item.ingredient.id ? { ...entry, selectedProduct: product } : entry,
      ),
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-foreground">Asignar productos de proveedor</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Selecciona el producto equivalente para cada insumo requerido.
        </p>
      </div>

      <div className="grid gap-3">
        {items.map((item) => {
          const products = SUPPLIER_PRODUCTS.filter(
            (product) => product.ingredientId === item.ingredient.id,
          )
          const isAssigned = Boolean(selections?.[item.ingredient.id])

          return (
            <div
              key={item.ingredient.id}
              className="overflow-hidden rounded-none border border-border bg-card"
            >
              <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-2.5">
                <div>
                  <p className="text-xs font-semibold text-foreground">{item.ingredient.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    Requerido: <span className="font-mono">{item.qty} {item.ingredient.unit}</span>
                  </p>
                </div>
                {isAssigned && (
                  <CheckCircle
                    size={16}
                    weight="fill"
                    className="shrink-0 text-secondary"
                    aria-label="Producto asignado"
                  />
                )}
              </div>

              <div className="space-y-1.5 p-2.5">
                <Controller
                  control={control}
                  name={`selections.${item.ingredient.id}` as FieldPath<AssignFormValues>}
                  render={({ field }) => (
                    <RadioGroup
                      value={typeof field.value === 'string' ? field.value : ''}
                      onValueChange={(value) => {
                        field.onChange(value)
                        const product = products.find((prod) => prod.id === value)
                        if (product) {
                          handleUpdate(item, product)
                        }
                      }}
                    >
                      {products.length === 0 ? (
                        <p className="px-1.5 py-2 text-xs italic text-muted-foreground">
                          Sin productos equivalentes registrados para este insumo.
                        </p>
                      ) : (
                        products.map((product) => {
                          const optionId = `${item.ingredient.id}-${product.id}`
                          return (
                            <div
                              key={product.id}
                              className="flex items-start gap-2.5 rounded-none border border-border px-3 py-2.5 transition-colors hover:bg-muted/40"
                            >
                              <RadioGroupItem value={product.id} id={optionId} />
                              <Label htmlFor={optionId} className="flex-1 cursor-pointer items-start">
                                <span className="block text-xs font-semibold text-foreground">
                                  {product.name}
                                </span>
                                <span className="block text-[11px] text-muted-foreground">
                                  {product.supplierName} · por {product.unit}
                                </span>
                                <span className="mt-0.5 block font-mono text-[11px] font-semibold text-foreground">
                                  {formatCurrency(product.unitCost)}
                                </span>
                              </Label>
                            </div>
                          )
                        })
                      )}
                    </RadioGroup>
                  )}
                />
              </div>
            </div>
          )
        })}
      </div>

      {!formState.isValid && (
        <p role="alert" className="flex items-center gap-1.5 text-xs text-chart-4">
          <Warning size={14} weight="fill" />
          Asigna un producto a cada insumo para continuar.
        </p>
      )}

      <div className="flex justify-end pt-2">
        <Button
          onClick={() => handleSubmit(() => onNext(items))()}
          disabled={!formState.isValid}
          size="sm"
        >
          Ver resumen →
        </Button>
      </div>
    </div>
  )
}
