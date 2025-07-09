import { ZodSchema } from 'zod'

export interface RouteDefinition {
  method: 'get' | 'post' | 'put' | 'delete'
  path: string
  summary?: string
  request?: {
    params?: ZodSchema
    query?: ZodSchema
    body?: ZodSchema
  }
  response: Record<number, ZodSchema>
}
