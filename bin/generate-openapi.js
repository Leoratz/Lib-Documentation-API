#!/usr/bin/env node

import { generateOpenAPIFile } from '../dist/generateOpenAPIFile.js'

const filePath = process.argv[2] || 'openapi.json'
generateOpenAPIFile(filePath)

// eslint-disable-next-line no-console
console.log(`OpenAPI spec generated in ${filePath}`)
