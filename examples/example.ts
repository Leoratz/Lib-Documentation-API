import { defineRoute, generateSpec } from '../src'
import { z } from 'zod'
import fs from 'fs'

defineRoute({
  method: 'get',
  path: '/users/:id',
  summary: 'Get user by ID',
  request: { params: z.object({ id: z.string() }) },
  response: { 200: z.object({ id: z.string(), name: z.string() }) },
})

const spec = generateSpec()
fs.writeFileSync('openapi.json', JSON.stringify(spec, null, 2))

// eslint-disable-next-line no-console
console.log('OpenAPI spec generated in openapi.json')
