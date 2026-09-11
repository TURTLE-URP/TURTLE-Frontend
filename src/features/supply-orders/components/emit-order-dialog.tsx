import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  dishes,
  dishInputs,
  rawMaterials,
  lowStockItems,
  getProductsForRawMaterial,
  getRawMaterialName,
  getRawMaterialUnit,
} from '../logic/catalog'
import { buildOrderRowFromSelection, type NeededInput } from '../logic/build-order-from-selection'
import type { SupplyOrderRow } from '../logic/mock-data'

type Modality = 'platillos' | 'escasez' | 'libre'
type Step = 'modalidad' | 'seleccion' | 'productos' | 'revision'

export interface EmitOrderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  existingIds: string[]
  onOrderCreated: (row: SupplyOrderRow) => void
}

const modalityInfo: Record<Modality, { title: string; description: string }> = {
  platillos: {
    title: 'Abasto por platillos',
    description: 'Calcula los insumos según las recetas de los platillos que selecciones.',
  },
  escasez: {
    title: 'Abasto por escasez',
    description: 'El sistema calcula automáticamente lo necesario para llegar al stock deseado.',
  },
  libre: {
    title: 'Abasto libre',
    description: 'Selecciona directamente los insumos y cantidades que deseas solicitar.',
  },
}

export function EmitOrderDialog({ open, onOpenChange, existingIds, onOrderCreated }: EmitOrderDialogProps) {
  const [step, setStep] = useState<Step>('modalidad')
  const [modality, setModality] = useState<Modality | null>(null)
  const [dishQty, setDishQty] = useState<Record<string, number>>({})
  const [freeQty, setFreeQty] = useState<Record<string, number>>({})
  const [neededInputs, setNeededInputs] = useState<NeededInput[]>([])
  const [selectedProducts, setSelectedProducts] = useState<Record<string, string>>({})

  function resetAndClose() {
    setStep('modalidad')
    setModality(null)
    setDishQty({})
    setFreeQty({})
    setNeededInputs([])
    setSelectedProducts({})
    onOpenChange(false)
  }

  function goToSelection(chosen: Modality) {
    setModality(chosen)
    if (chosen === 'escasez') {
      const computed: NeededInput[] = lowStockItems.map((item) => ({
        rawMaterialId: item.rawMaterialId,
        rawMaterialName: getRawMaterialName(item.rawMaterialId),
        qty: item.neededQty,
        unit: getRawMaterialUnit(item.rawMaterialId),
      }))
      setNeededInputs(computed)
      setStep('productos')
    } else {
      setStep('seleccion')
    }
  }

  function confirmDishSelection() {
    const totals = new Map<string, number>()
    for (const dish of dishes) {
      const qty = dishQty[dish.id] ?? 0
      if (qty <= 0) continue
      for (const input of dishInputs[dish.id] ?? []) {
        totals.set(input.rawMaterialId, (totals.get(input.rawMaterialId) ?? 0) + input.qtyPerDish * qty)
      }
    }
    const computed: NeededInput[] = Array.from(totals.entries()).map(([rawMaterialId, qty]) => ({
      rawMaterialId,
      rawMaterialName: getRawMaterialName(rawMaterialId),
      qty: Math.round(qty * 100) / 100,
      unit: getRawMaterialUnit(rawMaterialId),
    }))
    setNeededInputs(computed)
    setStep('productos')
  }

  function confirmFreeSelection() {
    const computed: NeededInput[] = Object.entries(freeQty)
      .filter(([, qty]) => qty > 0)
      .map(([rawMaterialId, qty]) => ({
        rawMaterialId,
        rawMaterialName: getRawMaterialName(rawMaterialId),
        qty,
        unit: getRawMaterialUnit(rawMaterialId),
      }))
    setNeededInputs(computed)
    setStep('productos')
  }

  const allProductsSelected = neededInputs.every((input) => selectedProducts[input.rawMaterialId])

  function handleConfirmOrder() {
    const newRow = buildOrderRowFromSelection({
      modality: modality ? modalityInfo[modality].title : 'Libre',
      neededInputs,
      selectedProducts,
      existingIds,
    })
    onOrderCreated(newRow)
    resetAndClose()
  }

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? onOpenChange(true) : resetAndClose())}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        {step === 'modalidad' && (
          <>
            <DialogHeader>
              <DialogTitle>Emitir orden(es) de abastecimiento</DialogTitle>
              <DialogDescription>Elige la modalidad de abasto que quieres usar.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 py-2">
              {(Object.keys(modalityInfo) as Modality[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => goToSelection(key)}
                  className="rounded-lg border border-border p-4 text-left transition-colors hover:border-foreground hover:bg-muted/40"
                >
                  <p className="font-medium text-foreground">{modalityInfo[key].title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{modalityInfo[key].description}</p>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 'seleccion' && modality === 'platillos' && (
          <>
            <DialogHeader>
              <DialogTitle>Selecciona platillos y cantidades</DialogTitle>
              <DialogDescription>El sistema calculará los insumos según la receta de cada uno.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2">
              {dishes.map((dish) => (
                <div key={dish.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <span className="text-sm font-medium text-foreground">{dish.name}</span>
                  <input
                    type="number"
                    min={0}
                    value={dishQty[dish.id] ?? 0}
                    onChange={(event) =>
                      setDishQty((prev) => ({ ...prev, [dish.id]: Number(event.target.value) }))
                    }
                    className="w-20 rounded-md border border-border bg-card px-2 py-1 text-right text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setStep('modalidad')}>Atrás</Button>
              <Button onClick={confirmDishSelection}>Continuar</Button>
            </DialogFooter>
          </>
        )}

        {step === 'seleccion' && modality === 'libre' && (
          <>
            <DialogHeader>
              <DialogTitle>Selecciona insumos y cantidades</DialogTitle>
              <DialogDescription>Indica directamente qué insumos y cuánto deseas solicitar.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2">
              {rawMaterials.map((rawMaterial) => (
                <div key={rawMaterial.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <span className="text-sm font-medium text-foreground">
                    {rawMaterial.name} <span className="text-muted-foreground">({rawMaterial.unit})</span>
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={freeQty[rawMaterial.id] ?? 0}
                    onChange={(event) =>
                      setFreeQty((prev) => ({ ...prev, [rawMaterial.id]: Number(event.target.value) }))
                    }
                    className="w-20 rounded-md border border-border bg-card px-2 py-1 text-right text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setStep('modalidad')}>Atrás</Button>
              <Button onClick={confirmFreeSelection}>Continuar</Button>
            </DialogFooter>
          </>
        )}

        {step === 'productos' && (
          <>
            <DialogHeader>
              <DialogTitle>Elige el producto por proveedor</DialogTitle>
              <DialogDescription>
                Para cada insumo, selecciona qué producto equivalente quieres adquirir.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              {neededInputs.map((input) => (
                <div key={input.rawMaterialId} className="rounded-lg border border-border p-3">
                  <p className="mb-2 text-sm font-medium text-foreground">
                    {input.rawMaterialName} — {input.qty} {input.unit}
                  </p>
                  <RadioGroup
                    value={selectedProducts[input.rawMaterialId] ?? ''}
                    onValueChange={(value) =>
                      setSelectedProducts((prev) => ({ ...prev, [input.rawMaterialId]: value }))
                    }
                  >
                    {getProductsForRawMaterial(input.rawMaterialId).map((product) => (
                      <div key={product.id} className="flex items-center gap-2 py-1">
                        <RadioGroupItem value={product.id} id={product.id} />
                        <Label htmlFor={product.id} className="flex-1 cursor-pointer text-sm">
                          {product.productName} — {product.providerName}
                        </Label>
                        <span className="text-sm text-muted-foreground">S/ {product.unitPrice.toFixed(2)}</span>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setStep(modality === 'escasez' ? 'modalidad' : 'seleccion')}>
                Atrás
              </Button>
              <Button disabled={!allProductsSelected} onClick={() => setStep('revision')}>
                Continuar
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 'revision' && (
          <RevisionStep
            modality={modality}
            neededInputs={neededInputs}
            selectedProducts={selectedProducts}
            onBack={() => setStep('productos')}
            onConfirm={handleConfirmOrder}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

function RevisionStep({
  neededInputs,
  selectedProducts,
  onBack,
  onConfirm,
}: {
  modality: Modality | null
  neededInputs: NeededInput[]
  selectedProducts: Record<string, string>
  onBack: () => void
  onConfirm: () => void
}) {
  const grouped = new Map<string, { qty: number; price: number; items: string[] }>()

  for (const input of neededInputs) {
    const productId = selectedProducts[input.rawMaterialId]
    const product = getProductsForRawMaterial(input.rawMaterialId).find((candidate) => candidate.id === productId)
    if (!product) continue

    const entry = grouped.get(product.providerName)
    const lineTotal = product.unitPrice * input.qty
    const label = `${input.rawMaterialName}: ${input.qty} ${input.unit}`
    if (entry) {
      entry.qty += 1
      entry.price += lineTotal
      entry.items.push(label)
    } else {
      grouped.set(product.providerName, { qty: 1, price: lineTotal, items: [label] })
    }
  }

  const total = Array.from(grouped.values()).reduce((sum, entry) => sum + entry.price, 0)

  return (
    <>
      <DialogHeader>
        <DialogTitle>Revisar y confirmar</DialogTitle>
        <DialogDescription>Órdenes que se generarán, agrupadas por proveedor.</DialogDescription>
      </DialogHeader>
      <div className="space-y-3 py-2">
        {Array.from(grouped.entries()).map(([providerName, entry]) => (
          <div key={providerName} className="rounded-lg border border-border p-3">
            <div className="flex items-center justify-between">
              <p className="font-medium text-foreground">{providerName}</p>
              <p className="font-medium text-foreground">S/ {entry.price.toFixed(2)}</p>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{entry.items.join(' · ')}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-border pt-3 text-sm font-semibold text-foreground">
        <span>Costo total del abasto</span>
        <span>S/ {total.toFixed(2)}</span>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onBack}>Atrás</Button>
        <Button onClick={onConfirm}>Confirmar orden(es)</Button>
      </DialogFooter>
    </>
  )
}