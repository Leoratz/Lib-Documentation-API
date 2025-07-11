import { generateSpec } from './generateSpec.js'
import fs from 'fs'
import yaml from 'js-yaml'
import prettier from 'prettier'

export async function generateOpenAPIFile(filePath = 'openapi.json'): Promise<void> {
  const spec = generateSpec()
  try {
    if (filePath.endsWith('.yaml') || filePath.endsWith('.yml')) {
      const yamlSpec = yaml.dump(spec)
      fs.writeFileSync(filePath, yamlSpec, 'utf-8')
      // eslint-disable-next-line no-console
      console.log(`✅ OpenAPI YAML file generated at ${filePath}`)
    } else {
      const json = JSON.stringify(spec, null, 2)
      const formatted = await prettier.format(json, { parser: 'json' })
      fs.writeFileSync(filePath, formatted, 'utf-8')
      // eslint-disable-next-line no-console
      console.log(`✅ OpenAPI JSON file generated at ${filePath}`)
    }
  } catch (err) {
    console.error(`Failed to write OpenAPI file to "${filePath}":`, err)
    throw err
  }
}
