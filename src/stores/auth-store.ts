import { create } from 'zustand'

export interface AuthSession {
  email: string
  token: string
}

interface AuthState {
  session: AuthSession | null
  signIn: (session: AuthSession) => void
  signOut: () => void
}

const STORAGE_KEY = 'turtle.auth.session'

function readStoredSession(): AuthSession | null {
  if (typeof sessionStorage === 'undefined') {
    return null
  }

  const raw = sessionStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return null
  }

  try {
    const parsed = JSON.parse(raw) as Partial<AuthSession>
    if (typeof parsed.email === 'string' && typeof parsed.token === 'string') {
      return { email: parsed.email, token: parsed.token }
    }
  } catch {
    sessionStorage.removeItem(STORAGE_KEY)
  }

  return null
}

export const useAuthStore = create<AuthState>((set) => ({
  session: readStoredSession(),
  signIn: (session) => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    set({ session })
  },
  signOut: () => {
    sessionStorage.removeItem(STORAGE_KEY)
    set({ session: null })
  },
}))
