# Feature Specification: Emitir Orden de Abastecimiento (CUS04)

**Feature Branch**: `feature/implement-UC04`

**Created**: 2026-08-09

**Status**: Draft

**Input**: User description:
"Elaborar la especificación del caso de uso CUS04 — Emitir Orden de
Abastecimiento, a partir de (a) la especificación del caso de uso
(Plantilla de Especificación de Caso de Uso CUS04), (b) el prototipo
generado por Figma Make en `dump/CUS04`, y (c) el design system del
proyecto (constitution v1.3.0, tokens de `src/styles/index.css`, contract
de componentes de `specs/001-project-init/contracts/components.md`)."

## Clarifications

### Session 2026-08-09 — Review of the Figma Make prototype (`dump/CUS04`)

Revisión del código generado por Make. El prototipo propone una página de
órdenes (KPIs, filtros, tabla con grupos expandibles) y un asistente de
emisión en 5 pasos (modalidad → configurar → asignar → resumen → listo).
Se registran las siguientes decisiones de alineación al design system:

- Q: ¿Se mantiene el asistente como un modal? → A: Sí, pero construido con
  **Radix Dialog** (primitivo shadcn `dialog`), no con un `<div>` custom
  (`WizardModal` actual). Obligatorio por constitution Principle VI.
- Q: ¿Cómo se selecciona el producto de proveedor por insumo? → A: Con
  **Radix RadioGroup** (primitivo shadcn `radio-group`); el prototipo usa
  `role="radio"` sobre `<button>` sin grupo gestionado, que no es operable
  por teclado de forma fiable.
- Q: ¿Se permite el color `yellow-*` hardcodeado para el estado Pendiente?
  → A: No. Los colores de estados se mapean a tokens semánticos existentes
  (ver contract). Prohibido cualquier valor de paleta crudo.
- Q: ¿Moneda y números? → A: `formatCurrency` debe usar
  `Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" })`,
  no la plantilla `S/ ${n.toFixed(2)}` (mantiene la misma salida).
- Q: ¿Los datos del prototipo (KPI, tabla, catálogos) son fuente de verdad?
  → A: No. Son **datos mock** para el prototipo. En la implementación el
  estado de servidor (historial, KPIs, insumos, catálogos) se obtiene con
  **TanStack Query**; las entidades del dominio se declaran en `logic/` y
  los cálculos (recetas, escasez, agrupación por proveedor) son funciones
  puras con tests.
- Q: ¿Tipado? → A: Strict, sin `any`, y **sin non-null assertions** (`!`);
  el prototipo usa `item.selectedProduct!` y `INGREDIENTS.find(...)!`.
- Q: ¿El botón del prototipo (`button.tsx` generado por Make) reemplaza al
  del repo? → A: No. Se usa el `Button` shadcn existente en
  `src/components/ui/button.tsx` (CVA + Radix Slot).
- Q: ¿Dark mode? → A: Se mantiene la clase `.dark` + tokens; el estado de
  tema no vive en estado local del componente sino en un store/context de
  tema (fuera de alcance de esta iteración si ya existe otro mecanismo).
- Q: ¿Emojis como íconos (p. ej. `✅` en vacío)? → A: No; se usan íconos
  Phosphor.
- Q: ¿La fila expandible de la tabla es accesible? → A: No (`onClick` sobre
  `<tr>`). Se implementa con un control expandible operable por teclado
  (botón/`aria-expanded`).

### Session 2026-08-09 — Assumptions resolved (Q&A con el equipo)

Decisiones tomadas en conjunto sobre la sección Assumptions:

- Q: ¿Existe backend/API? → A: **No en esta iteración.** Capa de API propia +
  TanStack Query con datos mock (fixtures del prototipo); lista para apuntar
  a `VITE_API_BASE_URL` cuando exista.
- Q: ¿Dónde se calculan las cantidades (por platillos / por escasez)? → A:
  **El backend calcula.** El frontend envía la configuración de la modalidad
  y recibe los ítems calculados tipados; la capa mock simula ese cómputo con
  funciones puras (mismo resultado que el prototipo).
- Q: ¿Cómo se trata el envío de la orden al proveedor? → A: **Simular el
  resultado** con un mock determinista por proveedor; la orden siempre queda
  registrada. El flujo de acuerdo posterior (enlace temporal) está fuera del
  alcance.
- Q: ¿Cómo se restringe por rol administrador? → A: **Guard de ruta con
  stub** de rol (constante/config reemplazable); se conectará al módulo de
  auth real cuando exista.
- Q: ¿Cómo se integra la pantalla en la app? → A: **Nueva ruta lazy** dentro
  del shell actual del scaffold (header/footer); no se reemplaza el shell.
- Q: ¿Primitivos shadcn a añadir? → A: **Confirmado**: `dialog`,
  `radio-group`, `badge`, `table`, `input` y `label` con `npx shadcn add`;
  sin dependencias de terceros nuevas.

### Session 2026-08-09 — Form validation (zod + react-hook-form)

- Q: ¿Cómo se valida el estado de los formularios del asistente
  (modalidad, cantidades, asignación)? → A: Con **zod + react-hook-form**
  (`useForm` + schema zod por paso vía `zodResolver`); el resultado de
  validación habilita/deshabilita `Continuar` por paso.
- Q: ¿Dependencias nuevas? → A: Sí, consultadas y aprobadas: `zod@^4.4.3`,
  `react-hook-form@^7.85.0`, `@hookform/resolvers@^5.7.1`. `zod@4.4.3` se
  deduplica con la copia que ya usa el tooling (sin conflictos; el
  `zod@3.25.76` interno de shadcn queda intacto). Sin otras dependencias.
- Q: ¿Cambia la validación de la capa de API (DTOs)? → A: No. Los type
  guards de `contracts/api.md` se mantienen; zod queda disponible para
  futura validación de DTOs cuando llegue el schema real.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Administrador revisa el historial de órdenes (Priority: P1)

El administrador accede al módulo de abastecimiento y ve un resumen del
módulo (KPIs), el historial de órdenes en una tabla y las precondiciones del
sistema. Las órdenes emitidas como parte de un mismo inicio de abasto
aparecen agrupadas en una fila expandible; las individuales como fila simple.
Puede filtrar por estado y buscar por proveedor o ID.

**Why this priority**: Sin poder ver el historial y su estado no hay contexto
para emitir órdenes; además esta pantalla es el punto de entrada del caso de
uso (Flujo Principal, pasos 1–2) y se puede entregar y validar por sí sola.

**Independent Test**: Renderizar el módulo, verificar KPIs, tabla con filas
individuales y de grupo, expandir/colapsar un grupo por teclado y ratón,
filtrar por estado y buscar.

**Acceptance Scenarios**:

1. **Given** el administrador autenticado en el módulo de abastecimiento,
   **When** la pantalla carga con datos disponibles, **Then** se muestran los
   KPIs del módulo y una tabla con el historial (estado, modalidad, total).
2. **Given** un grupo de órdenes emitidas conjuntamente, **When** el
   administrador expande la fila de grupo, **Then** se muestran las órdenes
   individuales por proveedor con su propio estado y total.
3. **Given** la tabla con datos, **When** el administrador selecciona un
   filtro de estado o escribe en la búsqueda, **Then** el listado se reduce
   a las coincidencias.
4. **Given** la tabla sin datos para el filtro, **When** se aplica el filtro,
   **Then** se muestra un estado vacío explícito (no una tabla en blanco).
5. **Given** la carga del historial desde el servidor, **When** la petición
   falla, **Then** se muestra un estado de error con opción de reintentar.

---

### User Story 2 - Administrador emite órdenes por abasto libre (Priority: P1)

El administrador abre el asistente, elige **Abasto libre**, selecciona
insumos y cantidades manualmente, asigna a cada insumo un producto
equivalente de un proveedor, revisa el resumen (agrupado por proveedor, con
costo por proveedor y total del abasto) y confirma. El sistema registra las
órdenes y notifica a cada proveedor por sus medios de contacto.

**Why this priority**: Es la ruta completa y mínima del caso de uso (Flujo
Principal pasos 3–12 y Flujo Alternativo C): sin depender de recetas ni de
cálculo de escasez, demuestra el ciclo de emisión de punta a punta y es el
MVP del feature.

**Independent Test**: Abrir el asistente, completar los 5 pasos por abasto
libre, verificar la agrupación por proveedor, los totales y la pantalla de
confirmación con estado de envío por proveedor.

**Acceptance Scenarios**:

1. **Given** el módulo de abastecimiento, **When** el administrador pulsa
   "Emitir orden(es)", **Then** se abre el asistente modal mostrando las tres
   modalidades.
2. **Given** la modalidad Abasto libre, **When** el administrador introduce
   cantidades en al menos un insumo, **Then** puede continuar al paso de
   asignación; sin cantidades, la continuación está deshabilitada.
3. **Given** el paso de asignación, **When** cada insumo tiene un producto de
   proveedor seleccionado, **Then** el resumen se habilita y los productos se
   agrupan por proveedor.
4. **Given** el resumen, **When** los productos pertenecen a varios
   proveedores, **Then** se muestra el costo total por proveedor y el costo
   total del abasto antes de confirmar.
5. **Given** el resumen revisado, **When** el administrador confirma,
   **Then** se muestran las órdenes emitidas con el estado de notificación
   por proveedor, y el historial queda actualizado al cerrar.
6. **Given** el envío a un proveedor, **When** la notificación falla,
   **Then** la orden queda registrada como pendiente de envío y el estado
   refleja el fallo (no silencioso).

---

### User Story 3 - Administrador emite órdenes por abasto por escasez (Priority: P2)

El administrador elige **Por escasez**; el sistema calcula la cantidad
necesaria de cada insumo para alcanzar su stock deseado y continúa con la
asignación y confirmación como en el flujo base.

**Why this priority**: Cubre el Flujo Alternativo B (Regla de Negocio: el
abasto por escasez se calcula para alcanzar el stock deseado). Depende del
flujo base ya cubierto por US2.

**Independent Test**: Seleccionar la modalidad, verificar los insumos bajo
stock deseado con la cantidad calculada (actual/deseado/solicitar) y el caso
en que no hay escasez (estado vacío).

**Acceptance Scenarios**:

1. **Given** la modalidad Por escasez, **When** existen insumos con stock
   actual menor al deseado, **Then** se listan con la cantidad a solicitar
   igual a `stockDeseado - stockActual`.
2. **Given** la modalidad Por escasez, **When** todos los insumos están en
   niveles óptimos, **Then** se muestra el estado vacío y no se permite
   continuar.
3. **Given** el cálculo de escasez, **When** se continúa, **Then** los ítems
   calculados pasan al paso de asignación de productos.

---

### User Story 4 - Administrador emite órdenes por abasto por platillos (Priority: P2)

El administrador elige **Por platillos**, selecciona platillos y cantidades;
el sistema calcula los insumos requeridos según las recetas registradas y
continúa con la asignación y confirmación.

**Why this priority**: Cubre el Flujo Alternativo A (Regla de Negocio: las
cantidades se calculan según recetas). Requiere el módulo de recetas como
precondición.

**Independent Test**: Seleccionar la modalidad, ajustar cantidades de
platillos, verificar que el cálculo agregue los insumos por receta, y que
sin ninguna cantidad no se pueda continuar.

**Acceptance Scenarios**:

1. **Given** la modalidad Por platillos, **When** el administrador fija la
   cantidad de al menos un platillo, **Then** el sistema calcula los insumos
   agregando `cantidad × proporción de receta` por insumo.
2. **Given** la selección de platillos, **When** ningún platillo tiene
   cantidad, **Then** no se puede continuar.
3. **Given** los insumos calculados, **When** se continúa, **Then** los ítems
   pasan al paso de asignación con las cantidades agregadas.

---

### User Story 5 - Módulo accesible, tipado y protegido por rol (Priority: P3)

La pantalla y el asistente cumplen a11y WCAG 2.1 AA, tipado estricto sin
`any` ni `!`, y solo un usuario con rol de administrador puede acceder a la
ruta y ejecutar la emisión.

**Why this priority**: Son garantías transversales (Requisitos No
Funcionales 3 y 5) que se verifican en revisión y con tests, no una
capacidad funcional nueva; por eso se entregan al final.

**Independent Test**: Revisión de teclado/foco/labels en cada paso, lint +
typecheck sin errores, y una prueba de que la ruta del módulo está protegida
para el rol administrador.

**Acceptance Scenarios**:

1. **Given** el asistente abierto, **When** se navega solo con teclado,
   **Then** todos los controles son alcanzables, con foco visible y orden
   lógico (Radix maneja dialog/radio).
2. **Given** el estado Pendiente/Error, **When** se muestra un badge,
   **Then** la información no se transmite solo por color (badge con texto).
3. **Given** un usuario sin rol administrador, **When** intenta acceder a la
   ruta del módulo, **Then** se le deniega el acceso (guard de ruta) y el
   backend rechaza la emisión.
4. **Given** el código del feature, **When** se ejecutan lint, typecheck y
   tests, **Then** pasan sin errores y sin `any`/`!`/`console.log`.

---

### Edge Cases

- No hay insumos bajo stock deseado (abasto por escasez) → estado vacío con
  guía, no permitir continuar.
- Un insumo requerido sin productos equivalentes registrados → el paso de
  asignación lo muestra como no asignable y bloquea la confirmación.
- Una orden con productos de un solo proveedor → se emite una sola orden
  (sin grupo); con varios proveedores → una orden por proveedor en un mismo
  grupo lógico.
- La notificación a un proveedor falla → la orden se registra y el estado de
  envío queda en error/pendiente, nunca se pierde el registro.
- Búsqueda/filtro sin resultados → estado vacío explícito.
- Cantidades en cero o negativas → no válidas para continuar (mínimo 0,
  step 0.5).
- Carga lenta del historial → skeleton/loading; fallo de red → estado de
  error con reintento.
- Modal con `max-h` y contenido largo → el cuerpo scrollea, cabecera y pie
  fijos.
- Cerrar el asistente a mitad de flujo → se descarta la selección sin
  registrar nada (sin confirmación previa).
- Moneda/locale: valores monetarios con formato es-PE (PEN).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El módulo de abastecimiento MUST mostrar un historial de
  órdenes en tabla: filas individuales y filas de grupo expandibles
  (órdenes emitidas en un mismo inicio de abasto), con ID/grupo, proveedor,
  fecha, modalidad, estado y total.
- **FR-002**: El módulo MUST mostrar KPIs (órdenes del mes, pendientes de
  acuerdo, gasto total del período, insumos en escasez) con sus valores de
  servidor.
- **FR-003**: El historial MUST permitir filtrar por estado y buscar por
  proveedor o ID, con estado vacío cuando no hay coincidencias.
- **FR-004**: La emisión MUST usar un asistente modal con los pasos:
  modalidad → configurar → asignar productos → resumen → confirmación,
  con navegación Atrás/Continuar y validación por paso.
- **FR-005**: El asistente MUST soportar las tres modalidades: abasto por
  platillos (cálculo por recetas), abasto por escasez (cálculo al stock
  deseado) y abasto libre (selección manual).
- **FR-006**: Cada insumo requerido MUST asignarse a un producto de
  proveedor equivalente registrado; los productos MUST agruparse por
  proveedor y mostrar costo por proveedor y costo total del abasto antes de
  confirmar.
- **FR-007**: Al confirmar, el sistema MUST registrar una orden por proveedor
  (relacionadas en un grupo lógico cuando se emitieron juntas) con fecha,
  productos, cantidades y costos, y MUST reflejar el estado de notificación
  por proveedor (enviada / error).
- **FR-008**: Todo dato asíncrono MUST cubrir estados loading, error y empty
  (TanStack Query).
- **FR-009**: El estilo MUST usar tokens semánticos (light/dark vía clase
  `.dark`), sin colores hardcodeados, con fuentes del theme, íconos Phosphor
  y el `Button` shadcn existente.
- **FR-010**: Los widgets complejos (modal del asistente, selección de
  producto) MUST usar primitivos Radix (shadcn `dialog`, `radio-group`); la
  tabla expandible MUST ser operable por teclado.
- **FR-011**: El acceso a la ruta del módulo y a la emisión MUST estar
  restringido al rol administrador.
- **FR-012**: El feature MUST incluir tests de lógica (cálculos puros) y
  tests de componente (Vitest Browser Mode) para cada componente, según
  constitution Principle III.
- **FR-013**: El código MUST cumplir TypeScript strict: sin `any`, sin
  non-null assertions (`!`), sin `console.log` en producción.
- **FR-014**: La lógica de dominio (tipos, formato, agrupación) MUST vivir en
  `logic/` como funciones puras separadas de los componentes; los cálculos de
  cantidades (por platillos y por escasez) MUST residir en la capa de API
  mock (simulando al backend) como funciones puras y tipadas, consumidos por
  los hooks de TanStack Query. El contrato de datos (endpoints, mapeo
  DTO↔dominio y validación, migración mock→backend) se define en
  `contracts/api.md`.

### Key Entities

- **Orden de Abastecimiento**: dirigida a un proveedor; contiene fecha de
  emisión, productos, cantidades, costo y estado (`Emitida`, `Pendiente`,
  `Acordada`, `Entregada`, `Error`).
- **Grupo de órdenes (inicio de abasto)**: relación lógica entre las órdenes
  emitidas en un mismo acto de abastecimiento (una por proveedor).
- **Insumo interno**: ítem de inventario con `stockActual`, `stockDeseado`,
  unidad y categoría.
- **Platillo / Receta**: platillo con proporción de insumo por unidad.
- **Producto de proveedor**: producto comercializado por un proveedor,
  equivalente a un insumo interno, con costo unitario, unidad y medio de
  contacto del proveedor.
- **Relación de equivalencia**: vínculo insumo interno ↔ producto de
  proveedor (registrado fuera de este módulo).
- **Proveedor**: entidad externa con catálogo y medios de contacto.
- **Modalidad de abasto**: `platillos` | `escasez` | `libre`.
- **Estado de notificación**: resultado del envío a cada proveedor.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un administrador puede completar el flujo completo de emisión
  (modalidad → configuración → asignación → resumen → confirmación → estado
  de envío) en menos de 2 minutos con datos de ejemplo.
- **SC-002**: El historial muestra correctamente grupos expandibles y
  órdenes individuales y refleja una nueva emisión al cerrar el asistente.
- **SC-003**: 100 % de los cálculos puros (recetas, escasez, agrupación por
  proveedor, formato de moneda) cubiertos por tests de lógica; cada
  componente del feature con su test de componente pasando en Browser Mode.
- **SC-004**: `lint`, `typecheck`, `test`, `test:components` y `build` pasan
  sin errores; sin `any`, `!`, colores hardcodeados ni `console.log` en el
  código del feature.
- **SC-005**: El módulo cumple WCAG 2.1 AA (modal y radios Radix, tabla
  expandible por teclado, estados no solo por color).

## Assumptions (resolved 2026-08-09)

- **No hay backend en esta iteración.** El estado de servidor se modela con
  una capa de API propia + **TanStack Query** y fixtures que simulan las
  respuestas; la capa queda lista para apuntar a `VITE_API_BASE_URL` cuando
  exista backend. Los datos del prototipo
  (`dump/CUS04/src/features/supply-orders/logic/data.ts`) son la base de los
  fixtures, no fuente de verdad.
- **El backend calcula las cantidades de abasto** (por platillos y por
  escasez). El frontend envía la configuración de la modalidad (cantidades de
  platillos o stock de insumos) y recibe los ítems calculados tipados. La
  capa mock simula ese cómputo (funciones puras en la capa API) y se
  reemplaza por la respuesta real cuando exista backend.
- **El envío de notificaciones se simula** con un resultado determinista por
  proveedor en la capa API; la UI queda lista para el endpoint real. La orden
  siempre queda registrada aunque el envío simulado "falle". El flujo de
  acuerdo posterior (enlace temporal) está fuera del alcance de este feature.
- **Rol administrador: guard de ruta con stub.** Se implementa un guard que
  consulta un stub de rol (constante/config reemplazable) y deniega el acceso
  al módulo a roles que no sean admin; se conectará al módulo de auth real
  cuando exista.
- Los primitivos shadcn `dialog`, `radio-group`, `badge`, `table`, `input` y
  `label` se agregan con `npx shadcn add` sobre el preset `radix-lyra`. La
  validación de formularios del asistente usa `zod` + `react-hook-form` +
  `@hookform/resolvers` (dependencias directas consultadas y aprobadas en la
  sesión de clarificación del 2026-08-09); no se introducen otras
  dependencias de terceros.
- El módulo se integra como ruta con lazy loading dentro del shell actual
  (header/footer del scaffold); no se reemplaza el shell del prototipo.
