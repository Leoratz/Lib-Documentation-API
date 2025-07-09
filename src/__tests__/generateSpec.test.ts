import { describe, it, expect, beforeEach } from 'vitest'
import { defineRoute } from '../defineRoute'
import { routeRegistry } from '../registry'
import { generateSpec } from '../generateSpec'
import { z } from 'zod'

describe('OpenAPI spec generation', () => {
  beforeEach(() => {
    // Nettoyer le registre avant chaque test
    routeRegistry.length = 0
  })

  it('should register route and generate correct OpenAPI spec', () => {
    defineRoute({
      method: 'get',
      path: '/test/:id',
      summary: 'Test route',
      request: {
        params: z.object({ id: z.string() }),
      },
      response: {
        200: z.object({ success: z.boolean() }),
      },
    })

    const spec = generateSpec()

    expect(spec.openapi).toBe('3.0.0')
    expect(spec.paths['/test/:id']).toBeDefined()
    expect(spec.paths['/test/:id'].get).toBeDefined()
    expect(spec.paths['/test/:id']?.get?.summary).toBe('Test route')

    // expect(spec.paths['/test/:id'].get.summary).toBe('Test route')

  })
})
