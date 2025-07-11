// import { generateSpec } from './generateSpec.js'
// import fs from 'fs'

// export function generateOpenAPIFile(filePath = 'openapi.json'): void {
//   const spec = generateSpec()
//   fs.writeFileSync(filePath, JSON.stringify(spec, null, 2))
// }

import { generateSpec } from './generateSpec.js'
import fs from 'fs'
import yaml from 'js-yaml'

export function generateOpenAPIFile(filePath = 'openapi.json'): void {
  const spec = generateSpec()

  if (filePath.endsWith('.yaml') || filePath.endsWith('.yml')) {
    const yamlSpec = yaml.dump(spec)
    fs.writeFileSync(filePath, yamlSpec, 'utf-8')
    console.log(`✅ OpenAPI YAML file generated at ${filePath}`)
  } else {
    fs.writeFileSync(filePath, JSON.stringify(spec, null, 2), 'utf-8')
    console.log(`✅ OpenAPI JSON file generated at ${filePath}`)
  }
}
