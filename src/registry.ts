import { RouteDefinition } from './types'

export const routeRegistry: RouteDefinition[] = []

export function registerRoute(route: RouteDefinition): void {
  routeRegistry.push(route)
}
