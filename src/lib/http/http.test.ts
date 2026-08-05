import { afterEach, describe, expect, it, vi } from 'vitest'
import { HttpError, request } from './http'

afterEach(() => {
  vi.unstubAllGlobals()
})

function stubFetch(impl: (url: string, init: RequestInit) => Promise<Response>): void {
  vi.stubGlobal('fetch', vi.fn(impl))
}

describe('request', () => {
  it('returns parsed JSON for a successful 2xx response', async () => {
    stubFetch(async () => new Response(JSON.stringify({ ok: true }), { status: 200 }))
    await expect(request<{ ok: boolean }>('/items')).resolves.toEqual({ ok: true })
  })

  it('sends a JSON body with a content-type header', async () => {
    const fetchMock = vi.fn(async (_url: string, _init: RequestInit): Promise<Response> => {
      return new Response('{}', { status: 200 })
    })
    vi.stubGlobal('fetch', fetchMock)
    await request('/items', { method: 'POST', body: { id: 1 } })
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('/items')
    expect(init.body).toBe(JSON.stringify({ id: 1 }))
    expect(new Headers(init.headers).get('content-type')).toBe('application/json')
  })

  it('resolves relative URLs against baseUrl', async () => {
    const fetchMock = vi.fn(async (_url: string, _init: RequestInit): Promise<Response> => {
      return new Response('[]', { status: 200 })
    })
    vi.stubGlobal('fetch', fetchMock)
    await request('/users', { baseUrl: 'https://api.example.com' })
    expect(fetchMock.mock.calls[0][0]).toBe('https://api.example.com/users')
  })

  it('returns undefined for a 204 no content response', async () => {
    stubFetch(async () => new Response(null, { status: 204 }))
    await expect(request('/noop')).resolves.toBeUndefined()
  })

  it('normalizes non-2xx responses into an HttpError carrying the status', async () => {
    stubFetch(async () => new Response('oops', { status: 500 }))
    const error = await request('/boom').catch((caught: unknown) => caught)
    expect(error).toBeInstanceOf(HttpError)
    expect(error).toMatchObject({ kind: 'http', status: 500 })
  })

  it('normalizes network failures into a network HttpError', async () => {
    stubFetch(async () => {
      throw new TypeError('fetch failed')
    })
    const error = await request('/down').catch((caught: unknown) => caught)
    expect(error).toBeInstanceOf(HttpError)
    expect(error).toMatchObject({ kind: 'network' })
  })

  it('normalizes timeouts into a timeout HttpError', async () => {
    stubFetch(
      (_url, init) =>
        new Promise<Response>((_resolve, reject) => {
          init.signal?.addEventListener('abort', () => reject(init.signal!.reason))
        }),
    )
    const error = await request('/slow', { timeoutMs: 100 }).catch((caught: unknown) => caught)
    expect(error).toBeInstanceOf(HttpError)
    expect(error).toMatchObject({ kind: 'timeout' })
  })
})
