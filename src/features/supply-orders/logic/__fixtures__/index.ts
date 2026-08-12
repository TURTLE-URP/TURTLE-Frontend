import type { Dish, HistoryEntry, Ingredient, SupplyKpis, SupplierProduct } from '../types'

export const INGREDIENTS: Ingredient[] = [
  { id: 'i1', name: 'Harina de trigo', unit: 'kg', currentStock: 8, desiredStock: 25, category: 'Secos' },
  { id: 'i2', name: 'Aceite de oliva', unit: 'L', currentStock: 3, desiredStock: 10, category: 'Aceites' },
  { id: 'i3', name: 'Tomate', unit: 'kg', currentStock: 5, desiredStock: 20, category: 'Frescos' },
  { id: 'i4', name: 'Queso mozzarella', unit: 'kg', currentStock: 2, desiredStock: 8, category: 'Lácteos' },
  { id: 'i5', name: 'Pechuga de pollo', unit: 'kg', currentStock: 6, desiredStock: 15, category: 'Carnes' },
  { id: 'i6', name: 'Pasta spaghetti', unit: 'kg', currentStock: 4, desiredStock: 12, category: 'Secos' },
  { id: 'i7', name: 'Crema de leche', unit: 'L', currentStock: 1, desiredStock: 6, category: 'Lácteos' },
  { id: 'i8', name: 'Cebolla', unit: 'kg', currentStock: 7, desiredStock: 15, category: 'Frescos' },
]

export const DISHES: Dish[] = [
  {
    id: 'd1',
    name: 'Pizza Margherita',
    ingredients: [
      { ingredientId: 'i1', qty: 0.3 },
      { ingredientId: 'i3', qty: 0.15 },
      { ingredientId: 'i4', qty: 0.12 },
      { ingredientId: 'i2', qty: 0.02 },
    ],
  },
  {
    id: 'd2',
    name: 'Pasta Alfredo',
    ingredients: [
      { ingredientId: 'i6', qty: 0.2 },
      { ingredientId: 'i7', qty: 0.08 },
      { ingredientId: 'i4', qty: 0.06 },
    ],
  },
  {
    id: 'd3',
    name: 'Pollo al ajillo',
    ingredients: [
      { ingredientId: 'i5', qty: 0.25 },
      { ingredientId: 'i2', qty: 0.03 },
      { ingredientId: 'i8', qty: 0.1 },
    ],
  },
  {
    id: 'd4',
    name: 'Pasta Napolitana',
    ingredients: [
      { ingredientId: 'i6', qty: 0.2 },
      { ingredientId: 'i3', qty: 0.12 },
      { ingredientId: 'i8', qty: 0.08 },
    ],
  },
]

export const SUPPLIER_PRODUCTS: SupplierProduct[] = [
  { id: 'p1', name: 'Harina sin preparar 25 kg', supplierId: 's1', supplierName: 'Molinos del Norte', contact: 'pedidos@molinosnorte.pe', unit: 'saco 25 kg', unitCost: 58.5, ingredientId: 'i1' },
  { id: 'p2', name: 'Harina integral 5 kg', supplierId: 's2', supplierName: 'Distribuidora Granos SA', contact: 'ventas@granos.pe', unit: 'bolsa 5 kg', unitCost: 14.9, ingredientId: 'i1' },
  { id: 'p3', name: 'Aceite oliva virgen extra 5 L', supplierId: 's3', supplierName: 'Importadora Mediterránea', contact: 'compras@imed.pe', unit: 'bidón 5 L', unitCost: 89.0, ingredientId: 'i2' },
  { id: 'p4', name: 'Aceite oliva clásico 1 L', supplierId: 's4', supplierName: 'Food Express Perú', contact: 'pedidos@foodexpress.pe', unit: 'botella 1 L', unitCost: 21.5, ingredientId: 'i2' },
  { id: 'p5', name: 'Tomate pera caja 10 kg', supplierId: 's5', supplierName: 'Agro Fresh SAC', contact: 'ventas@agrofresh.pe', unit: 'caja 10 kg', unitCost: 28.0, ingredientId: 'i3' },
  { id: 'p6', name: 'Tomate cherry 5 kg', supplierId: 's5', supplierName: 'Agro Fresh SAC', contact: 'ventas@agrofresh.pe', unit: 'caja 5 kg', unitCost: 18.5, ingredientId: 'i3' },
  { id: 'p7', name: 'Mozzarella bloque 2 kg', supplierId: 's6', supplierName: 'Lácteos del Campo', contact: 'admin@lacteosdecampo.pe', unit: 'bloque 2 kg', unitCost: 42.0, ingredientId: 'i4' },
  { id: 'p8', name: 'Mozzarella rallada 1 kg', supplierId: 's4', supplierName: 'Food Express Perú', contact: 'pedidos@foodexpress.pe', unit: 'bolsa 1 kg', unitCost: 24.9, ingredientId: 'i4' },
  { id: 'p9', name: 'Pechuga entera bandeja 5 kg', supplierId: 's7', supplierName: 'Carnes Premium SRL', contact: 'ventas@carnespremium.pe', unit: 'bandeja 5 kg', unitCost: 72.0, ingredientId: 'i5' },
  { id: 'p10', name: 'Spaghetti n.º 5 × 500 g', supplierId: 's2', supplierName: 'Distribuidora Granos SA', contact: 'ventas@granos.pe', unit: 'paquete 500 g', unitCost: 3.8, ingredientId: 'i6' },
  { id: 'p11', name: 'Crema de leche UHT 1 L', supplierId: 's6', supplierName: 'Lácteos del Campo', contact: 'admin@lacteosdecampo.pe', unit: 'caja 1 L', unitCost: 9.5, ingredientId: 'i7' },
  { id: 'p12', name: 'Cebolla blanca malla 10 kg', supplierId: 's5', supplierName: 'Agro Fresh SAC', contact: 'ventas@agrofresh.pe', unit: 'malla 10 kg', unitCost: 15.0, ingredientId: 'i8' },
]

export const ORDER_HISTORY: HistoryEntry[] = [
  {
    groupId: 'G-001',
    date: '2026-07-20',
    modality: 'Por escasez',
    orders: [
      { id: 'OA-0011', supplier: 'Agro Fresh SAC', date: '2026-07-20', status: 'Acordada', total: 186.5, products: 3 },
      { id: 'OA-0012', supplier: 'Lácteos del Campo', date: '2026-07-20', status: 'Entregada', total: 94.0, products: 2 },
      { id: 'OA-0013', supplier: 'Molinos del Norte', date: '2026-07-20', status: 'Entregada', total: 175.5, products: 1 },
    ],
  },
  { id: 'OA-0010', supplier: 'Carnes Premium SRL', date: '2026-07-18', status: 'Entregada', total: 216.0, products: 1 },
  {
    groupId: 'G-002',
    date: '2026-07-15',
    modality: 'Por platillos',
    orders: [
      { id: 'OA-0008', supplier: 'Food Express Perú', date: '2026-07-15', status: 'Acordada', total: 112.4, products: 2 },
      { id: 'OA-0009', supplier: 'Distribuidora Granos SA', date: '2026-07-15', status: 'Pendiente', total: 57.0, products: 2 },
    ],
  },
  { id: 'OA-0007', supplier: 'Importadora Mediterránea', date: '2026-07-10', status: 'Entregada', total: 267.0, products: 1 },
]

export const KPIS: SupplyKpis = {
  ordersMonth: 12,
  pendingAgreements: 2,
  spendPeriod: 1108,
  shortageIngredients: 6,
}
