# Feature Specification: Gestionar Proveedores

**Feature Branch**: `002-gestionar-proveedores`

**Created**: 2026-09-11

**Status**: Draft

**Input**: Especificación de caso de uso TURTLE_ECUS04 "Gestionar Proveedores" v1.0 (06/09/2026, rev. 1.1 del 10/09/2026), diagramas UML 2.0 (caso de uso, robustez, secuencia en vista de comunicación y vista de tiempo) y prototipo de interfaz en Figma (listado paginado, modal de registro, modal de edición, diálogo de confirmación de desactivación y diálogo "Activar proveedor").

## Clarifications

### Session 2026-09-11

- Q: ¿Existen endpoints backend listos o se desarrolla contra datos simulados? → A: Backend no listo (opción B): se define primero el contrato y se trabaja contra datos simulados; la integración real queda como tarea posterior (FR-014).
- Q: ¿Se incluye la reactivación de proveedores inactivos? → A: Sí (opción A): se mantiene US-5 y FR-015; el usuario aportó además el prototipo del diálogo "Activar proveedor" (confirmación con botones "Cancelar" y "Sí, activar").
- Q: ¿Qué hace la UI si la consulta fiscal por RUC falla? → A: Bloquear con mensaje de error y opción de reintentar (opción B); no se puede continuar el registro sin los datos fiscales (FR-005).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ver listado paginado de proveedores con búsqueda (Priority: P1)

El Administrador accede al módulo "Gestionar Proveedores" y ve una tabla paginada con los proveedores registrados (columnas: Proveedor, RUC, Contacto, Ciudad, Registrado, Estado y Acciones). Puede buscar por nombre, RUC o contacto, y cambiar de página para recorrer el registro.

**Why this priority**: Sin el listado no existe el módulo: es la pantalla base sobre la que operan el registro, la edición y la desactivación. Entrega valor por sí sola (visibilidad del registro de proveedores).

**Independent Test**: Abrir el módulo con datos existentes y verificar que la tabla muestra los proveedores con sus columnas, que la búsqueda filtra el contenido y que la paginación cambia de página.

**Acceptance Scenarios**:

1. **Given** un administrador autenticado con proveedores registrados, **When** accede al módulo "Gestionar Proveedores", **Then** ve una tabla paginada con las columnas Proveedor, RUC, Contacto, Ciudad, Registrado, Estado y Acciones.
2. **Given** el listado visible, **When** ingresa "Andina" en la barra de búsqueda, **Then** la tabla muestra solo los proveedores coincidentes.
3. **Given** el listado visible con más de una página de resultados, **When** selecciona la página 2, **Then** la tabla muestra el siguiente subconjunto de proveedores.

---

### User Story 2 - Registrar nuevo proveedor (Priority: P1)

El Administrador presiona "Nuevo Proveedor", completa el formulario del modal (identificación, contacto y ubicación), el sistema autocompleta los datos fiscales al ingresar el RUC/NIT, valida la información y guarda el proveedor con estado "Activo" mostrando un mensaje de confirmación.

**Why this priority**: El alta es la operación que hace crecer el registro; sin ella el módulo es de solo lectura.

**Independent Test**: Abrir el modal, completar un RUC no registrado con datos válidos, guardar y verificar que el proveedor aparece en la lista con estado Activo junto a un mensaje de éxito.

**Acceptance Scenarios**:

1. **Given** el modal de registro abierto, **When** ingresa un RUC/NIT válido no registrado, **Then** el sistema autocompleta la Razón Social, el nombre comercial y la dirección.
2. **Given** el formulario completo y válido, **When** presiona "Registrar Proveedor", **Then** el proveedor se guarda con estado Activo, se muestra la confirmación y la lista se actualiza.
3. **Given** el formulario con campos obligatorios vacíos o con formato inválido, **When** intenta guardar, **Then** el envío se bloquea y los campos con error se resaltan con mensajes explicativos (ej. "Ingrese un RUC válido", "Email inválido", "Ingrese un teléfono válido").
4. **Given** un RUC/NIT que ya pertenece a otro proveedor, **When** intenta guardar, **Then** el sistema muestra una alerta de duplicado y no guarda el registro.
5. **Given** que la consulta de datos fiscales falla, **When** intenta continuar el registro, **Then** el sistema muestra un mensaje de error con opción de reintentar y bloquea el avance hasta obtener los datos fiscales.

---

### User Story 3 - Actualizar datos del proveedor (Priority: P1)

El Administrador ubica un proveedor en la tabla, abre "Editar", modifica los campos deseados y guarda los cambios, que se validan igual que en el registro y se confirman con un mensaje de éxito.

**Why this priority**: Los datos de contacto y fiscales cambian con el tiempo; sin edición el registro se vuelve obsoleto.

**Independent Test**: Editar el teléfono de un proveedor, guardar y verificar que el cambio queda reflejado en la tabla con mensaje de éxito.

**Acceptance Scenarios**:

1. **Given** un proveedor visible en la tabla, **When** abre la opción "Editar", **Then** el formulario carga los datos actuales del proveedor seleccionado.
2. **Given** el formulario de edición modificado con datos válidos, **When** presiona "Guardar Cambios", **Then** el registro se actualiza, se muestra el éxito y la tabla se refresca.
3. **Given** un cambio que duplica el RUC/NIT de otro proveedor, **When** intenta guardar, **Then** el sistema bloquea la operación con una alerta de duplicidad.

---

### User Story 4 - Desactivar proveedor con confirmación (Priority: P2)

El Administrador desactiva un proveedor desde la tabla; el sistema solicita confirmación explícita y cambia el estado de "Activo" a "Inactivo" conservando el registro y sus datos vinculados.

**Why this priority**: Permite retirar proveedores de la operación sin perder trazabilidad ni historial comercial; es menos frecuente que las operaciones P1.

**Independent Test**: Desactivar un proveedor Activo, confirmar la acción y verificar que pasa a Inactivo con notificación de éxito, conservando el registro visible.

**Acceptance Scenarios**:

1. **Given** un proveedor en estado Activo, **When** selecciona la opción "Desactivar", **Then** el sistema despliega un diálogo solicitando la confirmación de la acción.
2. **Given** el diálogo de confirmación visible, **When** el administrador confirma, **Then** el estado cambia a Inactivo, se notifica la desactivación exitosa y la tabla se refresca.
3. **Given** el diálogo de confirmación visible, **When** el administrador cancela, **Then** no se produce ningún cambio en el registro.

---

### User Story 5 - Reactivar proveedor inactivo (Priority: P2)

El Administrador reactiva un proveedor Inactivo desde la tabla mediante el diálogo "Activar proveedor" ("¿Deseas reactivar a {nombre}? Volverá a estar disponible en el sistema.", con botones "Cancelar" y "Sí, activar"); al confirmar, el estado vuelve a "Activo" con notificación de éxito.

**Why this priority**: Complementa la desactivación permitiendo revertirla; quedó confirmada en alcance (decisión Q2 de la sesión 2026-09-11) y cuenta con prototipo Figma del diálogo.

**Independent Test**: Reactivar un proveedor Inactivo, confirmar con "Sí, activar" y verificar que vuelve a estado Activo con notificación.

**Acceptance Scenarios**:

1. **Given** un proveedor en estado Inactivo, **When** selecciona la opción de reactivar, **Then** el sistema muestra el diálogo "Activar proveedor" con el nombre del proveedor y las acciones "Cancelar" y "Sí, activar".
2. **Given** el diálogo de activación visible, **When** el administrador confirma con "Sí, activar", **Then** el estado vuelve a Activo, se notifica el éxito y la tabla se refresca.
3. **Given** el diálogo de activación visible, **When** el administrador cancela, **Then** no se produce ningún cambio en el registro.

---

### Edge Cases

- ¿Qué pasa si no hay proveedores registrados? → La tabla muestra un estado vacío con mensaje y una acción para registrar el primero.
- ¿Qué pasa si falla la carga de datos (red no disponible o servicio caído)? → Se muestra un estado de error con opción de reintentar, sin pantalla en blanco.
- ¿Qué pasa si la consulta de datos fiscales por RUC/NIT falla o no devuelve datos? → Se muestra un mensaje de error con opción de reintentar y el registro queda bloqueado hasta obtener los datos fiscales (decisión Q3).
- ¿Qué pasa si el filtro de búsqueda no coincide con ningún proveedor? → La tabla muestra un estado de "sin resultados" para el criterio ingresado.
- ¿Qué pasa si un usuario sin rol Administrador intenta acceder al módulo o a sus operaciones? → El acceso queda restringido (precondición del ECUS04).
- ¿Qué pasa si el administrador cancela la desactivación o la reactivación? → No se produce ningún cambio (US-4 escenario 3, US-5 escenario 3).
- ¿Qué pasa si el administrador ajusta el RUC duplicado o cancela la operación? → Puede corregir el número o abandonar el registro sin efectos (flujo alternativo E del ECUS04).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE mostrar el listado de proveedores en una tabla paginada con las columnas: Proveedor, RUC, Contacto, Ciudad, Registrado, Estado y Acciones.
- **FR-002**: El sistema DEBE permitir buscar y filtrar proveedores por nombre, RUC/NIT y contacto desde la barra de filtrado. *(Nota: el ECUS04 menciona nombre y RUC/NIT; el prototipo Figma incluye además contacto. Se adopta el alcance del prototipo por ser el más amplio.)*
- **FR-003**: El sistema DEBE paginar el listado con un número fijo de elementos por página y controles para cambiar de página.
- **FR-004**: El sistema DEBE ofrecer la acción "Nuevo Proveedor" que abre un formulario modal con las secciones Identificación (Nombre Comercial, RUC/NIT, Razón Social), Contacto (Nombre de Contacto, Teléfono, Correo Electrónico) y Ubicación (Dirección, Ciudad), marcando visualmente los campos obligatorios.
- **FR-005**: Al ingresar el RUC/NIT en el registro, el sistema DEBE autocompletar los datos fiscales (Razón Social, nombre comercial y dirección). Si la consulta falla o no devuelve datos, el sistema DEBE mostrar un mensaje de error con opción de reintentar y bloquear el avance del registro hasta obtener los datos fiscales.
- **FR-006**: El sistema DEBE validar que los datos obligatorios estén completos y con formato correcto (RUC/NIT de 11 dígitos, correo electrónico válido, teléfono válido), resaltando los campos con error mediante mensajes explicativos y bloqueando el envío hasta corregirlos.
- **FR-007**: El sistema DEBE detectar si el RUC/NIT ingresado ya pertenece a otro proveedor y mostrar una alerta bloqueante que impida el guardado.
- **FR-008**: El sistema DEBE permitir editar un proveedor cargando sus datos actuales en el formulario y guardando los cambios con las mismas validaciones de formato y control de duplicidad de RUC/NIT.
- **FR-009**: El sistema DEBE ofrecer la acción "Desactivar" sobre las filas de proveedores activos y solicitar confirmación explícita antes de ejecutarla.
- **FR-010**: Al confirmar la desactivación, el sistema DEBE cambiar el estado del proveedor a Inactivo conservando el registro y sus datos vinculados (borrado lógico; nunca eliminación física).
- **FR-011**: El sistema DEBE mostrar estados explícitos de carga, error (con opción de reintentar) y vacío en el listado de proveedores.
- **FR-012**: El sistema DEBE mostrar notificaciones de éxito o error tras registrar, actualizar, desactivar o reactivar un proveedor, y refrescar la lista tras cada operación.
- **FR-013**: El módulo y sus operaciones de creación, edición, desactivación y reactivación DEBEN estar restringidos a usuarios autenticados con rol Administrador.
- **FR-014**: El backend aún no está listo: el frontend DEBE definir primero el contrato de datos de proveedores y trabajar contra datos simulados que respeten ese contrato; la integración real con los endpoints queda como tarea posterior.
- **FR-015**: El sistema DEBE ofrecer la acción de reactivar sobre las filas de proveedores inactivos mediante el diálogo "Activar proveedor" ("¿Deseas reactivar a {nombre}? Volverá a estar disponible en el sistema.", con "Cancelar" y "Sí, activar"); al confirmar, el estado vuelve a Activo con notificación de éxito.

### Key Entities

- **Proveedor**: nombre comercial, RUC/NIT (11 dígitos, único por proveedor), razón social, contacto (nombre, teléfono, correo electrónico), dirección, ciudad, fecha de registro y estado (Activo | Inactivo).
- **Listado paginado**: conjunto de proveedores visibles, página actual, tamaño de página fijo y total de registros.
- **Filtro de búsqueda**: texto libre aplicado sobre nombre, RUC/NIT y contacto.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un administrador puede completar el registro de un proveedor válido en menos de 2 minutos desde que abre el modal de "Nuevo Proveedor".
- **SC-002**: Las búsquedas, la paginación y las operaciones de alta, edición, desactivación y reactivación responden en menos de 2 segundos en condiciones normales de red.
- **SC-003**: Todos los escenarios de aceptación (listado, búsqueda, registro, edición, desactivación, reactivación y validaciones) se verifican exitosamente de punta a punta.
- **SC-004**: Ninguna desactivación elimina registros: el 100 % de los proveedores desactivados conserva sus datos y su historial consultable en el sistema.

## Assumptions

- La autenticación y el rol Administrador existen como precondición (ECUS04); el módulo asume un mecanismo de sesión y roles disponible.
- Tamaño de página por defecto: 10 registros (la regla de negocio sugiere 10 o 20 como ejemplos).
- Alcance de búsqueda: nombre + RUC/NIT + contacto (se adopta el prototipo Figma, el más amplio de ambas fuentes).
- La interfaz está en español y sigue el sistema de diseño y las reglas de componentes del proyecto (tokens de tema, accesibilidad, estados explícitos); los detalles visuales y técnicos se definen en `plan.md` y `contracts/`.
- La consulta automática de datos fiscales se sirve desde el backend; si falla, la UI bloquea el registro con mensaje de error y reintento (decisión Q3).
- Backend no listo (decisión Q1): se define primero el contrato de proveedores y se trabaja contra datos simulados; la integración real es tarea posterior y no cambia esta especificación funcional.
- La reactivación está en alcance (decisión Q2) con el diálogo "Activar proveedor" del prototipo Figma.
