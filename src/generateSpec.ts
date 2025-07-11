import { routeRegistry } from './registry.js'
import { oas30 } from 'openapi3-ts'
import { zodToJsonSchema } from 'zod-to-json-schema'
import { zodToParameters } from './zodToParameters.js'

export function generateSpec(): oas30.OpenAPIObject {
  const paths: oas30.PathsObject = {}

  for (const route of routeRegistry) {
    try {
      const { method, path, summary, tags, request, response } = route

      const parameters: oas30.ParameterObject[] = []

      if (request?.params !== undefined) {
        parameters.push(...zodToParameters(request.params, 'path'))
      }

      if (request?.query !== undefined) {
        parameters.push(...zodToParameters(request.query, 'query'))
      }

      const requestBody: oas30.RequestBodyObject | undefined =
        request?.body !== undefined
          ? {
              content: {
                'application/json': {
                  schema: zodToJsonSchema(request.body) as oas30.SchemaObject,
                },
              },
            }
          : undefined

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
        tags,
        responses,
        requestBody,
        parameters,
      }
    } catch (err) {
      console.error(`Failed to process route: ${JSON.stringify(route)}\nError:`, err)
      throw err
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
