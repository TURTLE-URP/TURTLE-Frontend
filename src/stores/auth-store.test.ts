import { beforeEach, describe, expect, it, vi } from 'vitest'

const memory = new Map<string, string>()

const storage: Storage = {
  get length() {
    return memory.size
  },
  clear: () => memory.clear(),
  getItem: (key) => memory.get(key) ?? null,
  key: (index) => [...memory.keys()][index] ?? null,
  removeItem: (key) => {
    memory.delete(key)
  },
  setItem: (key, value) => {
    memory.set(key, value)
  },
}

describe('useAuthStore', () => {
  beforeEach(() => {
    memory.clear()
    vi.resetModules()
    Object.defineProperty(globalThis, 'sessionStorage', {
      configurable: true,
      value: storage,
    })
  })

  it('stores the session after sign in', async () => {
    const { useAuthStore } = await import('./auth-store')
    useAuthStore.getState().signIn({ email: 'ana@turtle.pe', token: 'demo' })
    expect(useAuthStore.getState().session).toEqual({
      email: 'ana@turtle.pe',
      token: 'demo',
    })
    expect(sessionStorage.getItem('turtle.auth.session')).toContain('ana@turtle.pe')
  })

  it('clears the session on sign out', async () => {
    const { useAuthStore } = await import('./auth-store')
    useAuthStore.getState().signIn({ email: 'ana@turtle.pe', token: 'demo' })
    useAuthStore.getState().signOut()
    expect(useAuthStore.getState().session).toBeNull()
    expect(sessionStorage.getItem('turtle.auth.session')).toBeNull()
  })
})
