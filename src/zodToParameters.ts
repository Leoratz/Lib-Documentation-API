import { ZodType, ZodObject } from 'zod'
import { oas30 } from 'openapi3-ts'
import { zodToJsonSchema } from 'zod-to-json-schema'


function zodToParameters(
  schema: ZodType,
  location: 'path' | 'query'
): oas30.ParameterObject[] {
  if (!(schema instanceof ZodObject)) {
    throw new Error('zodToParameters only accepts ZodObject')
  }

  const jsonSchema = zodToJsonSchema(schema) as {
    properties?: Record<string, any>
    required?: string[]
  }

  const properties = jsonSchema.properties ?? {}
  const required = jsonSchema.required ?? []

  return Object.entries(properties).map(([name, schema]) => ({
    name,
    in: location,
    required: required.includes(name),
    schema,
  }))
}


export { zodToParameters }
