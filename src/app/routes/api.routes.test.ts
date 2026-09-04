import { describe, expect, it } from 'vitest'
import { action as healthAction, loader as healthLoader } from './api.healthcheck'
import { action as statsAction, loader as statsLoader } from './api.stats.save'

function routeRequest(method: string, body?: string): Request {
  return new Request('http://localhost/api/test', { method, body })
}

describe('healthcheck API', () => {
  it('returns the fixed health response for GET', async () => {
    const response = healthLoader({ request: routeRequest('GET') } as never)

    await expect(response.json()).resolves.toEqual({ ok: true, version: '0.0.1' })
    expect(response.status).toBe(200)
  })

  it('rejects unsupported methods', async () => {
    const response = healthAction()

    expect(response.status).toBe(405)
    expect(response.headers.get('Allow')).toBe('GET')
    await expect(response.json()).resolves.toEqual({ error: 'Method not allowed' })
  })
})

describe('stats API', () => {
  it.each([null, true, ['round', 3], { score: { X: 2, O: 1 } }])(
    'accepts arbitrary valid JSON: %j',
    async (payload) => {
      const response = await statsAction({ request: routeRequest('POST', JSON.stringify(payload)) } as never)

      expect(response.status).toBe(200)
      await expect(response.json()).resolves.toEqual({ success: true })
    },
  )

  it('rejects malformed JSON', async () => {
    const response = await statsAction({ request: routeRequest('POST', '{') } as never)

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({ error: 'Invalid JSON' })
  })

  it('rejects unsupported methods', async () => {
    const response = statsLoader()

    expect(response.status).toBe(405)
    expect(response.headers.get('Allow')).toBe('POST')
  })
})
