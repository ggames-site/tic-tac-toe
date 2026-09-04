import type { Route } from './+types/api.healthcheck'
import { methodNotAllowed } from '../../shared/api/http/method-not-allowed'

const allowedMethod = 'GET'

export function loader({ request }: Route.LoaderArgs) {
  if (request.method !== allowedMethod) return methodNotAllowed(allowedMethod)

  return Response.json({ ok: true, version: '0.0.1' })
}

export function action() {
  return methodNotAllowed(allowedMethod)
}
