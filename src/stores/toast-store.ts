import { create } from 'zustand'

export interface Toast {
  id: string
  tono: 'success' | 'error'
  mensaje: string
}

interface ToastStoreState {
  toasts: Toast[]
  notificar: (tono: Toast['tono'], mensaje: string, id?: string) => void
  descartar: (id: string) => void
}

export const useToastStore = create<ToastStoreState>((set) => ({
  toasts: [],
  notificar: (tono, mensaje, id) => {
    const toast: Toast = { id: id ?? crypto.randomUUID(), tono, mensaje }
    set((state) => ({ toasts: [...state.toasts, toast] }))
  },
  descartar: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}))