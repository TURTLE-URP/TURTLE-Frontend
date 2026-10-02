export const env = {
  appName: import.meta.env.VITE_APP_NAME ?? 'TURTLE Frontend',
  apiUrl: import.meta.env.VITE_API_BASE_URL ?? import.meta.env.VITE_API_URL ?? '',
}
