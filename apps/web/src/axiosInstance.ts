// axiosInstance.ts
import axios from 'axios'
import Cookies from 'js-cookie'

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Make sure this is defined in your .env file
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach the token from cookies before each request
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = Cookies.get('token') // token must be set in cookies e.g., HttpOnly or accessible JS cookie

      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default axiosInstance
