import { RouteDefinition } from './types.js'
import { registerRoute } from './registry.js'

export function defineRoute(def: RouteDefinition): RouteDefinition {
  registerRoute(def)
  return def
}
