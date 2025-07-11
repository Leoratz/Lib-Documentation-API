import { generateSpec } from './generateSpec.js'
import fs from 'fs'

export function generateOpenAPIFile(filePath = 'openapi.json'): void {
  const spec = generateSpec()
  try {
    fs.writeFileSync(filePath, JSON.stringify(spec, null, 2))
  } catch (err) {
    console.error(`Failed to write OpenAPI file to "${filePath}":`, err)
    throw err
  }
}
