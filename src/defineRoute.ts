import { RouteDefinition } from './types'
import { registerRoute } from './registry'

export function defineRoute(def: RouteDefinition): RouteDefinition {
  registerRoute(def)
  return def
}
