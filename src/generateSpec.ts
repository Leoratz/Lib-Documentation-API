import { routeRegistry } from './registry'
import { oas30 } from 'openapi3-ts'

import { zodToJsonSchema } from 'zod-to-json-schema' // selon ta lib utilisée



export function getOpenApiSpec(): oas30.OpenAPIObject {
  const paths: oas30.PathsObject = {}

  for (const route of routeRegistry) {
    const { method, path, summary, request, response } = route

    const parameters: oas30.ParameterObject[] = []

    // Ici tu peux ajouter la conversion des schémas request/response via zodToJsonSchema

    const responses: Record<string, oas30.ResponseObject> = {}

    for (const [status, schema] of Object.entries(response)) {
      responses[status] = {
        description: '',
        content: {
            'application/json': {
            schema: zodToJsonSchema(schema) as unknown as oas30.SchemaObject,
        },
        },
      }
    }

    if (paths[path] === undefined) {
      paths[path] = {}
    }

    paths[path][method] = {
      summary,
      responses,
      parameters,
    }
  }

  return {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
    },
    paths,
  }
}
