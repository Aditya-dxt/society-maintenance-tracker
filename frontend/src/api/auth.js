import api from './client'

export const authApi = {
  adminSignup: (data) => api.post('/auth/admin/signup', data),
  residentSignup: (data) => api.post('/auth/resident/signup', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
}
