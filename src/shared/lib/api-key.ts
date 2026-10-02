/** Header que el backend valida contra `API_KEY`. */
export const API_KEY_HEADER = 'x-api-key'

export function getApiUrl(): string {
  const configured = import.meta.env.VITE_API_URL?.trim()
  return configured || 'http://localhost:3000'
}

export function applyApiKey(headers: Record<string, string>): Record<string, string> {
  const apiKey = import.meta.env.VITE_API_KEY?.trim()
  if (apiKey) {
    headers[API_KEY_HEADER] = apiKey
  }
  return headers
}
