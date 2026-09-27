# Feature Specification: Ver Cotizaciones

**Feature Branch**: `003-ver-cotizaciones`

**Created**: 2026-09-27

**Status**: Draft

**Input**: User description: "@TURTLE_ECUS01-Ver_Cotizaciones-v1.0.docx.pdf es el siguiente caso de uso a elaborar."

**Amendment 2026-09-27**: el botón global para empezar una nueva cotización queda fuera del alcance — no debe existir en la vista del maestro.

**Source**: Especificación de Caso de Uso TURTLE_ECUS01 "Ver Cotizaciones" v1.0 (24/09/2026, autor Leiva Chavez Edgar Franco) — Sistema Web para Optimizar el Proceso Operativo en el Restaurante "El Rinconcito Norteño". Incluye diagramas UML 2.0 (caso de uso, robustez, secuencia en vista de comunicación y vista de tiempo).

## Clarifications

### Session 2026-09-27

- Q: ¿Por qué campos debe poder buscar y filtrar el administrador en el maestro de cotizaciones? → A: Opción C: búsqueda por texto libre (folio, proveedor) + filtro por estado + filtro por rango de fechas.
- Q: ¿Qué columnas debe mostrar cada fila de la tabla del maestro de cotizaciones? → A: Opción C: folio, proveedor, fecha, estado, total/monto y acciones.
- Q: ¿Cómo debe presentarse una acción no disponible por el estado de la solicitud? → A: Opción B: deshabilitada con explicación visible del motivo.
- Q: ¿La opción "ver detalles" está siempre disponible para todas las cotizaciones? → A: Opción A: sí, siempre disponible en todas las filas sin restricción de estado.
- Q: ¿Existen endpoints backend listos para el maestro de cotizaciones, o se desarrolla primero contra datos simulados? → A: Opción B: backend no listo; se define primero el contrato y se trabaja contra datos simulados, la integración real queda como tarea posterior.
- Nota: el enlace al prototipo Figma incluido en el documento fuente no es válido y no se usa como referencia; los criterios de búsqueda/filtrado y las columnas se definieron en esta sesión de clarificación.
- Q: ¿Mensajes distintos para "maestro vacío" y "sin resultados de búsqueda", o uno solo? → A: Opción A: dos mensajes distintos, el de sin resultados menciona el criterio de búsqueda usado.
- Q: ¿Cómo debe comportarse la paginación en los bordes y al cambiar criterios? → A: Opción A: botones anterior/siguiente deshabilitados en los bordes y retorno a la página 1 al cambiar búsqueda o filtros.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visualizar maestro de cotizaciones con búsqueda, filtrado y paginación (Priority: P1)

El Administrador accede al apartado operativo del sistema, hace clic en "Cotizaciones" y ve una lista con todas las cotizaciones registradas junto a controles de búsqueda, filtrado y navegación por páginas.

**Why this priority**: Es el núcleo del caso de uso; sin el maestro visible no existe ningún punto de partida para las demás acciones. Entrega valor por sí sola (visibilidad y localización de cotizaciones).

**Independent Test**: Acceder al apartado con cotizaciones registradas y verificar que la lista se muestra con sus controles de búsqueda, filtrado y paginación funcionando.

**Acceptance Scenarios**:

1. **Given** un administrador autenticado, **When** accede al apartado operativo y hace clic en "Cotizaciones", **Then** el sistema muestra la lista con todas las cotizaciones registradas.
2. **Given** la lista visible, **When** ingresa un criterio en la búsqueda, **Then** la lista muestra solo las cotizaciones coincidentes.
3. **Given** la lista visible, **When** aplica un filtro, **Then** la lista muestra solo las cotizaciones que cumplen el criterio del filtro.
4. **Given** la lista visible con más de una página de resultados, **When** navega a otra página, **Then** la lista muestra el subconjunto correspondiente manteniendo búsqueda y filtros aplicados.

---

### User Story 2 - Acceder a las acciones por cotización según estado de la solicitud (Priority: P1)

El Administrador ve en cada fila de la lista las opciones disponibles (cerrar cotización, ver Orden de Compra, ver detalles) y accede a cada una: el cierre abre un modal con el formulario inicial, ver Orden de Compra y ver detalles abren una nueva pestaña con el detalle correspondiente.

**Why this priority**: Es el propósito operativo del maestro: derivar a las acciones. Sin estas opciones la lista es de solo lectura y el flujo de abastecimiento se interrumpe.

**Independent Test**: Abrir la lista con cotizaciones en distintos estados y verificar que cada fila ofrece las acciones que le corresponden y que cada acción deriva al destino correcto (modal o nueva pestaña).

**Acceptance Scenarios**:

1. **Given** una cotización cuya solicitud vinculada está en estado "en negociación", **When** el administrador usa la opción cerrar cotización de esa fila, **Then** el sistema muestra un modal con el formulario para empezar el cierre (extiende a Cerrar Cotización).
2. **Given** una cotización cuya solicitud vinculada está en estado "aprobada", **When** el administrador usa la opción ver Orden de Compra de esa fila, **Then** el sistema abre una nueva pestaña con los detalles de la Orden de Compra (extiende a Ver Orden de Compra).
3. **Given** cualquier cotización de la lista, **When** el administrador usa la opción ver detalles de esa fila, **Then** el sistema abre una nueva pestaña con los detalles de la Cotización (extiende a Ver Cotización).
4. **Given** una cotización cuya solicitud vinculada NO está en estado "aprobada", **When** se muestra su fila, **Then** la opción ver Orden de Compra no está disponible.
5. **Given** una cotización cuya solicitud vinculada NO está en estado "en negociación", **When** se muestra su fila, **Then** la opción cerrar cotización no está disponible.

### Edge Cases

- ¿Qué muestra el sistema cuando no hay ninguna cotización registrada (estado vacío)?
- ¿Qué muestra el sistema cuando la búsqueda o la combinación de filtros no devuelve resultados?
- La paginación deshabilita anterior/siguiente en los bordes y retorna a la página 1 al cambiar búsqueda o filtros (sesión 2026-09-27, FR-016).
- Las acciones no disponibles por estado de la solicitud se muestran deshabilitadas con la explicación visible del motivo (sesión 2026-09-27).
- ¿Qué ocurre si la sesión del administrador expiró al intentar abrir el maestro o una acción?
- ¿Qué ocurre si el navegador bloquea la apertura de la nueva pestaña (ver Orden de Compra / ver detalles)?
- ¿Qué ocurre si la carga del maestro falla o supera el tiempo esperado (mensaje de error y reintento)?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST permitir únicamente al administrador autenticado acceder al apartado operativo "Cotizaciones".
- **FR-002**: El sistema MUST mostrar en el maestro la lista con todas las cotizaciones registradas.
- **FR-003**: El sistema MUST ofrecer búsqueda por texto libre sobre la lista de cotizaciones, coincidiendo al menos contra folio y proveedor.
- **FR-004**: El sistema MUST ofrecer filtrado sobre la lista de cotizaciones por estado y por rango de fechas.
- **FR-005**: El sistema MUST ofrecer navegación por páginas sobre la lista de cotizaciones.
- **FR-006**: El sistema MUST mostrar por cada cotización de la lista sus opciones de acción: cerrar cotización, ver Orden de Compra y ver detalles.
- **FR-007**: El sistema MUST abrir un modal con el formulario para empezar el cierre al usar la opción cerrar cotización (flujo que se extiende a Cerrar Cotización).
- **FR-008**: El sistema MUST abrir en una nueva pestaña los detalles de la Orden de Compra al usar la opción ver Orden de Compra (flujo que se extiende a Ver Orden de Compra).
- **FR-009**: El sistema MUST abrir en una nueva pestaña los detalles de la Cotización al usar la opción ver detalles (flujo que se extiende a Ver Cotización); esta opción está siempre disponible en todas las filas, sin restricción por estado de la solicitud.
- **FR-010**: El sistema MUST permitir la opción ver Orden de Compra solo cuando la solicitud vinculada a la cotización esté en estado "aprobada"; en cualquier otro estado la opción se muestra deshabilitada con una explicación visible del motivo.
- **FR-011**: El sistema MUST permitir la opción cerrar cotización solo cuando la solicitud vinculada a la cotización esté en estado "en negociación"; en cualquier otro estado la opción se muestra deshabilitada con una explicación visible del motivo.
- **FR-012**: El sistema MUST devolver los registros del maestro de cotizaciones en menos de 2 segundos.
- **FR-013**: El sistema MUST mostrar dos estados diferenciados: (a) cuando no existan cotizaciones registradas, un mensaje de maestro vacío; (b) cuando la búsqueda/filtros no coincidan con ningún registro, un mensaje que indique que no se encontraron resultados bajo el criterio de búsqueda usado.
- **FR-014**: El sistema MUST mostrar un mensaje de error comprensible con opción de reintentar cuando la carga del maestro falle.
- **FR-015**: El sistema MUST NOT mostrar ningún botón global para empezar una nueva cotización en la vista del maestro.
- **FR-016**: El sistema MUST deshabilitar los botones anterior/siguiente de la paginación en la primera/última página y MUST retornar a la página 1 cuando cambien la búsqueda o los filtros.

### Key Entities

- **Cotización**: Registro central del maestro; representa una cotización del proceso de abastecimiento. Atributos visibles en lista y detalle según prototipo (identificador, datos de referencia, estado derivado de su solicitud vinculada). Se relaciona con una Solicitud y, cuando aplica, con una Orden de Compra.
- **Solicitud vinculada**: Solicitud de abastecimiento que origina la cotización; su estado ("aprobada", "en negociación", otros) determina qué acciones están disponibles sobre la cotización.
- **Orden de Compra**: Documento derivado de una cotización cuya solicitud fue aprobada; se consulta en una nueva pestaña desde la fila correspondiente.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El administrador localiza una cotización concreta usando búsqueda o filtros en menos de 1 minuto desde que abre el maestro.
- **SC-002**: El 100% de las filas muestra únicamente las acciones permitidas por el estado de su solicitud vinculada (sin acciones indebidas disponibles).
- **SC-003**: El maestro con registros se muestra completo en menos de 2 segundos en condiciones normales de uso.
- **SC-004**: El 95% de los intentos de navegación (cambiar de página, abrir modal de cierre, abrir detalle en nueva pestaña) se completan sin errores desde la perspectiva del usuario.
- **SC-005**: El 90% de los administradores completa a la primera la tarea de ubicar una cotización y derivar a la acción correcta sin ayuda adicional.

## Assumptions

- Se reutiliza el mecanismo de autenticación y el apartado operativo existentes; el caso de uso no define login ni estructura del menú.
- El backend aún no está listo: primero se define el contrato de datos del maestro y se trabaja contra datos simulados; la integración real queda como tarea posterior.
- Los criterios de búsqueda y filtrado son los definidos en la sesión de clarificación del 2026-09-27 (búsqueda por texto libre contra folio y proveedor; filtros por estado y rango de fechas). No hay prototipo UI de referencia.
- Las columnas de la tabla del maestro son: folio, proveedor, fecha, estado, total/monto y acciones. El detalle completo de cada cotización vive en su vista de detalle.
- Los flujos extendidos (Cerrar Cotización, Ver Orden de Compra, Ver Cotización/detalle) están fuera del alcance de este spec y se especifican por separado; aquí solo se exige la derivación correcta (modal vs. nueva pestaña).
- La creación de una nueva cotización está fuera del alcance de este spec: la vista del maestro no incluye ningún punto de entrada de creación (decisión del 2026-09-27).
- Los estados de solicitud relevantes son "aprobada" y "en negociación"; otros estados muestran las acciones restringidas deshabilitadas con la explicación del motivo, sin bloquear el resto de la fila.
- La apertura en "nueva pestaña" respeta el comportamiento estándar del navegador; si el navegador la bloquea, se informa al usuario cómo permitirla.
