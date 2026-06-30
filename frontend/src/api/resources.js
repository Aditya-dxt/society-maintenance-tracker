import api from './client'

export const complaintApi = {
  create: (formData) =>
    api.post('/complaints', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  mine: () => api.get('/complaints/mine'),
  all: (params) => api.get('/complaints', { params }),
  byId: (id) => api.get(`/complaints/${id}`),
  updateStatus: (id, data) => api.patch(`/complaints/${id}/status`, data),
  updatePriority: (id, data) => api.patch(`/complaints/${id}/priority`, data),
}

export const noticeApi = {
  list: () => api.get('/notices'),
  create: (data) => api.post('/notices', data),
  remove: (id) => api.delete(`/notices/${id}`),
}

export const societyApi = {
  mine: () => api.get('/society'),
  regenerateCode: () => api.post('/society/regenerate-code'),
  updateSettings: (data) => api.patch('/society/settings', data),
}

export const dashboardApi = {
  get: () => api.get('/dashboard'),
}
