import { create } from 'zustand'

interface AppState {
  appName: string
  ui: {
    theme: 'light'
  }
}

export const useAppStore = create<AppState>(() => ({
  appName: import.meta.env.VITE_APP_NAME ?? 'TURTLE Frontend',
  ui: { theme: 'light' },
}))
