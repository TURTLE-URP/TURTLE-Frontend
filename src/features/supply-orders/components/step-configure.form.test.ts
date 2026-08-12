import { describe, expect, it } from 'vitest'
import { dishQtysSchema, libreSchema } from './step-configure.form'

describe('libreSchema', () => {
  it('is invalid while no quantity is greater than 0', () => {
    expect(libreSchema.safeParse({ quantities: {} }).success).toBe(false)
    expect(libreSchema.safeParse({ quantities: { i1: 0 } }).success).toBe(false)
  })

  it('is valid once at least one quantity is greater than 0', () => {
    expect(libreSchema.safeParse({ quantities: { i1: 0, i2: 2.5 } }).success).toBe(true)
  })
})

describe('dishQtysSchema', () => {
  it('is invalid while no dish quantity is set', () => {
    expect(dishQtysSchema.safeParse({ dishQtys: {} }).success).toBe(false)
  })

  it('is valid once at least one dish quantity is set', () => {
    expect(dishQtysSchema.safeParse({ dishQtys: { d1: 4 } }).success).toBe(true)
  })
})
