import { create } from 'zustand'
import { validateEnv } from '../lib/env/env'

interface AppState {
  appName: string
  ui: {
    theme: 'light'
  }
}

const config = validateEnv()

export const useAppStore = create<AppState>(() => ({
  appName: config.VITE_APP_NAME,
  ui: { theme: 'light' },
}))
