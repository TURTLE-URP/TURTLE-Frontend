export type HttpErrorKind = 'timeout' | 'network' | 'http'

export class HttpError extends Error {
  readonly kind: HttpErrorKind
  readonly status?: number

  constructor(kind: HttpErrorKind, message: string, status?: number) {
    super(message)
    this.name = 'HttpError'
    this.kind = kind
    this.status = status
  }
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface HttpRequestOptions {
  method?: HttpMethod
  body?: unknown
  headers?: HeadersInit
  signal?: AbortSignal
  timeoutMs?: number
  baseUrl?: string
}

export async function request<T>(url: string, options: HttpRequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers, signal, timeoutMs = 10_000, baseUrl } = options

  const timeoutSignal = AbortSignal.timeout(timeoutMs)
  const combinedSignal = signal ? AbortSignal.any([signal, timeoutSignal]) : timeoutSignal

  const mergedHeaders = new Headers(headers)
  if (body !== undefined && !mergedHeaders.has('Content-Type')) {
    mergedHeaders.set('Content-Type', 'application/json')
  }

  const resolvedUrl = baseUrl ? new URL(url, baseUrl).toString() : url
  const init: RequestInit = {
    method,
    signal: combinedSignal,
    headers: mergedHeaders,
    body: body === undefined ? undefined : JSON.stringify(body),
  }

  let response: Response
  try {
    response = await fetch(resolvedUrl, init)
  } catch (error) {
    if (error instanceof DOMException && error.name === 'TimeoutError') {
      throw new HttpError('timeout', `Request timed out after ${timeoutMs}ms`)
    }
    throw new HttpError('network', 'Network request failed')
  }

  if (response.status === 204) {
    return undefined as T
  }

  if (!response.ok) {
    throw new HttpError('http', `Request failed with status ${response.status}`, response.status)
  }

  return (await response.json()) as T
}
