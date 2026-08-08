# Contract: Component API

**Feature**: Project Init | **Date**: 2026-08-02

Defines the rules every component in this SPA must follow. Consumers: all
feature developers. Reference: `src/components/ui/` and `src/features/`.

## Rules

- **Props**: explicit, documented TypeScript interfaces; no implicit `any`.
- **Documentation**: public components document their props and usage via
  JSDoc (constitution Documentation section).
- **Tests**: every component ships its own component test (Vitest Browser Mode)
  covering rendering and interaction (props, states, events, accessibility);
  business logic is extracted to `logic/` and covered by a separate logic test
  (constitution Principle III).
- **Accessibility**: semantic HTML; every interactive element keyboard
  operable with a visible focus indicator; labels on form controls; complex
  widgets built on Radix UI primitives (constitution Principle VI).
- **Styling**: Tailwind CSS only; no inline styles beyond dynamic values that
  cannot be expressed as utilities. Colors MUST come from the semantic theme
  tokens defined in `src/styles/index.css` (`bg-background`, `bg-card`,
  `bg-primary`, `text-foreground`, `text-muted-foreground`, `border-border`,
  `bg-muted`, etc.) — never from hardcoded palette values such as `bg-white`
  or `text-zinc-900` — so the light/dark theme applies consistently. Dark
  mode is driven by the `.dark` class + CSS variables.
- **UI primitives**: shared primitives live in `src/components/ui/` and MUST
  be generated with shadcn (`components.json`, `npx shadcn add`), using
  `class-variance-authority` for variants and the `cn` utility from
  `@/lib/utils` to merge classes. Icons come from `@phosphor-icons/react`.
- **Fonts**: typography uses the Fontsource variable fonts declared in the
  theme (Montserrat, Playfair Display, JetBrains Mono); font families MUST
  use the theme tokens (`--font-sans`, `--font-serif`, `--font-mono`).
- **State**: local state stays local; shared state lives in Zustand stores;
  server state comes from TanStack Query, never stored in local component
  state (constitution Principle I / Technology Stack).
- **Error/loading/empty states**: components that render async data MUST cover
  loading, error, and empty states explicitly.
- **Forbidden**: `dangerouslySetInnerHTML`, `console.log` in production code,
  dead code, and commented-out code (constitution Principles II and IV).

## Example component

`src/features/greeting/components/greeting-card.tsx` demonstrates the pattern:
props interface, JSDoc, Tailwind classes with theme tokens, Radix-ready
structure, co-located `greeting-card.test.tsx`, and logic extracted to
`logic/build-greeting.ts` with `build-greeting.test.ts`.

`src/components/ui/button.tsx` demonstrates the UI-primitive pattern: a
shadcn-generated primitive with CVA variants/sizes, Radix Slot support, and
theme-token styling; it is used on the home route alongside the greeting card.
