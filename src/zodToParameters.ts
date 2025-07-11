import { ZodType, ZodObject } from 'zod'
import { oas30 } from 'openapi3-ts'
import { zodToJsonSchema } from 'zod-to-json-schema'

function zodToParameters(schema: ZodType, location: 'path' | 'query'): oas30.ParameterObject[] {
  if (!(schema instanceof ZodObject)) {
    throw new Error('zodToParameters only accepts ZodObject')
  }

  try {
    const jsonSchema = zodToJsonSchema(schema) as {
      properties?: Record<string, oas30.SchemaObject>
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
  } catch (err) {
    console.error('Failed to convert Zod schema to OpenAPI parameters:', err)
    throw err
  }
}

export { zodToParameters }
