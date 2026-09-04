import type { Route } from './+types/api.stats.save'
import { methodNotAllowed } from '../../shared/api/http/method-not-allowed'

const allowedMethod = 'POST'

export function loader() {
  return methodNotAllowed(allowedMethod)
}

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== allowedMethod) return methodNotAllowed(allowedMethod)

  try {
    await request.json()
    return Response.json({ success: true })
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }
}
