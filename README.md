# Librairie - Documentation API

[![npm version](https://badge.fury.io/js/@leoratz%2Flib-documentation-api.svg)](https://badge.fury.io/js/@leoratz%2Flib-documentation-api)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A TypeScript library that automatically analyzes Express or Fastify APIs and generates OpenAPI 3.0 specifications. Define your routes with Zod schemas and get comprehensive API documentation with zero boilerplate.

## Collaborators
* [Léora CHRIQUI](https://github.com/Leoratz)
* [Aurore DIMECH](https://github.com/Aurore-Dimech)
* [Brunic FEYOU](https://github.com/BrunicFeyou)

## Features

- **Zero-config setup** - Works out of the box
- **Type-safe** - Full TypeScript support with strict typing
- **Zod integration** - Use Zod schemas for validation and documentation
- **OpenAPI 3.0** - Generate standard-compliant specifications
- **Multiple formats** - Export to JSON or integrate programmatically
- **CLI tool** - Generate specs from command line
- **Framework agnostic** - Works with Express, Fastify, and more

## Installation

```bash
npm i rest-to-openapi
```

## Quick Start

### 1. Define your routes

```typescript
import { defineRoute } from '@leoratz/lib-documentation-api'
import { z } from 'zod'

// Define a route with request/response schemas
defineRoute({
  method: 'get',
  path: '/users/:id',
  summary: 'Get user by ID',
  request: {
    params: z.object({
      id: z.string().uuid('Invalid user ID format')
    })
  },
  response: {
    200: z.object({
      id: z.string().uuid(),
      name: z.string(),
      email: z.string().email(),
      createdAt: z.string().datetime()
    }),
    404: z.object({
      error: z.string(),
      message: z.string()
    })
  }
})

// Define a POST route with body validation
defineRoute({
  method: 'post',
  path: '/users',
  summary: 'Create a new user',
  request: {
    body: z.object({
      name: z.string().min(1),
      email: z.string().email(),
      age: z.number().min(18).optional()
    })
  },
  response: {
    201: z.object({
      id: z.string().uuid(),
      name: z.string(),
      email: z.string().email()
    }),
    400: z.object({
      error: z.string(),
      details: z.array(z.string())
    })
  }
})
```

### 2. Use the CLI tool

```bash
# Generate OpenAPI spec to default file (openapi.json)
npx generate-openapi

# Generate to custom file
npx generate-openapi my-api-spec.json
```

## 📖 API Reference

### `defineRoute(definition: RouteDefinition): RouteDefinition`

Registers a route definition for OpenAPI generation.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `definition` | `RouteDefinition` | The route configuration object |

#### RouteDefinition Interface

```typescript
interface RouteDefinition {
  method: 'get' | 'post' | 'put' | 'delete'
  path: string
  summary?: string
  request?: {
    params?: ZodSchema    // Path parameters
    query?: ZodSchema     // Query parameters  
    body?: ZodSchema      // Request body
  }
  response: Record<number, ZodSchema> // HTTP status code -> response schema
}
```

### `generateSpec(): OpenAPIObject`

Generates an OpenAPI 3.0 specification object from all registered routes.

**Returns:** `OpenAPIObject` - The complete OpenAPI specification

### `generateOpenAPIFile(filePath?: string): void`

Generates and saves the OpenAPI specification to a JSON file.

#### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `filePath` | `string` | `'openapi.json'` | Output file path |

## Advanced Usage

### Complex Route Examples

```typescript
import { defineRoute } from '@leoratz/lib-documentation-api'
import { z } from 'zod'

// Route with query parameters
defineRoute({
  method: 'get',
  path: '/users',
  summary: 'List users with pagination',
  request: {
    query: z.object({
      page: z.coerce.number().min(1).default(1),
      limit: z.coerce.number().min(1).max(100).default(10),
      search: z.string().optional(),
      role: z.enum(['admin', 'user', 'moderator']).optional()
    })
  },
  response: {
    200: z.object({
      users: z.array(z.object({
        id: z.string().uuid(),
        name: z.string(),
        email: z.string().email(),
        role: z.enum(['admin', 'user', 'moderator'])
      })),
      pagination: z.object({
        page: z.number(),
        limit: z.number(),
        total: z.number(),
        totalPages: z.number()
      })
    })
  }
})

// Route with file upload
defineRoute({
  method: 'post',
  path: '/users/:id/avatar',
  summary: 'Upload user avatar',
  request: {
    params: z.object({
      id: z.string().uuid()
    }),
    body: z.object({
      avatar: z.string().describe('Base64 encoded image data'),
      filename: z.string()
    })
  },
  response: {
    200: z.object({
      avatarUrl: z.string().url(),
      message: z.string()
    }),
    413: z.object({
      error: z.literal('File too large'),
      maxSize: z.string()
    })
  }
})
```

<!-- ### Programmatic Usage

```typescript
import { generateSpec } from '@leoratz/lib-documentation-api'

// Get the spec object for custom processing
const spec = generateSpec()

// Customize the spec
spec.info = {
  title: 'My Amazing API',
  version: '2.1.0',
  description: 'A comprehensive REST API for user management',
  contact: {
    name: 'API Support',
    email: 'support@myapi.com'
  }
}

// Add servers
spec.servers = [
  {
    url: 'https://api.myservice.com/v1',
    description: 'Production server'
  },
  {
    url: 'https://staging-api.myservice.com/v1', 
    description: 'Staging server'
  }
]

// Save the customized spec

``` -->

## Integration Examples

### Express.js Integration

```typescript
import express from 'express'
import { defineRoute, generateOpenAPIFile } from '@leoratz/lib-documentation-api'
import { z } from 'zod'

const app = express()
app.use(express.json())

// Define route schema
const getUserRoute = defineRoute({
  method: 'get',
  path: '/users/:id',
  summary: 'Get user by ID',
  request: {
    params: z.object({ id: z.string() })
  },
  response: {
    200: z.object({ id: z.string(), name: z.string() })
  }
})

// Implement the actual route
app.get('/users/:id', (req, res) => {
  // Your route logic here
  res.json({ id: req.params.id, name: 'John Doe' })
})

app.listen(3000, () => {
  console.log('Server running on port 3000')
  console.log('API documentation generated!')
})
```

## CLI Usage

The package includes a CLI tool for generating OpenAPI specifications:

```bash
# Basic usage
npx generate-openapi

# Custom output file
npx generate-openapi docs/api-spec.json

# Use in npm scripts
npm run generate-openapi
```

Add to your `package.json`:

```json
{
  "scripts": {
    "docs": "generate-openapi public/openapi.json"
  }
}
```

## Requirements

### Runtime Dependencies
- Node.js >= 16
- Zod >= 3.0

### Development Dependencies (for contributors)
- TypeScript >= 5.8
- Vitest >= 3.2 (for testing)
- ESLint >= 9.30 (for linting)
- Prettier >= 3.6 (for code formatting)
- tsx >= 4.20 (for running TypeScript files)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Run tests: `npm test`
4. Build: `npm run build`
5. Run example: `npm run example`

### Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Run development server |
| `npm run build` | Build the library |
| `npm run test` | Run tests |
| `npm run lint` | Lint code |
| `npm run typecheck` | Type checking |
| `npm run example` | Run example usage |

## License

MIT © [Leoratz](https://github.com/leoratz)

## Links

- [NPM Package](https://www.npmjs.com/package/@leoratz/lib-documentation-api)
- [GitHub Repository](https://github.com/leoratz/lib-documentation-api)
- [OpenAPI Specification](https://spec.openapis.org/oas/v3.0.3/)
- [Zod Documentation](https://zod.dev/)