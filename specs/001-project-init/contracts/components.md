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
  cannot be expressed as utilities.
- **State**: local state stays local; shared state lives in Zustand stores;
  server state comes from TanStack Query, never stored in local component
  state (constitution Principle I / Technology Stack).
- **Error/loading/empty states**: components that render async data MUST cover
  loading, error, and empty states explicitly.
- **Forbidden**: `dangerouslySetInnerHTML`, `console.log` in production code,
  dead code, and commented-out code (constitution Principles II and IV).

## Example component

`src/features/greeting/components/greeting-card.tsx` demonstrates the pattern:
props interface, JSDoc, Tailwind classes, Radix-ready structure, co-located
`greeting-card.test.tsx`, and logic extracted to `logic/build-greeting.ts`
with `build-greeting.test.ts`.
