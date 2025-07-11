import { describe, it, expect } from 'vitest'
import { z } from 'zod'
import { zodToParameters } from '../zodToParameters'

describe('zodToParameters', () => {
  it('converts a simple Zod object to OpenAPI parameters', () => {
    const schema = z.object({
      id: z.string(),
      active: z.boolean().optional(),
    })
    const params = zodToParameters(schema, 'query')
    expect(params).toEqual([
      {
        name: 'id',
        in: 'query',
        required: true,
        schema: expect.any(Object),
      },
      {
        name: 'active',
        in: 'query',
        required: false,
        schema: expect.any(Object),
      },
    ])
  })

  it('throws if schema is not a ZodObject', () => {
    expect(() => zodToParameters(z.string(), 'query')).toThrow(
      'zodToParameters only accepts ZodObject'
    )
  })

  it('handles empty Zod object', () => {
    const schema = z.object({})
    const params = zodToParameters(schema, 'path')
    expect(params).toEqual([])
  })
})
