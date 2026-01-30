import axios from 'axios'

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 15000,
    withCredentials: true,
})

// Helper function to get token from localStorage
const getToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('astro_access_token')
    }
    return null
}

// Add a request interceptor to add token to headers
apiClient.interceptors.request.use(
    function (config) {
        // Add token to Authorization header if available
        const token = getToken()
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        // Add cache control
        config.headers['Cache-Control'] = 'no-cache'
        return config
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error)
    },
)

// Add a response interceptor
axios.interceptors.response.use(
    function onFulfilled(response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response
    },
    function onRejected(error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        return Promise.reject(error)
    },
)

export default apiClient
