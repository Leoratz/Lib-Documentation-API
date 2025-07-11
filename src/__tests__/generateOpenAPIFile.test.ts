import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import fs from 'fs'
import { generateOpenAPIFile } from '../generateOpenAPIFile'
import { defineRoute } from '../defineRoute'
import { routeRegistry } from '../registry'
import { z } from 'zod'

const TEST_FILE = 'openapi.test.json'

describe('OpenAPI file generation', () => {
  beforeEach(() => {
    routeRegistry.length = 0
    if (fs.existsSync(TEST_FILE)) fs.unlinkSync(TEST_FILE)
  })

  afterEach(() => {
    if (fs.existsSync(TEST_FILE)) fs.unlinkSync(TEST_FILE)
  })

  it('creates a file with the OpenAPI spec', () => {
    defineRoute({
      method: 'get',
      path: '/users/:id',
      summary: 'Get user by ID',
      request: { params: z.object({ id: z.string() }) },
      response: { 200: z.object({ id: z.string(), name: z.string() }) },
    })

    generateOpenAPIFile(TEST_FILE)
    expect(fs.existsSync(TEST_FILE)).toBe(true)

    const content = fs.readFileSync(TEST_FILE, 'utf-8')
    const json = JSON.parse(content)
    expect(json.openapi).toBe('3.0.0')
    expect(json.paths['/users/:id']).toBeDefined()
  })

  it('defaults to openapi.json if no path is given', () => {
    const defaultFile = 'openapi.json'
    if (fs.existsSync(defaultFile)) fs.unlinkSync(defaultFile)

    generateOpenAPIFile()
    expect(fs.existsSync(defaultFile)).toBe(true)

    fs.unlinkSync(defaultFile)
  })

  it('writes an OpenAPI file with empty paths if no routes are registered', () => {
    generateOpenAPIFile(TEST_FILE)
    const content = fs.readFileSync(TEST_FILE, 'utf-8')
    const json = JSON.parse(content)
    expect(json.paths).toEqual({})
  })

  it('overwrites an existing file', () => {
    fs.writeFileSync(TEST_FILE, 'old content')
    defineRoute({
      method: 'get',
      path: '/overwrite',
      summary: 'Overwrite test',
      response: { 200: z.object({ ok: z.boolean() }) },
    })
    generateOpenAPIFile(TEST_FILE)
    const content = fs.readFileSync(TEST_FILE, 'utf-8')
    expect(content).not.toContain('old content')
    const json = JSON.parse(content)
    expect(json.paths['/overwrite']).toBeDefined()
  })

  it('throws or logs an error if the file path is invalid', () => {
    expect(() => generateOpenAPIFile('/invalid/path/openapi.json')).toThrow()
  })
})
