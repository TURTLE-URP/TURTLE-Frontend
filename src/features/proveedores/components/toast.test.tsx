import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useToastStore } from '@/stores/toast-store'
import { ToastRegion } from './toast'

beforeEach(() => {
  useToastStore.setState({ toasts: [] })
})

describe('ToastRegion', () => {
  it('no renderiza nada cuando no hay toasts', () => {
    render(<ToastRegion />)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('muestra un toast del store con su mensaje', () => {
    useToastStore.getState().notificar('success', 'Proveedor registrado', 't1')
    render(<ToastRegion />)
    expect(screen.getByText('Proveedor registrado')).toBeInTheDocument()
  })

  it('muestra varios toasts en el orden encolado', () => {
    useToastStore.getState().notificar('error', 'Error al guardar', 't1')
    useToastStore.getState().notificar('success', 'Cambios guardados', 't2')
    render(<ToastRegion />)
    const mensajes = screen
      .getAllByRole('status')
      .map((el) => el.querySelector('p')?.textContent)
    expect(mensajes).toEqual(['Error al guardar', 'Cambios guardados'])
  })

  it('descarta un toast al presionar su botón de cierre', () => {
    useToastStore.getState().notificar('success', 'Proveedor registrado', 't1')
    render(<ToastRegion />)
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar notificación' }))
    expect(screen.queryByText('Proveedor registrado')).not.toBeInTheDocument()
  })

  it('usa una región viva ARIA (aria-live) para anuncios accesibles', () => {
    useToastStore.getState().notificar('error', 'Atención', 't1')
    render(<ToastRegion />)
    expect(screen.getByText('Atención').closest('[aria-live]')).toHaveAttribute(
      'aria-live',
      'polite',
    )
  })
})