import { RouteDefinition } from './types.js'

export const routeRegistry: RouteDefinition[] = []

export function registerRoute(route: RouteDefinition): void {
  routeRegistry.push(route)
}
