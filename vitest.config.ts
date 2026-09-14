import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'
import { fileURLToPath, URL } from 'node:url'

const alias = {
  '@': fileURLToPath(new URL('./src', import.meta.url)),
}

export default defineConfig({
  optimizeDeps: {
    include: ['@testing-library/react', '@testing-library/jest-dom/vitest', 'react', 'react/jsx-dev-runtime'],
  },
  test: {
    projects: [
      {
        resolve: { alias },
        test: {
          name: 'logic',
          environment: 'node',
          include: ['src/**/*.test.ts'],
        },
      },
      {
        resolve: { alias },
        test: {
          name: 'components',
          environment: 'node',
          include: ['src/**/*.test.tsx'],
          setupFiles: ['./vitest.setup.ts'],
          browser: {
            enabled: true,
            provider: playwright(),
            headless: true,
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
})
