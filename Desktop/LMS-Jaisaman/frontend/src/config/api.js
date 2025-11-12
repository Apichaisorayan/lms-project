// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// Helper function for API calls
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
}

// OAuth URLs
export const OAUTH_URLS = {
  google: `${API_URL}/api/auth/google`,
  facebook: `${API_URL}/api/auth/facebook`
}
