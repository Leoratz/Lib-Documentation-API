import { generateSpec } from './generateSpec'
import fs from 'fs'

export function generateOpenAPIFile(filePath = 'openapi.json'): void {
  const spec = generateSpec()
  fs.writeFileSync(filePath, JSON.stringify(spec, null, 2))
}