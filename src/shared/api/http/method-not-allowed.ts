export function methodNotAllowed(allow: string): Response {
  return Response.json(
    { error: 'Method not allowed' },
    { headers: { Allow: allow }, status: 405 },
  )
}
