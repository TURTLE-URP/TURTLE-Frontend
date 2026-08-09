# Figma Make Brief — TURTLE Frontend

Pega este documento (o adjúntalo) en el chat de **Figma Make** antes de pedirle
que genere un prototipo. Su objetivo es que los diseños **y** el código que
genere salgan alineados al design system del repositorio, para que después
opencode los revise y los convierta en especificaciones (Spec Driven
Development).

> **Fuente de verdad**: este brief se sincroniza con
> `src/styles/index.css` y `src/components/ui/`. Si cambian los tokens o los
> componentes, actualiza este documento en el mismo PR.

---

## 1. Proyecto

- SPA: **Vite + React 19**, TypeScript en modo `strict`.
- **Tailwind CSS v4** para estilos (no CSS manual, no styled-components).
- **shadcn/ui** (preset `radix-lyra`) sobre **Radix UI**: componentes
  accesibles con variantes CVA y utilitario `cn()`.
- **TanStack Router** (rutas), **TanStack Query** (estado de servidor),
  **Zustand** (estado global), `fetch` nativo.
- Íconos: **Phosphor** (`@phosphor-icons/react`).
- Fuentes variable Fontsource: Montserrat, Playfair Display, JetBrains Mono.

**División de trabajo**: Figma Make propone diseño y código. opencode revisa el
código, lo alinea al design system y formaliza la spec + contract de
componentes. No inventes tokens ni componentes que no existan en este brief.

---

## 2. Design tokens

Usa **siempre** las variables CSS semánticas. En el código generado, refiérete
a ellas como `var(--background)`, `bg-primary`, `text-muted-foreground`, etc.
**Nunca** valores hardcodeados (`bg-white`, hex, `rgb`, `hsl`) en código.

### Light (`:root`)

| Token              | Valor (OKLCH)                          |
| ------------------ | -------------------------------------- |
| `--background`     | `oklch(1 0 0)`                         |
| `--foreground`     | `oklch(0.2235 0.0282 231.653)`         |
| `--card`           | `oklch(0.9848 0 0)`                    |
| `--card-foreground`| `oklch(0.2816 0.0392 232.234)`         |
| `--popover`        | `oklch(1 0 0)`                         |
| `--popover-foreground` | `oklch(0.2235 0.0282 231.653)`     |
| `--primary`        | `oklch(0.664 0.1341 231.161)`          |
| `--primary-foreground` | `oklch(1 0 0)`                     |
| `--secondary`      | `oklch(0.6425 0.1889 146.993)`         |
| `--secondary-foreground` | `oklch(1 0 0)`                    |
| `--muted`          | `oklch(0.964 0.0047 211.04)`           |
| `--muted-foreground` | `oklch(0.5153 0.0292 229.653)`       |
| `--accent`         | `oklch(0.5715 0.2359 260.219)`         |
| `--accent-foreground` | `oklch(1 0 0)`                     |
| `--destructive`    | `oklch(0.6356 0.2082 25.378)`          |
| `--destructive-foreground` | `oklch(0.9848 0 0)`             |
| `--border`         | `oklch(0.8909 0.0201 219.695)`         |
| `--input`          | `oklch(0.9275 0.0133 219.619)`         |
| `--ring`           | `oklch(0.664 0.1341 231.161)`          |

### Dark (`.dark`)

| Token              | Valor (OKLCH)                          |
| ------------------ | -------------------------------------- |
| `--background`     | `oklch(0.1891 0.0208 248.976)`         |
| `--foreground`     | `oklch(0.964 0.0047 211.04)`           |
| `--card`           | `oklch(0.2324 0.0295 249.194)`         |
| `--card-foreground`| `oklch(0.9856 0.0019 211.042)`         |
| `--popover`        | `oklch(0.211 0.0252 249.097)`          |
| `--popover-foreground` | `oklch(0.964 0.0047 211.04)`       |
| `--primary`        | `oklch(0.7549 0.1391 227.215)`         |
| `--primary-foreground` | `oklch(0.1549 0.0139 247.824)`     |
| `--secondary`      | `oklch(0.7169 0.1947 148.593)`         |
| `--secondary-foreground` | `oklch(0.1549 0.0139 247.824)`     |
| `--muted`          | `oklch(0.2947 0.0314 248.936)`         |
| `--muted-foreground` | `oklch(0.7678 0.0202 229.118)`       |
| `--accent`         | `oklch(0.64 0.159 257.298)`            |
| `--accent-foreground` | `oklch(1 0 0)`                     |
| `--destructive`    | `oklch(0.5288 0.1952 27.157)`          |
| `--destructive-foreground` | `oklch(1 0 0)`                   |
| `--border`         | `oklch(0.3145 0.0343 248.966)`         |
| `--input`          | `oklch(0.3628 0.0413 249.026)`         |
| `--ring`           | `oklch(0.7549 0.1391 227.215)`         |

También existen tokens `--sidebar-*` para la barra lateral (variaciones de los
mismos tonos). El dark mode se activa con la clase `.dark` en el raíz.

### Geometría y forma

- **Radio**: `--radius: 0.75rem`. Variantes derivadas: `rounded-sm` =
  `calc(0.75rem - 4px)`, `rounded-md` = `calc(0.75rem - 2px)`,
  `rounded-lg` = `0.75rem`, `rounded-xl` = `calc(0.75rem + 4px)`.
  (Excepción: los botones del preset usan `rounded-none` — respétalo.)
- **Sombras**: suaves y sutiles, definidas como `--shadow-*`
  (`hsl(200 50% 10% / ~0.05–0.25)` en light; negras `/ 0.20–0.40` en dark).
  Sin sombras duras, sin `box-shadow` inline.
- **Tracking**: base `0.025em` (`--tracking-normal`) aplicado al `body`.
- **Spacing**: escala base `0.25rem` (`--spacing`). Usa la escala de Tailwind
  (`p-2`, `gap-3`, `space-y-6`, …).

---

## 3. Tipografía

| Uso                            | Familia             | Token       |
| ------------------------------ | ------------------- | ----------- |
| UI, navegación, títulos de interfaz | **Montserrat** | `--font-sans` |
| Títulos display / branding     | **Playfair Display**| `--font-serif` |
| Datos, números, código, logs   | **JetBrains Mono**  | `--font-mono` |

- Fuentes **variable** Fontsource; úsalas por token (`font-sans`, `font-serif`,
  `font-mono`), nunca importándolas manualmente.
- Jerarquía discreta; evita pesos extremos y tamaños gigantes salvo en
  headings display.

---

## 4. Componentes (shadcn/Radix)

No inventes componentes nuevos. Construye con primitivos de
`src/components/ui/` (generados con `npx shadcn add <x>` sobre el preset
`radix-lyra`), usando **CVA** para variantes y `cn()` para merge de clases.

### Primitivos disponibles hoy

- **`Button`** — variantes: `default`, `outline`, `secondary`, `ghost`,
  `destructive`, `link`. Tamaños: `default`, `xs`, `sm`, `lg`, `icon`,
  `icon-xs`, `icon-sm`, `icon-lg`. Default: `h-8`, `text-xs`, `rounded-none`.
  Soporta `asChild` (Radix Slot) para links.

Si un flujo necesita algo más (`dialog`, `tabs`, `select`, `tooltip`,
`textarea`, `card`, …), proponlo como "agregar con `npx shadcn add`" y usa el
primitivo de Radix correspondiente. **Widgets complejos = Radix obligatorio**
(herencia ARIA correcta). Añade `Radix` + `asChild` donde aplique.

### Patrón de variantes

```tsx
const variants = cva("base classes…", {
  variants: { variant: {…}, size: {…} },
  defaultVariants: { variant: "default", size: "default" },
})
```

---

## 5. Reglas de estilo (obligatorias)

1. **Tokens semánticos únicamente** en el código: `bg-background`,
   `bg-card`, `bg-primary`, `text-foreground`, `text-muted-foreground`,
   `border-border`, `bg-muted`, etc. Prohibido hardcodear colores.
2. **Diseña en light y dark**. El dark mode se aplica con la clase `.dark` +
   variables CSS; incluye estados de ambos temas en el prototipo.
3. **Sin inline styles**; todo con clases Tailwind (salvo valores dinámicos
   imposibles como utilidades).
4. **Íconos Phosphor** (`@phosphor-icons/react`), tamaño consistente con el
   elemento (p. ej. `size-4` en botones).
5. **Estados siempre explícitos**: loading, error y empty para cualquier
   pantalla que muestre datos asíncronos.
6. **A11y (WCAG 2.1 AA)**: etiquetas en formularios, foco visible, contraste
   AA, operabilidad por teclado, información no solo por color.
7. **Prohibido en producción**: `dangerouslySetInnerHTML` (sin sanitizar),
   `console.log`, código muerto/comentado.
8. Errores y acciones destructivas con el token `destructive`; la marca usa
   `primary` (azul), `secondary` (verde) y `accent` (morado).

---

## 6. Estructura de código esperada

- Componentes de feature en `src/features/<feature>/components/`.
- Lógica de negocio separada en `src/features/<feature>/logic/` (funciones
  puras, hooks, stores) — nunca embebida en el JSX.
- Primitivos compartidos en `src/components/ui/`.
- Props con interfaces TypeScript explícitas (sin `any`) + JSDoc.
- Tests co-locados: `*.test.tsx` (componente, Vitest Browser Mode) y
  `*.test.ts` (lógica, node).

---

## 7. Salida esperada de Figma Make

Genera **ambos**:

1. **Diseño (prototipo)**: frames del flujo completo del caso de uso, con
   estados loading/error/empty y variante light/dark, usando los tokens de la
   sección 2 y la tipografía de la sección 3.
2. **Código**: React + Tailwind v4 + componentes shadcn/Radix, clases con
   tokens semánticos (CSS vars), estructura según la sección 6, listo para
   que opencode lo revise y lo formalice en spec + contract.

---

## 8. Checklist rápido

- [ ] Colores de código = tokens (`bg-*`, `text-*`, `border-*`), no valores
      crudos.
- [ ] Frames en light **y** dark.
- [ ] Estados loading / error / empty presentes.
- [ ] Widgets complejos sobre Radix; botones = `Button` existente.
- [ ] Íconos Phosphor, fuentes por token, radio/sombras del theme.
- [ ] Estructura `components/` + `logic/` con props tipadas y JSDoc.
