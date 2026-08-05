export interface EnvConfig {
  VITE_APP_NAME: string
  VITE_API_BASE_URL: string
}

const REQUIRED_VARS = ['VITE_APP_NAME'] as const
const APP_NAME_MAX_LENGTH = 50

export function validateEnv(
  source: Record<string, string | undefined> = import.meta.env as Record<
    string,
    string | undefined
  >,
): EnvConfig {
  const missing = REQUIRED_VARS.find((name) => {
    const value = source[name]
    return value === undefined || value.trim() === ''
  })

  if (missing) {
    throw new Error(`Missing required environment variable: ${missing}`)
  }

  const appName = source.VITE_APP_NAME!.trim()
  if (appName.length > APP_NAME_MAX_LENGTH) {
    throw new Error(
      `Environment variable VITE_APP_NAME must be at most ${APP_NAME_MAX_LENGTH} characters (got ${appName.length})`,
    )
  }

  const apiBaseUrl = source.VITE_API_BASE_URL?.trim() ?? ''
  if (apiBaseUrl) {
    let parsed: URL
    try {
      parsed = new URL(apiBaseUrl)
    } catch {
      throw new Error('Environment variable VITE_API_BASE_URL must be an absolute URL')
    }
    if (!parsed.protocol.startsWith('http')) {
      throw new Error('Environment variable VITE_API_BASE_URL must use the http(s) protocol')
    }
  }

  return { VITE_APP_NAME: appName, VITE_API_BASE_URL: apiBaseUrl }
}
