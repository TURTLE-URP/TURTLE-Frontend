# Rol
Eres un ingeniero de software senior que trabaja con un usuario NO técnico que habla español.
Implementarás por fases la feature "Gestionar Proveedores". La ejecución es POR FASES y con VALIDACIÓN
del usuario entre una y otra.

REGLAS DE FASE (críticas):
- Ejecutas SOLO la fase que el usuario te pida. Al terminar una fase: corre los gates, marca [X] en tasks.md,
  presenta un resumen checkpoint en español sencillo y SUGIERE un mensaje de commit en español.
- A continuación te DETIENES y esperas la aprobación del usuario para pasar a la siguiente fase.
- NO executes la fase siguiente por tu cuenta. NO commitees tú: el usuario commitea (o lo pide).

# Flujo esperado (cada fase = una nueva sesión de opencode)
1. Sesión A: Fase 6 (US4, T034–T036) → parar y esperar aprobación.
2. Sesión B: Fase 7 (US5, T037–T038) → parar y esperar aprobación.
3. Sesión C: Fase 8 (Polish, T039–T043) → termina módulo + PR.

# Proyecto
- Ruta: C:\Users\Mauri\Desktop\TP_2026-2\TURTLE-Frontend (repo git, Windows PowerShell).
- Plan general con specs y contratos: `specs/002-gestionar-proveedores/tasks.md`, `spec.md`,
  `quickstart.md` (14 escenarios), `contracts/`, `data-model.md` — LÉELOS.
- 43 tareas T001–T043 en 8 fases. Fases 1–5 COMPLETAS (T001–T033 [X]).
  HEAD actual (working tree limpio): 9164513 "feat: editar proveedor reutilizando el diálogo (US3)".
  Rama actual: `002-gestionar-proveedores`.
- Dependencias de fases: Fase 6 depende solo de `useCambiarEstado` (ya existe);
  Fase 7 depende de US4 (`proveedor-confirm-dialog`); Fase 8 depende de todas las historias.

# Stack (ya instalado; NO instalar nada)
- Vite 8 + React 19 + TypeScript estricto (sin `any`, sin `@ts-ignore`).
- Tailwind v4; shadcn/ui preset radix-lyra (base en `src/components/ui/`); iconos @phosphor-icons/react.
- TanStack Router (file-based, `src/routes/`), TanStack Query v5, Zustand v5, Radix UI.
- Vitest 4 con 2 proyectos: `logic` (node, `.test.ts`) y `components` (browser+Playwright Chromium,
  `.test.tsx`, alias `@/` por proyecto, screenshots de fallo en `__screenshots__`). Node >=24, ESLint flat, Prettier.
- Scripts: `npm test` (logic), `npm run test:components`, `npm run typecheck`, `npm run lint`, `npm run build`
  (regenera routeTree.gen.ts), `npm run audit`.

# Constitución (NO negociable)
1. Test-first: test ANTES del código → verlo fallar (RED) → implementar (GREEN) → gates.
2. TypeScript estricto. 3. Lint 0 errores nuevos (baseline: 2 warnings pre-existentes en badge.tsx/button.tsx).
4. Sin console.log. 5. WCAG 2.1 AA: queries por rol, aria-label, foco gestionado, tecla Esc.
6. Sin dependencias nuevas sin consultar. 7. NO comentarios en código.
8. UI 100% fiel al Figma que el usuario adjunta (copy en español, fechas dd/mm/yyyy).
9. Marcar [X] en tasks.md SOLO con la herramienta Edit (NUNCA PowerShell Set-Content: corrompe acentos UTF-8).
10. No tocar código de fases anteriores salvo wiring estrictamente necesario.
11. NO commitees: sugiere mensaje de commit en español (firma del estilo "feat: ... (US#)").

# Estado de gates (baseline antes de Fase 6)
- `npm test` → 79 passed / 10 files.  - `npm run test:components` → 47 passed / 9 files.
- typecheck 0 errores, lint 0 errores, build OK. Tras Fase 6 esperado: components 55 / 10 files.

# ===== FASE 6 (US4 "Desactivar proveedor con confirmación") =====
Goal: "Desactivar" pide confirmación explícita; al confirmar, estado → Inactivo conservando el registro
(soft-delete, FR-009/FR-010, SC-004); cancelar no cambia nada; toast de éxito + refresh (FR-012).

## T034 [P][US4] Test (RED primero): `src/features/proveedores/components/proveedor-confirm-dialog.test.tsx`
- si `abierto=false` NO renderiza nada (abre solo tras una acción).
- confirm/cancel llaman SOLO a su handler.  - foco al diálogo al abrir; Escape → onCancelar.
- copy configurable (título, descripción, texto del botón confirmar).
- botones deshabilitados mientras `procesando`.
Patrón de `proveedor-form-dialog.test.tsx` (@testing-library/react + jest-dom). No requiere QueryClient.

## T035 [US4] Implementar `src/features/proveedores/components/proveedor-confirm-dialog.tsx`
Radix Dialog reutilizable con props EXACTAS:
`{ abierto: boolean; titulo: string; descripcion: React.ReactNode; textoConfirmar: string;
   tono: 'peligro' | 'info'; procesando: boolean; onCancelar: () => void; onConfirmar: () => void }`
- Si `!abierto` → `return null`.  - `<Dialog open={abierto} onOpenChange={(open) => { if (!open) onCancelar() }}>`.
- `DialogContent className="sm:max-w-md"`; DialogHeader: icono circular (peligro: WarningCircle en bg-red-100;
  info: CheckCircle en bg-green-100) + DialogTitle + DialogDescription; DialogFooter: Cancelar
  (`variant="outline"` en `DialogClose asChild`) + confirmación (textoConfirmar), ambos `disabled={procesando}`.
  Peligro: bg-red-600 text-white hover:bg-red-700; Info: bg-blue-700 text-white hover:bg-blue-800.
- Look coherente con `proveedor-form-dialog.tsx`. Verificar visual con screenshot.

## T036 [US4] Wiring en `src/features/proveedores/pages/proveedores-page.tsx`
- `const [desactivando, setDesactivando] = useState<Proveedor | null>(null)`.
- ProveedoresTable recibe `onDesactivar={(p) => setDesactivando(p)}` (hoy `() => {}`);
  dejar `onReactivar={() => {}}` (Fase 7). Botón "Desactivar" YA existe en la tabla (fila Activo, MinusCircle, aria-label).
- Renderizar cuando `desactivando`:
  `<ProveedorConfirmDialog abierto titulo="Desactivar proveedor"
     descripcion={<>¿Deseas desactivar a <strong>{desactivando.nombreComercial}</strong>? El registro se conservará pero no estará disponible para nuevas operaciones.</>}
     textoConfirmar="Sí, desactivar" tono="peligro" procesando={cambiarEstado.isPending}
     onCancelar={() => setDesactivando(null)} onConfirmar={() => { ... }} />`
- onConfirmar: `cambiarEstado.mutate({ id: desactivando.id, estado: 'Inactivo' }, {
     onSuccess: () => { notificar('success', 'Proveedor desactivado correctamente.'); setDesactivando(null) },
     onError: (err) => { notificar('error', err instanceof Error ? err.message : 'No se pudo desactivar el proveedor.'); setDesactivando(null) } })`
- `useCambiarEstado()` YA existe (`proveedores-query.ts`; invalida `['proveedores']` → auto-refresh).
- Toast: `useToastStore((s) => s.notificar)`, `ToastRegion` YA montado en __root.tsx (NO tocar).
- Verificar copy exacto contra las imágenes Figma del usuario.

## Coverage de ruta (parte de T036) en `src/routes/proveedores.test.tsx`
Helper existente `renderPagina()`. 2 tests:
1. desactiva con confirmación: findByText('Agro Andina',{timeout:4000}) → click "Desactivar" →
   findByRole('dialog',{name:'Desactivar proveedor'}) → click 'Sí, desactivar' →
   waitFor toast 'Proveedor desactivado correctamente.' → dialog cerrado.
2. cancelar no cambia nada: click "Desactivar" → click 'Cancelar' → dialog cerrado, sin toast.
⚠ TRAMPA: aria-label "Desactivar" se repite en cada fila → usar
  `screen.getAllByRole('button', { name: 'Desactivar' })[0]`, NUNCA `getByRole`.

## Cierre de Fase 6
1. Gates: typecheck, lint, `npm test`, `test:components` (esperado 55/10), `build`.
2. Marcar [X] T034–T036 en tasks.md. 3. Limpiar `__screenshots__`. 4. Resumen checkpoint + commit sugerido:
   `feat: desactivar proveedor con confirmación (US4)`. 5. DETENTE y espera aprobación.

# ===== FASE 7 (US5 "Reactivar proveedor inactivo") =====
Goal: sobre una fila Inactiva, diálogo "Activar proveedor" con copy de Figma:
"¿Deseas reactivar a {nombre}? Volverá a estar disponible en el sistema.",
botones "Cancelar" y "Sí, activar"; al confirmar → Activo + toast (FR-015, Q2=A).

## T037 [P][US5] Extender `proveedor-confirm-dialog.test.tsx`
Cover del copy de reactivación: botón "Sí, activar", texto con el nombre del proveedor.

## T038 [US5] Wiring de reactivación
"Reactivar" en filas Inactivo de proveedores-table → `ProveedorConfirmDialog` con copy de Figma →
`useCambiarEstado('Activo')` → toast "Proveedor activado correctamente." + refresh.
La tabla YA muestra el botón "Reactivar" (fila Inactivo, CheckCircle, aria-label "Reactivar"),
hoy conectado a `onReactivar={() => {}}` en la página. Estado local `const [activando, setActivando] = useState<Proveedor | null>(null)`. tono="info", textoConfirmar="Sí, activar".
Cierre: gates, marcar [X] T037–T038, checkpoint + commit: `feat: reactivar proveedor inactivo (US5)`. DETENTE.

# ===== FASE 8 (Polish & Cross-Cutting Concerns) =====
- T039 [P]: Ejecutar los 14 escenarios de `specs/002-gestionar-proveedores/quickstart.md` contra el mock
  y corregir toda discrepancia.
- T040 [P]: Actualizar README.md: módulo Proveedores, ruta /proveedores, contrato mock-first y swap del
  adapter (FR-014).
- T041: Gates completos: `npm run lint`, `npm run typecheck`, `npm test`, `npm run test:components`,
  `npm run build`, `npm run audit` — todos exit code 0.
- T042 [P]: Revisión final: RUC duplicado (error-toast), a11y (labels, foco, contraste AA, solo-color no informa),
  sin console.log/código muerto, seams de port/HOOK limpios.
- T043: Commits por grupo lógico con Conventional Commits (`feat:`/`test:`/`docs:`) en rama
  `002-gestionar-proveedores` y abrir PR a `main` referenciando spec + tests (política de merge híbrida).
  OJO: T043 es la única tarea que sí implica commit/PR; confirmar con el usuario antes de pushear/abrir PR.

# Comunicación
Español, simple, sin jerga; explica cada paso (T034→T035→T036…), reporta números de gates y alerta de cualquier
variación respecto al Figma. Entre fases, DETENTE y espera la palabra del usuario para continuar.