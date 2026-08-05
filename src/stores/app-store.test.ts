import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('useAppStore', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('reads the app name from the validated environment', async () => {
    vi.stubEnv('VITE_APP_NAME', 'Turtle')
    const { useAppStore } = await import('./app-store')
    expect(useAppStore.getState().appName).toBe('Turtle')
    expect(useAppStore.getState().ui.theme).toBe('light')
  })

  it('fails fast when the required variable is missing', async () => {
    vi.stubEnv('VITE_APP_NAME', '')
    await expect(import('./app-store')).rejects.toThrow(/VITE_APP_NAME/)
  })
})
