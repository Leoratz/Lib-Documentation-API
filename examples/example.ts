import express from 'express'
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
console

const spec = generateSpec()
fs.writeFileSync('openapi.json', JSON.stringify(spec, null, 2))
console.log('OpenAPI spec generated in openapi.json')
