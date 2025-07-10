import { defineRoute, generateOpenAPIFile } from '../src'
import { z } from 'zod'

defineRoute({
  method: 'get',
  path: '/users/:id',
  summary: 'Get user by ID',
  request: { params: z.object({ id: z.string() }) },
  response: { 200: z.object({ id: z.string(), name: z.string() }) },
})

generateOpenAPIFile()

// eslint-disable-next-line no-console
console.log('OpenAPI spec generated in openapi.json')
