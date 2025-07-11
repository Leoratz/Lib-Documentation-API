import { RouteDefinition } from './types.js'
import { registerRoute } from './registry.js'

export function defineRoute(def: RouteDefinition): RouteDefinition {
  if (!def.method) throw new Error('Route definition missing "method"')
  if (!def.path) throw new Error('Route definition missing "path"')
  registerRoute(def)
  return def
}
