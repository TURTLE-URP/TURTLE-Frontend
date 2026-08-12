import { describe, expect, it } from 'vitest'
import { modalitySchema } from './step-modality.form'

describe('modalitySchema', () => {
  it('accepts every supported modality', () => {
    for (const modality of ['platillos', 'escasez', 'libre'] as const) {
      expect(modalitySchema.safeParse({ modality }).success).toBe(true)
    }
  })

  it('rejects a missing modality', () => {
    expect(modalitySchema.safeParse({}).success).toBe(false)
  })

  it('rejects an unknown modality', () => {
    expect(modalitySchema.safeParse({ modality: 'otro' }).success).toBe(false)
  })
})
