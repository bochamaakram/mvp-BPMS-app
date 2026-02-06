import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Axios instance with default config
 */
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Request interceptor to add auth token
 */
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

/**
 * Response interceptor for error handling
 */
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
};

// Process API
export const processAPI = {
    getAll: () => api.get('/processes'),
    getById: (id) => api.get(`/processes/${id}`),
    create: (data) => api.post('/processes', data),
    update: (id, data) => api.put(`/processes/${id}`, data),
    delete: (id) => api.delete(`/processes/${id}`),
    toggle: (id) => api.put(`/processes/${id}/toggle`),
};

// Instance API
export const instanceAPI = {
    getAll: () => api.get('/instances'),
    getById: (id) => api.get(`/instances/${id}`),
    start: (processId) => api.post('/instances', { processId }),
    updateStatus: (id, data) => api.put(`/instances/${id}/status`, data),
    nextStep: (id, value) => api.post(`/instances/${id}/next`, { value }),
    getHistory: (id) => api.get(`/instances/${id}/history`),
    getSummary: (id) => api.get(`/instances/${id}/summary`),
};

// Organization API
export const organizationAPI = {
    getStats: () => api.get('/organization/stats'),
    getMembers: () => api.get('/organization/members'),
    updateMemberRole: (id, role) => api.put(`/organization/members/${id}/role`, { role }),
    removeMember: (id) => api.delete(`/organization/members/${id}`),
};

export default api;
