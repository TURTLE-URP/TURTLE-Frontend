import { describe, expect, it } from 'vitest'
import { buildAssignSchema } from './step-assign.form'

describe('assignSchema', () => {
  const schema = buildAssignSchema(['i1', 'i2'])

  it('is invalid while not every ingredient is assigned', () => {
    expect(schema.safeParse({ selections: {} }).success).toBe(false)
    expect(schema.safeParse({ selections: { i1: 'p1' } }).success).toBe(false)
    expect(schema.safeParse({ selections: { i1: '', i2: 'p2' } }).success).toBe(false)
  })

  it('is valid once every ingredient has a product', () => {
    expect(schema.safeParse({ selections: { i1: 'p1', i2: 'p2' } }).success).toBe(true)
  })
})
