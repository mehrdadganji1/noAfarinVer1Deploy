import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// Create axios instance with auth token
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Director Stats API
export const directorApi = {
  // Get complete director stats
  getStats: async () => {
    const response = await api.get('/director/stats')
    return response.data
  },

  // Get user statistics
  getUserStats: async () => {
    const response = await api.get('/director/stats/users')
    return response.data
  },

  // Get system health
  getSystemHealth: async () => {
    const response = await api.get('/director/stats/system-health')
    return response.data
  },
}

export default directorApi
