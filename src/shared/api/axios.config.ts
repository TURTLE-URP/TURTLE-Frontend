import axios from 'axios'
import { useAuthStore } from '@/shared/stores/auth-store'
import { API_KEY_HEADER } from '@/shared/lib/api-key'

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL?.trim() ||
  import.meta.env.VITE_API_URL?.trim() ||
  'http://localhost:3000'

const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
  timeout: 6000,
  responseType: 'json',
  responseEncoding: 'utf8',
  paramsSerializer: {
    indexes: false,
  },
  validateStatus: (status) => status >= 200 && status < 300,
})

axiosInstance.interceptors.request.use(
  (config) => {
    const session = useAuthStore.getState().session
    if (session?.token) {
      config.headers.Authorization = `Bearer ${session.token}`
    }
    const apiKey = import.meta.env.VITE_API_KEY?.trim()
    if (apiKey) {
      config.headers[API_KEY_HEADER] = apiKey
    }
    return config
  },
  (error) => Promise.reject(error),
)

export default axiosInstance
