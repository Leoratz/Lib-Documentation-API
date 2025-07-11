import { describe, it, expect, beforeEach } from 'vitest'
import { defineRoute } from '../defineRoute'
import { routeRegistry } from '../registry'
import { generateSpec } from '../generateSpec'
import { z } from 'zod'
import type { oas30 } from 'openapi3-ts'

describe('OpenAPI spec generation', () => {
  beforeEach(() => {
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
  })

  it('should return empty paths when no routes are registered', () => {
    routeRegistry.length = 0
    const spec = generateSpec()
    expect(spec.paths).toEqual({})
  })

  it('should handle routes with no params or body', () => {
    defineRoute({
      method: 'get',
      path: '/simple',
      summary: 'Simple route',
      response: { 200: z.object({ ok: z.boolean() }) },
    })
    const spec = generateSpec()
    expect(spec.paths['/simple']).toBeDefined()
    expect(spec.paths['/simple'].get?.parameters).toEqual([])
    expect(spec.paths['/simple'].get?.requestBody).toBeUndefined()
  })

  it('should handle routes with both query and path params', () => {
    defineRoute({
      method: 'get',
      path: '/users/:id',
      summary: 'User with query',
      request: {
        params: z.object({ id: z.string() }),
        query: z.object({ search: z.string().optional() }),
      },
      response: { 200: z.object({ id: z.string() }) },
    })
    const spec = generateSpec()
    const params = spec.paths['/users/:id'].get?.parameters as
      | (oas30.ParameterObject | oas30.ReferenceObject)[]
      | undefined
    expect(params?.some((p) => !('$ref' in p) && p.in === 'path')).toBe(true)
    expect(params?.some((p) => !('$ref' in p) && p.in === 'query')).toBe(true)
  })

  it('should handle multiple response codes', () => {
    defineRoute({
      method: 'post',
      path: '/multi',
      summary: 'Multiple responses',
      response: {
        200: z.object({ ok: z.boolean() }),
        400: z.object({ error: z.string() }),
      },
    })
    const spec = generateSpec()
    expect(spec.paths['/multi'].post?.responses['200']).toBeDefined()
    expect(spec.paths['/multi'].post?.responses['400']).toBeDefined()
  })

  it('should throw if route is missing required fields', () => {
    expect(() => {
      // @ts-expect-error
      defineRoute({ method: 'get' })
    }).toThrow()
  })

  it('should handle routes with a request body', () => {
    defineRoute({
      method: 'post',
      path: '/with-body',
      summary: 'With body',
      request: { body: z.object({ name: z.string() }) },
      response: { 201: z.object({ id: z.string() }) },
    })
    const spec = generateSpec()
    expect(spec.paths['/with-body'].post?.requestBody).toBeDefined()
  })
})
