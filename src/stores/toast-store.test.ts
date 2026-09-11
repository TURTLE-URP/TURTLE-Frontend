import { beforeEach, describe, expect, it } from 'vitest'
import { useToastStore } from './toast-store'

describe('useToastStore', () => {
  beforeEach(() => {
    useToastStore.setState({ toasts: [] })
  })

  it('encola un toast con su tono y mensaje', () => {
    useToastStore.getState().notificar('success', 'Proveedor registrado', 't1')
    expect(useToastStore.getState().toasts).toEqual([
      { id: 't1', tono: 'success', mensaje: 'Proveedor registrado' },
    ])
  })

  it('soporta el tono de error', () => {
    useToastStore.getState().notificar('error', 'Error al guardar', 't1')
    expect(useToastStore.getState().toasts[0]?.tono).toBe('error')
  })

  it('encola varios toasts preservando el orden', () => {
    useToastStore.getState().notificar('error', 'Error al guardar', 't1')
    useToastStore.getState().notificar('success', 'Cambios guardados', 't2')
    expect(useToastStore.getState().toasts.map((t) => t.id)).toEqual(['t1', 't2'])
  })

  it('descarta un toast por su id (prune)', () => {
    useToastStore.getState().notificar('success', 'A', 't1')
    useToastStore.getState().notificar('error', 'B', 't2')
    useToastStore.getState().descartar('t1')
    expect(useToastStore.getState().toasts.map((t) => t.id)).toEqual(['t2'])
  })

  it('descarta un id inexistente sin efectos', () => {
    useToastStore.getState().notificar('success', 'A', 't1')
    useToastStore.getState().descartar('zzz')
    expect(useToastStore.getState().toasts).toHaveLength(1)
  })
})