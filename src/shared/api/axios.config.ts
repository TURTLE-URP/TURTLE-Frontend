import axios from 'axios'
import { useAuthStore } from '@/shared/stores/auth-store'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? import.meta.env.VITE_API_URL ?? '',
  timeout: 6000,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
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
    return config
  },
  (error) => Promise.reject(error),
)

export default axiosInstance
