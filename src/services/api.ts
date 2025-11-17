import axios from 'axios'
import type { AxiosInstance } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

export const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 10000
})

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        // Add auth token if available
        const token = localStorage.getItem('auth_token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor
apiClient.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        // Handle common errors
        if (error.response?.status === 401) {
            // Handle unauthorized
            localStorage.removeItem('auth_token')
        }
        return Promise.reject(error)
    }
)

export default apiClient
