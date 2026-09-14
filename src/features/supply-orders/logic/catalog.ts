export interface RawMaterial {
  id: string
  name: string
  unit: string
}

export interface Dish {
  id: string
  name: string
}

export interface ProviderProduct {
  id: string
  providerId: string
  providerName: string
  rawMaterialId: string
  productName: string
  unitPrice: number
}

export const rawMaterials: RawMaterial[] = [
  { id: 'rm-carne', name: 'Carne de res', unit: 'kg' },
  { id: 'rm-pollo', name: 'Pollo', unit: 'kg' },
  { id: 'rm-pescado', name: 'Pescado', unit: 'kg' },
  { id: 'rm-cebolla', name: 'Cebolla', unit: 'kg' },
  { id: 'rm-limon', name: 'Limón', unit: 'kg' },
  { id: 'rm-aji', name: 'Ají amarillo', unit: 'kg' },
  { id: 'rm-papa', name: 'Papa', unit: 'kg' },
]

export const dishes: Dish[] = [
  { id: 'd-lomo', name: 'Lomo Saltado' },
  { id: 'd-ceviche', name: 'Ceviche Mixto' },
  { id: 'd-aji', name: 'Ají de Gallina' },
]

// Receta: qué insumos y cuánto necesita cada platillo, por unidad
export const dishInputs: Record<string, { rawMaterialId: string; qtyPerDish: number }[]> = {
  'd-lomo': [
    { rawMaterialId: 'rm-carne', qtyPerDish: 0.3 },
    { rawMaterialId: 'rm-cebolla', qtyPerDish: 0.1 },
  ],
  'd-ceviche': [
    { rawMaterialId: 'rm-pescado', qtyPerDish: 0.25 },
    { rawMaterialId: 'rm-limon', qtyPerDish: 0.15 },
    { rawMaterialId: 'rm-cebolla', qtyPerDish: 0.05 },
  ],
  'd-aji': [
    { rawMaterialId: 'rm-pollo', qtyPerDish: 0.3 },
    { rawMaterialId: 'rm-aji', qtyPerDish: 0.1 },
    { rawMaterialId: 'rm-papa', qtyPerDish: 0.2 },
  ],
}

// Insumos que hoy están bajo su stock deseado (para la modalidad "por escasez")
export const lowStockItems: { rawMaterialId: string; neededQty: number }[] = [
  { rawMaterialId: 'rm-carne', neededQty: 5 },
  { rawMaterialId: 'rm-pescado', neededQty: 3 },
  { rawMaterialId: 'rm-papa', neededQty: 10 },
  { rawMaterialId: 'rm-aji', neededQty: 2 },
]

// Relación de equivalencia insumo ↔ producto ofrecido por cada proveedor
export const providerProducts: ProviderProduct[] = [
  { id: 'pp-1', providerId: 'prov-carnes-premium', providerName: 'Carnes Premium SRL', rawMaterialId: 'rm-carne', productName: 'Carne de res - corte bife', unitPrice: 28 },
  { id: 'pp-2', providerId: 'prov-agro-fresh', providerName: 'Agro Fresh SAC', rawMaterialId: 'rm-carne', productName: 'Carne de res importada', unitPrice: 31 },
  { id: 'pp-3', providerId: 'prov-avicola', providerName: 'Avícola San Juan', rawMaterialId: 'rm-pollo', productName: 'Pollo entero fresco', unitPrice: 9 },
  { id: 'pp-4', providerId: 'prov-pesquera', providerName: 'Pesquera del Pacífico', rawMaterialId: 'rm-pescado', productName: 'Filete de pescado blanco', unitPrice: 22 },
  { id: 'pp-5', providerId: 'prov-mediterranea', providerName: 'Importadora Mediterránea', rawMaterialId: 'rm-pescado', productName: 'Pescado congelado premium', unitPrice: 19 },
  { id: 'pp-6', providerId: 'prov-agro-fresh', providerName: 'Agro Fresh SAC', rawMaterialId: 'rm-cebolla', productName: 'Cebolla roja', unitPrice: 2.5 },
  { id: 'pp-7', providerId: 'prov-agro-fresh', providerName: 'Agro Fresh SAC', rawMaterialId: 'rm-limon', productName: 'Limón fresco', unitPrice: 4 },
  { id: 'pp-8', providerId: 'prov-especias-andinas', providerName: 'Especias Andinas', rawMaterialId: 'rm-aji', productName: 'Ají amarillo fresco', unitPrice: 6 },
  { id: 'pp-9', providerId: 'prov-molinos-norte', providerName: 'Molinos del Norte', rawMaterialId: 'rm-papa', productName: 'Papa blanca', unitPrice: 1.8 },
]

export function getProductsForRawMaterial(rawMaterialId: string): ProviderProduct[] {
  return providerProducts.filter((product) => product.rawMaterialId === rawMaterialId)
}

export function getRawMaterialName(id: string): string {
  return rawMaterials.find((rawMaterial) => rawMaterial.id === id)?.name ?? id
}

export function getRawMaterialUnit(id: string): string {
  return rawMaterials.find((rawMaterial) => rawMaterial.id === id)?.unit ?? ''
}