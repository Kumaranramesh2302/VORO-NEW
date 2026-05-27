import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// Request interceptor — attach JWT
api.interceptors.request.use(
  (config) => {
    try {
      const stored = JSON.parse(localStorage.getItem('voro-auth') || '{}');
      const token = stored?.state?.token;
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch {}
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const stored = JSON.parse(localStorage.getItem('voro-auth') || '{}');
        const refreshToken = stored?.state?.refreshToken;
        if (refreshToken) {
          const res = await axios.post(`/api/auth/refresh?refreshToken=${refreshToken}`);
          const newToken = res.data.data.accessToken;
          // Update store
          const auth = JSON.parse(localStorage.getItem('voro-auth'));
          auth.state.token = newToken;
          localStorage.setItem('voro-auth', JSON.stringify(auth));
          original.headers.Authorization = `Bearer ${newToken}`;
          return api(original);
        }
      } catch {
        localStorage.removeItem('voro-auth');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ─── API helpers ──────────────────────────────────────────────────────────────
export const authApi = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
};

export const userApi = {
  getMe: () => api.get('/users/me'),
  updateProfile: (data) => api.put('/users/me', data),
  changePassword: (data) => api.patch('/users/me/password', data),
};

export const projectApi = {
  create: (data) => api.post('/projects', data),
  getAll: (params) => api.get('/projects', { params }),
  getById: (id) => api.get(`/projects/${id}`),
  updateStatus: (id, status) => api.patch(`/projects/${id}/status`, { status }),
  updateProgress: (id, progress) => api.patch(`/projects/${id}/progress`, { progress }),
};

export const packageApi = {
  getAll: () => api.get('/packages'),
  getBySlug: (slug) => api.get(`/packages/${slug}`),
};

export const portfolioApi = {
  getAll: (params) => api.get('/portfolio', { params }),
  getFeatured: () => api.get('/portfolio/featured'),
  getBySlug: (slug) => api.get(`/portfolio/${slug}`),
};

export const reviewApi = {
  getPublished: () => api.get('/reviews/public'),
  create: (data) => api.post('/reviews', data),
  publish: (id) => api.patch(`/reviews/${id}/publish`),
  reply: (id, reply) => api.post(`/reviews/${id}/reply`, { reply }),
};

export const contactApi = {
  submit: (data) => api.post('/contact', data),
};

export const notificationApi = {
  getAll: (page = 0) => api.get('/notifications', { params: { page } }),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch('/notifications/read-all'),
};

export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params) => api.get('/admin/users', { params }),
  getProjects: (params) => api.get('/admin/projects', { params }),
  toggleUserStatus: (id) => api.patch(`/admin/users/${id}/toggle-status`),
};

export const fileApi = {
  upload: (file, projectId) => {
    const form = new FormData();
    form.append('file', file);
    if (projectId) form.append('projectId', projectId);
    return api.post('/files/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  getByProject: (projectId) => api.get(`/files/project/${projectId}`),
  delete: (id) => api.delete(`/files/${id}`),
};

export const chatApi = {
  getMessages: (projectId, page = 0) => api.get(`/chat/project/${projectId}/messages`, { params: { page } }),
  send: (projectId, content) => api.post(`/chat/project/${projectId}/messages`, { content }),
};

export default api;
