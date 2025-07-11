import { defineRoute, generateOpenAPIFile } from '../src'
import { z } from 'zod'

defineRoute({
  method: 'get',
  path: '/users/:id',
  tags: ['Users'],
  summary: 'Change user details',
  request: { params: z.object({ id: z.string() }) },
  response: { 200: z.object({ id: z.string(), name: z.string() }) },
})

generateOpenAPIFile()
generateOpenAPIFile('openapi.yaml')

// eslint-disable-next-line no-console
console.log('OpenAPI spec generated in openapi.json')
