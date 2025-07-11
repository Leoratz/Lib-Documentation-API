#!/usr/bin/env node

import { generateOpenAPIFile } from '../generateOpenAPIFile.js'

const filePath = process.argv[2] || 'openapi.json'
await generateOpenAPIFile(filePath)

// eslint-disable-next-line no-console
console.log(`OpenAPI spec generated in ${filePath}`)
